using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using DreamSongs.MongoRepository;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;

namespace HC.TripData.Repository.Mongo
{


    public class TripDataRepository : ITripDataRepository
    {
        #region Private members
        
        private string _connectionString = "";

        #endregion

        #region C'tors
       
        public TripDataRepository()
        {
            _connectionString = ConfigurationManager.AppSettings.Get("MONGOLAB_URI");
        }

        public TripDataRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        #endregion
    
        public List<Trip> GetTrips()
        {
            var repository = ResolveTripRepository();

            return repository.All().ToList();
        }

        public Trip GetTrip(string tripId)
        {
            var repository = ResolveTripRepository();
            return repository.GetById(tripId);
        }

         public void DeleteTrips()
         {
             var repository = ResolveTripRepository();
             repository.DeleteAll();
         }
        
        public void AddTrips(IEnumerable<Trip> trips)
        {
             var repository =  ResolveTripRepository();
            repository.Add(trips);
        }

        #region Private methods

        private MongoRepository<Trip> ResolveTripRepository()
        {
            return new MongoRepository<Trip>(_connectionString);
        }

        #endregion
    }
}
