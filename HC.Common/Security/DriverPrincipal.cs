using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HC.TripData.Domain;

namespace HC.Common.Security
{
    public class DriverPrincipal : BasePrincipal
    {
        public long DriverId { get; private set; }

        public DriverPrincipal(Driver driver, string authenticationType, bool authenticated) 
        {
            if (driver == null)
            {
                throw new ArgumentNullException("driver");
            }
            Identity = new Identity(driver , authenticationType, authenticated);
            DriverId = driver.DriverId;
        }
    }
}
