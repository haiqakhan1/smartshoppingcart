using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartShop.Data;
using SmartShop.Models;

namespace SmartShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _db;
        public AdminController(AppDbContext db) { _db = db; }

        public class LoginRequest
        {
            public string? Email { get; set; }
            public string? Password { get; set; }
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] Admin admin)
        {
            if (await _db.Admins.AnyAsync(a => a.Email == admin.Email))
                return BadRequest(new { message = "Email already exists" });
            _db.Admins.Add(admin);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Admin created successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var existing = await _db.Admins
                .FirstOrDefaultAsync(a => a.Email == request.Email && a.Password == request.Password);
            if (existing == null)
                return Unauthorized(new { message = "Invalid credentials" });
            return Ok(new { message = "Login successful", adminId = existing.Id, username = existing.Username });
        }
    }
}
