using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using DreamSongs.MongoRepository;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;

namespace HC.TripData.Repository.Mongo
{


    public class DriverRepository : IDriverRepository
    {
        #region Private members
        
        private string _connectionString = "";

        #endregion

        #region C'tors
       
        public DriverRepository()
        {
            _connectionString = ConfigurationManager.AppSettings.Get("MONGOLAB_URI");
        }

        public DriverRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        #endregion
    
        public Driver GetDriver(string userName)
        {
            var repository = ResolveDriverRepository();
            return repository.GetSingle(d => d.UserName == userName);
        }

 
        public void CreateDriver(Driver driver)
        {
            var repository =  ResolveDriverRepository();
            repository.Add(driver);
        }

        public void UpdateDriver(Driver driver)
        {
            var repository = ResolveDriverRepository();
            repository.Update(driver);
        }


        #region Private methods

        private MongoRepository<Driver> ResolveDriverRepository()
        {
            return new MongoRepository<Driver>(_connectionString);
        }

        #endregion
    }
}
