using Moq;
using Xunit;
using FluentAssertions;
using System;

namespace VirtualReactShop.UnitTests
{
    public class ShippingCostCalculatorTest
    {
        [Theory]
        [InlineData(25, 2)]
        [InlineData(50, 1)]
        [InlineData(50.01, 1)]
        public void When_Order_Is_AUD_50_Or_Above_The_Shipping_Fee_Is_AUD_20(double price, uint quantity) 
        {
            var orders = new[]
            {
                new Order(new Product("XPS", "Product 1", price), quantity)
            };

            // Assert shipping fee:
            var cost = CreateCalculator().Calculate(orders, "AUD");
            Math.Round(cost - price * quantity, 2).Should().Be(20);
        }

        [Fact] public void When_Order_Is_Below_AUD_50_The_Shipping_Fee_Is_AUD_10()
        {
            var orders = new[]
            {
                new Order(new Product("BTC", "Bitcoin (once it was cheap)", 24.50), 2)
            };

            // Assert shipping fee:
            var cost = CreateCalculator().Calculate(orders, "AUD");
            Math.Round(cost - 49.0, 2).Should().Be(10);
        }


        public static ShippingCostCalculator CreateCalculator() 
        {
            var currencies = new Mock<CurrencyRepository>();
            currencies.Setup(r => r.List(It.IsAny<int>(), It.IsAny<int>())).Returns(new[]
            {
                new Currency("AUD", "Australian Dollar", 1.0),
                new Currency("CNY", "Chinese Yuan", 5.01),
            });

            return new ShippingCostCalculator(new CurrencyConverter(currencies.Object));
        }
    }
}
