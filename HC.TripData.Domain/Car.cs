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
        [StringLength(20)]
        public string LicensePlateNumber { get; set; }
        [Required]
        [StringLength(100)]
        public string Make { get; set; }
        [Required]
        [StringLength(100)]
        public string Model { get; set; }
        public bool IsCurrentCar { get; set; }

        public Driver Driver { get; set; }
        public long DriverId { get; set; }
    }
}
