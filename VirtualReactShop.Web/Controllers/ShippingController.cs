using Microsoft.AspNetCore.Mvc;
using VirtualReactShop;
using VirtualReactShop.Models;
using System.Linq;
using System;

namespace virtual_react_shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippingController : ControllerBase
    {
        private readonly ShippingCostCalculator _shippingCostCalculator;

        public ShippingController(ShippingCostCalculator shippingCostCalculator)
        {
            _shippingCostCalculator = shippingCostCalculator;
        }

        [HttpPost]
        [Route("")]
        public object CalculateShipping(CheckoutRequest request)
        {
            var subtotal = request.Orders.Sum(p => p.PriceInBaseCurrency * p.Qty);

            return new ShippingCost 
            { 
                Amount = _shippingCostCalculator.Calculate(subtotal, request.CurrencyCode), 
                CurrencyCode = request.CurrencyCode 
            };
        }

    }
}
