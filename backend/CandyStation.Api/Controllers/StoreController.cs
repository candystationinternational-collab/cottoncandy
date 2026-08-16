using CandyStation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers;

[ApiController]
[Route("api")]
public class StoreController(CatalogService catalog) : ControllerBase
{
    [HttpGet("delivery-zones")]
    public async Task<IActionResult> GetZones() => Ok(await catalog.GetDeliveryZonesAsync());

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await catalog.GetSettingsAsync();
        return settings is null ? NotFound() : Ok(settings);
    }
}
