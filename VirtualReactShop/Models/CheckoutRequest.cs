using System.Collections.Generic;

namespace VirtualReactShop.Models
{
    public class OrderModel
    {
        public int Qty { get; set; }
        public double PriceInBaseCurrency { get; set; }
    }

    public class CheckoutRequest
    {
        public IReadOnlyCollection<OrderModel> Orders { get; set; }
        public string CurrencyCode { get; set; }
    }
}
