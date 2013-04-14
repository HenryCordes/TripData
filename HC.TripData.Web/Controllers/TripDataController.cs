using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Breeze.WebApi;
using HC.TripData.Domain;

using HC.TripData.Repository.Sql.Context;
using Newtonsoft.Json.Linq;

namespace HC.TripData.Web.Controllers
{
    [BreezeController]
    public class TripDataController : ApiController
    {
        readonly EFContextProvider<TripDataContext> _contextProvider = new EFContextProvider<TripDataContext>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        [HttpGet]
        public object Lookups()
        {
            var cars = _contextProvider.Context.Cars;
            return new { cars };
        }

        [HttpGet]
        public IQueryable<Trip> Trips()
        {
            return _contextProvider.Context.Trips;
        }

        [HttpGet]
        public IQueryable<Driver> Drivers()
        {
            return _contextProvider.Context.Drivers;
        }

        [HttpGet]
        public IQueryable<Car> Cars()
        {
            return _contextProvider.Context.Cars;
        }
    }
}
