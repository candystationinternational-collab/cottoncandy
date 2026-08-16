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
[Route("api/admin/bundles")]
[Authorize(Roles = "Admin")]
public class AdminBundlesController(CandyStationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bundles = await db.Bundles.Include(b => b.Items).ThenInclude(i => i.Product).ToListAsync();
        return Ok(bundles.Select(CatalogService.ToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create(BundleWriteDto req)
    {
        var bundle = new Bundle();
        Apply(bundle, req);
        db.Bundles.Add(bundle);
        await db.SaveChangesAsync();
        await db.Entry(bundle).Collection(b => b.Items).Query().Include(i => i.Product).LoadAsync();
        return Ok(CatalogService.ToDto(bundle));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, BundleWriteDto req)
    {
        var bundle = await db.Bundles.Include(b => b.Items).FirstOrDefaultAsync(b => b.Id == id);
        if (bundle is null) return NotFound();
        Apply(bundle, req);
        await db.SaveChangesAsync();
        await db.Entry(bundle).Collection(b => b.Items).Query().Include(i => i.Product).LoadAsync();
        return Ok(CatalogService.ToDto(bundle));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var bundle = await db.Bundles.FindAsync(id);
        if (bundle is null) return NotFound();
        db.Bundles.Remove(bundle);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Bundle bundle, BundleWriteDto req)
    {
        bundle.Name = req.Name;
        bundle.Description = req.Description;
        bundle.Price = req.Price;
        bundle.CompareAtPrice = req.CompareAtPrice;
        bundle.Status = req.Status == "inactive" ? ItemStatus.Inactive : ItemStatus.Active;
        bundle.Items.Clear();
        foreach (var i in req.Items)
            bundle.Items.Add(new BundleItem { ProductId = i.ProductId, Quantity = i.Quantity });
    }
}
