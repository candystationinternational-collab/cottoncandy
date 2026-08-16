using System.Security.Claims;
using CandyStation.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers;

[ApiController]
[Route("api/customers")]
[Authorize(Roles = "Customer")]
public class CustomersController(AuthService auth) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var me = await auth.GetMeAsync(id);
        return me is null ? NotFound() : Ok(me);
    }
}
