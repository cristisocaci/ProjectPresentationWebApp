using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DataModel
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string Title { get; set; }

        public ICollection<Info> Infos { get; set; }
    }
}
