using CandyStation.Api.Dtos;
using CandyStation.Api.Services;
using CandyStation.Core.Entities;
using CandyStation.Core.Enums;
using CandyStation.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/hero-slides")]
[Authorize(Roles = "Admin")]
public class AdminHeroSlidesController(CandyStationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var slides = await db.HeroSlides
            .Include(x => x.Product)
            .Include(x => x.Bundle).ThenInclude(b => b!.Items).ThenInclude(i => i.Product)
            .OrderBy(x => x.DisplayOrder)
            .ToListAsync();
        return Ok(slides.Select(CatalogService.ToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create(HeroSlideWriteDto req)
    {
        var slide = new HeroSlide();
        if (!Apply(slide, req, out var error)) return BadRequest(new { message = error });
        db.HeroSlides.Add(slide);
        await db.SaveChangesAsync();
        await Reload(slide);
        return Ok(CatalogService.ToDto(slide));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, HeroSlideWriteDto req)
    {
        var slide = await db.HeroSlides.FindAsync(id);
        if (slide is null) return NotFound();
        if (!Apply(slide, req, out var error)) return BadRequest(new { message = error });
        await db.SaveChangesAsync();
        await Reload(slide);
        return Ok(CatalogService.ToDto(slide));
    }

    [HttpPatch("{id:int}/display-order")]
    public async Task<IActionResult> Reorder(int id, DisplayOrderUpdateDto req)
    {
        var slide = await db.HeroSlides.FindAsync(id);
        if (slide is null) return NotFound();
        slide.DisplayOrder = req.DisplayOrder;
        await db.SaveChangesAsync();
        await Reload(slide);
        return Ok(CatalogService.ToDto(slide));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var slide = await db.HeroSlides.FindAsync(id);
        if (slide is null) return NotFound();
        db.HeroSlides.Remove(slide);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task Reload(HeroSlide slide)
    {
        if (slide.ItemType == HeroItemType.Bundle)
            await db.Entry(slide).Reference(x => x.Bundle).Query().Include(b => b!.Items).ThenInclude(i => i.Product).LoadAsync();
        else
            await db.Entry(slide).Reference(x => x.Product).LoadAsync();
    }

    private static bool Apply(HeroSlide slide, HeroSlideWriteDto req, out string? error)
    {
        error = null;
        var isBundle = req.ItemType == "bundle";
        if (isBundle && req.BundleId is null) { error = "BundleId is required for bundle slides."; return false; }
        if (!isBundle && req.ProductId is null) { error = "ProductId is required for product slides."; return false; }

        slide.ItemType = isBundle ? HeroItemType.Bundle : HeroItemType.Product;
        slide.ProductId = isBundle ? null : req.ProductId;
        slide.BundleId = isBundle ? req.BundleId : null;
        slide.BackgroundColor = req.BackgroundColor;
        slide.TitleOverride = req.TitleOverride;
        slide.SubtitleOverride = req.SubtitleOverride;
        slide.CtaLabel = req.CtaLabel;
        slide.DisplayOrder = req.DisplayOrder;
        slide.Status = req.Status == "inactive" ? ItemStatus.Inactive : ItemStatus.Active;
        return true;
    }
}
