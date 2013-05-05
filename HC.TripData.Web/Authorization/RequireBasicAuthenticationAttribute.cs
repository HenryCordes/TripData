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
using System.Web.Mvc;
using HC.Common.Cryptography;
using HC.Common.Security;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Web.Helpers;
using HC.TripData.Web.Models;
using Microsoft.Practices.Unity;
using System.Web.Http;
using System.Threading;
using HC.TripData.Repository.Sql;
using Newtonsoft.Json;
using TokenValidness = HC.TripData.Repository.Models.TokenValidness;

namespace HC.TripData.Web.Authorization
{
    public class RequireBasicAuthenticationAttribute : AuthorizationFilterAttribute
    {


        public IDriverRepository _driverRepository {
            get { return ContainerConfig.Resolve(typeof(IDriverRepository)) as IDriverRepository; }
        }
       
        private class Credentials
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

         public override void OnAuthorization(HttpActionContext actionContext)
        {
            var valid = false;
            LogonResponseModel logonResponse = AccountHelper.GetLogonResponseModel(false);
            var tokenValue = "";

            try
            {
                var header = actionContext.Request.Headers.Single(x => x.Key == "X-TripData-AccessToken");
                var accessToken = header.Value.First();
                if (accessToken != null)
                {
                    var tokenArray = accessToken.Split('|');
                    if (tokenArray.Length == 2)
                    {

                        var driverId = long.Parse(tokenArray[1]);
                        var response = _driverRepository.ValidateToken(driverId, accessToken);
                        switch (response.Validness)
                        {
                            case TokenValidness.Valid:
                                logonResponse = AccountHelper.GetLogonResponseModel(true, accessToken);
                                tokenValue = accessToken;
                                valid = true;
                                break;
                            case TokenValidness.Expired:
                                var driver = _driverRepository.GetDriverById(driverId);
                                AccountHelper.SetToken(driver.Token, driverId);
                                _driverRepository.UpdateDriver(driver);
                                tokenValue = driver.Token.Token;
                                logonResponse = AccountHelper.GetLogonResponseModel(true, driver.Token.Token);
                                valid = true;
                                break;
                            case TokenValidness.Invalid:
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            catch
            {

            }


            if (!valid)
            {
               // const string jsonResult =
               //     @"{""result"":{""success"":false,""message"":""Invalid Authorization Key"",""location"":""/api/Security""}}";
         

                var cookie = new CookieHeaderValue(SecurityHelper.AccessTokenCookieName, tokenValue);
                cookie.Expires = DateTimeOffset.Now.AddDays(14);
                cookie.Path = "/";

                dynamic result = JsonConvert.SerializeObject(logonResponse);
                var message = new HttpResponseMessage(HttpStatusCode.Forbidden)
                {
                    Content = result
                };
                message.Headers.AddCookies(new CookieHeaderValue[] { cookie });
                actionContext.Response = message;
            }
        }

    
    }
}