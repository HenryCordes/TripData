using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Breeze.WebApi;
using HC.Common.Security;
using HC.TripData.Domain;

using HC.TripData.Repository.Sql.Context;
using HC.TripData.Web.Authorization;
using Newtonsoft.Json.Linq;

namespace HC.TripData.Web.Controllers
{
    [BreezeController]
    public class TripDataController : ApiController
    {
        readonly EFContextProvider<TripDataContext> _repository = new EFContextProvider<TripDataContext>();

        [HttpGet]
        public string Metadata()
        {
            return _repository.Metadata();
        }

        [HttpPost]
        [RequireApiKeyAuthentication]    
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _repository.SaveChanges(saveBundle);
        }

        [HttpGet]
        public object Lookups()
        {
            var driver = SecurityHelper.GetLoggedOnDriver();
            var cars = _repository.Context.Cars; // Drivers.Include("Car").Where(d => d.DriverId);
            return new { cars };
        }

        [HttpGet]
        public IQueryable<Trip> Trips()
        {
            return _repository.Context.Trips;
        }

        [HttpGet]
        public IQueryable<Driver> Drivers()
        {
            return _repository.Context.Drivers;
        }

        [HttpGet]
        public IQueryable<Car> Cars()
        {
            return _repository.Context.Cars;
        }
    }
}
