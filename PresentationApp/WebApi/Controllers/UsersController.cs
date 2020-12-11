using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DataModel;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using WebApi.Security;
using System.Text.RegularExpressions;

namespace WebApi.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMyProjectsRepository repository;
        private readonly ILogger<UsersController> logger;
        private readonly ITokenService tokenService;

        public UsersController( 
            IMyProjectsRepository repository, 
            ILogger<UsersController> logger,
            ITokenService tokenService)
        {
            this.repository = repository;
            this.logger = logger;
            this.tokenService = tokenService;
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
        public IActionResult CreateUser([FromBody] CreateModel usermodel)
        {
            try
            {
                if (usermodel == null) 
                    return BadRequest("Invalid client request");
                if (!usermodel.ValidateUserName())
                    return BadRequest("Invalid Username");
                if (!usermodel.ValidatePassword())
                    return BadRequest("Invalid Password");
                if (repository.GetUsers(usermodel.UserName).Count() > 0)
                    return BadRequest("User already exists");  

                User user = new User();
                user.UserName = usermodel.UserName;
                user.FirstName = usermodel.FirstName;
                user.LastName = usermodel.LastName;
                user.Salt = BCrypt.Net.BCrypt.GenerateSalt();
                user.Password = BCrypt.Net.BCrypt.HashPassword(usermodel.Password + user.Salt);
                repository.AddEntity(user);
                if (repository.SaveChanges())
                {
                    var claims = new List<Claim>{
                        new Claim("UserId", user.UserId)
                    };
                    var tokenString = tokenService.GenerateAccessToken(claims);
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

    public class CreateModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public bool ValidateUserName()
        {
            if (Regex.IsMatch(UserName, @"^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$", RegexOptions.IgnoreCase))
                return true;
            return false;
        }

        public bool ValidatePassword()
        {
            if (Regex.IsMatch(Password, @"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$"))
                return true;
            return false;
        }
    }
}