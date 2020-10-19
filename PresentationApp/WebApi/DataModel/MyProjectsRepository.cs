using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace WebApi.DataModel
{
    public class MyProjectsRepository: IMyProjectsRepository
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
            var user = context.Users.Find(id);
            return user;
        }

        public IEnumerable<Project> GetAllProjects(string userId)
        {
            return context.Projects
                .Include(p => p.Infos)
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

        public IEnumerable<Info> GetAllInfos(int projectId)
        {
            return context.Infos.Where(i => i.ProjectId == projectId).ToList();
        }
    }
}
