using CandyStation.Core.Enums;

namespace CandyStation.Core.Entities;

public class Product
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? Description { get; set; }
    public string? Ingredients { get; set; }
    public string? ServingSize { get; set; }
    public int? Calories { get; set; }
    public string? Fat { get; set; }
    public string? Carbs { get; set; }
    public string? Protein { get; set; }

    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public decimal? CostPrice { get; set; }
    public int Stock { get; set; }
    public string Sku { get; set; } = "";
    public ItemStatus Status { get; set; } = ItemStatus.Active;
    public string? Weight { get; set; }
    public string? FlavorTags { get; set; } // comma-separated
    public string? Images { get; set; } // comma-separated URLs (relative or absolute); first = primary photo
    public string CandyColor { get; set; } = "#F90264";
    public decimal Rating { get; set; }
    public int ReviewCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<ProductVariant> Variants { get; set; } = [];
}
