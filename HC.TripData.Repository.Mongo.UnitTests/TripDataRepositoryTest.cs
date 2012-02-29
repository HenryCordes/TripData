using System.Collections;
using HC.TripData.Repository.Mongo;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using HC.TripData.Domain;
using System.Collections.Generic;

namespace HC.TripData.Repository.Mongo.UnitTests
{
    
    
    /// <summary>
    ///This is a test class for TripDataRepositoryTest and is intended
    ///to contain all TripDataRepositoryTest Unit Tests
    ///</summary>
    [TestClass()]
    public class TripDataRepositoryTest
    {

        #region MsTest stuff
       
        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }
        #endregion

        #region Additional test attributes
        // 
        //You can use the following additional attributes as you write your tests:
        //
        //Use ClassInitialize to run code before running the first test in the class
        //[ClassInitialize()]
        //public static void MyClassInitialize(TestContext testContext)
        //{
        //}
        //
        //Use ClassCleanup to run code after all tests in a class have run
        //[ClassCleanup()]
        //public static void MyClassCleanup()
        //{
        //}
        //
        //Use TestInitialize to run code before running each test
        //[TestInitialize()]
        //public void MyTestInitialize()
        //{
        //}
        //
        //Use TestCleanup to run code after each test has run
        //[TestCleanup()]
        //public void MyTestCleanup()
        //{
        //}
        //
        #endregion


        /// <summary>
        ///A test for AddTrips
        ///</summary>
   //     [TestMethod()]
        public void AddTripsTest()
        {
            const int  milageConstant = 37;
            List<Trip> trips = new List<Trip>();

            var target = new TripDataRepository("mongodb://localhost/TripData");
            int milage = 0;

            for (int i = 0; i < 10; i++)
            {
                var trip = new Trip()
                {
                    StartMilage = milage,
                    DateTime = DateTime.Now,
                    DepartureZipCode = "1234 AA",
                    Description = "Woon werkverkeer heenreis",
                    Destination = "Lathmerweg 5, Wilp",
                    DestinationZipCode = "7966 GG",
                    EndMilage = milage   + 37
                };
                trips.Add(trip);

                milage += milageConstant;
            }
            
            target.AddTrips(trips);
        }

       //  [TestMethod()]
        public void DeleteTripsTest()
        {
            var target = new TripDataRepository("mongodb://localhost/TripData");
             target.DeleteTrips();
        }

        private static Car GetCar()
        {
            return new Car()
                       {
                           IsCurrentCar = true,
                           Model = "V60",
                           Make = "Volvo",
                           LicensePlateNumber = "17-PNG-8"
                       };
        }


        private static Driver GetDriver()
        {
            return new Driver()
                       {
                           FirstName = "Henry",
                           LastName = "Cordes",
                           UserName = "HenDaMan",
                           Password = "EncryptedPasswordComesHere",
                           Cars = new List<Car>()
                                      {
                                          GetCar()
                                      }
                       };
        }
    }
}
