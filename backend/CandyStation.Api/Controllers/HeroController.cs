using CandyStation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers;

[ApiController]
[Route("api/hero-slides")]
public class HeroController(CatalogService catalog) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await catalog.GetHeroSlidesAsync());
}
