using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
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


        public User GetUser(string id)
        {
            var user = context.Users
                .Where(u => u.UserId == id)
                .FirstOrDefault();
            return user;
        }

        public IEnumerable<User> GetUsers(string userName)
        {
            return context.Users
                .Where(u => u.UserName == userName)
                .ToList();
        }


        public IEnumerable<Object> GetAllProjects(string userId)
        {
            return context.Projects
                .Where(p => p.UserId == userId)
                .Select(p => new
                {
                    p.ProjectId,
                    p.Title,
                    p.Photo,
                    p.Description,
                    p.Position,
                    p.StartDate,
                    p.EndDate,
                    p.UserId
                })
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

        public void DeleteUser(string userId)
        {   
            var user = context.Users.Find(userId);
            DeleteImages(userId);
            context.Users.Remove(user);
        }

        public void DeleteProject(int projectId)
        {
            
            var proj = context.Projects.Find(projectId);
            DeleteInfoImages(proj.UserId, projectId);
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

        private void DeleteImages(string userId)
        {
            var user = GetUser(userId);
            foreach (var project in user.Projects)
            {
                DeleteImage(project.Photo);
                DeleteInfoImages(userId, project.ProjectId);
            }
        }

        private void DeleteInfoImages(string userId, int projectId)
        {
            var project = GetProject(userId, projectId);
            foreach (var info in project.Infos)
                if (info.Type == "image")
                    DeleteImage(info.Content);
        }

        private void DeleteImage(string name)
        {
            /* Delete image saved in filesystem
            string folderName = Path.Combine("wwwroot", "img");
            string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            string fullPath = Path.Combine(pathToSave, name);
            System.IO.File.Delete(fullPath);
            */
        }
    }
       
}
