using CandyStation.Api.Dtos;
using CandyStation.Core.Entities;
using CandyStation.Core.Enums;
using CandyStation.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Services;

public class CatalogService(CandyStationDbContext db)
{
    public static ProductDto ToDto(Product p) => new(
        p.Id, p.CategoryId, p.Name, p.Description, p.Ingredients, p.ServingSize, p.Calories,
        p.Fat, p.Carbs, p.Protein, p.Price, p.CompareAtPrice, p.Stock, p.Sku, p.Weight,
        (p.FlavorTags ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
        (p.Images ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
        p.CandyColor, p.Rating, p.ReviewCount,
        p.Variants.OrderBy(v => v.SortOrder).Select(v => new ProductVariantDto(v.Id, v.Name, v.Price)).ToList()
    );

    public static CategoryDto ToDto(Category c) => new(c.Id, c.Name, c.Description, c.DisplayOrder);

    public static BundleDto ToDto(Bundle b) => new(
        b.Id, b.Name, b.Description, b.Price, b.CompareAtPrice,
        b.Items.Select(i => new BundleItemDto(
            i.ProductId, i.Product?.Name ?? "", i.Product?.CandyColor ?? "#F90264",
            (i.Product?.Images ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
            i.Quantity
        )).ToList()
    );

    public static DeliveryZoneDto ToDto(DeliveryZone z) => new(z.Id, z.Name, z.Description, z.Cost, z.Enabled);

    public static SettingsDto ToDto(Settings s) => new(
        s.StoreName, s.StoreAddress, s.StorePhone, s.StoreEmail, s.StoreHours, s.Currency,
        s.PickupAddress, s.PickupHours, s.CodEnabled, s.CodMinOrder, s.CodMaxOrder, s.CodInstructions,
        s.TaxRate, s.ShippingPolicy
    );

    public async Task<List<ProductDto>> GetProductsAsync(int? categoryId, string? search, decimal? minPrice,
        decimal? maxPrice, string? tag, string? sort)
    {
        var query = db.Products.Include(p => p.Variants).Where(p => p.Status == ItemStatus.Active).AsQueryable();

        if (categoryId.HasValue) query = query.Where(p => p.CategoryId == categoryId.Value);
        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);
        if (!string.IsNullOrWhiteSpace(tag)) query = query.Where(p => p.FlavorTags != null && p.FlavorTags.Contains(tag));
        if (!string.IsNullOrWhiteSpace(search))
        {
            var q = search.Trim();
            query = query.Where(p => p.Name.Contains(q) || (p.Description != null && p.Description.Contains(q)) || (p.FlavorTags != null && p.FlavorTags.Contains(q)));
        }

        query = sort switch
        {
            "price-asc" => query.OrderBy(p => p.Price),
            "price-desc" => query.OrderByDescending(p => p.Price),
            "rating" => query.OrderByDescending(p => p.Rating),
            _ => query.OrderBy(p => p.Name),
        };

        var products = await query.ToListAsync();
        return products.Select(ToDto).ToList();
    }

    public async Task<ProductDto?> GetProductAsync(int id)
    {
        var p = await db.Products.Include(x => x.Variants).FirstOrDefaultAsync(x => x.Id == id);
        return p is null ? null : ToDto(p);
    }

    public async Task<List<CategoryDto>> GetCategoriesAsync() =>
        await db.Categories.Where(c => c.Status == ItemStatus.Active).OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Description, c.DisplayOrder)).ToListAsync();

    public async Task<List<BundleDto>> GetBundlesAsync()
    {
        var bundles = await db.Bundles.Include(b => b.Items).ThenInclude(i => i.Product)
            .Where(b => b.Status == ItemStatus.Active).ToListAsync();
        return bundles.Select(ToDto).ToList();
    }

    public async Task<BundleDto?> GetBundleAsync(int id)
    {
        var b = await db.Bundles.Include(x => x.Items).ThenInclude(i => i.Product).FirstOrDefaultAsync(x => x.Id == id);
        return b is null ? null : ToDto(b);
    }

    public async Task<List<DeliveryZoneDto>> GetDeliveryZonesAsync() =>
        await db.DeliveryZones.Where(z => z.Enabled).Select(z => new DeliveryZoneDto(z.Id, z.Name, z.Description, z.Cost, z.Enabled)).ToListAsync();

    public async Task<SettingsDto?> GetSettingsAsync()
    {
        var s = await db.Settings.FirstOrDefaultAsync();
        return s is null ? null : ToDto(s);
    }
}
