using System;

namespace VirtualReactShop
{
    public class Product
    {
        public Product(string code, string name, double priceInBaseCurrency)
        {
            if (string.IsNullOrWhiteSpace(code)) throw new ArgumentNullException(nameof(code));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));
            if (priceInBaseCurrency <= 0) throw new ArgumentException($"Product {code}:{name} - invalid price: {priceInBaseCurrency}", nameof(priceInBaseCurrency));

            Code = code.ToUpperInvariant();
            Name = name;
            PriceInBaseCurrency = priceInBaseCurrency;
        }

        public string Code { get; }
        public double PriceInBaseCurrency { get; }
        public string Name { get; }

        public override bool Equals(object obj) => obj is Product other && Code == other.Code;

        public override int GetHashCode() => Code.GetHashCode();
    }
}
