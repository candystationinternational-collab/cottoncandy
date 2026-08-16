using CandyStation.Api.Dtos;
using CandyStation.Api.Services;
using CandyStation.Core.Entities;
using CandyStation.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Controllers.Admin;

public record DeliveryZoneWriteDto(string Name, string? Description, decimal Cost, bool Enabled);

[ApiController]
[Route("api/admin/delivery-zones")]
[Authorize(Roles = "Admin")]
public class AdminDeliveryZonesController(CandyStationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var zones = await db.DeliveryZones.ToListAsync();
        return Ok(zones.Select(CatalogService.ToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create(DeliveryZoneWriteDto req)
    {
        var zone = new DeliveryZone { Name = req.Name, Description = req.Description, Cost = req.Cost, Enabled = req.Enabled };
        db.DeliveryZones.Add(zone);
        await db.SaveChangesAsync();
        return Ok(CatalogService.ToDto(zone));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, DeliveryZoneWriteDto req)
    {
        var zone = await db.DeliveryZones.FindAsync(id);
        if (zone is null) return NotFound();
        zone.Name = req.Name;
        zone.Description = req.Description;
        zone.Cost = req.Cost;
        zone.Enabled = req.Enabled;
        await db.SaveChangesAsync();
        return Ok(CatalogService.ToDto(zone));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var zone = await db.DeliveryZones.FindAsync(id);
        if (zone is null) return NotFound();
        db.DeliveryZones.Remove(zone);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
