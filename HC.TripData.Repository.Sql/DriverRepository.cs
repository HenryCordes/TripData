using System.Globalization;
using HC.Common.Cryptography;
using HC.Common.Security;
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

        public long CreateDriver(string emailAddress, string password, AccessToken accessToken)
        {
            var dbdriver = tripDataContext.Drivers.FirstOrDefault(d => d.EmailAddress.ToLower() == emailAddress.ToLower());
            if (dbdriver == null)
            {
                var salt = _encryptionHelper.CreateSalt();
                var driver = new Driver()
                    {
                        EmailAddress = emailAddress.ToLower(),
                        Salt = salt,
                        Password = _encryptionHelper.Encrypt(password, salt),
                        Token = accessToken
                    };
                tripDataContext.Drivers.Add(driver);
                tripDataContext.SaveChanges();

                return driver.DriverId;
            }
            else
            {
                throw new InvalidOperationException("Driver already exists");
            }   
        }

        public long UpdateDriver(Driver driver)
        {
           var dbDriver = tripDataContext.Drivers.Single(d => d.DriverId == driver.DriverId);
           dbDriver = driver;

           tripDataContext.SaveChanges();

            return driver.DriverId;
        }

        public Driver ValidateDriver(string emailAddress, string password)
        {
            var driver = tripDataContext.Drivers.FirstOrDefault(d => d.EmailAddress == emailAddress);
            if (driver != null)
            {
                var saltedPassword = _encryptionHelper.Encrypt(password, driver.Salt);
                if (string.Compare(driver.Password, saltedPassword, true, CultureInfo.InvariantCulture) == 0)
                {
                    return driver;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
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


        public AccessToken ValidateToken(long driverId, string token)
        {
            AccessToken accessToken = null;
            var driver = tripDataContext.Drivers.First(d => d.DriverId == driverId);
            if (driver != null)
            {
                if (string.Compare(driver.Token.Token, token, true, CultureInfo.InvariantCulture)== 0)
                {
                    if (driver.Token.ExpiresOn < DateTime.UtcNow)
                    {
                        accessToken = driver.Token;
                    }
                }
            }

            return accessToken;
        }
    }
}
