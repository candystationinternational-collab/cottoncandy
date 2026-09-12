namespace CandyStation.Api.Dtos;

public record ProductVariantWriteDto(int? Id, string Name, decimal Price);

public record ProductWriteDto(
    int CategoryId,
    string Name,
    string? Description,
    string? Ingredients,
    string? ServingSize,
    int? Calories,
    string? Fat,
    string? Carbs,
    string? Protein,
    decimal Price,
    decimal? CompareAtPrice,
    decimal? CostPrice,
    int Stock,
    string Sku,
    string? Weight,
    string[] FlavorTags,
    string[] Images,
    string CandyColor,
    string Status,
    List<ProductVariantWriteDto> Variants
);

public record CategoryWriteDto(string Name, string? Description, int DisplayOrder, string Status);

public record BundleItemWriteDto(int ProductId, int Quantity);
public record BundleWriteDto(string Name, string? Description, decimal Price, decimal? CompareAtPrice, string Status, List<BundleItemWriteDto> Items);

public record DisplayOrderUpdateDto(int DisplayOrder);

public record CustomerAdminDto(int Id, string Name, string Email, string? Phone, DateTime JoinedDate, int OrdersCount, decimal TotalSpent);
public record CustomerUpdateDto(string Name, string? Phone);

public record SettingsUpdateDto(
    string StoreName,
    string? StoreAddress,
    string? StorePhone,
    string? StoreEmail,
    string? StoreHours,
    string? PickupAddress,
    string? PickupHours,
    bool CodEnabled,
    decimal CodMinOrder,
    decimal CodMaxOrder,
    string? CodInstructions,
    decimal TaxRate,
    string? ShippingPolicy
);

public record AdminOrderListItemDto(
    int Id, string OrderNumber, string CustomerName, string CustomerEmail, decimal Total,
    string Status, string DeliveryMethod, DateTime PlacedAt
);
