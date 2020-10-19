using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApi.DataModel;

namespace WebApi.Controllers
{
    [Route("api/users/{userId}/projects")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IMyProjectsRepository repository;
        private readonly ILogger logger;

        public ProjectsController(IMyProjectsRepository repository, ILogger<ProjectsController> logger)
        {
            this.repository = repository;
            this.logger = logger;
        }

        // read projects of a user
        // GET api/users/{userId}/projects
        [HttpGet]
        public IActionResult Get(string userId)
        {
            try
            {
                var projects = repository.GetAllProjects(userId);
                if(projects.Any())
                {
                    logger.LogInformation($"Projects of user with id {userId} returned");
                    return Ok(projects);
                }
                logger.LogInformation($"User with id {userId} not found or has no projects");
                return NotFound($"User with id {userId} not found or has no projects");
            }
            catch (Exception e)
            {
                logger.LogError($"Failed to get projects of user with id {userId}: " + e.Message);
                return BadRequest($"Failed to get projects of user with id {userId}");
            }
        }

        // read a project of a user
        // GET api/users/{userId}/projects/{id}
        [HttpGet("{id}")]
        public IActionResult Get(string userId, int id)
        {
            try
            {
                var project = repository.GetProject(userId, id);
                if (project != null)
                {
                    logger.LogInformation($"Project {id} of user with id {userId} returned");
                    return Ok(project);
                }
                logger.LogInformation($"Project with id {id} not found or user with id {userId} not found");
                return NotFound($"Project with id {id} not found or user with id {userId} not found");
            }
            catch (Exception e)
            {
                logger.LogError($"Failed to get project with id {id} of user with id {userId}: " + e.Message);
                return BadRequest($"Failed to get project with id {id} of user with id {userId}");
            }
        }

    }
}