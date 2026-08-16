using CandyStation.Core.Enums;

namespace CandyStation.Core.Entities;

public class Bundle
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public decimal? CompareAtPrice { get; set; }
    public ItemStatus Status { get; set; } = ItemStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<BundleItem> Items { get; set; } = [];
}

public class BundleItem
{
    public int Id { get; set; }
    public int BundleId { get; set; }
    public Bundle? Bundle { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int Quantity { get; set; } = 1;
}
