using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Practices.Unity;
using System.Web.Http.Dependencies;

namespace HC.Common.Resolver
{
    public class UnityDependencyResolver: UnityDependencyScope, IDependencyResolver
    {
        public UnityDependencyResolver(IUnityContainer container)
            :base(container)
        {
        }

        public IDependencyScope BeginScope()
        {
            return (IDependencyScope)new UnityDependencyScope(this.Container.CreateChildContainer());
        }
    }
}
