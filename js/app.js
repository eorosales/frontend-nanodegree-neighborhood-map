var map;

function initMap() {
  // load map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 37.5327193, lng: -121.9593492}
  });
  ko.applyBindings(new neighborhoodAppViewModel());
}

var neighborhoodAppViewModel = function() {
  'use strict';
  var self = this;
  var data = [
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
  self.markers = ko.observableArray();

  // Push each object from data into a ko.observableArray()
  for(var i = 0; i < data.length; i++) {
    self.place.push(data[i]);
  }

  for(var j = 0; j < self.place().length; j++) {
    // Create markers based on number of objects in self.place() array
    var markers = new google.maps.Marker({
      position: {
        lat: self.place()[j].lat,
        lng: self.place()[j].lng
      },
      map: map
    });
  }
}
