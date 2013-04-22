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
        public LogonResponseModel Token(string id)
        {
            var tokenArray =id.Split('|');
            if (tokenArray.Length != 2)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            var driverId = long.Parse(tokenArray[1]);
            var accessToken = _driverRepository.ValidateToken(driverId, tokenArray[0]);
            if (accessToken != null)
            {
                if (accessToken.ExpiresOn < DateTime.UtcNow.AddHours(8))
                {
                    var driver = _driverRepository.GetDriverById(driverId);
                    var newToken = string.Format("{0}|{1}", driver.Token.Token, driverId);
                    driver.Token.Token = newToken;
                    _driverRepository.UpdateDriver(driver);
                    accessToken.Token = newToken;
                }
                return AccountHelper.GetLogonResponseModel(true, accessToken.Token);
            }
            else
            {
                return AccountHelper.GetLogonResponseModel(false);
            }

        }
    }
}
