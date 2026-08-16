namespace CandyStation.Core.Entities;

public class DeliveryZone
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public decimal Cost { get; set; }
    public bool Enabled { get; set; } = true;
}
