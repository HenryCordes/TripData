using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Security.Principal;
using System.Text;
using DreamSongs.MongoRepository;
using HC.Common.Cryptography;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;

namespace HC.TripData.Repository.Mongo
{


    public class DriverRepository : IDriverRepository
    {
        #region Private members

        private IEncryptionHelper _encryptionHelper;
        private string _connectionString = "";

        #endregion

        #region C'tors
       
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
    
        public Driver GetDriver(string emailaddres)
        {
            var repository = ResolveDriverRepository();
            return repository.GetSingle(d => d.EmailAddress == emailaddres);
        }

        public Driver GetDriverById(string id)
        {
            var repository = ResolveDriverRepository();
            return repository.GetById(id);
        }

        public string CreateDriver(Driver driver)
        {
            var repository = ResolveDriverRepository();
            if (!repository.Exists(d => d.Id == driver.Id))
            {
                driver.Salt = _encryptionHelper.CreateSalt();
                driver.Password = _encryptionHelper.Encrypt(driver.Password, driver.Salt);
                var newDriver = repository.Add(driver);

                return newDriver.Id;     
            }
            else
            {
                throw new InvalidOperationException("Driver already exists");
            }
        }

        public string UpdateDriver(string id, Driver driver)
        {
            var repository = ResolveDriverRepository();
            if (repository.Exists(d => d.Id == id))
            {
                repository.Update(driver);
                return driver.Id;
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
            var hash = _encryptionHelper.Encrypt(password, driver.Salt);

            return (string.Compare(hash, driver.Password,false,CultureInfo.InvariantCulture) == 0);

        }

        #region Private methods

        private MongoRepository<Driver> ResolveDriverRepository()
        {
            return new MongoRepository<Driver>(_connectionString);
        }

        #endregion
    }

   
}
