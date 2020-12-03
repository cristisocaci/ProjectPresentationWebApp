using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace WebApi.DataModel
{
    public class MyProjectsRepository : IMyProjectsRepository
    {
        private readonly MyProjectsContext context;
        private readonly ILogger<MyProjectsRepository> logger;

        public MyProjectsRepository(MyProjectsContext context, ILogger<MyProjectsRepository> logger)
        {
            this.context = context;
            this.logger = logger;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return context.Users;
        }
        public User GetUser(string id)
        {
            var user = context.Users
                .Include(u => u.Projects)
                .Where(u => u.UserId == id)
                .FirstOrDefault();
            return user;
        }

        public IEnumerable<Project> GetAllProjects(string userId)
        {
            return context.Projects
                .Where(p => p.UserId == userId)
                .ToList();

        }
        public Project GetProject(string userId, int id)
        {
            return context.Projects
                .Include(p => p.Infos)
                .Where(p => p.UserId == userId && p.ProjectId == id)
                .FirstOrDefault();
            // return infos also
        }

        public void AddEntity(object entity)
        {
            context.Add(entity);
        }

        public void DeleteUser(string id)
        {
            var user = context.Users.Find(id);
            context.Users.Remove(user);
        }

        public void DeleteProject(int id)
        {
            var proj = context.Projects.Find(id);
            context.Remove(proj);
        }

        public bool UpdateProject(Project proj, string userId, int id)
        {
            var oldProject = GetProject(userId, id);
            if (oldProject == null)
                return false;
            oldProject.Title = proj.Title;
            oldProject.Photo = proj.Photo;
            oldProject.Description = proj.Description;
            oldProject.Position = proj.Position;
            oldProject.StartDate = proj.StartDate;
            oldProject.EndDate = proj.EndDate;
            oldProject.Infos =  new List<Info> { };
            context.SaveChanges();
            oldProject.Infos = proj.Infos;
            return SaveChanges();
        }

        public bool UpdateProjects(Project[] projects, string userId)
        {
            foreach (var proj in projects) {
                var oldProject = GetProject(userId, proj.ProjectId);
                if (oldProject == null)
                {
                    return false;
                }
                oldProject.Title = proj.Title;
                oldProject.Photo = proj.Photo;
                oldProject.Description = proj.Description;
                oldProject.Position = proj.Position;
                oldProject.StartDate = proj.StartDate;
                oldProject.EndDate = proj.EndDate;

            }
            return SaveChanges();
        }

        public bool SaveChanges()
        {
            return context.SaveChanges() >= 0;
        }

        public bool UserHasProject(string userId, int id)
        {
            return context.Projects.Find(id).UserId == userId;
        }
        public string GetOwnerOfImage(string imgName)
        {
            var projImg = context.Projects
                .Where(p => p.Photo == imgName)
                .FirstOrDefault();
            if (projImg != null)
                return projImg.UserId;
            var infoImg = context.Infos
                .Where(i => i.Content == imgName && i.Type == "Image")
                .FirstOrDefault();
            if (infoImg != null)
                return context.Projects
                    .Where(p => p.ProjectId == infoImg.ProjectId)
                    .Select(p => p.UserId)
                    .FirstOrDefault();
            return null;
        }
    }
       
}
