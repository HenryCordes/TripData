using System.Linq;
using System.Web.Http;
using System.Web.Mvc;
using HC.Common.Cryptography;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Repository.Mongo;
using HC.TripData.Web.Authorization;
using HC.WebApi.Helpers.Attributes;
using Microsoft.Practices.Unity;
using Unity.WebApi;

namespace HC.TripData.Web
{
    public static class Bootstrapper
    {
      

        public static void Initialise(IUnityContainer container)
        {
            container = BuildUnityContainer();

            GlobalConfiguration.Configuration.ServiceResolver.SetResolver(new UnityDependencyResolver(container));
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            container.RegisterType<ITripRepository, TripRepository>()
                .RegisterType<IDriverRepository, DriverRepository>()
                .RegisterType<IEncryptionHelper, EncryptionHelper>()
                .RegisterType<IDriverValidator, DriverValidator>();
         
            return container;
        }
    }
}