﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApi.DataModel;

namespace WebApi.Controllers
{
  
    [Route("api/users/{userId}/[controller]")]
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
        [HttpGet("{id:int}")]
        public IActionResult GetProject(string userId, int id)
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

        // create project
        // POST api/users/{userId}/projects
        [HttpPost, Authorize]
        public IActionResult CreateProject(string userId, [FromBody] Project project)
        {
            try
            {
                project.UserId = userId;
                repository.AddEntity(project);
                if (repository.SaveChanges())
                    return Created($"api/users/{userId}/projects/{project.ProjectId}", project);
            }
            catch
            {
                logger.LogInformation("Failed to add a new project");
            }

            return BadRequest("Failed to add a new project");
        }

        // delete project
        // POST api/users/{userId}/projects/{id}
        [HttpPost("{id}"), Authorize]
        public IActionResult Delete(string userId, int id)
        {
            try
            {
                if (repository.UserHasProject(userId, id))
                {
                    repository.DeleteProject(id);
                    if (repository.SaveChanges())
                        return Ok(new string[] { "Project deleted" });
                }
            }
            catch
            {
                logger.LogInformation("Failed to delete project");
            }
            return BadRequest("Failed to delete project");
        }

        // update project
        // PUT api/users/{userId}/projects/{id}
        [HttpPut("{id}"), Authorize]
        public IActionResult Update(string userId, int id, [FromBody] Project project)
        {
            try
            {
                if (repository.UpdateProject(project, userId, id))
                {
                    return Ok(project);
                }
            }
            catch
            {
                logger.LogInformation("Failed to update the project");
            }
            return BadRequest("Failed to update the project");
        }

        // update multiple projects
        // PUT api/users/{userId}/projects
        [HttpPut, Authorize]
        public IActionResult UpdateMultiple(string userId, [FromBody] Project[] projects)
        {
            try
            {
                if (repository.UpdateProjects(projects, userId))
                {
                    return Ok(projects);
                }
            }
            catch
            {
                logger.LogInformation("Failed to update the projects");
               
            }
            return BadRequest("Failed to update the projects");

        }
    }
}
