using CandyStation.Core.Enums;

namespace CandyStation.Core;

/// <summary>Pure, DB-free business rules for orders — kept separate from OrderService so they're unit-testable without EF Core.</summary>
public static class OrderRules
{
    public const int LowStockThreshold = 20;
    public const decimal CodMaxOrder = 10000m;

    private static readonly OrderStatus[] ForwardSequence =
    [
        OrderStatus.Pending, OrderStatus.Confirmed, OrderStatus.Preparing, OrderStatus.OutForDelivery, OrderStatus.Delivered,
    ];

    public static string GenerateOrderNumber(int year, int sequence) => $"ORD-{year}-{sequence:0000}";

    public static decimal CalculateSubtotal(IEnumerable<(decimal UnitPrice, int Quantity)> lines) =>
        lines.Sum(l => l.UnitPrice * l.Quantity);

    public static decimal CalculateTotal(decimal subtotal, decimal shipping) => subtotal + shipping;

    public static bool IsLowStock(int stock) => stock <= LowStockThreshold;

    public static bool IsWithinCodLimit(decimal total) => total <= CodMaxOrder;

    /// <summary>Orders containing any bundle are exempt from the minimum; orders made up only of single
    /// (non-bundle) items must exceed minOrder to check out.</summary>
    public static bool MeetsMinimumForSingleItems(decimal subtotal, bool hasBundle, decimal minOrder) =>
        hasBundle || subtotal > minOrder;

    /// <summary>Cancellation is always allowed from any non-terminal state; forward transitions must follow the sequence.</summary>
    public static bool CanTransition(OrderStatus from, OrderStatus to)
    {
        if (from is OrderStatus.Delivered or OrderStatus.Cancelled) return false;
        if (to == OrderStatus.Cancelled) return true;

        var fromIndex = Array.IndexOf(ForwardSequence, from);
        var toIndex = Array.IndexOf(ForwardSequence, to);
        return fromIndex >= 0 && toIndex == fromIndex + 1;
    }

    public static decimal CalculateRevenue(IEnumerable<(OrderStatus Status, decimal Total)> orders) =>
        orders.Where(o => o.Status == OrderStatus.Delivered).Sum(o => o.Total);
}
