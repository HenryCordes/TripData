using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HC.TripData.Web.Controllers
{
    public class TripController : Controller
    {
        //
        // GET: /Trip/

        public ActionResult Index()
        {
            return View();
        }

    }
}
