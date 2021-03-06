﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using HC.TripData.Domain;

namespace HC.TripData.Repository.Interfaces
{
    public interface ITripRepository
    {
        List<Trip> GetTrips();
        Trip GetTrip(long tripId);
        void AddTrips(IEnumerable<Trip> trips);
        void DeleteTrips();
    }
}
