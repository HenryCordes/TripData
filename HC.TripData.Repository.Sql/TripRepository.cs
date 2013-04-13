using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Repository.Sql.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HC.TripData.Repository.Sql
{
    public class TripRepository: ITripRepository
    {
        private TripDataContext tripDataContext = new TripDataContext();

        public List<Trip> GetTrips()
        {
            return tripDataContext.Trips.ToList();
        }

        public Trip GetTrip(long tripId)
        {
            return tripDataContext.Trips.Single(t => t.TripId == tripId);
        }

        public void AddTrips(IEnumerable<Trip> trips)
        {
            foreach(var trip in trips)
            {
                tripDataContext.Trips.Add(trip);
            }
            tripDataContext.SaveChanges();
        }

        public void DeleteTrips()
        {
            throw new NotImplementedException();
        }
    }
}
