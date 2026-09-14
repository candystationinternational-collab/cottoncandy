using CandyStation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(CatalogService catalog) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? categoryId, [FromQuery] string? search, [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice, [FromQuery] string? tag, [FromQuery] string? sort)
    {
        var products = await catalog.GetProductsAsync(categoryId, search, minPrice, maxPrice, tag, sort);
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await catalog.GetProductAsync(id);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var product = await catalog.GetProductByIdOrSlugAsync(slug);
        return product is null ? NotFound() : Ok(product);
    }
}
