using System.Security.Claims;
using CandyStation.Api.Dtos;
using CandyStation.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CandyStation.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController(OrderService orders) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create(OrderCreateRequest req)
    {
        int? customerId = null;
        if (User.Identity?.IsAuthenticated == true && User.IsInRole("Customer"))
            customerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        try
        {
            var order = await orders.CreateOrderAsync(req, customerId);
            return Ok(order);
        }
        catch (OrderValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("track")]
    public async Task<IActionResult> Track([FromQuery] string number, [FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(number) || string.IsNullOrWhiteSpace(email))
            return BadRequest(new { message = "Order number and email are required." });

        var order = await orders.TrackAsync(number, email);
        return order is null ? NotFound() : Ok(order);
    }

    [HttpGet("mine")]
    [Authorize(Roles = "Customer")]
    public async Task<IActionResult> Mine()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await orders.GetMineAsync(id));
    }
}
