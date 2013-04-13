using HC.Common.Cryptography;
using HC.Common.Resolver;
using HC.TripData.Repository.Interfaces;
using HC.TripData.Repository.Mongo;
using HC.TripData.Web.Authorization;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace HC.TripData.Web
{
    public class ContainerConfig
    {
        private static IUnityContainer _container;

        public static void RegisterTypes(HttpConfiguration config)
        {
            _container = new UnityContainer();
            _container.RegisterType<ITripRepository, TripRepository>()
                .RegisterType<IDriverRepository, DriverRepository>()
                .RegisterType<IEncryptionHelper, EncryptionHelper>()
                .RegisterType<IDriverValidator, DriverValidator>();

            config.DependencyResolver = new UnityDependencyResolver(_container);

        //   System.Web.Mvc.DependencyResolver.SetResolver(new UnityDependencyResolver(_container));
        }
    }
}