using CandyStation.Core.Enums;

namespace CandyStation.Core.Entities;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public int DisplayOrder { get; set; }
    public ItemStatus Status { get; set; } = ItemStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<Product> Products { get; set; } = [];
}
