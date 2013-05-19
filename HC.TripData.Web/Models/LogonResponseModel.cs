using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HC.TripData.Web.Models
{
    public class LogonResponseModel
    {
        public bool Success { get; set; }
        public string AccessToken { get; set; }
        public long? DriverId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public long? CurrentCarId { get; set; }
    }
}