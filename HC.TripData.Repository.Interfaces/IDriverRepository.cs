using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HC.TripData.Domain;

namespace HC.TripData.Repository.Interfaces
{
    public interface IDriverRepository
    {
        Driver GetDriver(string emailAddress);
        Driver GetDriverById(long id);
        long CreateDriver(Driver driver);
        long UpdateDriver(long id, Driver driver);
        bool ValidateDriver(string emailaddress, string password);
        Driver DeleteDriver(long id);

        IEnumerable<Driver> GetDrivers();
    }
}
