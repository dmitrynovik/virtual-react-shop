using System.Linq;
using System.Collections.Generic;

namespace VirtualReactShop
{
    public class ShippingCostCalculator
    {
        private readonly CurrencyConverter _converter;

        private readonly IDictionary<double, double> _rates = new SortedDictionary<double, double>()
        {
            { 0,  10 },
            { 50, 20 },
        };

        public ShippingCostCalculator(CurrencyConverter converter)
        {
            _converter = converter;
        }

        public double Calculate(IReadOnlyCollection<Order> orders, string currencyCode)
        {
            var subtotal = orders.Sum(o => o.Product.PriceInBaseCurrency * o.Quantity);

            var shippingRate = 0.0;
            foreach (var rate in _rates)
            {
                if (rate.Key > subtotal)
                    break;

                shippingRate = rate.Value;
            }

            var total = subtotal + shippingRate;
            return _converter.Convert(total, Currency.BASE_CURRENCY /* AUD */, currencyCode);
        }
    }
}
