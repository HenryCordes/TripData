using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using HC.Common.Security;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Web.Helpers;
using HC.TripData.Web.Models;


namespace HC.TripData.Web.Controllers
{

    public class AccountController : ApiController
    {
        #region Private Members

        private readonly IDriverRepository _driverRepository;

        #endregion

        #region C'tor

        public AccountController(IDriverRepository driverRepository)
        {
            _driverRepository = driverRepository;
        }

        #endregion

        [HttpPost]
        [AllowAnonymous]
        public HttpResponseMessage Login(LogonRequestModel logonModel)
        {
            if (ModelState.IsValid)
            {
                var driver = _driverRepository.ValidateDriver(logonModel.Email, logonModel.Password);
                if (driver == null)
                {
                    return Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, AccountHelper.GetLogonResponseModel(false));
                }
                else
                {
                    if (driver.Token != null)
                    {
                        AccountHelper.SetToken(driver.Token, driver.DriverId);
                    }
                    else
                    {
                        var token = new AccessToken();
                        AccountHelper.SetToken(token, driver.DriverId);
                        driver.Token = token;
                    }
                    _driverRepository.UpdateDriver(driver);

                    var responseMessage = Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, AccountHelper.GetLogonResponseModel(true, driver.Token.Token));

                    var cookie = new CookieHeaderValue(SecurityHelper.AccessTokenCookieName, driver.Token.Token);
                    cookie.Expires = DateTimeOffset.Now.AddDays(14);
                    cookie.Path = "/";

                    responseMessage.Headers.AddCookies(new CookieHeaderValue[] { cookie });

                    return responseMessage;
                }
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }


        [HttpPut]
        [AllowAnonymous]
        public HttpResponseMessage CreateAccount(LogonRequestModel logonModel)
        {
            if (ModelState.IsValid)
            {
                var driverId = _driverRepository.CreateDriver(logonModel.Email, logonModel.Password);
                if (driverId > 0)
                {
                    var driver = _driverRepository.GetDriverById(driverId);
                    if (driver.Token == null)
                    {
                        driver.Token = new AccessToken();
                    }
                    AccountHelper.SetToken(driver.Token, driverId);
                    _driverRepository.UpdateDriver(driver);

                    var responseMessage = Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, AccountHelper.GetLogonResponseModel(true, driver.Token.Token));
                    var cookie = new CookieHeaderValue(SecurityHelper.AccessTokenCookieName, driver.Token.Token);
                    cookie.Expires = DateTimeOffset.Now.AddDays(14);
                    cookie.Path = "/";

                    responseMessage.Headers.AddCookies(new CookieHeaderValue[] { cookie });

                    return responseMessage;
                }
                else
                {
                    return Request.CreateResponse<LogonResponseModel>(HttpStatusCode.OK, AccountHelper.GetLogonResponseModel(false));
                }
            }

            return Request.CreateResponse<LogonResponseModel>(HttpStatusCode.BadRequest, AccountHelper.GetLogonResponseModel(false));
        }
    }
}
