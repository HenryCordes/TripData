using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace HC.Common.Cryptography
{
    public interface IEncryptionHelper
    {
        string Encrypt(string password, string salt);
        string CreateSalt();
    }

}
