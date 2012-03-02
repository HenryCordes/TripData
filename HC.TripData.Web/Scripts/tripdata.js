var TripData = Em.Application.create();

TripData.TripView = Em.View.extend({
    mouseDown: function () {
        window.alert("trips view!");
    }
});

TripData.trip = Ember.Object.create({
    startMilage: 0,
    endMilage: 0,
    dateTime: null ,
    placeOfDeparture:"",
    deparetureZipCode: "",
    destination: "",
    destinationZipCode:"",
    description:"",
    tripType: "",
    driverId:"",
    carId:""
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
    userName: "HenDaMan",
    password: "",
    cars: cars,

    fullName: function() {
        return this.get('firstName') + ' ' + this.get('lastName');
    } .property('firstName', 'lastName')
    
});

TripData.car = Ember.Object.create({
    licensePlateNumber: "18-PNG-7",
    make: "Volvo",
    model: "V60",
    isCurrentcar: true
});
