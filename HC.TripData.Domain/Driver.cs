using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using DataAnnotationsExtensions;

namespace HC.TripData.Domain
{
    public class Driver 
    {
        [Key]
        public long DriverId { get; set; }

        [StringLength(100)]
        public string LastName { get; set; }
        [StringLength(100)]
        public string FirstName { get; set; }

        [Required]
        [Email]
        [StringLength(100)]
        public string EmailAddress { get; set; }
        [Required]
        [StringLength(100)]
        public string Password { get; set; }
         [StringLength(100)]
        public string Salt { get; set; }

        public AccessToken Token { get; set; }
 
        public List<Car> Cars { get; set; }
    }


    
}
