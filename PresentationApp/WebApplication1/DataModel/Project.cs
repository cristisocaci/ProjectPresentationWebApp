using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.DataModel
{
    public class Project
    {
        public int ProjectId;
        public string Titlel;

        public ICollection<Info> Infos;
    }
}
