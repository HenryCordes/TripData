﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Web.Authorization;


namespace HC.TripData.Web.Controllers
{
   
    public class TripsController : ApiController
    {

        private ITripRepository _tripRepository;

        public TripsController(ITripRepository tripRepository)
        {
            _tripRepository = tripRepository;
        }

        /// GET /trips
          [Authorize]
        public List<Trip> GetTrips()
        {
            return _tripRepository.GetTrips();
        }


        /// GET /trips/<id>
        public Trip GetTrip(long id)
        {
            var trip = _tripRepository.GetTrips().FirstOrDefault(t => t.TripId == id);

            if (trip == null)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return trip; 
        }

        /// GET /driver/<driverId>/trips/
        [RequireApiKeyAuthentication]  
        public List<Trip> GetTripsByDriver(string driverId)
        {
            return _tripRepository.GetTrips().Where(t => t.DriverId.ToString() == driverId).ToList();
        }

        // POST /api/tripdata
        [RequireApiKeyAuthentication]  
        public void Post(List<Trip> value)
        {
            throw new HttpResponseException(HttpStatusCode.NotImplemented);
        }

        // PUT /api/tripdata/5
        [RequireApiKeyAuthentication]  
        public void Put(string id, string value)
        {
            throw new HttpResponseException(HttpStatusCode.NotImplemented);
        }

        // DELETE /api/tripdata/5
        [RequireApiKeyAuthentication]  
        public void Delete(string id)
        {
            throw new HttpResponseException(HttpStatusCode.NotImplemented);
        }


        #region Private Methods

        private static List<Trip> CheckIfTripsReturned(List<Trip> trips)
        {
            if (trips == null || trips.Count == 0)
                throw new HttpResponseException(HttpStatusCode.NotFound);

            return trips;
        }

        #endregion

    }
}
