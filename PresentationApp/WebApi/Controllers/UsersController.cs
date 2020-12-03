﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DataModel;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;

namespace WebApi.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMyProjectsRepository repository;
        private readonly ILogger<UsersController> logger;

        public UsersController(IMyProjectsRepository repository, ILogger<UsersController> logger)
        {
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
        public IActionResult CreateUser([FromBody] User user)
        {
            try
            {
                repository.AddEntity(user);
                if (repository.SaveChanges())
                    return Created($"api/users/{user.UserId}", user);
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