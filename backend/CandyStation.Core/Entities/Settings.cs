namespace CandyStation.Core.Entities;

public class Settings
{
    public int Id { get; set; }
    public string StoreName { get; set; } = "Candy Station";
    public string? StoreAddress { get; set; }
    public string? StorePhone { get; set; }
    public string? StoreEmail { get; set; }
    public string? StoreHours { get; set; }
    public string Currency { get; set; } = "NPR";
    public string? PickupAddress { get; set; }
    public string? PickupHours { get; set; }
    public bool CodEnabled { get; set; } = true;
    public decimal CodMinOrder { get; set; }
    public decimal CodMaxOrder { get; set; } = 10000;
    public string? CodInstructions { get; set; }
    public decimal TaxRate { get; set; }
    public string? ShippingPolicy { get; set; }
}
