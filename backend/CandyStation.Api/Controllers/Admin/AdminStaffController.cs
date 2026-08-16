using CandyStation.Api.Dtos;
using CandyStation.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers.Admin;

// Staff management (Admin + Delivery accounts) is Admin-only — riders cannot create/edit users.
[ApiController]
[Route("api/admin/staff")]
[Authorize(Roles = "Admin")]
public class AdminStaffController(AdminAuthService auth) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await auth.GetStaffAsync());

    [HttpPost]
    public async Task<IActionResult> Create(StaffCreateDto req)
    {
        try
        {
            return Ok(await auth.CreateStaffAsync(req));
        }
        catch (DuplicateEmailException)
        {
            return Conflict(new { message = "A staff account with this username already exists." });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, StaffUpdateDto req)
    {
        try
        {
            return Ok(await auth.UpdateStaffAsync(id, req));
        }
        catch (InvalidCredentialsException)
        {
            return NotFound();
        }
    }

    [HttpPost("{id:int}/reset-password")]
    public async Task<IActionResult> ResetPassword(int id, StaffResetPasswordDto req)
    {
        try
        {
            await auth.ResetStaffPasswordAsync(id, req);
            return Ok(new { message = "Password reset." });
        }
        catch (InvalidCredentialsException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await auth.DeleteStaffAsync(id);
            return NoContent();
        }
        catch (InvalidCredentialsException)
        {
            return NotFound();
        }
    }
}
