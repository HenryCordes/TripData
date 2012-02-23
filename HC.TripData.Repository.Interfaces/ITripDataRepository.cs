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
        void AddTrips(IEnumerable<Trip> trips);
    }
}
