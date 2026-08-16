using CandyStation.Api.Dtos;
using CandyStation.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService auth) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest req)
    {
        try
        {
            return Ok(await auth.RegisterAsync(req));
        }
        catch (DuplicateEmailException)
        {
            return Conflict(new { message = "An account with this email already exists." });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest req)
    {
        try
        {
            return Ok(await auth.LoginAsync(req));
        }
        catch (InvalidCredentialsException)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }
        catch (EmailNotVerifiedException)
        {
            return StatusCode(403, new { message = "Please verify your email before logging in.", code = "EMAIL_NOT_VERIFIED" });
        }
    }

    [HttpGet("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromQuery] string token)
    {
        try
        {
            return Ok(await auth.VerifyEmailAsync(token));
        }
        catch (InvalidOrExpiredTokenException)
        {
            return BadRequest(new { message = "This verification link is invalid or has expired." });
        }
    }

    [HttpPost("resend-verification")]
    public async Task<IActionResult> ResendVerification(ResendVerificationRequest req)
    {
        try
        {
            await auth.ResendVerificationAsync(req.Email);
            return Ok(new { message = "If an account exists with that email, a new verification link has been sent." });
        }
        catch (CustomerNotFoundException)
        {
            // Same response as success — don't leak which emails have accounts.
            return Ok(new { message = "If an account exists with that email, a new verification link has been sent." });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest req)
    {
        await auth.ForgotPasswordAsync(req.Email);
        return Ok(new { message = "If an account exists with that email, a password reset link has been sent." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest req)
    {
        try
        {
            await auth.ResetPasswordAsync(req);
            return Ok(new { message = "Password reset successfully. You can now log in." });
        }
        catch (InvalidOrExpiredTokenException)
        {
            return BadRequest(new { message = "This reset link is invalid or has expired." });
        }
    }
}
