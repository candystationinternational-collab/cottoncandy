namespace CandyStation.Api.Dtos;

/// <summary>One flavor within a bundle hero slide, so the hero art can show the whole bundle rather than a single photo.</summary>
public record HeroSlideItemDto(int ProductId, string Name, string? Image, string CandyColor);

public record HeroSlideDto(
    int Id,
    string BackgroundColor,
    string ItemType, // "product" | "bundle"
    int? ProductId,
    int? BundleId,
    string Title,
    string? TitleOverride,
    string? Subtitle,
    string? SubtitleOverride,
    string CtaLabel,
    string? CtaLabelOverride,
    string LinkUrl,
    string CandyColor,
    string[] Images,
    HeroSlideItemDto[] Items,
    decimal Price,
    decimal? CompareAtPrice,
    int DisplayOrder,
    string Status
);

public record HeroSlideWriteDto(
    string ItemType, // "product" | "bundle"
    int? ProductId,
    int? BundleId,
    string BackgroundColor,
    string? TitleOverride,
    string? SubtitleOverride,
    string? CtaLabel,
    int DisplayOrder,
    string Status
);
