using CandyStation.Api.Dtos;
using CandyStation.Api.Email;
using CandyStation.Core;
using CandyStation.Core.Entities;
using CandyStation.Core.Enums;
using CandyStation.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Services;

public class OrderValidationException(string message) : Exception(message);
public class OrderNotFoundException : Exception;

public class OrderService(CandyStationDbContext db, IEmailService email)
{
    public static OrderDto ToDto(Order o) => new(
        o.OrderNumber, o.CustomerName, o.CustomerEmail, o.CustomerPhone,
        o.Items.Select(i => new OrderItemDto(i.ProductName, i.VariantName, i.UnitPrice, i.Quantity, i.LineTotal)).ToList(),
        o.Subtotal, o.Shipping, o.Total,
        o.DeliveryMethod == DeliveryMethod.Delivery ? "delivery" : "pickup",
        StatusToWire(o.Status),
        o.Timeline.OrderBy(t => t.ChangedAt).Select(t => new OrderTimelineDto(StatusToWire(t.Status), t.ChangedAt)).ToList(),
        o.PlacedAt,
        o.ShippingAddress is null ? null : new ShippingAddressRequest(
            o.ShippingAddress.Name, o.ShippingAddress.Phone, o.ShippingAddress.Address1, o.ShippingAddress.Address2,
            o.ShippingAddress.City, o.ShippingAddress.State, o.ShippingAddress.PostalCode, o.ShippingAddress.Country)
    );

    private static string StatusToWire(OrderStatus s) => s switch
    {
        OrderStatus.OutForDelivery => "out_for_delivery",
        _ => s.ToString().ToLowerInvariant(),
    };

    public static OrderStatus StatusFromWire(string s) => s switch
    {
        "out_for_delivery" => OrderStatus.OutForDelivery,
        "pending" => OrderStatus.Pending,
        "confirmed" => OrderStatus.Confirmed,
        "preparing" => OrderStatus.Preparing,
        "delivered" => OrderStatus.Delivered,
        "cancelled" => OrderStatus.Cancelled,
        _ => throw new OrderValidationException($"Unknown status '{s}'"),
    };

    public async Task<OrderDto> CreateOrderAsync(OrderCreateRequest req, int? customerId)
    {
        if (req.Items.Count == 0) throw new OrderValidationException("Order must contain at least one item.");

        await using var tx = await db.Database.BeginTransactionAsync();

        var orderItems = new List<OrderItem>();
        foreach (var line in req.Items)
        {
            if (line.Kind == "product")
            {
                var product = await db.Products.Include(p => p.Variants).FirstOrDefaultAsync(p => p.Id == line.ProductId)
                    ?? throw new OrderValidationException($"Product {line.ProductId} not found.");
                var variant = product.Variants.FirstOrDefault(v => v.Id == line.VariantId)
                    ?? throw new OrderValidationException($"Variant {line.VariantId} not found on product {product.Id}.");
                if (product.Stock < line.Quantity) throw new OrderValidationException($"Insufficient stock for {product.Name}.");

                product.Stock -= line.Quantity;
                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    VariantName = variant.Name,
                    UnitPrice = variant.Price,
                    Quantity = line.Quantity,
                    LineTotal = variant.Price * line.Quantity,
                });
            }
            else if (line.Kind == "bundle")
            {
                var bundle = await db.Bundles.Include(b => b.Items).ThenInclude(i => i.Product)
                    .FirstOrDefaultAsync(b => b.Id == line.BundleId)
                    ?? throw new OrderValidationException($"Bundle {line.BundleId} not found.");

                foreach (var item in bundle.Items)
                {
                    var product = item.Product ?? throw new OrderValidationException("Bundle item missing product.");
                    var needed = item.Quantity * line.Quantity;
                    if (product.Stock < needed) throw new OrderValidationException($"Insufficient stock for {product.Name} (bundle {bundle.Name}).");
                    product.Stock -= needed;
                }

                orderItems.Add(new OrderItem
                {
                    BundleId = bundle.Id,
                    ProductName = bundle.Name,
                    VariantName = "Bundle",
                    UnitPrice = bundle.Price,
                    Quantity = line.Quantity,
                    LineTotal = bundle.Price * line.Quantity,
                });
            }
            else
            {
                throw new OrderValidationException($"Unknown line kind '{line.Kind}'.");
            }
        }

        var subtotal = OrderRules.CalculateSubtotal(orderItems.Select(i => (i.UnitPrice, i.Quantity)));
        var deliveryMethod = req.DeliveryMethod == "pickup" ? DeliveryMethod.Pickup : DeliveryMethod.Delivery;

        decimal shipping = 0;
        int? zoneId = null;
        if (deliveryMethod == DeliveryMethod.Delivery)
        {
            var zone = await db.DeliveryZones.FirstOrDefaultAsync(z => z.Id == req.DeliveryZoneId)
                ?? throw new OrderValidationException("Delivery zone is required for home delivery.");
            shipping = zone.Cost;
            zoneId = zone.Id;
        }

        var total = OrderRules.CalculateTotal(subtotal, shipping);
        if (!OrderRules.IsWithinCodLimit(total))
            throw new OrderValidationException($"Order total exceeds the COD limit of Rs. {OrderRules.CodMaxOrder}.");

        CustomerAddress? address = null;
        if (req.ShippingAddress is not null)
        {
            address = new CustomerAddress
            {
                CustomerId = customerId,
                Name = req.ShippingAddress.Name,
                Phone = req.ShippingAddress.Phone,
                Address1 = req.ShippingAddress.Address1,
                Address2 = req.ShippingAddress.Address2,
                City = req.ShippingAddress.City,
                State = req.ShippingAddress.State,
                PostalCode = req.ShippingAddress.PostalCode,
                Country = req.ShippingAddress.Country,
            };
        }

        var year = DateTime.UtcNow.Year;
        var sequence = await db.Orders.CountAsync(o => o.PlacedAt.Year == year) + 1;
        var orderNumber = OrderRules.GenerateOrderNumber(year, sequence);

        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerId = customerId,
            CustomerName = req.CustomerName,
            CustomerEmail = req.CustomerEmail,
            CustomerPhone = req.CustomerPhone,
            Subtotal = subtotal,
            Shipping = shipping,
            Total = total,
            DeliveryMethod = deliveryMethod,
            DeliveryZoneId = zoneId,
            ShippingAddress = deliveryMethod == DeliveryMethod.Delivery ? address : null,
            Status = OrderStatus.Pending,
            Items = orderItems,
            Timeline = [new OrderTimelineEntry { Status = OrderStatus.Pending }],
        };
        db.Orders.Add(order);

        if (customerId is not null)
        {
            var customer = await db.Customers.FindAsync(customerId);
            if (customer is not null)
            {
                customer.OrdersCount += 1;
            }
        }

        await db.SaveChangesAsync();
        await tx.CommitAsync();

        var (subject, html) = EmailTemplates.OrderCreated(order.CustomerName, order.OrderNumber, order.Total);
        await email.SendAsync(order.CustomerEmail, order.CustomerName, subject, html);

        return ToDto(order);
    }

    public async Task<OrderDto?> TrackAsync(string orderNumber, string email)
    {
        var order = await LoadFullOrderAsync(o =>
            o.OrderNumber.ToLower() == orderNumber.Trim().ToLower() && o.CustomerEmail.ToLower() == email.Trim().ToLower());
        return order is null ? null : ToDto(order);
    }

    public async Task<List<OrderDto>> GetMineAsync(int customerId)
    {
        var orders = await db.Orders.Where(o => o.CustomerId == customerId)
            .Include(o => o.Items).Include(o => o.Timeline).Include(o => o.ShippingAddress)
            .OrderByDescending(o => o.PlacedAt).ToListAsync();
        return orders.Select(ToDto).ToList();
    }

    private Task<Order?> LoadFullOrderAsync(System.Linq.Expressions.Expression<Func<Order, bool>> predicate) =>
        db.Orders.Include(o => o.Items).Include(o => o.Timeline).Include(o => o.ShippingAddress).FirstOrDefaultAsync(predicate);

    public async Task<OrderDto> UpdateStatusAsync(int orderId, string newStatusWire)
    {
        var order = await db.Orders.Include(o => o.Items).Include(o => o.Timeline).Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.Id == orderId) ?? throw new OrderNotFoundException();

        var newStatus = StatusFromWire(newStatusWire);
        if (!OrderRules.CanTransition(order.Status, newStatus))
            throw new OrderValidationException($"Cannot transition order from {order.Status} to {newStatus}.");

        order.Status = newStatus;
        order.Timeline.Add(new OrderTimelineEntry { OrderId = order.Id, Status = newStatus });

        if (newStatus == OrderStatus.Delivered && order.CustomerId is not null)
        {
            var customer = await db.Customers.FindAsync(order.CustomerId);
            if (customer is not null) customer.TotalSpent += order.Total;
        }

        await db.SaveChangesAsync();

        var (subject, html) = EmailTemplates.OrderStatusUpdate(order.CustomerName, order.OrderNumber, StatusToWire(newStatus).Replace('_', ' '));
        await email.SendAsync(order.CustomerEmail, order.CustomerName, subject, html);

        return ToDto(order);
    }
}
