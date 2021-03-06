﻿using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Http.Controllers;
using System.Web.Http.Dependencies;

namespace HC.Common.Resolver
{
    public class UnityDependencyScope: IDependencyScope
    {
        protected IUnityContainer Container { get; private set; }

        public UnityDependencyScope(IUnityContainer container)
        {
            this.Container = container;
        }

        public object GetService(Type serviceType)
        {
            if (typeof(IHttpController).IsAssignableFrom(serviceType))
            {
                return Container.Resolve(serviceType);
            }

            try
            {
                return Container.Resolve(serviceType);
            }
            catch
            {
                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            return this.Container.ResolveAll(serviceType, new ResolverOverride[0]);
        }

        public void Dispose()
        {
            Container.Dispose();
        }
    }
}
