using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.DataModel
{
    public class MyProjectsContext : DbContext
    {
        public DbSet<Project> Projects;
        public DbSet<Info> Infos;

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlServer("Server=.\\MSSQLSERVER;Database=MyProjectsDB;Trusted_Connection=True;");
    }
    
}
