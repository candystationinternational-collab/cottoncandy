using CandyStation.Api.Dtos;
using CandyStation.Api.Services;
using CandyStation.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/settings")]
[Authorize(Roles = "Admin")]
public class AdminSettingsController(CandyStationDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var s = await db.Settings.FirstOrDefaultAsync();
        return s is null ? NotFound() : Ok(CatalogService.ToDto(s));
    }

    [HttpPut]
    public async Task<IActionResult> Update(SettingsUpdateDto req)
    {
        var s = await db.Settings.FirstOrDefaultAsync();
        if (s is null) return NotFound();

        s.StoreName = req.StoreName;
        s.StoreAddress = req.StoreAddress;
        s.StorePhone = req.StorePhone;
        s.StoreEmail = req.StoreEmail;
        s.StoreHours = req.StoreHours;
        s.PickupAddress = req.PickupAddress;
        s.PickupHours = req.PickupHours;
        s.CodEnabled = req.CodEnabled;
        s.CodMinOrder = req.CodMinOrder;
        s.CodMaxOrder = req.CodMaxOrder;
        s.CodInstructions = req.CodInstructions;
        s.TaxRate = req.TaxRate;
        s.ShippingPolicy = req.ShippingPolicy;
        s.PrivacyPolicy = req.PrivacyPolicy;
        s.TermsOfService = req.TermsOfService;
        s.ReturnRefundPolicy = req.ReturnRefundPolicy;
        s.FacebookUrl = req.FacebookUrl;
        s.InstagramUrl = req.InstagramUrl;
        s.TiktokUrl = req.TiktokUrl;

        await db.SaveChangesAsync();
        return Ok(CatalogService.ToDto(s));
    }
}
