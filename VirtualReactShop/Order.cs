namespace VirtualReactShop
{
    public class Order
    {
        public Order(Product product, uint qty = 1)
        {
            Product = product;
            Quantity = qty;
        }

        public Product Product { get; }
        public uint Quantity { get; set; }
    }
}
