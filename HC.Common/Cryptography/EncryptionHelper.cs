using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace HC.Common.Cryptography
{
 
    public class EncryptionHelper : IEncryptionHelper
    {
        #region Privates
        
        private int _saltSize = 13;

        public int SaltSize {
            get { return _saltSize; }
            set { _saltSize = value; }
        }

        #endregion

        public string Encrypt(string password, string salt)
        {
            var valueToEncrypt = password + salt;
            HashAlgorithm hashAlg = new SHA256CryptoServiceProvider();
            var bytValue = System.Text.Encoding.UTF8.GetBytes(valueToEncrypt);
            var bytHash = hashAlg.ComputeHash(bytValue);
 
            return Convert.ToBase64String(bytHash);
        }

        public string CreateSalt()
        {
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            var buff = new byte[SaltSize];
            rng.GetBytes(buff);

            return Convert.ToBase64String(buff);
        }  

    }
}
