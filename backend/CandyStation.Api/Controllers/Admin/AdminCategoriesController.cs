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
[Route("api/admin/categories")]
[Authorize(Roles = "Admin")]
public class AdminCategoriesController(CandyStationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await db.Categories.OrderBy(c => c.DisplayOrder).ToListAsync();
        return Ok(categories.Select(CatalogService.ToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CategoryWriteDto req)
    {
        var category = new Category();
        Apply(category, req);
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return Ok(CatalogService.ToDto(category));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CategoryWriteDto req)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return NotFound();
        Apply(category, req);
        category.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
        return Ok(CatalogService.ToDto(category));
    }

    [HttpPatch("{id:int}/display-order")]
    public async Task<IActionResult> Reorder(int id, DisplayOrderUpdateDto req)
    {
        var category = await db.Categories.FindAsync(id);
        if (category is null) return NotFound();
        category.DisplayOrder = req.DisplayOrder;
        await db.SaveChangesAsync();
        return Ok(CatalogService.ToDto(category));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var hasProducts = await db.Products.AnyAsync(p => p.CategoryId == id);
        if (hasProducts) return BadRequest(new { message = "Category has assigned products and cannot be deleted." });

        var category = await db.Categories.FindAsync(id);
        if (category is null) return NotFound();
        db.Categories.Remove(category);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void Apply(Category category, CategoryWriteDto req)
    {
        category.Name = req.Name;
        category.Description = req.Description;
        category.DisplayOrder = req.DisplayOrder;
        category.Status = req.Status == "inactive" ? ItemStatus.Inactive : ItemStatus.Active;
    }
}
