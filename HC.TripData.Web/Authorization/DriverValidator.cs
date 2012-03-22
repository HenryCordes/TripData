using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using HC.TripData.Repository.Interfaces;

namespace HC.TripData.Web.Authorization
{
    public interface IDriverValidator
    {
        bool Validate(string email, string password);
    }

    public class DriverValidator : IDriverValidator
    {
        private readonly IDriverRepository _driverRepository;

        public DriverValidator(IDriverRepository driverRepository)
        {
            _driverRepository = driverRepository;
        }

        public bool Validate(string email, string password)
        {
            if(_driverRepository.ValidateDriver(email, password))
            {
                var driver = _driverRepository.GetDriver(email);
                //IIdentity identity = new GenericIdentity(driver.EmailAddress, "Basic");
                //var roles = new string[] { "Driver" };
                //principal = new GenericPrincipal(identity, roles);

                return true;
            }
            else
            {
         //       principal = null;
                return false;
            }
        }
    }
}