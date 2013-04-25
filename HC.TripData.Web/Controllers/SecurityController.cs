using System.Net.Http.Headers;
using System.Web.Helpers;
using HC.Common.Security;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Web.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HC.TripData.Web.Helpers;
using HC.TripData.Web.Models;
using TokenValidness = HC.TripData.Repository.Models.TokenValidness;

namespace HC.TripData.Web.Controllers
{
    public class SecurityController : ApiController
    {
        #region Private Members

        private readonly IDriverRepository _driverRepository;

        #endregion

        #region C'tor

        public SecurityController(IDriverRepository driverRepository)
        {
            _driverRepository = driverRepository;
        }

        #endregion

        [HttpPost]
        [AllowAnonymous]
        public HttpResponseMessage Token(AccessToken token)
        {
            if (token == null)
                return Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, AccountHelper.GetLogonResponseModel(false));

            var tokenArray =token.Token.Split('|');
            if (tokenArray.Length != 2)
            {
                return Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, AccountHelper.GetLogonResponseModel(false));
            }

            LogonResponseModel logonResponse;
            var driverId = long.Parse(tokenArray[1]);
            var response = _driverRepository.ValidateToken(driverId, token.Token);
            string tokenValue ="";

            switch (response.Validness)
            {
                case TokenValidness.Valid:
                    logonResponse = AccountHelper.GetLogonResponseModel(true, token.Token);
                    tokenValue = token.Token;
                    break;
                case TokenValidness.Expired:
                    var driver = _driverRepository.GetDriverById(driverId);
                    AccountHelper.SetToken(driver.Token, driverId);
                    _driverRepository.UpdateDriver(driver);
                    tokenValue = driver.Token.Token;
                    logonResponse = AccountHelper.GetLogonResponseModel(true, driver.Token.Token);
                    break;
                case TokenValidness.Invalid:
                    logonResponse = AccountHelper.GetLogonResponseModel(false);
                    break;
                default:
                    logonResponse = AccountHelper.GetLogonResponseModel(false);
                    break;
            }
       
            var responseMessage = Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, logonResponse);

            var cookie = new CookieHeaderValue(SecurityHelper.AccessTokenCookieName, tokenValue);
            cookie.Expires = DateTimeOffset.Now.AddDays(14);
            cookie.Path = "/";

            responseMessage.Headers.AddCookies(new CookieHeaderValue[] { cookie });

            return responseMessage;
        }


        [HttpDelete]
        [AllowAnonymous]
        public HttpResponseMessage Logout(AccessToken token)
        {
            if (token == null)
                return Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, AccountHelper.GetLogonResponseModel(false));

            var tokenArray = token.Token.Split('|');
            if (tokenArray.Length != 2)
            {
                return Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, AccountHelper.GetLogonResponseModel(false));
            }

            LogonResponseModel logonResponse;
            var driverId = long.Parse(tokenArray[1]);
            var response = _driverRepository.ValidateToken(driverId, token.Token);

            switch (response.Validness)
            {
                case TokenValidness.Valid:
                    UpdateLoggedOutDriver(driverId);
                    logonResponse = AccountHelper.GetLogonResponseModel(true, "");
                    break;
                case TokenValidness.Expired:
                    UpdateLoggedOutDriver(driverId);
                    logonResponse = AccountHelper.GetLogonResponseModel(true, "");
                    break;
                case TokenValidness.Invalid:
                    logonResponse = AccountHelper.GetLogonResponseModel(false);
                    break;
                default:
                    logonResponse = AccountHelper.GetLogonResponseModel(false);
                    break;
            }

            var responseMessage = Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, logonResponse);

            var cookie = new CookieHeaderValue(SecurityHelper.AccessTokenCookieName, "")
                {
                    Expires = DateTimeOffset.Now.AddDays(14),
                    Path = "/"
                };
            responseMessage.Headers.AddCookies(new CookieHeaderValue[] { cookie });

            return responseMessage;
        }

        private void UpdateLoggedOutDriver(long driverId)
        {
            var driver = _driverRepository.GetDriverById(driverId);
            driver.Token = null;
            _driverRepository.UpdateDriver(driver);
        }
    }
}
