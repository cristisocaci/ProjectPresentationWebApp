using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DataModel
{
    public class Info
    {
        public string InfoId { get; set; }
        public string Type { get; set; }
        public string Content { get; set; }
        public string NextInfoId { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; }
    }
}
