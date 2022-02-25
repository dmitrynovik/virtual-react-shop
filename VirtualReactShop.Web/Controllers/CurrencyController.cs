using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VirtualReactShop;
using VirtualReactShop.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace virtual_react_shop.Controllers
{
    [Route("api/currencies")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private readonly CurrencyRepository _currencyRepository;
        private readonly CurrencyConverter _currencyConverter;

        public CurrencyController(CurrencyRepository currencyRepository, CurrencyConverter currencyConverter)
        {
            _currencyRepository = currencyRepository;
            _currencyConverter = currencyConverter;
        }

        [HttpGet]
        [Route("list")]
        public IEnumerable<Currency> List(int page = 1, int pageSize = 50) => _currencyRepository.List(page, pageSize);

        [HttpPost]
        [Route("shipping")]
        public object CalculateShipping(IReadOnlyCollection<Product> products, string currencyCode)
        {
            return new ShippingCost { Amount = _currencyConverter.Convert(products, "AUD", currencyCode), CurrencyCode = currencyCode };
        }
    }
}
