﻿
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HC.TripData.Domain
{
    public class Trip
    {
        [Key]
        public long TripId { get; set; }

        public int? StartMilage { get; set; }
        public int? EndMilage { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateTime  { get; set; }

        public string PlaceOfDeparture { get; set; }
        public string Destination { get; set; }
        public string DepartureZipCode { get; set; }
        public string DestinationZipCode { get; set; }
        public string Description { get; set; }
        public TripType TripType { get; set; }

        public long DriverId { get; set; }
        public long CarId { get; set; }
    }

    public enum TripType
    {
        Business,
        Private
    }

}
