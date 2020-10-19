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
    }
}
