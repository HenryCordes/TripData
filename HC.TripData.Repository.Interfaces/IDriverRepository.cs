using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HC.TripData.Domain;

namespace HC.TripData.Repository.Interfaces
{
    public interface IDriverRepository
    {
        Driver GetDriver(string userName);
        Driver GetDriverById(string id);
        string CreateDriver(Driver driver);
            string UpdateDriver(string id, Driver driver);
        bool ValidateDriver(string emailaddress, string password);
        Driver DeleteDriver(string id);

        IEnumerable<Driver> GetDrivers();
    }
}
