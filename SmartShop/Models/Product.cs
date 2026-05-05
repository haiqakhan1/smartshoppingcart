namespace SmartShop.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Barcode { get; set; }
        public string? Weight { get; set; }
        public decimal Rating { get; set; }
        public string? ImageUrl { get; set; }
        public int BrandId { get; set; }
        public Brand Brand { get; set; }
        public int SubcategoryId { get; set; }
        public Subcategory Subcategory { get; set; }
    }
}
