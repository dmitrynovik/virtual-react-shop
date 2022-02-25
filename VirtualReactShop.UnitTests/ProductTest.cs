using Xunit;
using FluentAssertions;
using System;

namespace VirtualReactShop.UnitTests
{
    public class ProductTest
    {
        [Theory]
        [InlineData(0)]
        [InlineData(-0.01)]
        public void When_Product_Price_Is_NegativeOrZero_Throws_ArgumentException(double price)
        {
            Action act = () => new Product("YYY", "Some Product", price);
            act.Should().Throw<ArgumentException>();
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("  ")]
        public void When_Product_Code_Is_Empty_Throws_ArgumentNullException(string code)
        {
            Action act = () => new Product(code, "Some Product", 0.01);
            act.Should().Throw<ArgumentNullException>();
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("  ")]
        public void When_Product_Name_Is_Empty_Throws_ArgumentNullException(string name)
        {
            Action act = () => new Product("XYZ", name, 0.01);
            act.Should().Throw<ArgumentNullException>();
        }

        [Theory]
        [InlineData("XYZ", "product 1", 0.01)]
        [InlineData("ABC", "product 2", 100000.01)]
        public void When_Product_Creation_Arguments_AreValid_Assert_All_Product_Properties_Are_Correct(string code, string name, double price)
        {
            var product = new Product(code, name, price);

            product.Should().Match<Product>(p => 
                p.PriceInBaseCurrency == price &&
                p.Code == code &&
                p.Name == name
            );
        }
    }
}
