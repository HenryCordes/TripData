using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;

namespace HC.TripData.Web.Controllers
{
    public class AccountController : ApiController
    {
        #region Private Members
       
        private IDriverRepository _accountRepository;
        #endregion

        #region C'tor

        public AccountController(IDriverRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        #endregion


        // GET /account/[emailaddress]
        public Driver Get(string id)
        {
            var driver = _accountRepository.GetDriver(id);

            if (driver == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return driver; 
        }

        // POST /account/
        public HttpResponseMessage<Driver> Post(Driver driver)
        {
            if (ModelState.IsValid)
            {
                var newId = _accountRepository.CreateDriver(driver);

                var response = new HttpResponseMessage<Driver>(driver, HttpStatusCode.Created);

                string uri = Url.Route(null, new { id = newId });
                response.Headers.Location = new Uri(Request.RequestUri, uri);

                return response;
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest); 
        }

        // PUT /account/5
        public HttpResponseMessage<Driver> Put(string id, Driver driver)
        {
           
            if (ModelState.IsValid)
            {
                _accountRepository.UpdateDriver(id, driver);

                var response = new HttpResponseMessage<Driver>(driver, HttpStatusCode.Accepted);

                string uri = Url.Route(null, new { id = id });
                response.Headers.Location = new Uri(Request.RequestUri, uri);

                return response;
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest); 
        }

        // DELETE /account/5
        public void Delete(int id)
        {
            throw new HttpResponseException(HttpStatusCode.NotImplemented);
        }
    }
}
