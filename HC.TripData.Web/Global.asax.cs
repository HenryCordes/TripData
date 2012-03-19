using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Autofac;
using Autofac.Integration.WebApi;
using HC.Common.Cryptography;
using HC.TripData.Repository.Interfaces;
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

            var configuration = GlobalConfiguration.Configuration;
            var builder = new ContainerBuilder();

            // Configure the container with the integration implementations.
            builder.ConfigureWebApi(configuration);
            // Register API controllers using assembly scanning.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            builder.RegisterType<TripRepository>().As<ITripRepository>();
            builder.RegisterType<DriverRepository>().As<IDriverRepository>();
            builder.RegisterType<EncryptionHelper>().As<IEncryptionHelper>();

            var container = builder.Build();
            // Set the dependency resolver implementation.
            var resolver = new AutofacWebApiDependencyResolver(container);
            configuration.ServiceResolver.SetResolver(resolver);
        }

        public static void Configure(HttpConfiguration config)
        {

          
        }

        //public static void RegisterServices(IKernel kernel)
        //{
        //  //  kernel.Bind<ITripRepository>().To<TripRepository>();
        //  //  kernel.Bind<IDriverRepository>().To<DriverRepository>();
        //}


        public static void RegisterApis(HttpConfiguration config)
        {
          //  config.MessageHandlers.Add(new ApiUsageLogger());

            config.Routes.MapHttpRoute("trips-route", "trips", new { controller = "trips" });
            config.Routes.MapHttpRoute("account-route", "account", new { controller = "account" });
        }
    }
}