var map;
var markers = [];
var infowindow;
var infowindowData;

function initMap() {
  // load map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12.75,
    center: {lat: 37.548271, lng:-121.988571},
    disableDefaultUI: true
  });
  ko.applyBindings(new neighborhoodAppViewModel());
}

function neighborhoodAppViewModel() {
  "use strict";

  var self = this;
  var marker;
  var Place = (function(name, lat, lng, id) {
    this.name = name,
    this.lat = lat,
    this.lng = lng,
    this.id = id;
  });
  var placeList = [];
  var pushMarkersObservableArr;
  infowindow = new google.maps.InfoWindow();

  self.data = [
    {
      "name": "Devout Coffee",
      "lat": 37.577225,
      "lng": -121.980728,
      "id": "529a682e11d251a74918e082"
    },
    {
      "name": "Slapface Coffee",
      "lat": 37.5584073,
      "lng": -122.0068662,
      "id": "56ccd05a498eb21aed240776"
    },
    {
      "name": "Mission Coffee",
      "lat": 37.53353329999999,
      "lng": -121.9208885,
      "id": "4a66da25f964a520d7c81fe3"
    },
    {
      "name": "Suju's Coffee and Tea",
      "lat": 37.529927,
      "lng": -121.9830347,
      "id": "4b689012f964a52019802be3"
    },
    {
      "name": "Bean Scene Cafe",
      "lat": 37.5327193,
      "lng": -121.9593492,
      "id": "4f4c45d9e4b0c132f4f15726"
    }
  ]
  self.placeList = (function() {
    for(var i = 0; i < self.data.length; i++) {
      var places = new Place(self.data[i].name, self.data[i].lat, self.data[i].lng, self.data[i].id);
      placeList.push(places);
    }
  }());
  marker = (function() {
    var lat, lng;
    for(var j = 0; j < placeList.length; j++) {
      marker = new google.maps.Marker({
        position: {
          lat: placeList[j].lat,
          lng: placeList[j].lng},
        title: placeList[j].name,
        animation: null,
        id: placeList[j].id
      })
      marker.setMap(map);
      // Push marker into array of markers
      markers.push(marker);
      marker.addListener('click', function() {
        infowindow.setContent(null);
        self.infowindowData(this, infowindow, this.title);
      })
    }
  }());
  self.markersObservableArr = ko.observableArray();
  pushMarkersObservableArr = (function() {
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
  self.infowindowData = function (marker, infowindow, name) {
    // Ajax request to Foursquare
    var xhr = $.ajax({
      method: 'GET',
      url: "https://api.foursquar.com/v2/venues/search?near=Fremont,CA",
      dataType: 'json',
      data: '&client_id=NEUORKAG245XLYEPTJRLI31AE4UJH0BRUKA3FZJFJOPVHGMW' +
            '&client_secret=Q5AUJAPD2OOZO3EXLWPOTQPZVUX4ML3G15JQYLHSQUO24K15' +
            '&query=' + name +
            '&v=20180609' +
            '&limit=1',
      async: true
      })
      // When AJAX request is succesful, populate infowindow with associated
      // place information provided by Foursquare API
      .done(function() {
        var info = JSON.parse(xhr.responseText).response.venues[0];
        var infoName = info.name;
        var infoCategory = info.categories[0].name;
        var infoAddress = info.location.formattedAddress[0] + '<br>' + info.location.formattedAddress[1] + '<br>' + info.location.formattedAddress[2];
        infowindow.setContent('<h3>' + infoName + '</h3> <div>' + infoAddress + '</div><p><i>Category: ' + infoCategory + '</i></p>');
        infowindow.open(map, marker);
      })
      // If AJAX request fails, notify the user of the error and what to do
      .fail(function() {
        infowindow.setContent('<h1>Do\'\h!</h1> There was an error in communicating with Fourquare.<br>Please contact site admin to resolve issue.');
      })
    // Enable BOUNCE animation if marker is clicked or
    // associated list item is clicked
    for(var j = 0; j < markers.length; j++) {
      if(markers[j].getAnimation() !== null) {
        markers[j].setAnimation(null);
      }
    }
    marker.setAnimation((google.maps.Animation.BOUNCE));
    // Check to see if associated marker has infowindow open
    if(infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.open(map, marker);
      // Close infowindow by clicking 'x'
      infowindow.addListener('closeclick', function() {
        infowindow.close();
        marker.setAnimation(null);
      })
    }
  }
  self.listItemClick = function() {
    // When a list item is clicked in the view,
    // it's associated marker will populate an attached infowindow
    var listItem = this.name;
    for(var i = 0; i < markers.length; i++) {
      if(listItem == markers[i].title) {
        self.infowindowData(markers[i], infowindow, markers[i].title);
      }
    }
  }
}
