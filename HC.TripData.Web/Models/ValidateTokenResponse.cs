using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HC.TripData.Domain;

namespace HC.TripData.Web.Models
{
    public enum TokenValidness
    {
        Valid,
        Expired,
        Invalid
    }

    public class ValidateTokenResponse
    {
        public AccessToken AccessToken { get; set; }
        public TokenValidness Validness { get; set; }
    }
}