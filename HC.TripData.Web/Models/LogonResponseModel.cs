using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HC.TripData.Web.Models
{
    public class LogonResponseModel
    {
        public bool Success { get; set; }
        public string AccesToken { get; set; }
    }
}