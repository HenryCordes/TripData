using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace HC.TripData.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "DriverSpecific",
                routeTemplate: "driver/{driverId}/trips/{id}",
                defaults: new { controller = "trips", driverId = "", id = RouteParameter.Optional }
            );
            
        }
    }
}
