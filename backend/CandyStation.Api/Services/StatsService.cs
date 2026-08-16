using CandyStation.Api.Dtos;
using CandyStation.Core;
using CandyStation.Core.Enums;
using CandyStation.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace CandyStation.Api.Services;

public class StatsService(CandyStationDbContext db)
{
    public async Task<StatsDto> GetStatsAsync()
    {
        var orders = await db.Orders.Include(o => o.Items).ToListAsync();
        var products = await db.Products.ToListAsync();

        var revenue = OrderRules.CalculateRevenue(orders.Select(o => (o.Status, o.Total)));
        var pendingCount = orders.Count(o => o.Status == OrderStatus.Pending);
        var lowStock = products.Where(p => OrderRules.IsLowStock(p.Stock)).ToList();

        var since = DateTime.UtcNow.Date.AddDays(-6);
        var ordersByDay = orders.Where(o => o.PlacedAt.Date >= since)
            .GroupBy(o => o.PlacedAt.Date)
            .OrderBy(g => g.Key)
            .Select(g => new DailyCountDto(g.Key.ToString("yyyy-MM-dd"), g.Count()))
            .ToList();

        var recentOrders = orders.OrderByDescending(o => o.PlacedAt).Take(10)
            .Select(o => new RecentOrderDto(o.OrderNumber, o.CustomerName, o.Total, o.Status.ToString(), o.PlacedAt))
            .ToList();

        var topProducts = orders.SelectMany(o => o.Items)
            .Where(i => i.ProductId != null)
            .GroupBy(i => i.ProductName)
            .OrderByDescending(g => g.Sum(i => i.Quantity))
            .Take(5)
            .Select(g => new TopProductDto(g.Key, g.Sum(i => i.Quantity)))
            .ToList();

        return new StatsDto(
            revenue,
            orders.Count,
            pendingCount,
            products.Count,
            lowStock.Count,
            ordersByDay,
            recentOrders,
            topProducts,
            lowStock.Select(p => new LowStockProductDto(p.Name, p.Stock)).ToList()
        );
    }
}
