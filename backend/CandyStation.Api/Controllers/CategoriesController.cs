using CandyStation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(CatalogService catalog) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await catalog.GetCategoriesAsync());
}
