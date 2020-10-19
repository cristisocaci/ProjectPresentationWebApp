using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DataModel;
using Microsoft.Extensions.Logging;

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

        // read all users without projects
        // GET api/users
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var users = repository.GetAllUsers();
                logger.LogInformation("Users returned");
                return Ok(users);
            }
            catch(Exception e)
            {
                logger.LogError("Failed to get users: " + e.Message);
                return BadRequest("Failed to get users");
            }
        }

        // read a user with projects
        // GET api/users/{id}
        [HttpGet("{id}")]
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
        //[HttpPost]
        //public IActionResult CreateUser([FromBody] User user)
       // {

        //}
    }
}