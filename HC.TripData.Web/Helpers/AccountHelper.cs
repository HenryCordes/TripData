using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HC.Common.Security;
using HC.TripData.Domain;
using HC.TripData.Web.Models;

namespace HC.TripData.Web.Helpers
{
    public class AccountHelper
    {
        private const int TokenLength = 35;

        public static void SetToken(AccessToken accessToken, long driverId)
        {
            accessToken.ExpiresOn = DateTime.UtcNow.AddDays(2);
            accessToken.IssuedOn = DateTime.UtcNow;
            accessToken.Token = string.Format("{0}|{1}", SecurityHelper.CreateToken(TokenLength), driverId);
        }

        public static LogonResponseModel GetLogonResponseModel(bool success, 
                                                                string token = null, 
                                                                long? driverId = null, 
                                                                string driverEmail = null, 
                                                                string driverFirstName = null,
                                                                string driverLastname = null,
                                                                long? currentCar = 0 )
        {
            var returnValue = new LogonResponseModel()
                {
                    Success = success,
                    AccessToken = token,
                    DriverId = driverId,
                    Email = driverEmail,
                    FirstName = driverFirstName,
                    LastName = driverLastname,
                    CurrentCarId = currentCar
                };

            return returnValue;
        }
    }
}