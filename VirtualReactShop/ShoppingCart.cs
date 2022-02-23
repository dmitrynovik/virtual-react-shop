using System.Collections.Generic;
using System.Linq;
using Functional.Maybe;

namespace VirtualReactShop
{
    public class ShoppingCart
    {
        private readonly IDictionary<string, Order> _orders = new SortedDictionary<string, Order>();
        private readonly ShippingCostCalculator _shippingCostCalculator;

        public ShoppingCart(ShippingCostCalculator shippingCostCalculator)
        {
            _shippingCostCalculator = shippingCostCalculator;
        }

        public void Clear() => _orders.Clear();

        public Order Add(Product product)
        {
            if (!_orders.ContainsKey(product.Code))
            {
                var order = new Order(product, 1);
                _orders.Add(product.Code, order);
                return order;
            }
            else
            {
                var order = _orders[product.Code];
                order.Quantity = order.Quantity + 1;
                _orders[product.Code] = order;
                return order;
            }
        }

        public Maybe<Order> Remove(string productCode)
        {
            if (!_orders.ContainsKey(productCode))
            {
                return Maybe<Order>.Nothing;
            }

            var order = _orders[productCode];
            order.Quantity = order.Quantity - 1;
            if (order.Quantity > 0)
            {
                _orders[productCode] = order;
                return order.ToMaybe();
            }
            else
            {
                _orders.Remove(productCode);
                return Maybe<Order>.Nothing;
            }
        }

        public double CalculateTotal(string currencyCode) => _shippingCostCalculator.Calculate(_orders.Values.ToArray(), currencyCode);
    }
}
