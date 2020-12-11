using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DataModel
{
    public interface IMyProjectsRepository
    {
        User GetUser(string id);
        IEnumerable<User> GetUsers(string userName); 
        void DeleteUser(string id);


        IEnumerable<Project> GetAllProjects(string userId);
        Project GetProject(string userId, int id);
        void DeleteProject(int projectId);
        bool UpdateProject(Project proj, string userId, int id);
        bool UpdateProjects(Project[] projects, string userId);


        void AddEntity(object entity);
  
        bool SaveChanges();
        bool UserHasProject(string userId, int id);
        string GetOwnerOfImage(string imgName);
    }
}
