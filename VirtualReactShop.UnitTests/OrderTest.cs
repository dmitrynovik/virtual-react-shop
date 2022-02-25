using Xunit;
using FluentAssertions;
using System;

namespace VirtualReactShop.UnitTests
{
    public class OrderTest
    {
        [Fact] public void When_Quantity_Is_0_Throws_ArgumentException()
        {
            Action act = () => new Order(new Product("XYZ", "Product", 0.01), 0);
            act.Should().Throw<ArgumentException>();
        }

        [Fact] public void When_Product_Is_Null_Throws_ArgumentNullException()
        {
            Action act = () => new Order(null);
            act.Should().Throw<ArgumentNullException>();
        }


        [Theory]
        [InlineData(1)]
        [InlineData(1000000)]
        public void When_Quantity_Is_Positive_Assert_Quantity_Is_AsExpected(uint qty)
        {
            var order = new Order(new Product("XYZ", "Product", 0.01), qty);
            order.Quantity.Should().Be(qty);
        }
    }
}
