using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebApi.DataModel
{
    public class MyProjectsContext : DbContext
    {
        
        
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Info> Infos { get; set; }


        public MyProjectsContext(DbContextOptions<MyProjectsContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().
                HasMany<Project>(us => us.Projects)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>().
                HasMany<Info>(p => p.Infos)
                .WithOne(i => i.Project)
                .HasForeignKey(i => i.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>().HasData(
                new User { UserId = "0" }
            );
            modelBuilder.Entity<Project>().HasData(
                new  { ProjectId = 1, Title = "Demo 1", UserId = "0", Position=0, Description="Description of project 1" },
                new  { ProjectId = 2, Title = "Demo 2", UserId = "0", Position=1, Description = "Description of project 1" }
            );
            
            modelBuilder.Entity<Info>().HasData(
                new { InfoId = "1", Content = "Project 1 information #1", Type = "text", Position = 0, ProjectId = 1, AdditionalData="" },
                new { InfoId = "2", Content = "Project 1 information #2", Type = "text", Position = 1, ProjectId = 1, AdditionalData = "" },
                new { InfoId = "3", Content = "Project 2 information #1", Type = "text", Position = 0, ProjectId = 2, AdditionalData = "" },
                new { InfoId = "4", Content = "Project 2 information #2", Type = "text", Position = 1, ProjectId = 2, AdditionalData = "" }
            );
           
        }

    }
    
}
