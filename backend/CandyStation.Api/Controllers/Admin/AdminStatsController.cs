using CandyStation.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/stats")]
[Authorize(Roles = "Admin")]
public class AdminStatsController(StatsService stats) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await stats.GetStatsAsync());
}
