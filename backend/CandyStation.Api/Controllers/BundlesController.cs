using CandyStation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers;

[ApiController]
[Route("api/bundles")]
public class BundlesController(CatalogService catalog) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await catalog.GetBundlesAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var bundle = await catalog.GetBundleAsync(id);
        return bundle is null ? NotFound() : Ok(bundle);
    }
}
