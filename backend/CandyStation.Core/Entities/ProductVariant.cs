namespace CandyStation.Core.Entities;

public class ProductVariant
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string Name { get; set; } = "";
    public decimal Price { get; set; }
    public int SortOrder { get; set; }
}
