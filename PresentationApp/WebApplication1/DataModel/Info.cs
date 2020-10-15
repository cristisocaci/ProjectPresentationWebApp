using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.DataModel
{
    public class Info
    {
        public int InfoId;
        public string Type;
        public string Content;

        public int ProjectId;
        public Project Project;
    }
}
