using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DataModel
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string Title { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }
      

        public ICollection<Info> Infos { get; set; }
    }
}
