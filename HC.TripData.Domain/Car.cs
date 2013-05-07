using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace HC.TripData.Domain
{
    public class Car
    {
        [Key]
        public long CarId { get; set; }
        [Required]
        public string LicensePlateNumber { get; set; }
        [Required]
        public string Make { get; set; }
        [Required]
        public string Model { get; set; }
        public bool IsCurrentCar { get; set; }

        public Driver Driver { get; set; }
        public long DriverId { get; set; }
    }
}
