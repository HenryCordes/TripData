using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using HC.TripData.Domain;
using HC.TripData.Repository.Interfaces;

namespace HC.TripData.Web.Controllers
{
    public class TripController : Controller
    {

        private ITripDataRepository _tripRepository;

        public TripController(ITripDataRepository tripRepository)
        {
            _tripRepository = tripRepository;
        }
        //
        // GET: /Trip/

        public ActionResult Index()
        {
            return View();
        }

        ////
        //// GET: /Trip/Details/5

        //public ActionResult Details(int id)
        //{
        //    return View();
        //}

        //
        // GET: /Trip/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Trip/Create

        [HttpPost]
        public ActionResult Create(Trip trip)
        {
            try
            {
                
                _tripRepository.AddTrips(new List<Trip>(){trip});
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        ////
        //// GET: /Trip/Edit/5

        //public ActionResult Edit(int id)
        //{
        //    return View();
        //}

        ////
        //// POST: /Trip/Edit/5

        //[HttpPost]
        //public ActionResult Edit(int id, FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add update logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}

        ////
        //// GET: /Trip/Delete/5

        //public ActionResult Delete(int id)
        //{
        //    return View();
        //}

        ////
        //// POST: /Trip/Delete/5

        //[HttpPost]
        //public ActionResult Delete(int id, FormCollection collection)
        //{
        //    try
        //    {
        //        // TODO: Add delete logic here

        //        return RedirectToAction("Index");
        //    }
        //    catch
        //    {
        //        return View();
        //    }
        //}
    }
}
