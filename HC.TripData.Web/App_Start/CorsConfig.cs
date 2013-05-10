using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Thinktecture.IdentityModel.Http.Cors.Mvc;

namespace HC.TripData.Web
{
    public class CorsConfig
    {
        public static void RegisterCors(MvcCorsConfiguration mvcCorsConfiguration)
        {
            mvcCorsConfiguration.AllowAll();
        }
    }
}