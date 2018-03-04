var map;
var markers = [];

function initMap() {
  // load map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {lat: 37.548271, lng:-121.988571},
    disableDefaultUI: true
  });
  ko.applyBindings(new neighborhoodAppViewModel());
}




var neighborhoodAppViewModel = function() {

  'use strict';

  var self = this;

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
  self.place = ko.observableArray();
    for(var i = 0; i < self.data.length; i++) {
    self.place.push(self.data[i]);
  }
  self.initMarkers = (function() {
    // Initialize all markers once based on total number of objects in self.place() array
    for(var j = 0; j < self.place().length; j++) {
      var marker = new google.maps.Marker({
        position: {
          lat: self.place()[j].lat,
          lng: self.place()[j].lng
        },
        map: map
      });
      markers.push(marker[j]);
    }
  }());
  self.filterPlaces = function() {
    self.place.removeAll(); // clear ko.observableArray to empty list
    // Declare all necessary vars for filtering list and markers
    var input, target, filter, k, m, name, marker, lat, lng;
        input = document.getElementById('input'); // select input box
        target = document.getElementsByTagName('li'); // select items to be filtered
        filter = input.value.toUpperCase();

    // Filter text list
    for(k = 0; k < self.data.length; k++) {
      name = self.data[k].name.toUpperCase();
      if(name.indexOf(filter) > -1) {
        self.place.push(self.data[k]);


        // Filter markers
        lat = self.data[k].lat;
        lng = self.data[k].lng;
        marker = new google.maps.Marker({
          position: {
            lat: lat,
            lng: lng
          },
          map: map
        });
      }
    }
    return true;
    }
}
