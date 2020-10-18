using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.DataModel
{
    interface IMyProjectsRepository
    {
        IEnumerable<User> GetAllUsers();
        
    }
}
