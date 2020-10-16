using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebApi.DataModel
{
    public class MyProjectsContext : DbContext
    {
        
        public DbSet<Project> Projects { get; set; }
        public DbSet<Info> Infos { get; set; }

        public MyProjectsContext(DbContextOptions<MyProjectsContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>().ToTable("Projects");
            modelBuilder.Entity<Info>().ToTable("Infos");
        }

    }
    
}
