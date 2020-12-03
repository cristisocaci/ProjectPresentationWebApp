using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using WebApi.DataModel;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IMyProjectsRepository repository;
        private readonly ILogger<UsersController> logger;

        public ImagesController(IMyProjectsRepository repository, ILogger<UsersController> logger)
        {
            this.repository = repository;
            this.logger = logger;
        }

        // Upload image
        // POST api/images
        [HttpPost, DisableRequestSizeLimit, Authorize]
        public IActionResult UploadImages()
        {
            try
            {
                foreach(var file in Request.Form.Files) {
                    
                    var folderName = Path.Combine("wwwroot", "img");
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    if (file.Length > 0)
                    {
                        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        var fullPath = Path.Combine(pathToSave, fileName);
                        var dbPath = Path.Combine(folderName, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                        
                    }

                }
                return Ok(new string[] { "Photos uploaded" });
            }
            catch(Exception e)
            {
                logger.LogInformation("Failed to save photos\n" + e);
                return BadRequest("Failed to save photos");

            }

        }

        [HttpPost("{name}"), Authorize]
        public IActionResult DeleteImage(string name)
        {
            try
            {
                var userId = repository.GetOwnerOfImage(name);
                if (name != null)
                {
                    if (VerifyUserId(userId))
                    {
                        string folderName = Path.Combine("wwwroot", "img");
                        string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                        string fullPath = Path.Combine(pathToSave, name);
                        System.IO.File.Delete(fullPath);
                        return Ok(new string[] { "Photo deleted", name });
                    }
                    else return Unauthorized();
                }
            }
            catch(Exception e)
            {
                logger.LogInformation("Failed to delete the photo\n" + e);
            }
            return BadRequest("Failed to delete the photo");

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