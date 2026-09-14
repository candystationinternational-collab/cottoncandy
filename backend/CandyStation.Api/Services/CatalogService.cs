using CandyStation.Api.Dtos;
using CandyStation.Core.Entities;
using CandyStation.Core.Enums;
using CandyStation.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Services;

public class CatalogService(CandyStationDbContext db)
{
    public static ProductDto ToDto(Product p) => new(
        p.Id, p.CategoryId, p.Name, p.Slug, p.MetaTitle, p.MetaDescription, p.Description, p.Ingredients, p.ServingSize, p.Calories,
        p.Fat, p.Carbs, p.Protein, p.Price, p.CompareAtPrice, p.Stock, p.Sku, p.Weight,
        (p.FlavorTags ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
        (p.Images ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
        p.CandyColor, p.Rating, p.ReviewCount,
        p.Variants.OrderBy(v => v.SortOrder).Select(v => new ProductVariantDto(v.Id, v.Name, v.Price)).ToList()
    );

    /// <summary>URL-safe slug from a product name: lowercase, non-alphanumerics collapsed to single hyphens.</summary>
    public static string Slugify(string input)
    {
        var lowered = input.Trim().ToLowerInvariant();
        var slug = System.Text.RegularExpressions.Regex.Replace(lowered, @"[^a-z0-9]+", "-").Trim('-');
        return slug.Length == 0 ? "item" : slug;
    }

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

    /// <summary>Requires HeroSlide.Product and HeroSlide.Bundle (with Bundle.Items.Product) to be loaded.</summary>
    public static HeroSlideDto ToDto(HeroSlide h)
    {
        var status = h.Status == ItemStatus.Inactive ? "inactive" : "active";

        if (h.ItemType == HeroItemType.Bundle && h.Bundle is not null)
        {
            var images = h.Bundle.Items.SelectMany(i => (i.Product?.Images ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)).ToArray();
            var candyColor = h.Bundle.Items.FirstOrDefault()?.Product?.CandyColor ?? "#F90264";
            var items = h.Bundle.Items.Select(i => new HeroSlideItemDto(
                i.ProductId, i.Product?.Name ?? "",
                (i.Product?.Images ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).FirstOrDefault(),
                i.Product?.CandyColor ?? "#F90264"
            )).ToArray();
            return new HeroSlideDto(
                h.Id, h.BackgroundColor, "bundle", null, h.BundleId,
                h.TitleOverride ?? h.Bundle.Name, h.TitleOverride, h.SubtitleOverride ?? h.Bundle.Description, h.SubtitleOverride,
                h.CtaLabel ?? "Shop Bundles", h.CtaLabel, "/shop", candyColor, images, items,
                h.Bundle.Price, h.Bundle.CompareAtPrice, h.DisplayOrder, status
            );
        }

        var p = h.Product;
        return new HeroSlideDto(
            h.Id, h.BackgroundColor, "product", h.ProductId, null,
            h.TitleOverride ?? p?.Name ?? "", h.TitleOverride, h.SubtitleOverride ?? p?.Description, h.SubtitleOverride,
            h.CtaLabel ?? "Shop Now", h.CtaLabel, p is not null ? $"/product/{p.Slug}" : "/shop",
            p?.CandyColor ?? "#F90264",
            (p?.Images ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries),
            [],
            p?.Price ?? 0, p?.CompareAtPrice, h.DisplayOrder, status
        );
    }

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

    /// <summary>Looks up by numeric id when the segment parses as one (legacy links), otherwise by slug.</summary>
    public async Task<ProductDto?> GetProductByIdOrSlugAsync(string idOrSlug)
    {
        var p = int.TryParse(idOrSlug, out var id)
            ? await db.Products.Include(x => x.Variants).FirstOrDefaultAsync(x => x.Id == id)
            : await db.Products.Include(x => x.Variants).FirstOrDefaultAsync(x => x.Slug == idOrSlug);
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

    public async Task<List<HeroSlideDto>> GetHeroSlidesAsync()
    {
        var slides = await db.HeroSlides
            .Include(x => x.Product)
            .Include(x => x.Bundle).ThenInclude(b => b!.Items).ThenInclude(i => i.Product)
            .Where(x => x.Status == ItemStatus.Active)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();
        return slides.Select(ToDto).ToList();
    }
}
