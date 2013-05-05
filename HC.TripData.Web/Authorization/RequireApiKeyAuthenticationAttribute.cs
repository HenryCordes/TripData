using System;
using System.Collections.Generic;
using System.Diagnostics;
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
using HC.TripData.Domain;
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
    public class RequireApiKeyAuthenticationAttribute : AuthorizationFilterAttribute
    {

        public IDriverRepository DriverRepository {
            get { return ContainerConfig.Resolve(typeof(IDriverRepository)) as IDriverRepository; }
        }
       
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            var valid = false;
            var logonResponse = AccountHelper.GetLogonResponseModel(false);
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
                        var response = DriverRepository.ValidateToken(driverId, accessToken);
                        switch (response.Validness)
                        {
                            case TokenValidness.Valid:
                                logonResponse = AccountHelper.GetLogonResponseModel(true, accessToken, driverId,
                                                                                    response.DriverEmail);
                                tokenValue = accessToken;
                                valid = true;
                                SecurityHelper.SetUseronThread(response.Driver);
                                break;
                            case TokenValidness.Expired:
                                var driver = DriverRepository.GetDriverById(driverId);
                                AccountHelper.SetToken(driver.Token, driverId);
                                DriverRepository.UpdateDriver(driver);
                                tokenValue = driver.Token.Token;
                                logonResponse = AccountHelper.GetLogonResponseModel(true, driver.Token.Token, driverId,
                                                                                    response.DriverEmail);
                                valid = true;
                                SecurityHelper.SetUseronThread(driver);
                                break;
                            case TokenValidness.Invalid:
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            catch (ArgumentNullException argEx)
            {
                Trace.Write(argEx.Message + Environment.NewLine + argEx.StackTrace);
            }
            catch (IndexOutOfRangeException indEx)
            {
                Trace.Write(indEx.Message + Environment.NewLine + indEx.StackTrace);
            }

            if (!valid)
            {
               // const string jsonResult =
               //     @"{""result"":{""success"":false,""message"":""Invalid Authorization Key"",""location"":""/api/Security""}}";

                var cookie = new CookieHeaderValue(SecurityHelper.AccessTokenCookieName, tokenValue)
                    {
                        Expires = DateTimeOffset.Now.AddDays(14),
                        Path = "/"
                    };

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