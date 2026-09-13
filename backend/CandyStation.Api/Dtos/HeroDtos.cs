namespace CandyStation.Api.Dtos;

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
