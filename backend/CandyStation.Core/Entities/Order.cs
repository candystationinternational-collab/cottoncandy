using CandyStation.Core.Enums;

namespace CandyStation.Core.Entities;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = "";

    public int? CustomerId { get; set; }
    public Customer? Customer { get; set; }

    public string CustomerName { get; set; } = "";
    public string CustomerEmail { get; set; } = "";
    public string CustomerPhone { get; set; } = "";

    public decimal Subtotal { get; set; }
    public decimal Shipping { get; set; }
    public decimal Total { get; set; }

    public string PaymentMethod { get; set; } = "COD";
    public DeliveryMethod DeliveryMethod { get; set; }
    public int? DeliveryZoneId { get; set; }
    public DeliveryZone? DeliveryZone { get; set; }

    public int? ShippingAddressId { get; set; }
    public CustomerAddress? ShippingAddress { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public string? Notes { get; set; }
    public DateTime PlacedAt { get; set; } = DateTime.UtcNow;

    public List<OrderItem> Items { get; set; } = [];
    public List<OrderTimelineEntry> Timeline { get; set; } = [];
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }

    // Exactly one of ProductId / BundleId is set (product line vs. bundle line).
    public int? ProductId { get; set; }
    public Product? Product { get; set; }
    public int? BundleId { get; set; }
    public Bundle? Bundle { get; set; }

    public string ProductName { get; set; } = ""; // snapshot
    public string VariantName { get; set; } = ""; // snapshot ("Bundle" for bundle lines)
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal LineTotal { get; set; }
}

public class OrderTimelineEntry
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public OrderStatus Status { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}
