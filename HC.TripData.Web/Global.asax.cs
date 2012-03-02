using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using HC.TripData.Repository.Interfaces;
using Ninject;
using Ninject.Web.Mvc;
using HC.TripData.Repository.Mongo;

namespace HC.TripData.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            routes.MapHttpRoute(
                name: "DriverSpecific",
                routeTemplate: "driver/{driverId}/{controller}/{*id}",
                defaults:new { controller="trip", driverId = "", id="" }
                );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Page", action = "Index", id = UrlParameter.Optional }
            );
        }

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RegisterGlobalFilters(GlobalFilters.Filters);
            RegisterRoutes(RouteTable.Routes);

            BundleTable.Bundles.RegisterTemplateBundles();

            Configure(GlobalConfiguration.Configuration);

        }

        public static void Configure(HttpConfiguration config)
        {
            var kernel = new StandardKernel();
            RegisterServices(kernel);
            config.ServiceResolver.SetResolver(
                t => kernel.TryGet(t),
                t => kernel.GetAll(t));

            DependencyResolver.SetResolver(
                t => kernel.TryGet(t),
                t => kernel.GetAll(t));
        }

        public static void RegisterServices(IKernel kernel)
        {
            kernel.Bind<ITripDataRepository>().To<TripDataRepository>();
        }


        public static void RegisterApis(HttpConfiguration config)
        {
          //  config.MessageHandlers.Add(new ApiUsageLogger());

            config.Routes.MapHttpRoute("tripdata-route", "tripdata", new { controller = "tripdata" });
        }
    }
}