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
[Route("api/admin/products")]
[Authorize(Roles = "Admin")]
public class AdminProductsController(CandyStationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await db.Products.Include(p => p.Variants).OrderBy(p => p.Name).ToListAsync();
        return Ok(products.Select(CatalogService.ToDto));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await db.Products.Include(x => x.Variants).FirstOrDefaultAsync(x => x.Id == id);
        return p is null ? NotFound() : Ok(CatalogService.ToDto(p));
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProductWriteDto req)
    {
        var product = new Product();
        Apply(product, req);
        product.Slug = await ResolveSlugAsync(null, req.Slug, req.Name);
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, CatalogService.ToDto(product));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, ProductWriteDto req)
    {
        var product = await db.Products.Include(p => p.Variants).FirstOrDefaultAsync(p => p.Id == id);
        if (product is null) return NotFound();
        Apply(product, req);
        product.Slug = await ResolveSlugAsync(id, req.Slug, req.Name);
        product.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Ok(CatalogService.ToDto(product));
    }

    /// <summary>Uses the admin-supplied slug if given, otherwise derives one from the name; appends
    /// -2, -3, etc. on collision with another product (excludeId is the product being updated, if any).</summary>
    private async Task<string> ResolveSlugAsync(int? excludeId, string? requestedSlug, string name)
    {
        var baseSlug = CatalogService.Slugify(string.IsNullOrWhiteSpace(requestedSlug) ? name : requestedSlug);
        var slug = baseSlug;
        var suffix = 2;
        while (await db.Products.AnyAsync(p => p.Slug == slug && p.Id != (excludeId ?? -1)))
        {
            slug = $"{baseSlug}-{suffix}";
            suffix++;
        }
        return slug;
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return NotFound();
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Product product, ProductWriteDto req)
    {
        product.CategoryId = req.CategoryId;
        product.Name = req.Name;
        product.MetaTitle = string.IsNullOrWhiteSpace(req.MetaTitle) ? null : req.MetaTitle.Trim();
        product.MetaDescription = string.IsNullOrWhiteSpace(req.MetaDescription) ? null : req.MetaDescription.Trim();
        product.Description = req.Description;
        product.Ingredients = req.Ingredients;
        product.ServingSize = req.ServingSize;
        product.Calories = req.Calories;
        product.Fat = req.Fat;
        product.Carbs = req.Carbs;
        product.Protein = req.Protein;
        product.Price = req.Price;
        product.CompareAtPrice = req.CompareAtPrice;
        product.CostPrice = req.CostPrice;
        product.Stock = req.Stock;
        product.Sku = req.Sku;
        product.Weight = req.Weight;
        product.FlavorTags = string.Join(",", req.FlavorTags);
        product.Images = string.Join(",", req.Images.Select(i => i.Trim()).Where(i => i.Length > 0));
        product.CandyColor = req.CandyColor;
        product.Status = req.Status == "inactive" ? ItemStatus.Inactive : ItemStatus.Active;

        product.Variants.Clear();
        foreach (var v in req.Variants)
            product.Variants.Add(new ProductVariant { Name = v.Name, Price = v.Price });
    }
}
