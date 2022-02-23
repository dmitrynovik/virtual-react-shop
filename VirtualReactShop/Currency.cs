using System;

namespace VirtualReactShop
{
    public class Currency
    {
        public const string BASE_CURRENCY = "AUD";

        public Currency(string code, string name, double baseRate)
        {
            if (string.IsNullOrWhiteSpace(code)) throw new ArgumentNullException(nameof(code));
            if (string.IsNullOrWhiteSpace(name)) throw new ArgumentNullException(nameof(name));
            if (baseRate <= 0) throw new ArgumentException($"Currency {code}:{name} - invalid base rate: {baseRate}", nameof(baseRate));

            Code = code.ToUpperInvariant();
            Name = name;
            BaseExchangeRate = baseRate;
        }

        public string Code { get; }
        public double BaseExchangeRate { get; }
        public string Name { get; }

        public override bool Equals(object obj) => obj is Currency other && Code == other.Code;

        public override int GetHashCode() => Code.GetHashCode();
    }
}
