var map, marker;
var markers = [];
var placeList = [];

function initMap() {
  // load map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: {lat: 37.548271, lng:-121.988571},
    disableDefaultUI: true
  });
  ko.applyBindings(new neighborhoodAppViewModel());
}

function neighborhoodAppViewModel() {
  "use strict";

  var self = this;
  var infowindow = new google.maps.InfoWindow();

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
  self.Place = (function(name, lat, lng, id) {
    this.name = name,
    this.lat = lat,
    this.lng = lng,
    this.id = id;
  });
  self.placeList = (function() {
    for(var i = 0; i < self.data.length; i++) {
      var places = new self.Place(self.data[i].name, self.data[i].lat, self.data[i].lng, self.data[i].id);
      placeList.push(places);
    }
  }());
  self.marker = (function() {
    var lat, lng, pos;
    // var bounds = new google.maps.LatLngBounds();
    for(var j = 0; j < placeList.length; j++) {
      lat = placeList[j].lat;
      lng = placeList[j].lng;
      pos = {lat, lng};
      marker = new google.maps.Marker({
        position: pos,
        title: placeList[j].name,
        id: placeList[j].id
      })
      marker.setMap(map);
      // Push marker into array of markers
      markers.push(marker);
      // bounds.extend(marker.position);
      marker.addListener('click', function() {
        self.infowindowData(this, infowindow);
      })
    }
    // map.fitBounds(bounds);
  }());
  self.markersObservableArr = ko.observableArray();
  self.pushMarkersObservableArr = (function() {
    for(var i = 0; i < self.data.length; i++) {
      self.markersObservableArr.push(self.data[i]);
    }
  }())
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
  self.infowindowData = function (marker, infowindow) {
    // Ajax request to Foursquare
    var foursquare = $.ajax({
      method: 'GET',
      url: "https://api.foursquare.com/v2/venues/search?",
      dataType: 'json',
      data: 'client_id=NEUORKAG245XLYEPTJRLI31AE4UJH0BRUKA3FZJFJOPVHGMW' +
            '&client_secret=Q5AUJAPD2OOZO3EXLWPOTQPZVUX4ML3G15JQYLHSQUO24K15' +
            '&near=Fremont,CA' +
            '&v=20180609' +
            '&limit=1'
    })
    // Check to see if associated marker has infowindow open
    if(infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div>' + marker.title + '</div>');
      infowindow.open(map, marker);
      // Clear property marker
      infowindow.addListener('closeclick', function() {
        infowindow.setMarker(null);
      })
    }
  }
}
