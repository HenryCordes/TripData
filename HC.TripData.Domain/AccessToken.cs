using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace HC.TripData.Domain
{
    public class AccessToken
    {
        [Key]
        public long AccessTokenId { get; set; }

        public DateTime IssuedOn { get; set; }
        public DateTime ExpiresOn { get; set; }

        public string Token { get; set; }
    }
}
