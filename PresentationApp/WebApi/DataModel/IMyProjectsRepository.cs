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


        IEnumerable<Project> GetAllProjects(string userId);
        Project GetProject(string userId, int id);

        IEnumerable<Info> GetAllInfos(int projectId);
    }
}
