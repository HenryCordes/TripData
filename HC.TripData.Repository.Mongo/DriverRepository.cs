using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Security.Principal;
using System.Text;
using HC.Common.Cryptography;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using Microsoft.Practices.Unity;
using MongoRepository;

namespace HC.TripData.Repository.Mongo
{
    public class DriverRepository : IDriverRepository
    {
        #region Private members

        private IEncryptionHelper _encryptionHelper;
        private string _connectionString = "";

        #endregion

        #region C'tors
       [InjectionConstructor]
        public DriverRepository(IEncryptionHelper encryptionHelper)
        {
            _connectionString = ConfigurationManager.AppSettings.Get("MONGOLAB_URI");
            _encryptionHelper = encryptionHelper;
        }

        public DriverRepository(string connectionString, IEncryptionHelper encryptionHelper)
        {
            _connectionString = connectionString;
            _encryptionHelper = encryptionHelper;
        }

        #endregion

        public IEnumerable<Driver> GetDrivers()
        {
            var repository = ResolveDriverRepository();
            return repository.All();
        }
    
        public Driver GetDriver(string emailaddres)
        {
            var repository = ResolveDriverRepository();
            return repository.GetSingle(d => d.EmailAddress.ToLower() == emailaddres.ToLower());
        }

        public Driver GetDriverById(long id)
        {
            var repository = ResolveDriverRepository();
            return repository.GetById(id.ToString());
        }

        public long CreateDriver(Driver driver)
        {
            var repository = ResolveDriverRepository();
            if (!repository.Exists(d => d.DriverId == driver.DriverId || d.EmailAddress.ToLower() == driver.EmailAddress.ToLower()))
            {
                driver.Salt = _encryptionHelper.CreateSalt();
                driver.Password = _encryptionHelper.Encrypt(driver.Password, driver.Salt);
                var newDriver = repository.Add(driver);

                return newDriver.DriverId;     
            }
            else
            {
                throw new InvalidOperationException("Driver already exists");
            }
        }

        public long UpdateDriver(long id, Driver driver)
        {
            var repository = ResolveDriverRepository();
            if (repository.Exists(d => d.DriverId == id))
            {
                repository.Update(driver);
                return driver.DriverId;
            }
            else
            {
                throw new IdentityNotMappedException("Driver does not exist");
            }
        }

        public bool ValidateDriver(string emailaddres, string password)
        {
            var repository = ResolveDriverRepository();
            var driver = repository.GetSingle(d => d.EmailAddress == emailaddres);
            if (driver == null) return false;

            var hash = _encryptionHelper.Encrypt(password, driver.Salt);

            return (string.Compare(hash, driver.Password,false,CultureInfo.InvariantCulture) == 0);

        }


        public Driver DeleteDriver(long id)
        {
            var repository = ResolveDriverRepository();
            var driver = repository.GetSingle(d => d.DriverId == id);
            repository.Delete(id.ToString());

            return driver;
        }

        #region Private methods

        private MongoRepository<Driver> ResolveDriverRepository()
        {
            return new MongoRepository<Driver>(_connectionString);
        }

        #endregion

    }

   
}
