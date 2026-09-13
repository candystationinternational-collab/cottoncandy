using CandyStation.Core.Enums;

namespace CandyStation.Core.Entities;

public class HeroSlide
{
    public int Id { get; set; }
    public int DisplayOrder { get; set; }
    public ItemStatus Status { get; set; } = ItemStatus.Active;

    public string BackgroundColor { get; set; } = "#FFF4F8";

    public HeroItemType ItemType { get; set; }
    public int? ProductId { get; set; }
    public Product? Product { get; set; }
    public int? BundleId { get; set; }
    public Bundle? Bundle { get; set; }

    public string? TitleOverride { get; set; }
    public string? SubtitleOverride { get; set; }
    public string? CtaLabel { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
