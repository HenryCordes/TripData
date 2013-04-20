using System.Web.Helpers;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Web.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace HC.TripData.Web.Controllers
{
    public class SecurityController : ApiController
    {
        #region Private Members

        private IDriverRepository _driverRepository;

        #endregion

        #region C'tor

        public SecurityController(IDriverRepository driverRepository)
        {
            _driverRepository = driverRepository;
        }

        #endregion


        // GET /driver/[emailaddress]
        public Driver Get(string id)
        {
            var email = id;
            if (email == "999")
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
            var driver = _driverRepository.GetDriver(email);

            if (driver == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return driver; 
        }

        // POST /driver/
        public HttpResponseMessage Post(Driver driver)
        {
            if (ModelState.IsValid)
            {
                var newId = _driverRepository.CreateDriver(driver.EmailAddress, driver.Password);

              //  var response = new HttpResponseMessage<Driver>(driver, HttpStatusCode.Created);

                var response = Request.CreateResponse<Driver>(HttpStatusCode.Created, driver);
                string uri = Url.Route(null, new { id = newId });
                response.Headers.Location = new Uri(Request.RequestUri, uri);

                return response;
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest); 
        }

        // PUT /driver/5
        [RequireBasicAuthentication]  
        public HttpResponseMessage Put(Driver driver)
        {
           
            if (ModelState.IsValid)
            {
                _driverRepository.UpdateDriver(driver);

                //var response = new HttpResponseMessage<Driver>(driver, HttpStatusCode.Accepted);
                var response = Request.CreateResponse<Driver>( HttpStatusCode.Accepted, driver);

                string uri = Url.Route(null, new { id = driver.DriverId });
                response.Headers.Location = new Uri(Request.RequestUri, uri);

                return response;
            }

            throw new HttpResponseException(HttpStatusCode.BadRequest); 
        }

        // DELETE /driver/5
        [RequireBasicAuthentication]  
        public void Delete(int id)
        {
            throw new HttpResponseException(HttpStatusCode.NotImplemented);
        }
    }
}
