using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Web.Authorization;

namespace HC.TripData.Web.Controllers
{
    public class DriverController : ApiController
    {
        #region Private Members
       
        private IDriverRepository _driverRepository;
        #endregion

        #region C'tor

        public DriverController(IDriverRepository driverRepository)
        {
            _driverRepository = driverRepository;
        }

        #endregion

        // GET /driver
        public IEnumerable<Driver> Get()
        {
            var drivers = _driverRepository.GetDrivers();
            if (drivers == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return drivers;
        }

        // GET /driver/5
        [RequireBasicAuthentication]      
        public Driver Get(string id)
        {
            var email = id;
            var driver = _driverRepository.GetDriver(email);

            if (driver == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return driver; 
        }

        // POST /driver
        [RequireBasicAuthentication]  
        public HttpResponseMessage Post(Driver driver)
        {

            if (ModelState.IsValid)
            {
                driver.Id = _driverRepository.UpdateDriver(driver.Id, driver);

              //  var response = new HttpResponseMessage<Driver>(driver, HttpStatusCode.Created);
                var response = Request.CreateResponse<Driver>(HttpStatusCode.Created, driver);

                string uri = Url.Link(null, new { id = driver.Id });
                response.Headers.Location = new Uri(Request.RequestUri, uri);

                return response;
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest);
        }


        // DELETE /driver/5
   //     [RequireBasicAuthentication]  
        public void Delete(string id)
        {
            var driver = _driverRepository.DeleteDriver(id);

            if (driver == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

        }
    }
}
