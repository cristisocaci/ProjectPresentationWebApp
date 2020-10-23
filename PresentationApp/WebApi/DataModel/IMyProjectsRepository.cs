using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DataModel
{
    public interface IMyProjectsRepository
    {
        IEnumerable<User> GetAllUsers();
        User GetUser(string id);
        void DeleteUser(string entity);


        IEnumerable<Project> GetAllProjects(string userId);
        Project GetProject(string userId, int id);
        void DeleteProject(int entity);


        void AddEntity(object entity);
  
        bool SaveChanges();
        bool UserHasProject(string userId, int id);
    }
}
