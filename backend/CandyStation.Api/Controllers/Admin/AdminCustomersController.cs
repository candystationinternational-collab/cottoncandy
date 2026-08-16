using CandyStation.Api.Dtos;
using CandyStation.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/customers")]
[Authorize(Roles = "Admin")]
public class AdminCustomersController(CandyStationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? sort)
    {
        var query = db.Customers.AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c => c.Name.Contains(search) || c.Email.Contains(search));

        query = sort switch
        {
            "spent" => query.OrderByDescending(c => c.TotalSpent),
            "orders" => query.OrderByDescending(c => c.OrdersCount),
            _ => query.OrderByDescending(c => c.JoinedDate),
        };

        var customers = await query.ToListAsync();
        return Ok(customers.Select(c => new CustomerAdminDto(c.Id, c.Name, c.Email, c.Phone, c.JoinedDate, c.OrdersCount, c.TotalSpent)));
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var c = await db.Customers.Include(x => x.Addresses).FirstOrDefaultAsync(x => x.Id == id);
        return c is null ? NotFound() : Ok(new CustomerAdminDto(c.Id, c.Name, c.Email, c.Phone, c.JoinedDate, c.OrdersCount, c.TotalSpent));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CustomerUpdateDto req)
    {
        var c = await db.Customers.FindAsync(id);
        if (c is null) return NotFound();
        c.Name = req.Name;
        c.Phone = req.Phone;
        await db.SaveChangesAsync();
        return Ok(new CustomerAdminDto(c.Id, c.Name, c.Email, c.Phone, c.JoinedDate, c.OrdersCount, c.TotalSpent));
    }
}
