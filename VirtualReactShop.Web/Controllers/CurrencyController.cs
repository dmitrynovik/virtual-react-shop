using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VirtualReactShop;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace virtual_react_shop.Controllers
{
    [Route("api/currencies/list")]
    [ApiController]
    public class CurrencyController : ControllerBase
    {
        private CurrencyRepository _currencyRepository;

        public CurrencyController(CurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }

        [HttpGet]
        public IEnumerable<Currency> List(int page = 1, int pageSize = 50) => _currencyRepository.List(page, pageSize);
    }

}
