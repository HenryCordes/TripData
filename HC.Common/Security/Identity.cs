using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using HC.TripData.Domain;

namespace HC.Common.Security
{
    class Identity : IIdentity
    {
        private readonly bool _authenticated;
        private readonly string _authenticationType;
        private readonly Driver _account;

        public Identity(Driver account, string authenticationType, bool authentiated)
        {
            _account = account;
            _authenticationType = authenticationType;
            _authenticated = authentiated;
        }

        public string Name
        {
            get { return _account.EmailAddress; }
        }

        public string AuthenticationType
        {
            get { return _authenticationType; }
        }

        public bool IsAuthenticated
        {
            get { return _authenticated; }
        }
    }
}
