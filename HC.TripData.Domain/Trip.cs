
using System;
using System.Collections.Generic;
using DreamSongs.MongoRepository;

namespace HC.TripData.Domain
{
    public class Trip: Entity
    {
        public int StartMilage { get; set; }
        public int EndMilage { get; set; }
        public DateTime DateTime  { get; set; }
        public string PlaceOfDeparture { get; set; }
        public string Destination { get; set; }
        public string DepartureZipCode { get; set; }
        public string DestinationZipCode { get; set; }
        public string Description { get; set; }
        public TripType TripType { get; set; }

        public Driver Driver { get; set; }
        public Car Car { get; set; }
    }

    public enum TripType
    {
        Business,
        Private
    }

    public class Driver
    {
        public string LastName { get; set; }
        public string FirstName { get; set; }

        public string UserName { get; set; }
        public string Password { get; set; }

        public List<Car> Cars { get; set; }
    }


    public class Car
    {
        public string LicensePlateNumber { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public bool IsCurrentCar { get; set; }
    }
}
