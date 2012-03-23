using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Security.Principal;
using System.Web.Http.Common;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

using HC.Common.Cryptography;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Repository.Mongo;
using HC.TripData.Web.Authorization;
using Microsoft.Practices.Unity;

namespace HC.TripData.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        private static IUnityContainer _container;

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
     //       Bootstrapper.Initialise(_container);
            _container = new UnityContainer();
            _container.RegisterType<ITripRepository, TripRepository>()
                .RegisterType<IDriverRepository, DriverRepository>()
                .RegisterType<IEncryptionHelper, EncryptionHelper>()
                .RegisterType<IDriverValidator, DriverValidator>();
            ConfigureMessageHandlers(GlobalConfiguration.Configuration);
        }

        private static void ConfigureMessageHandlers(HttpConfiguration configuration)
        {
            configuration.MessageHandlers.Add(new BasicAuthenticationMessageHandler(_container.Resolve<IDriverValidator>()));
        }


   



        public static void RegisterApis(HttpConfiguration config)
        {
          //  config.MessageHandlers.Add(new ApiUsageLogger());

            config.Routes.MapHttpRoute("trips-route", "trips", new { controller = "trips" });
            config.Routes.MapHttpRoute("account-route", "account", new { controller = "account" });
        }
    }
}