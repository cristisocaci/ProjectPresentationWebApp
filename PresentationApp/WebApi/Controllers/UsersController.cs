using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DataModel;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace WebApi.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration configuration;
        private readonly IMyProjectsRepository repository;
        private readonly ILogger<UsersController> logger;

        public UsersController(IConfiguration configuration, 
            IMyProjectsRepository repository, 
            ILogger<UsersController> logger)
        {
            this.configuration = configuration;
            this.repository = repository;
            this.logger = logger;
        }

        // read a user 
        // GET api/users/{id}
        [HttpGet("{id}"), Authorize]
        public IActionResult GetUser(string id)
        {
            try
            {
                var user = repository.GetUser(id);
                if(user != null)
                {
                    logger.LogInformation($"User with id {id} returned");
                    return Ok(user);
                }
                logger.LogInformation($"User with id {id} not found");
                return NotFound($"User with id {id} not found");
            }
            catch(Exception e)
            {
                logger.LogError($"Failed to get user with id {id}: " + e.Message);
                return BadRequest($"Failed to get user with id {id}");
            }
        }

        // Create user
        // POST api/users
        [HttpPost]
        public IActionResult CreateUser([FromBody] LoginModel usermodel)
        {
            try
            {
                if(usermodel == null || usermodel.UserName == "" || usermodel.Password == "") 
                    return BadRequest("Invalid client request");
                if (repository.GetUsers(usermodel.UserName).Count() > 0)
                    return BadRequest("User already exists");

                User user = new User();
                user.UserName = usermodel.UserName;
                user.Salt = BCrypt.Net.BCrypt.GenerateSalt();
                user.Password = BCrypt.Net.BCrypt.HashPassword(usermodel.Password + user.Salt);
                repository.AddEntity(user);
                if (repository.SaveChanges())
                {
                    var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("Security:SecretKey").Value));
                    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                    var claims = new List<Claim>{
                    new Claim("UserId", user.UserId)
                    };
                    var tokeOptions = new JwtSecurityToken(
                        issuer: configuration.GetSection("Security:Issuer").Value,
                        audience: configuration.GetSection("Security:Audience").Value,
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(120),
                        signingCredentials: signinCredentials
                    );
                    var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                    return Created($"api/users/{user.UserId}", new { Token = tokenString, UserId = user.UserId });
                }
            }
            catch(Exception e)
            {
                logger.LogInformation("Failed to add a new user\n" + e);
            }
            return BadRequest("Failed to add a new user");

        }

        // Delete User
        // POST api/users/{id}
        [HttpPost("{id}"), Authorize]
        public IActionResult Delete(string id)
        {
            try
            {
                if (VerifyUserId(id))
                {
                    repository.DeleteUser(id);
                    if (repository.SaveChanges())
                        return Ok("User deleted");
                }
  
            }
            catch(Exception e)
            {
                logger.LogInformation("Failed to delete user\n"+e);
            }
            return BadRequest("Failed to delete user");

        }

        // Update User
        // PUT api/users/{id}
        [HttpPut("{id}"), Authorize]
        public IActionResult Update(string id, [FromBody] User newUser)
        {
            return Ok();
        }


        private bool VerifyUserId(string userId)
        {
            Microsoft.Extensions.Primitives.StringValues jwt;
            HttpContext.Request.Headers.TryGetValue("Authorization", out jwt);
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(jwt.ToString().Substring(7));

            if (token.Claims.FirstOrDefault(c => c.Type == "UserId").Value == userId)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

    }

}