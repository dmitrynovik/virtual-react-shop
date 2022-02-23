using System.Linq;
using System.Collections.Generic;
using System;

namespace VirtualReactShop
{
    public class CurrencyConverter
    {
        public class CurrencyNotFoundException : Exception
        {
            public CurrencyNotFoundException(string code) : base($"Currency {code} not found")
            {
                Code = code;
            }

            public string Code { get; }
        }

        private readonly IDictionary<string, Currency> _currencies;

        public CurrencyConverter(CurrencyRepository currencyRepository)
        {
            _currencies = currencyRepository
                .List(1, int.MaxValue)
                .ToDictionary(c => c.Code, c => c);
        }

        public static double Convert(double price, Currency from, Currency to) => price * (to.BaseExchangeRate / from.BaseExchangeRate);

        public double Convert(double price, string from, string to)
        {
            if (!_currencies.TryGetValue(from, out var fromCurrency)) throw new CurrencyNotFoundException(from);
            if (!_currencies.TryGetValue(from, out var toCurrency)) throw new CurrencyNotFoundException(to);

            return Convert(price, fromCurrency, toCurrency);
        }
    }
}
