using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;

namespace HC.TripData.Web.Controllers
{
    public class TripDataController : ApiController
    {
        // GET /api/tripdata
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET /api/tripdata/5
        public string Get(int id)
        {
            return "value";
        }

        // POST /api/tripdata
        public void Post(string value)
        {
        }

        // PUT /api/tripdata/5
        public void Put(int id, string value)
        {
        }

        // DELETE /api/tripdata/5
        public void Delete(int id)
        {
        }
    }
}
