﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Globalization;
using HC.Common.Cryptography;
using HC.Common.Security;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Repository.Models;
using HC.TripData.Repository.Sql.Context;
using Microsoft.Practices.Unity;


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
            return tripDataContext.Drivers.Include("Token").FirstOrDefault(d => d.DriverId == id);
        }

        public long CreateDriver(string emailAddress, string password)
        {
            var dbdriver = tripDataContext.Drivers.FirstOrDefault(d => d.EmailAddress.ToLower() == emailAddress.ToLower());
            if (dbdriver == null)
            {
                var salt = _encryptionHelper.CreateSalt();
                var driver = new Driver()
                    {
                        EmailAddress = emailAddress.ToLower(),
                        Salt = salt,
                        Password = _encryptionHelper.Encrypt(password, salt)
                    };
                tripDataContext.Drivers.Add(driver);
                try
                {
                    tripDataContext.SaveChanges();
                }
                catch (Exception ex)
                {
                    Trace.Write(ex.Message);
                }

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
            var driver = tripDataContext.Drivers.Include("Token").FirstOrDefault(d => d.EmailAddress == emailAddress);
            
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


        public ValidateTokenResponse ValidateToken(long driverId, string token)
        {
            var response = new ValidateTokenResponse() {Validness = TokenValidness.Invalid};
            AccessToken accessToken = null;
            var driver = tripDataContext.Drivers.Include("Token").FirstOrDefault(d => d.DriverId == driverId);
            if (driver != null)
            {
                response.Driver = driver;
                response.DriverEmail = driver.EmailAddress;   
                if (string.Compare(driver.Token.Token, token, true, CultureInfo.InvariantCulture)== 0)
                {
                    if (driver.Token.ExpiresOn > DateTime.UtcNow)
                    {
                        response.AccessToken = driver.Token;
                        response.Validness = TokenValidness.Valid;
                    }
                    else
                    {
                        response.Validness = TokenValidness.Expired;
                    }
                }
            }

            return response;
        }
    }
}
