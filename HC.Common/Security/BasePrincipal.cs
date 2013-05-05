using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;

namespace HC.Common.Security
{
    public abstract class BasePrincipal : IPrincipal
    {
        public bool IsInRole(string role)
        {
            throw new NotImplementedException();
        }

        public IIdentity Identity { get; protected set; }
    }
}
