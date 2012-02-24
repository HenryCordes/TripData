using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;

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
        public List<Trip> Get()
        {
            return _tripDataRepository.GetTrips();
        }

        // GET /api/tripdata/<userName>
        public List<Trip> Get(string userName)
        {
            return _tripDataRepository.GetTrips().Where(t => t.Driver.UserName == userName).ToList();
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
