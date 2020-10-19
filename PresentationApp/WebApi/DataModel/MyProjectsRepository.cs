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

        User IMyProjectsRepository.GetUser(string id)
        {
            var user = context.Users.Find(id);
          
            return user;
            //TODO: return the projects also
        }
    }
}
