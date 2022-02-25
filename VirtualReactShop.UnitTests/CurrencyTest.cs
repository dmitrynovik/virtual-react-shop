using Xunit;
using FluentAssertions;
using System;

namespace VirtualReactShop.UnitTests
{
    public class CurrencyTest
    {
        public class ProductTest
        {
            [Theory]
            [InlineData(0)]
            [InlineData(-0.01)]
            public void When_Currency_Rate_Is_NegativeOrZero_Throws_ArgumentException(double rate)
            {
                Action act = () => new Currency("AUD", "AUD", rate);
                act.Should().Throw<ArgumentException>();
            }

            [Theory]
            [InlineData(null)]
            [InlineData("")]
            [InlineData("  ")]
            public void When_Currency_Code_Is_Empty_Throws_ArgumentNullException(string code)
            {
                Action act = () => new Currency(code, "Some Currency", 0.01);
                act.Should().Throw<ArgumentNullException>();
            }

            [Theory]
            [InlineData(null)]
            [InlineData("")]
            [InlineData("  ")]
            public void When_Currency_Name_Is_Empty_Throws_ArgumentNullException(string name)
            {
                Action act = () => new Currency("AUD", name, 0.01);
                act.Should().Throw<ArgumentNullException>();
            }

            [Theory]
            [InlineData("AUD", "Australian Dollar", 1.0)]
            [InlineData("CNY", "Chinese Yuan", 5.01)]
            public void When_Product_Creation_Arguments_AreValid_Assert_All_Product_Properties_Are_Correct(string code, string name, double rate)
            {
                var currency = new Currency(code, name, rate);

                currency.Should().Match<Currency>(p =>
                    p.BaseExchangeRate == rate &&
                    p.Code == code &&
                    p.Name == name
                );
            }
        }

    }
}
