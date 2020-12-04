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
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using WebApi.DataModel;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IMyProjectsRepository repository;
        private readonly ILogger<ProjectsController> logger;

        public LoginController(IConfiguration configuration, 
            IMyProjectsRepository repository, 
            ILogger<ProjectsController> logger)
        {
            this.configuration = configuration;
            this.repository = repository;
            this.logger = logger;
        }

        // POST api/login
        [HttpPost]
        public IActionResult Login([FromBody] LoginModel user)
        {
            if (user == null)
            {
                return BadRequest("Invalid client request");
            }
            User savedUser = repository.GetUsers(user.UserName).FirstOrDefault();
            bool verified = BCrypt.Net.BCrypt.Verify(user.Password + savedUser.Salt, savedUser.Password);
            if (verified)
            {
                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("Security:SecretKey").Value));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var claims = new List<Claim>
                {
                    new Claim("UserId", savedUser.UserId)
                };
                var tokeOptions = new JwtSecurityToken(
                    issuer: configuration.GetSection("Security:Issuer").Value,
                    audience: configuration.GetSection("Security:Audience").Value,
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(120),
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString, UserId = savedUser.UserId});
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