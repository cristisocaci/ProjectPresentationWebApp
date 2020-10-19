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
    [Route("api/users/{userId}/projects/{projectId}/infos")]
    [ApiController]
    public class InfosController : ControllerBase
    {
        private readonly IMyProjectsRepository repository;
        private readonly ILogger logger;

        public InfosController(IMyProjectsRepository repository, ILogger<InfosController> logger)
        {
            this.repository = repository;
            this.logger = logger;
        }

        
    }
}