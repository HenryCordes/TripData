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
    public class AccountController : ApiController
    {
        #region Private Members
       
        private IDriverRepository _driverRepository;

        #endregion

        #region C'tor

        public AccountController(IDriverRepository driverRepository)
        {
            _driverRepository = driverRepository;
        }

        #endregion


        // GET /account/[emailaddress]
        public Driver Get(string id)
        {
            if (id == "999")
            {
                return new Driver()
                           {
                               FirstName = "Joep",
                               LastName = "Meloen",
                               EmailAddress = "j.meloen@mel.on",
                               Password = "12345",
                               Cars = new List<Car>() { 
                                            new Car() { 
                                                    IsCurrentCar = true,
                                                    LicensePlateNumber = "11-ABC-1",
                                                    Make = "BMW",
                                                    Model = "323i"
                                            },
                                            new Car() { 
                                                    IsCurrentCar = false,
                                                    LicensePlateNumber = "23-DFG-2",
                                                    Make = "Volvo",
                                                    Model = "V70"
                                            }
                               }
                           };
            }
            var driver = _driverRepository.GetDriver(id);

            if (driver == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return driver; 
        }

        // POST /account/
        public HttpResponseMessage<Driver> Post(Driver driver)
        {
            if (ModelState.IsValid)
            {
                var newId = _driverRepository.CreateDriver(driver);

                var response = new HttpResponseMessage<Driver>(driver, HttpStatusCode.Created);

                string uri = Url.Route(null, new { id = newId });
                response.Headers.Location = new Uri(Request.RequestUri, uri);

                return response;
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest); 
        }

        // PUT /account/5
        [RequireBasicAuthentication]  
        public HttpResponseMessage<Driver> Put(string id, Driver driver)
        {
           
            if (ModelState.IsValid)
            {
                _driverRepository.UpdateDriver(id, driver);

                var response = new HttpResponseMessage<Driver>(driver, HttpStatusCode.Accepted);

                string uri = Url.Route(null, new { id = id });
                response.Headers.Location = new Uri(Request.RequestUri, uri);

                return response;
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest); 
        }

        // DELETE /account/5
        [RequireBasicAuthentication]  
        public void Delete(int id)
        {
            throw new HttpResponseException(HttpStatusCode.NotImplemented);
        }
    }
}
