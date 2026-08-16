using System.Security.Claims;
using CandyStation.Api.Dtos;
using CandyStation.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/auth")]
public class AdminAuthController(AdminAuthService auth) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login(AdminLoginRequest req)
    {
        try
        {
            return Ok(await auth.LoginAsync(req));
        }
        catch (InvalidCredentialsException)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }
    }

    [HttpPost("/api/admin/password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest req)
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        try
        {
            await auth.ChangePasswordAsync(id, req);
            return Ok(new { message = "Password updated." });
        }
        catch (InvalidCredentialsException)
        {
            return BadRequest(new { message = "Current password is incorrect." });
        }
    }
}
