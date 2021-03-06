﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HC.TripData.Domain;
using HC.TripData.Repository.Models;

namespace HC.TripData.Repository.Interfaces
{
    public interface IDriverRepository
    {
        Driver GetDriver(string emailAddress);
        Driver GetDriverById(long id);
        long CreateDriver(string emailAddress, string password);
        long UpdateDriver(Driver driver);
        Driver ValidateDriver(string emailaddress, string password);
        ValidateTokenResponse ValidateToken(long driverId, string token);
        Driver DeleteDriver(long id);

        IEnumerable<Driver> GetDrivers();
    }
}
