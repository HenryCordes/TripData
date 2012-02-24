using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HC.TripData.Domain;

namespace HC.TripData.Repository.Interfaces
{
    public interface IDriverRepository
    {
        Driver GetDriver(string userName);
        void CreateDriver(Driver driver);
        void UpdateDriver(Driver driver);
    }
}
