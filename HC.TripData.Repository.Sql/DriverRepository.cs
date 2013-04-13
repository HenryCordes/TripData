using HC.Common.Cryptography;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Repository.Sql.Context;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HC.TripData.Repository.Sql
{
    public class DriverRepository: IDriverRepository
    {
        private TripDataContext tripDataContext = new TripDataContext();
        private IEncryptionHelper _encryptionHelper;

        [InjectionConstructor]
        public DriverRepository(IEncryptionHelper encryptionHelper)
        {
            _encryptionHelper = encryptionHelper;
        }

        public Driver GetDriver(string emailAddress)
        {
            return tripDataContext.Drivers.FirstOrDefault(d => d.EmailAddress == emailAddress);
        }

        public Driver GetDriverById(long id)
        {
            return tripDataContext.Drivers.FirstOrDefault(d => d.DriverId == id);
        }

        public long CreateDriver(Driver driver)
        {
            var dbdriver = tripDataContext.Drivers.FirstOrDefault(d => d.DriverId == driver.DriverId || d.EmailAddress.ToLower() == driver.EmailAddress.ToLower());
            if (dbdriver == null)
            {
                driver.Salt = _encryptionHelper.CreateSalt();
                driver.Password = _encryptionHelper.Encrypt(driver.Password, driver.Salt);
                tripDataContext.Drivers.Add(driver);
                tripDataContext.SaveChanges();

                return driver.DriverId;
            }
            else
            {
                throw new InvalidOperationException("Driver already exists");
            }   
        }

        public long UpdateDriver(long id, Driver driver)
        {
           var dbDriver = tripDataContext.Drivers.Single(d => d.DriverId == id);
           dbDriver = driver;

           tripDataContext.SaveChanges();

            return driver.DriverId;
        }

        public bool ValidateDriver(string emailAddress, string password)
        {
            var driver = tripDataContext.Drivers.FirstOrDefault(d => d.EmailAddress == emailAddress && d.Password == password);
            return driver != null;
        }

        public Driver DeleteDriver(long id)
        {
            var dbDriver = tripDataContext.Drivers.Single(d => d.DriverId == id);
            return tripDataContext.Drivers.Remove(dbDriver);
        }

        public IEnumerable<Driver> GetDrivers()
        {
            return tripDataContext.Drivers.ToList();
        }
    }
}
