﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace HC.TripData.Domain
{
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