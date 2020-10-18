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

        // api/users
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                logger.LogInformation("Users returned");
                return Ok(repository.GetAllUsers());
            }
            catch(Exception e)
            {
                logger.LogError("Failed to get users: " + e.Message);
                return BadRequest("Failed to get users");
            }
        }
    }
}