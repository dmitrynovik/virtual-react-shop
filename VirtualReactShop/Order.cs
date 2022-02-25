using System;

namespace VirtualReactShop
{
    public class Order
    {
        public Order(Product product, uint quantity = 1)
        {
            if (quantity == 0) throw new ArgumentException("Quantity cannot be 0", nameof(quantity));
            if (product == null) throw new ArgumentNullException(nameof(product));
            Product = product;
            Quantity = quantity;
        }

        public Product Product { get; }
        public uint Quantity { get; set; }
    }
}
