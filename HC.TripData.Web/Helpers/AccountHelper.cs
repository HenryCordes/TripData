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

        public static void SetToken(AccessToken accessToken, long driverId)
        {
            accessToken.ExpiresOn = DateTime.UtcNow.AddDays(2);
            accessToken.IssuedOn = DateTime.UtcNow;
            accessToken.Token = string.Format("{0}|{1}", SecurityHelper.CreateToken(15), driverId);
        }

        public static LogonResponseModel GetLogonResponseModel(bool success, string token = null)
        {
            return new LogonResponseModel()
            {
                Success = success,
                AccessToken = token
            };
        }
    }
}