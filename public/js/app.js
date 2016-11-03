"use strict";

console.log("JS loaded!");
$(function () {

  var today = new Date();
  var dateBounds = new Date(new Date(today).setMonth(today.getMonth() + 1));
  var googleMap = googleMap || {};
  var range = new Date(new Date(today).setDate(today.getDate() + 2));
  var $main = $('main');
  var $sidebar = $(".sidebar");
  var $loginForm = $('nav');
  $main.on('submit', 'form', handleForm);
  $sidebar.on('submit', 'form', handleForm);
  $loginForm.on('submit', 'form', handleForm);
  $sidebar.on('click', 'button.delete', deleteUser);
  $sidebar.on('click', 'button.edit', getUser);
  $sidebar.on('click', 'button.dateButton', dateSetup);
  $('.usersIndex').on('click', getUsers);
  $('.logOut').on('click', logout);
  $('.datePic').on('click', selectNewDate);
  var markers = [];
  var circle = [];

  var eventCircle = {
    lat: undefined,
    lng: undefined
  };

  createMap();
  dateSlider();

  var $mapDiv = $('#map');
  var eventMarkers = [];

  var map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5153, lng: -0.0722 },
    zoom: 12,
    styles: [{
      "elementType": "geometry",
      "stylers": [{
        "color": "#f5f5f5"
      }]
    }, {
      "elementType": "labels.icon",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#616161"
      }]
    }, {
      "elementType": "labels.text.stroke",
      "stylers": [{
        "color": "#f5f5f5"
      }]
    }, {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#bdbdbd"
      }]
    }, {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [{
        "color": "#eeeeee"
      }]
    }, {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#757575"
      }]
    }, {
      "featureType": "poi.business",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{
        "color": "#e5e5e5"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#9e9e9e"
      }]
    }, {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{
        "color": "#ffffff"
      }]
    }, {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#757575"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{
        "color": "#dadada"
      }]
    }, {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#616161"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [{
        "visibility": "off"
      }]
    }, {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#9e9e9e"
      }]
    }, {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [{
        "color": "#e5e5e5"
      }]
    }, {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [{
        "color": "#eeeeee"
      }]
    }, {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{
        "color": "#c9c9c9"
      }]
    }, {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{
        "color": "#9e9e9e"
      }]
    }]
  });

  function dateSetup(data) {
    var partnerLat = $(this).data('lat');
    var partnerLng = $(this).data('lng');
    var partnerLatLng = {
      lat: partnerLat,
      lng: partnerLng
    };
    var partnerImg = $(this).data('img');
    createEventRadius(partnerLatLng);
    setDatePic(partnerImg);
    removeCover();
    $('.sidebar').hide();
  }

  function setDatePic(partnerImg) {
    $('.datePic').show();
    $('.datePic').css('background-image', 'url(' + partnerImg + ')');
    $('.datePic').css('border', '2px solid grey');
  }

  function createMap() {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.panTo(latLng);
    });
  }

  function dateSlider() {
    $("#slider").dateRangeSlider({
      bounds: {
        min: today,
        max: dateBounds
      },
      defaultValues: {
        min: today,
        max: range
      }
    });

    $("#slider").bind("userValuesChanged", function (e, data) {
      // get new events from API
      var min = data.values.min;
      var max = data.values.max;

      getEvents(min, max);
    });
  }

  function removeMarkers() {
    for (var i = 0; i < eventMarkers.length; i++) {
      eventMarkers[i].setMap(null);
    }
    eventMarkers = [];
  }

  function getEvents(min, max) {
    removeMarkers();
    var minDate = min.toISOString().split('T')[0];
    var maxDate = max.toISOString().split('T')[0];

    console.log('getting events');
    $.ajax({
      url: "/events",
      data: {
        latitude: eventCircle.lat,
        longitude: eventCircle.lng,
        radius: 1,
        limit: 100,
        minDate: minDate,
        maxDate: maxDate
      },
      method: "GET"
    }).done(function (data) {
      console.log(data);
      addEventMarkers(data);
    }).fail(function () {
      console.log('Skiddle call failed, arguments:', arguments);
    });
  }

  // setTimeout(function dropMarker(){
  //   let marker = new google.maps.Marker({
  //     position: latLng,
  //     animation: google.maps.Animation.DROP,
  //     map
  //   });
  // }, 60 * index);

  function addEventMarkers(events) {
    events.forEach(function (event, index) {
      var latLng = {
        lat: event.venue.latitude,
        lng: event.venue.longitude
      };
      var marker = new google.maps.Marker({
        position: latLng,
        // animation: google.maps.Animation.DROP,
        map: map
      });
      googleMap.addInfoWindowForEvent(event, marker);
      eventMarkers.push(marker);
    });
  }

  $('.mapCover').on('click', removeCover);
  function removeCover() {
    $('.mapCover').hide();
    $('.mainBox').hide();
  }

  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  if (isLoggedIn()) {
    getUsers();
    toggleNav();
  } else {
    // showLoginForm();
  }

  function showLoginForm() {
    if (event) event.preventDefault();
  }

  function handleForm() {
    if (event) event.preventDefault();
    var token = localStorage.getItem('token');
    var $form = $(this);
    var url = $form.attr('action');
    var method = $form.attr('method');
    var data = $form.serialize();
    $.ajax({
      url: url,
      method: method,
      data: data,
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
      }
    }).done(function (data) {
      if (data.token) localStorage.setItem('token', data.token);
      if (data.user) localStorage.setItem('userId', data.user._id);
      getUsers();
      if (url === "/login" || url === "/register") {
        toggleNav();
      }
    }).fail(showLoginForm);
  }

  function toggleNav() {
    $('.logOut').toggle();
    $('.logIn').toggle();
  }

  function getUsers() {
    if (event) event.preventDefault();
    var token = localStorage.getItem('token');
    $.ajax({
      url: "/users",
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
      }
    }).done(showUsers).fail(showLoginForm);
  }

  function showUsers(users) {
    removeCover();
    var loggedInUserId = localStorage.getItem('userId');

    var $row = $('<div class="row"></div>');
    users.forEach(function (user) {

      if (user._id !== loggedInUserId) {
        $row.append("\n          <div class=\"user-profile\">\n          <img class=\"card-img-top\" src=\"" + user.profilePic + "\" alt=\"Card image cap\"></br>\n          <h2 class=\"card-title\">" + user.firstName + "</h2></br>\n          <h4 class=\"card-title\">" + user.gender + "</h4></br>\n          <h2 class=\"card-title\">" + user.age + "</h2></br>\n          <h4 class=\"card-title\">Fun Fact: " + user.fact + "</h4></br>\n          <h4 class=\"card-title\">Interested In: " + user.interestedIn + "</h4></br>\n          <button class=\"dateButton\" data-id=\"" + user._id + "\" data-img=\"" + user.profilePic + "\" data-lat=\"" + user.lat + "\" data-lng=\"" + user.lng + "\">Date</button>\n          </div>\n          ");
      } else {
        $row.prepend("\n          <div class=\"user-profile user\">\n          <img class=\"card-img-top\" src=\"" + user.profilePic + "\" alt=\"Card image cap\">\n          <h2 class=\"card-title\">" + user.firstName + "</h2>\n          <button class=\"delete\" data-id=\"" + user._id + "\">Delete</button>\n          <button class=\"edit\" data-id=\"" + user._id + "\">Edit</button>\n          </div>\n          ");
      }
    });
    $(".sidebar").html($row);
  }

  function selectNewDate() {
    $('.sidebar').toggle();
    $('.datePic').hide();
    dateReset();
  }

  function dateReset() {
    removeMarkers();
    console.log(markers);
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
    circle[0].setMap(null);
    circle = [];
  }

  function getUser() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');
    $.ajax({
      url: "/users/" + id,
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
      }
    }).done(showEditForm).fail(showLoginForm);
  }

  function showEditForm(user) {
    if (event) event.preventDefault();
    console.log(user);
    $sidebar.html("\n      <h2>Edit Profile</h2>\n      <form method=\"put\" action=\"/users/" + user._id + "\">\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"firstName\" placeholder=\"Firstname\" value=\"" + user.firstName + "\">\n      </div>\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"lastName\" placeholder=\"Last Name\" value=\"" + user.lastName + "\">\n      </div>\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"email\" placeholder=\"Email\" value=\"" + user.email + "\">\n      </div>\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"age\" placeholder=\"Age e.g 21\" value=\"" + user.age + "\">\n      </div>\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"gender\" placeholder=\"Male or Female?\" value=\"" + user.gender + "\">\n      </div>\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"interestedIn\" placeholder=\"Men, Women, or Both?\" value=\"" + user.interestedIn + "\">\n      </div>\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"postcode\" placeholder=\"Postcode\" value=\"" + user.postcode + "\">\n      </div>\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"fact\" placeholder=\"Tell us a quick fact about yourself!\" value=\"" + user.fact + "\">\n      </div>\n      <div class=\"form-group\">\n      <input class=\"form-control\" name=\"profilePic\" placeholder=\"Image Url\" value=\"" + user.profilePic + "\">\n      </div>\n      <button class=\"btn btn-primary\">Update</button>\n      </form>\n      ");
  }

  function deleteUser() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');
    $.ajax({
      url: "/users/" + id,
      method: "DELETE",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
      }
    }).done(getUsers).fail(showLoginForm);
  }

  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    location.reload();
  }

  function createEventRadius(partnerLatLng) {
    console.log(partnerLatLng);
    google.maps.Circle.prototype.contains = function (latLng) {
      return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
    };
    var bounds = new google.maps.LatLngBounds();
    navigator.geolocation.getCurrentPosition(function (position) {
      var loctn = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      markers.push(new google.maps.Marker({
        map: map,
        position: loctn,
        icon: '../images/tflmarker.png'

      }));
      markers.push(new google.maps.Marker({
        map: map,
        position: partnerLatLng,
        icon: '../images/tflmarker.png'

      }));
      markers.forEach(function (marker) {
        bounds.extend(marker.getPosition());
      });
      var centerOfBounds = bounds.getCenter();
      // console.log("centerOfBounds", centerOfBounds);
      // console.log(this.getCenter());

      circle.push(new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.65,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.1,
        map: map,
        center: centerOfBounds,
        radius: 1950
      }));

      map.panTo(centerOfBounds);

      console.log(today);
      console.log(range);
      eventCircle.lat = centerOfBounds.lat();
      eventCircle.lng = centerOfBounds.lng();
      getEvents(today, range);
    });
  }

  googleMap.addInfoWindowForEvent = function (event, marker) {
    var _this = this;

    google.maps.event.addListener(marker, "click", function () {
      if (_this.infowindow) {
        _this.infowindow.close();
      }
      _this.infowindow = new google.maps.InfoWindow({
        content: "\n        <img src=" + event.largeimageurl + " onerror=\"this.src='../images/noimage.jpg'\">\n        <h2>" + event.eventname + "</h2><br>\n        <h2>" + event.description + "</h2></br>\n        <h2>" + event.venue.name + "</h2></br>\n        <h4>" + event.date + "</h4>\n        <p>" + event.venue.address + "</p>\n        <p>" + event.venue.town + "</p>\n        <p>" + event.venue.postcode + "</p>\n        <p>" + event.venue.phone + "</p>\n        <button><a href=" + event.link + " target=\"_blank\">Get Tickets</a></button>\n        <p>" + event.entryprice + "</p>\n      "
      });
      _this.infowindow.open(_this.map, marker);
    });
  };
});