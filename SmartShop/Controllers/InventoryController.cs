using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartShop.Data;

namespace SmartShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _db;
        private const int LOW_STOCK_THRESHOLD = 10;

        public InventoryController(AppDbContext db) { _db = db; }

        [HttpGet("low-stock")]
        public async Task<IActionResult> GetLowStock()
        {
            var lowStock = await _db.Products
                .Include(p => p.Brand)
                .Include(p => p.Subcategory)
                    .ThenInclude(s => s.Category)
                .Where(p => p.Quantity <= LOW_STOCK_THRESHOLD)
                .OrderBy(p => p.Quantity)
                .Select(p => new
                {
                    id = p.Id,
                    name = p.Name,
                    quantity = p.Quantity,
                    barcode = p.Barcode,
                    category = p.Subcategory.Category.Name,
                    subcategory = p.Subcategory.Name,
                    brand = p.Brand.Name,
                    threshold = LOW_STOCK_THRESHOLD,
                    status = p.Quantity == 0 ? "Out of Stock" : p.Quantity <= 5 ? "Critical" : "Low"
                })
                .ToListAsync();

            return Ok(new
            {
                totalLowStock = lowStock.Count,
                threshold = LOW_STOCK_THRESHOLD,
                items = lowStock
            });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var total = await _db.Products.CountAsync();
            var outOfStock = await _db.Products.CountAsync(p => p.Quantity == 0);
            var critical = await _db.Products.CountAsync(p => p.Quantity > 0 && p.Quantity <= 5);
            var low = await _db.Products.CountAsync(p => p.Quantity > 5 && p.Quantity <= 10);
            var healthy = await _db.Products.CountAsync(p => p.Quantity > 10);

            return Ok(new
            {
                totalProducts = total,
                outOfStock,
                critical,
                low,
                healthy
            });
        }
    }
}
