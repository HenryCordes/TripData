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
using HC.TripData.Web.Models;

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
        public LogonResponseModel Login(LogonRequestModel logonModel)
        {
            if (ModelState.IsValid)
            {
                var driver = _driverRepository.ValidateDriver(logonModel.Email, logonModel.Password);
                if (driver == null)
                {
                    return GetLogonResponseModel(false);
                }
                else
                {
                    if (driver.Token != null)
                    {
                        SetToken(driver.Token);
                    }
                    else
                    {
                        var token = new AccessToken();
                        SetToken(token);
                        driver.Token = token;
                    }       
                    _driverRepository.UpdateDriver(driver);

                    return GetLogonResponseModel(true, driver.Token.Token);
                }
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }


        [HttpPut]
        [AllowAnonymous]
        public LogonResponseModel CreateAccount(LogonRequestModel logonModel)
        {
            if (ModelState.IsValid)
            {
                var token = new AccessToken();
                SetToken(token);

                var driverId = _driverRepository.CreateDriver(logonModel.Email, logonModel.Password, token);
                if (driverId > 0)
                {
                    return GetLogonResponseModel(true, token.Token);
                }
                else
                {
                    return GetLogonResponseModel(false);
                }

            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }

        #region Helpers
        
        private void SetToken(AccessToken accessToken)
        {
            accessToken.ExpiresOn = DateTime.UtcNow.AddDays(2);
            accessToken.IssuedOn = DateTime.UtcNow;
            accessToken.Token = SecurityHelper.CreateToken(15);
        }

        private static LogonResponseModel GetLogonResponseModel(bool success, string token = null)
        {
            return new LogonResponseModel()
            {
                Success = success,
                AccessToken = token
            };
        }

        #endregion
    }
}
