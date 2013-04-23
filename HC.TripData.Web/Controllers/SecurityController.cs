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
        public LogonResponseModel Token(AccessToken token)
        {
            if (token == null)
                return AccountHelper.GetLogonResponseModel(false);

            var tokenArray =token.Token.Split('|');
            if (tokenArray.Length != 2)
            {
                return AccountHelper.GetLogonResponseModel(false);
            //    throw new HttpResponseException(HttpStatusCode.BadRequest);
            }

            LogonResponseModel logonResponse;
            var driverId = long.Parse(tokenArray[1]);
            var response = _driverRepository.ValidateToken(driverId, token.Token);

            switch (response.Validness)
            {
                case TokenValidness.Valid:
                    logonResponse = AccountHelper.GetLogonResponseModel(true, token.Token);
                    break;
                case TokenValidness.Expired:
                    var driver = _driverRepository.GetDriverById(driverId);
                    AccountHelper.SetToken(driver.Token, driverId);
                    _driverRepository.UpdateDriver(driver);
                    logonResponse = AccountHelper.GetLogonResponseModel(true, driver.Token.Token);
                    break;
                case TokenValidness.Invalid:
                    logonResponse = AccountHelper.GetLogonResponseModel(false);
                    break;
                default:
                    logonResponse = AccountHelper.GetLogonResponseModel(false);
                    break;
            }

            return logonResponse;
        }
    }
}
