using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Helpers;
using HC.TripData.Domain;

namespace HC.Common.Security
{
    public class SecurityHelper
    {
        public static string GetTokens()
        {
            string cookieToken, formToken;
            AntiForgery.GetTokens(null, out cookieToken, out formToken);
            return cookieToken + ":" + formToken;
        }

        public static string CreateToken(int tokenLength)
        {
            const string allowedChars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789!@$?_-";
            var chars = new char[tokenLength];
            var rd = new Random();

            for (int i = 0; i < tokenLength; i++)
            {
                chars[i] = allowedChars[rd.Next(0, allowedChars.Length)];
            }

            return new string(chars);
        }

        public const string AccessTokenCookieName = "tripdata-accesstoken";

        public static void SetUseronThread(Driver driver)
        {
            var principal = GetDriverPrincipal(driver);

            //  Principal needs to be set on both Thread.CurrentPrincipal and HttpContext.Current.User
            //  http://stackoverflow.com/questions/12028604/how-can-i-safely-set-the-user-principal-in-a-custom-webapi-httpmessagehandler
            Thread.CurrentPrincipal = principal;
            if (HttpContext.Current != null)
            {
                HttpContext.Current.User = principal;
            }
        }

        public static BasePrincipal GetDriverPrincipal(Driver driver)
        {
            return new DriverPrincipal(driver, "Basic authentication", true);
        }

        public static DriverPrincipal GetLoggedOnDriver()
        {
            if (HttpContext.Current.User is DriverPrincipal)
            {
                return HttpContext.Current.User as DriverPrincipal;
            }
            if (Thread.CurrentPrincipal is DriverPrincipal)
            {
               return  Thread.CurrentPrincipal as DriverPrincipal;
            }

            return null;
        }
    }
}
