using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;


namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly ILogger<UsersController> logger;

        public ImagesController(ILogger<UsersController> logger)
        {
            this.logger = logger;
        }

        // Upload image
        // POST api/images
        [HttpPost, DisableRequestSizeLimit]
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
            catch
            {
                logger.LogInformation("Failed to save photos");
                return BadRequest("Failed to save photos");

            }

        }

        [HttpPost("{name}")]
        public IActionResult DeleteImage(string name)
        {
            try
            {
                string folderName = Path.Combine("wwwroot", "img");
                string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                string fullPath = Path.Combine(pathToSave, name);
                System.IO.File.Delete(fullPath);
                return Ok(new string[] { "Photo deleted", name});


            }
            catch
            {
                return BadRequest("Failed to delete the photo");
            }
            
        }
    }
}