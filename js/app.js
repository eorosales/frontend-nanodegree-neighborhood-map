var map;
var marker;
var markers = [];

function initMap() {
  // load map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: {lat: 37.548271, lng:-121.988571},
    disableDefaultUI: true
  });
  ko.applyBindings(new neighborhoodAppViewModel());
}

var neighborhoodAppViewModel = function() {

  "use strict";

  var self = this;
  var infowindow = new google.maps.InfoWindow({
    content: 'test success'
  });

  self.data = [
    {
      "name": "Devout Coffee",
      "lat": 37.577225,
      "lng": -121.980728,
      "id": "ChIJBUN0jW3Aj4ARiUk9mQkTgQ8"
    },
    {
      "name": "Slapface Coffee",
      "lat": 37.5584073,
      "lng": -122.0068662,
      "id": "ChIJk_RMgJy_j4ARU6hT5aaVlJM"
    },
    {
      "name": "Mission Coffee",
      "lat": 37.53353329999999,
      "lng": -121.9208885,
      "id": "ChIJWWCfGrfGj4AR6Hlr8U5ePfE"
    },
    {
      "name": "Suju's Coffee and Tea",
      "lat": 37.529927,
      "lng": -121.9830347,
      "id": "ChIJIRdYs6_Aj4ARQhW4gPZB_lI"
    },
    {
      "name": "Bean Scene Cafe",
      "lat": 37.5327193,
      "lng": -121.9593492,
      "id": "ChIJJQ32j83Aj4ARvHLRh6S4xhc"
    }
  ]
  // Populate markers array on load
  self.fillMarkersArr = (function() {
    var lat, lng;
    for(var i = 0; i < self.data.length; i++) {
      lat = self.data[i].lat;
      lng = self.data[i].lng;
      marker = new google.maps.Marker({
        position: {lat, lng},
        animation: google.maps.Animation.DROP // Set drop animation for markers on load
      });
    marker.addListener('click', function() {
      infowindow.open(map, this);
    })
    marker.setMap(map);
    markers.push(marker);
    }
  }());
  // Populate markers array as a ko.observableArray
  self.markersObservableArr = ko.observableArray();
  // Populate self.markersObservableArr with data objects for each place
  for(var i = 0; i < self.data.length; i++) {
    self.markersObservableArr.push(self.data[i]);
  }
  // Dynamically filter list of place names and
  // their associated markers based on user's input
  self.filterPlaces = function() {
    self.markersObservableArr.removeAll(); // Clears list of names in VIEW
    // Declare all necessary vars for filtering list and markers
    var input, filter, name;
        input = document.getElementById("input"); // select input box
        filter = input.value.toUpperCase(); // grab value of input

    // Filter list of place names and markers dynamically based on user's text input
    for(var j = 0; j < self.data.length; j++) {
      markers[j].setMap(null); // Remove all visible markers on map
      name = self.data[j].name.toUpperCase();
      if(name.indexOf(filter) > -1) {
        // Push objects with matching "name" properties as objects into observableArray
        self.markersObservableArr.push(self.data[j]);
        markers[j].setMap(map);
      }
    }
    // Filter markers depending on list of place names
    return true;
    }
}
