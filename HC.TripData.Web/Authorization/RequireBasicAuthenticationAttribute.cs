using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Http.Hosting;

namespace HC.TripData.Web.Authorization
{
    public class RequireBasicAuthenticationAttribute : AuthorizationFilterAttribute
    {

        private IDriverValidator _driverValidator { get; set; }

        private class Credentials
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

         public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (actionContext.Request.Headers.Authorization == null ||
                actionContext.Request.Headers.Authorization.Scheme != "Basic")
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                actionContext.Response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue("Basic"));//,"realm=" + Realm
                return;
            }

            var credentials = ExtractCredentials(actionContext.Request.Headers.Authorization);
            if (credentials != null && ValidateUser(credentials))
            {
                var identity = new GenericIdentity(credentials.Email, "Basic");
                actionContext.Request.Properties.Add(HttpPropertyKeys.UserPrincipalKey,
                                       new GenericPrincipal(identity, new string[0]));
                return;
            }
            else
            {
                actionContext.Response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                actionContext.Response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue("Basic"));//,"realm=" + Realm
                return;
            }
           
        }

         private bool ValidateUser(Credentials credentials)
         {
             return _driverValidator.Validate(credentials.Email, credentials.Password);
         }

         private Credentials ExtractCredentials(AuthenticationHeaderValue authHeader)
         {
             try
             {
                 if (authHeader == null || authHeader.Scheme != "Basic")
                 {
                     return null;
                 }


                 var encodedUserPass = authHeader.Parameter.Trim();
                 var encoding = Encoding.GetEncoding("iso-8859-1");
                 var userPass = encoding.GetString(Convert.FromBase64String(encodedUserPass));
                 var parts = userPass.Split(":".ToCharArray());
                 return new Credentials { Email = parts[0], Password = parts[1] };
             }
             catch (Exception ex)
             {
                 return null;
             }
         }
    }
}