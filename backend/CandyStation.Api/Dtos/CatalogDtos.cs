namespace CandyStation.Api.Dtos;

public record CategoryDto(int Id, string Name, string? Description, int DisplayOrder);

public record ProductVariantDto(int Id, string Name, decimal Price);

public record ProductDto(
    int Id,
    int CategoryId,
    string Name,
    string Slug,
    string? MetaTitle,
    string? MetaDescription,
    string? Description,
    string? Ingredients,
    string? ServingSize,
    int? Calories,
    string? Fat,
    string? Carbs,
    string? Protein,
    decimal Price,
    decimal? CompareAtPrice,
    int Stock,
    string Sku,
    string? Weight,
    string[] FlavorTags,
    string[] Images,
    string CandyColor,
    decimal Rating,
    int ReviewCount,
    List<ProductVariantDto> Variants
);

public record BundleItemDto(int ProductId, string ProductName, string CandyColor, string[] Images, int Quantity);

public record BundleDto(
    int Id,
    string Name,
    string? Description,
    decimal Price,
    decimal? CompareAtPrice,
    List<BundleItemDto> Items
);

public record DeliveryZoneDto(int Id, string Name, string? Description, decimal Cost, bool Enabled);

public record SettingsDto(
    string StoreName,
    string? StoreAddress,
    string? StorePhone,
    string? StoreEmail,
    string? StoreHours,
    string Currency,
    string? PickupAddress,
    string? PickupHours,
    bool CodEnabled,
    decimal CodMinOrder,
    decimal CodMaxOrder,
    string? CodInstructions,
    decimal TaxRate,
    string? ShippingPolicy,
    string? PrivacyPolicy,
    string? TermsOfService,
    string? ReturnRefundPolicy,
    string? FacebookUrl,
    string? InstagramUrl,
    string? TiktokUrl
);
