using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using MongoDB.Bson;

namespace HC.TripData.Web.Controllers
{
    public class TripDataController : ApiController
    {

        private ITripDataRepository _tripDataRepository;

        public TripDataController(ITripDataRepository tripDataRepository)
        {
            _tripDataRepository = tripDataRepository;
        }

        // GET /api/tripdata
        public List<Trip> GetTrips()
        {
            return _tripDataRepository.GetTrips();
        }

        // GET /api/tripdata/<tripId>
        public Trip GetTrip(string tripId)
        {
            return _tripDataRepository.GetTrips().FirstOrDefault(t => t.Id == tripId);
        }

        // GET /api/tripdata
        public List<Trip> GetTripsByDriver(ObjectId driverId)
        {
            return _tripDataRepository.GetTrips().Where(t => t.DriverId == driverId).ToList();
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
