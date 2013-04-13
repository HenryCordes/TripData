using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using DataAnnotationsExtensions;
using MongoDB.Bson;
using MongoRepository;

namespace HC.TripData.Domain
{
    public class Driver 
    {
        [Key]
        public long DriverId { get; set; }
        [Required]
        public string LastName { get; set; }
        public string FirstName { get; set; }

        [Required]
        [Email]
        public string EmailAddress { get; set; }
        [Required]
        public string Password { get; set; }
        public string Salt { get; set; }

        public List<Car> Cars { get; set; }
    }


    
}
