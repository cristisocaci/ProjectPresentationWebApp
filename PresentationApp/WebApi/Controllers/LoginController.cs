using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApi.DataModel;
using WebApi.Security;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly IMyProjectsRepository repository;
        private readonly ILogger<ProjectsController> logger;
        private readonly ITokenService tokenService;

        public LoginController( 
            IMyProjectsRepository repository, 
            ILogger<ProjectsController> logger,
            ITokenService tokenService)
        {
            this.repository = repository;
            this.logger = logger;
            this.tokenService = tokenService;
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
                var claims = new List<Claim>{
                    new Claim("UserId", savedUser.UserId)
                };
                var tokenString = tokenService.GenerateAccessToken(claims);
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