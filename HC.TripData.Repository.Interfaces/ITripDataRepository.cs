using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HC.TripData.Domain;

namespace HC.TripData.Repository.Interfaces
{
    public interface ITripDataRepository
    {
        List<Trip> GetTrips();
        Trip GetTrip(string tripId);
        void AddTrips(IEnumerable<Trip> trips);
        void DeleteTrips();
    }
}
