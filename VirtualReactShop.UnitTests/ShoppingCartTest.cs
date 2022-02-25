using Xunit;
using FluentAssertions;

namespace VirtualReactShop.UnitTests
{
    public class ShoppingCartTest
    {
        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(10)]
        public void When_Product_Added_To_Cart_Quantity_Is_Incremented(uint quantity)
        {
            var product = new Product("XPS", "Dell Inspiron", 1000);
            var cart = CreateShoppingCart();
            for (var i = 0; i < quantity; ++i)
                cart.Add(product);

            cart.Quantity("XPS").Should().Be(quantity);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(10)]
        public void When_Product_Removed_From_Cart_Quantity_Is_Decremented(uint quantity)
        {
            var product = new Product("XPS", "Dell Inspiron", 1000);
            var cart = CreateShoppingCart();
            for (var i = 0; i < quantity; ++i)
                cart.Add(product);

            cart.Remove("XPS");

            cart.Quantity("XPS").Should().Be(quantity - 1);
        }


        private ShoppingCart CreateShoppingCart() => new ShoppingCart(ShippingCostCalculatorTest.CreateCalculator());
    }
}
