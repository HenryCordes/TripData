using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Web.Http.Hosting;

namespace HC.TripData.Web.Authorization
{

    public class BasicAuthenticationMessageHandler : DelegatingHandler
    {

        private readonly IDriverValidator _driverValidator;

        public BasicAuthenticationMessageHandler(IDriverValidator driverValidator)
        {
            _driverValidator = driverValidator;
        }

        private class Credentials
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

    
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request,
                                                               System.Threading.CancellationToken cancellationToken)
        {
            var credentials = ExtractCredentials(request.Headers.Authorization);
            if (credentials != null && ValidateUser(credentials))
            {
                
                var identity = new GenericIdentity(credentials.Email, "Basic");
                if (request.Properties.ContainsKey(HttpPropertyKeys.UserPrincipalKey))
                {
                    request.Properties.Remove(HttpPropertyKeys.UserPrincipalKey);
                }
                request.Properties.Add(HttpPropertyKeys.UserPrincipalKey,
                                        new GenericPrincipal(identity, new string[0]));
 
            }
            else
            {
                return ReturnUnauthorizedResponse();
            }

            return base.SendAsync(request, cancellationToken);
        }

        private static Task<HttpResponseMessage> ReturnUnauthorizedResponse()
        {
            return
                Task<HttpResponseMessage>.Factory.StartNew(
                    () =>
                        {
                            var response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                            response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue("Basic"));
                            return response;
                        });
        }

        private bool ValidateUser(Credentials credentials)
        {
            if (!_driverValidator.Validate(credentials.Email, credentials.Password))
            {
                return false;
            }
            return true;
        }

        private Credentials ExtractCredentials(AuthenticationHeaderValue authHeader)
        {
            try
            {
                if (authHeader == null)
                {
                    return null;
                }

                if (authHeader.Scheme != "Basic")
                {
                    return null;
                }

                var encodedUserPass = authHeader.Parameter.Trim();
                var encoding = Encoding.GetEncoding("iso-8859-1");
                var userPass = encoding.GetString(Convert.FromBase64String(encodedUserPass));
                var parts = userPass.Split(":".ToCharArray());
                return new Credentials {Email = parts[0], Password = parts[1]};
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}