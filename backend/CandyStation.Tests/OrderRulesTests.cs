using CandyStation.Core;
using CandyStation.Core.Enums;
using Xunit;

namespace CandyStation.Tests;

public class OrderRulesTests
{
    [Theory]
    [InlineData(2026, 1, "ORD-2026-0001")]
    [InlineData(2026, 42, "ORD-2026-0042")]
    [InlineData(2027, 9999, "ORD-2027-9999")]
    public void GenerateOrderNumber_FormatsCorrectly(int year, int seq, string expected)
    {
        Assert.Equal(expected, OrderRules.GenerateOrderNumber(year, seq));
    }

    [Fact]
    public void CalculateSubtotal_SumsUnitPriceTimesQuantity()
    {
        var lines = new[] { (UnitPrice: 200m, Quantity: 2), (UnitPrice: 500m, Quantity: 1) };
        Assert.Equal(900m, OrderRules.CalculateSubtotal(lines));
    }

    [Fact]
    public void CalculateTotal_AddsShippingToSubtotal()
    {
        Assert.Equal(700m, OrderRules.CalculateTotal(600m, 100m));
    }

    [Theory]
    [InlineData(19, true)]
    [InlineData(20, true)]
    [InlineData(21, false)]
    public void IsLowStock_UsesThresholdOfTwenty(int stock, bool expected)
    {
        Assert.Equal(expected, OrderRules.IsLowStock(stock));
    }

    [Theory]
    [InlineData(10000, true)]
    [InlineData(10000.01, false)]
    [InlineData(500, true)]
    public void IsWithinCodLimit_RespectsTenThousandCap(decimal total, bool expected)
    {
        Assert.Equal(expected, OrderRules.IsWithinCodLimit(total));
    }

    [Theory]
    [InlineData(300, false, 400, false)] // single items only, below the minimum
    [InlineData(400, false, 400, false)] // exactly at the minimum — must exceed, not just meet
    [InlineData(400.01, false, 400, true)]
    [InlineData(500, false, 400, true)]
    [InlineData(300, true, 400, true)] // bundle present — exempt regardless of subtotal
    [InlineData(200, false, 0, true)] // minimum disabled (0) — any positive subtotal passes
    public void MeetsMinimumForSingleItems_ExemptsBundlesFromTheMinimum(decimal subtotal, bool hasBundle, decimal minOrder, bool expected)
    {
        Assert.Equal(expected, OrderRules.MeetsMinimumForSingleItems(subtotal, hasBundle, minOrder));
    }

    [Theory]
    [InlineData(OrderStatus.Pending, OrderStatus.Confirmed, true)]
    [InlineData(OrderStatus.Pending, OrderStatus.Preparing, false)] // can't skip a step
    [InlineData(OrderStatus.Confirmed, OrderStatus.Preparing, true)]
    [InlineData(OrderStatus.Preparing, OrderStatus.OutForDelivery, true)]
    [InlineData(OrderStatus.OutForDelivery, OrderStatus.Delivered, true)]
    [InlineData(OrderStatus.Delivered, OrderStatus.Confirmed, false)] // terminal state
    [InlineData(OrderStatus.Pending, OrderStatus.Cancelled, true)] // cancel from any active state
    [InlineData(OrderStatus.OutForDelivery, OrderStatus.Cancelled, true)]
    [InlineData(OrderStatus.Cancelled, OrderStatus.Pending, false)] // terminal state
    public void CanTransition_FollowsForwardSequenceOrCancelsFromActive(OrderStatus from, OrderStatus to, bool expected)
    {
        Assert.Equal(expected, OrderRules.CanTransition(from, to));
    }

    [Fact]
    public void CalculateRevenue_OnlySumsDeliveredOrders()
    {
        var orders = new[]
        {
            (Status: OrderStatus.Delivered, Total: 500m),
            (Status: OrderStatus.Pending, Total: 300m),
            (Status: OrderStatus.Delivered, Total: 200m),
            (Status: OrderStatus.Cancelled, Total: 900m),
        };
        Assert.Equal(700m, OrderRules.CalculateRevenue(orders));
    }
}
