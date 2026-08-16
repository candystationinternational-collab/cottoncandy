namespace CandyStation.Api.Dtos;

public record OrderLineRequest(string Kind, int? ProductId, int? VariantId, int? BundleId, int Quantity);

public record ShippingAddressRequest(
    string Name,
    string Phone,
    string Address1,
    string? Address2,
    string City,
    string State,
    string PostalCode,
    string Country
);

public record OrderCreateRequest(
    List<OrderLineRequest> Items,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    string DeliveryMethod, // "delivery" | "pickup"
    int? DeliveryZoneId,
    ShippingAddressRequest? ShippingAddress
);

public record OrderItemDto(string ProductName, string VariantName, decimal UnitPrice, int Quantity, decimal LineTotal);

public record OrderTimelineDto(string Status, DateTime ChangedAt);

public record OrderDto(
    string OrderNumber,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    List<OrderItemDto> Items,
    decimal Subtotal,
    decimal Shipping,
    decimal Total,
    string DeliveryMethod,
    string Status,
    List<OrderTimelineDto> Timeline,
    DateTime PlacedAt,
    ShippingAddressRequest? ShippingAddress
);

public record OrderStatusUpdateRequest(string Status);
