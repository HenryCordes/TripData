
var TripData = Em.Application.create();


Trip = Ember.Object.extend({
    startMilage: 0,
    endMilage: 0,
    dateTime: null,
    placeOfDeparture: "",
    deparetureZipCode: "",
    destination: "",
    destinationZipCode: "",
    description: "",
    tripType: "",
    driverId: "",
    carId: ""
});


Car = Ember.Object.extend({
    licensePlateNumber: null,
    make: null,
    model: null,
    isCurrentCar: false
});

var volvo = Car.create({
    licensePlateNumber: "18-PNG-7",
    make: "Volvo",
    model: "V60",
    isCurrentCar: true
});
var skoda = Car.create({
    licensePlateNumber: "33-JI-89",
    make: "Skoda",
    model: "Octavia",
    isCurrentCar: false
});

var cars = [
    volvo,
    skoda
];

TripData.driver = Ember.Object.create({
    lastName: "Cordes",
    firstName: "Henry",
    emailAddress: "j.meloen@gmail.com",
    password: "",
    cars: cars,

    fullName: function () {
        return this.get('firstName') + ' ' + this.get('lastName');
    } .property('firstName', 'lastName')

});



TripData.TripView = Em.View.extend({
    onLoad: function () {
        
    },
    mouseDown: function () {
        window.alert("trips view!");
    }
});

TripData.tripsController = Em.ArrayProxy.create({
  trips: [],

  loadTrips: function(driverId) {
    var that = this;
   
    $.ajax({
      url: '/driver/'+ driverId +'/trips',
      dataType: 'json',
      data: data,
      success: function(data) {
                  alert(data);
              }
    });
      
  }
});
