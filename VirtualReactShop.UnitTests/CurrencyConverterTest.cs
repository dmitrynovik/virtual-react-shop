﻿using Xunit;
using FluentAssertions;
using Moq;

namespace VirtualReactShop.UnitTests
{
    public class CurrencyConverterTest
    {
        [Theory]
        [InlineData("AUD", 100)]
        [InlineData("CNY", 100)]
        [InlineData("AUD", 1000000.01)]
        [InlineData("CNY", 1000000.01)]
        [InlineData("AUD", 0.01)]
        [InlineData("CNY", 0.01)]
        public void Conversion_To_Same_Currency_Is_Producing_Same_Number(string currencyCode, double amount) => CreateCurrencyConverter()
            .Convert(amount, from: currencyCode, to: currencyCode)
            .Should()
            .Be(amount);

        private static CurrencyConverter CreateCurrencyConverter()
        {
            var currencies = new Mock<CurrencyRepository>();
            currencies.Setup(r => r.List(It.IsAny<int>(), It.IsAny<int>())).Returns(new[]
            {
                new Currency("AUD", "Australian Dollar", 1.0),
                new Currency("CNY", "Chinese Yuan", 5.00),
            });

            return new CurrencyConverter(currencies.Object);
        }
    }
}