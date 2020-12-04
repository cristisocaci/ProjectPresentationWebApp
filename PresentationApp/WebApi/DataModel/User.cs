using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DataModel
{
    public class User
    {

        public string UserId { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string Salt { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public ICollection<Project> Projects { get; set; }
    }
}
