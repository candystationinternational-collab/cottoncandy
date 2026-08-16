namespace CandyStation.Api.Dtos;

public record RecentOrderDto(string OrderNumber, string CustomerName, decimal Total, string Status, DateTime PlacedAt);
public record TopProductDto(string Name, int UnitsSold);
public record LowStockProductDto(string Name, int Stock);
public record DailyCountDto(string Date, int Count);

public record StatsDto(
    decimal Revenue,
    int OrdersCount,
    int PendingCount,
    int ProductsCount,
    int LowStockCount,
    List<DailyCountDto> OrdersByDay,
    List<RecentOrderDto> RecentOrders,
    List<TopProductDto> TopProducts,
    List<LowStockProductDto> LowStockProducts
);
