using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using VirtualReactShop;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace virtual_react_shop.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private ProductRepository _productRepository;

        public ProductController(ProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet]
        [Route("list")]
        public IEnumerable<Product> List(int page = 1, int pageSize = 50) => _productRepository.List(page, pageSize);
    }

}
