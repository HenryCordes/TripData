using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;

namespace HC.TripData.Web.Controllers
{
    public class TripController : ApiController
    {

        private ITripDataRepository _tripRepository;

        public TripController(ITripDataRepository tripRepository)
        {
            _tripRepository = tripRepository;
        }

        /// GET /api/tripdata
        public List<Trip> GetTrips()
        {
            return _tripRepository.GetTrips();
        }

        /// GET /api/tripdata/<id>
        public Trip GetTrip(string id)
        {
            return _tripRepository.GetTrips().FirstOrDefault(t => t.Id == id);
        }

        /// GET /api/tripdata
        public List<Trip> GetTripsByDriver(string driverId, string id)
        {
            return _tripRepository.GetTrips().Where(t => t.DriverId.ToString() == driverId).ToList();
        }


        // POST /api/tripdata
        public void Post(List<Trip> value)
        {
        }

        // PUT /api/tripdata/5
        public void Put(string id, string value)
        {
        }

        // DELETE /api/tripdata/5
        public void Delete(string id)
        {
        }

     
    }
}
