using System.Collections.Generic;
using System.Linq;

namespace VirtualReactShop
{
    public abstract class Repository<T>
    {
        protected abstract IEnumerable<T> ListImpl();

        public IReadOnlyCollection<T> List(int page = 1, int pageSize = 50) => 
            ListImpl()
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToArray();
    }

    public class Repositories : Repository<Product>
    {
        protected override IEnumerable<Product> ListImpl() => new[]
        {
            new Product("SKU001", "Sunsoft Toilet Paper", 1.01),
            new Product("SKU002", "Liquid soap", 2.02),
            new Product("SKU003", "Gentle Toothbrush", 3.03),
        };
    }

    public class CurrencyRepository : Repository<Currency>
    {
        protected override IEnumerable<Currency> ListImpl() => new[]
        {
            new Currency("AUD", "Australian Dollar", 1),
            new Currency("USD", "United States Dollar", 1.41),
            new Currency("CNY", "Chinese Renminbi", 5.02),
        };
    }
}
