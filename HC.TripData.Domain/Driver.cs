using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using DreamSongs.MongoRepository;
using MongoDB.Bson;

namespace HC.TripData.Domain
{
    public class Driver : Entity
    {
        [Required]
        public string LastName { get; set; }
        public string FirstName { get; set; }

        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; }

        public List<Car> Cars { get; set; }
    }


    public class Car
    {
        [Required]
        public string LicensePlateNumber { get; set; }
        [Required]
        public string Make { get; set; }
        [Required]
        public string Model { get; set; }
        public bool IsCurrentCar { get; set; }
    }
}
