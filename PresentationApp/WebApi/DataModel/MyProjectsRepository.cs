using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace WebApi.DataModel
{
    public class MyProjectsRepository: IMyProjectsRepository
    {
        private readonly MyProjectsContext context;

        public MyProjectsRepository(MyProjectsContext context)
        {
            this.context = context;
        }

        public IEnumerable<User> GetAllUsers()
        {
            return context.Users; 
        }
    }
}
