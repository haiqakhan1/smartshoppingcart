using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace SmartShoppingCart.Controllers
{
    // This controller handles API requests for /api/products
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        // Connection string for the SQL database
        private readonly string connectionString;

        public ProductsController(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // This endpoint returns the product with the matching barcode.
        [HttpGet("barcode/{barcode}")]
        public IActionResult GetByBarcode(string barcode)
        {
            using (var conn = new SqlConnection(connectionString))
            {
                conn.Open();
                string query = "SELECT Id, Name, Price, Quantity,Barcode FROM Products WHERE Barcode = @barcode";
                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@barcode", barcode);
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            // Return product data as JSON
                            return Ok(new
                            {
                                id = reader["Id"],
                                name = reader["Name"].ToString(),
                                price = Convert.ToDecimal(reader["Price"]),
                                quantity = Convert.ToInt32(reader["Quantity"]),
                                barcode = reader["Barcode"].ToString()

                            });
                        }
                    }
                }
            }
            return NotFound();
        }
    }
}