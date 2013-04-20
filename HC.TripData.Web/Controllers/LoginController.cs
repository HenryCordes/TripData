using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HC.Common.Security;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Web.Models;

namespace HC.TripData.Web.Controllers
{
    public class LoginController : ApiController
    {

        #region Private Members

        private IDriverRepository _driverRepository;

        #endregion

        #region C'tor

        public LoginController(IDriverRepository driverRepository)
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
                    return new LogonResponseModel()
                    {
                        Success = false
                    };
                }
                else
                {
                    var token = new AccessToken()
                        {
                            ExpiresOn = DateTime.UtcNow.AddDays(2),
                            IssuedOn = DateTime.UtcNow,
                            Token = SecurityHelper.CreateToken(15)
                        };
                    driver.Token = token;
                    _driverRepository.UpdateDriver(driver);

                    return new LogonResponseModel()
                    {
                        Success = true,
                        AccesToken = token.Token
                    };
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
                var driver = _driverRepository.ValidateDriver(logonModel.Email, logonModel.Password);
                if (driver == null)
                {
                    return new LogonResponseModel()
                    {
                        Success = false
                    };
                }
                else
                {
                    var token = new AccessToken()
                    {
                        ExpiresOn = DateTime.UtcNow.AddDays(2),
                        IssuedOn = DateTime.UtcNow,
                        Token = SecurityHelper.CreateToken(15)
                    };
                    driver.Token = token;
                    _driverRepository.UpdateDriver(driver);

                    return new LogonResponseModel()
                    {
                        Success = true,
                        AccesToken = token.Token
                    };
                }

            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }
      
    }
}
