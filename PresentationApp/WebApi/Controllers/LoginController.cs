using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public LoginController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        // POST api/login
        [HttpPost]
        public IActionResult Login([FromBody] LoginModel user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }
            if (user.UserName == "user" && user.Password == "hadsaa123")
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("Security:SecretKey").Value));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var claims = new List<Claim>
                {
                    new Claim("UserId", "0")
                };
                var tokeOptions = new JwtSecurityToken(
                    issuer: configuration.GetSection("Security:Issuer").Value,
                    audience: configuration.GetSection("Security:Audience").Value,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(120),
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString, UserId = "0" });
            }
            else
            {
                return Unauthorized();
            }
        }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}