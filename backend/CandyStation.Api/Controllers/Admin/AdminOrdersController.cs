using CandyStation.Api.Dtos;
using CandyStation.Api.Services;
using CandyStation.Core.Enums;
using CandyStation.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Controllers.Admin;

// Orders are viewable/status-updatable by both Admin and Delivery (rider) accounts —
// Delivery has no access to any other admin controller (products/categories/bundles/customers/settings).
[ApiController]
[Route("api/admin/orders")]
[Authorize(Roles = "Admin,Delivery")]
public class AdminOrdersController(CandyStationDbContext db, OrderService orderService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status, [FromQuery] string? search,
        [FromQuery] DateTime? from, [FromQuery] DateTime? to)
    {
        var query = db.Orders.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status)) query = query.Where(o => o.Status == OrderService.StatusFromWire(status));
        if (from.HasValue) query = query.Where(o => o.PlacedAt >= from.Value);
        if (to.HasValue) query = query.Where(o => o.PlacedAt <= to.Value);
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(o => o.OrderNumber.Contains(search) || o.CustomerName.Contains(search) || o.CustomerEmail.Contains(search));

        var orders = await query.OrderByDescending(o => o.PlacedAt).ToListAsync();
        var result = orders.Select(o => new AdminOrderListItemDto(
            o.Id, o.OrderNumber, o.CustomerName, o.CustomerEmail, o.Total,
            o.Status.ToString(), o.DeliveryMethod.ToString(), o.PlacedAt));
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await db.Orders.Include(o => o.Items).Include(o => o.Timeline).Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.Id == id);
        return order is null ? NotFound() : Ok(OrderService.ToDto(order));
    }

    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, OrderStatusUpdateRequest req)
    {
        try
        {
            return Ok(await orderService.UpdateStatusAsync(id, req.Status));
        }
        catch (OrderNotFoundException)
        {
            return NotFound();
        }
        catch (OrderValidationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
