'use strict';

console.log("JS loaded!");
$(function () {

  var today = new Date();
  var dateBounds = new Date(new Date(today).setMonth(today.getMonth() + 1));
  var googleMap = googleMap || {};
  var range = new Date(new Date(today).setDate(today.getDate() + 2));

  createMap();
  dateSlider();

  var $mapDiv = $('#map');
  var eventMarkers = [];

  var map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5153, lng: -0.0722 },
    zoom: 12
  });

  function dateSetup(data) {
    var partnerLat = $(this).data('lat');
    var partnerLng = $(this).data('lng');
    var partnerLatLng = {
      lat: partnerLat,
      lng: partnerLng
    };
    createEventRadius(partnerLatLng);
    getEvents(today, range);
    removeCover();
  }

  function createMap() {
    navigator.geolocation.getCurrentPosition(function (position) {
      var latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.panTo(latLng);

      var marker = new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.DROP,
        icon: 'https://lh4.ggpht.com/Tr5sntMif9qOPrKV_UVl7K8A_V3xQDgA7Sw_qweLUFlg76d_vGFA7q1xIKZ6IcmeGqg=w300',
        map: map
      });
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
      url: '/events',
      data: {
        latitude: 51.5153,
        longitude: -0.0722,
        radius: 5,
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

  var $main = $('main');
  var $loginForm = $('nav');
  $main.on('submit', 'form', handleForm);
  $loginForm.on('submit', 'form', handleForm);
  $main.on('click', 'button.delete', deleteUser);
  $main.on('click', 'button.edit', getUser);
  $main.on('click', 'button.dateButton', dateSetup);
  $('.usersIndex').on('click', getUsers);
  $('.logout').on('click', logout);

  // function isLoggedIn() {
  //   return !!localStorage.getItem('token');
  // }
  //
  // if(isLoggedIn()) {
  //   getUsers();
  // } else {
  //   showLoginForm();
  // }

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
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (data) {
      if (data.token) localStorage.setItem('token', data.token);
      getUsers();
    }).fail(showLoginForm);
  }

  function getUsers() {
    if (event) event.preventDefault();
    var token = localStorage.getItem('token');
    $.ajax({
      url: '/users',
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(showUsers).fail(showLoginForm);
  }

  function showUsers(users) {
    var $row = $('<div class="row"></div>');
    users.forEach(function (user) {
      $row.append('\n        <div class="col-md-4">\n          <div class="card">\n            <img class="card-img-top" src="' + user.profilePic + '" alt="Card image cap">\n            <div class="card-block">\n              <h4 class="card-title">' + user.firstName + '</h4>\n            </div>\n          </div>\n          <!-- <button class="danger delete" data-id="' + user._id + '">Delete</button> -->\n          <button class="edit" data-id="' + user._id + '">Edit</button>\n          <button class="dateButton" data-id="' + user._id + '" data-lat="' + user.lat + '" data-lng="' + user.lng + '">Date</button>\n        </div>\n        ');
    });
    $main.html($row);
  }

  function getUser() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');
    $.ajax({
      url: '/users/' + id,
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(showEditForm).fail(showLoginForm);
  }

  function showEditForm(user) {
    if (event) event.preventDefault();
    console.log(user);
    $main.html('\n      <h2>Edit User</h2>\n      <form method="put" action="/users/' + user._id + '">\n      <div class="form-group">\n      <input class="form-control" name="firstName" placeholder="Firstname" value="' + user.firstName + '">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="lastName" placeholder="Last Name" value="' + user.lastName + '">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="email" placeholder="Email" value="' + user.email + '">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="age" placeholder="Age e.g 21" value="' + user.age + '">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="gender" placeholder="Male or Female?" value="' + user.gender + '">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="interestedIn" placeholder="Men, Women, or Both?" value="' + user.interestedIn + '">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="postcode" placeholder="Postcode" value="' + user.postcode + '">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="fact" placeholder="Tell us a quick fact about yourself!" value="' + user.fact + '">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="profilePic" placeholder="Image Url" value="' + user.profilePic + '">\n      </div>\n      <button class="btn btn-primary">Update</button>\n      </form>\n      ');
  }

  function deleteUser() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');
    $.ajax({
      url: '/users/' + id,
      method: "DELETE",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(getUsers).fail(showLoginForm);
  }

  // logs user out by removing local token
  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
  }

  function createEventRadius(partnerLatLng) {
    console.log(partnerLatLng);
    google.maps.Circle.prototype.contains = function (latLng) {
      return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
    };
    var bounds = new google.maps.LatLngBounds();
    // markers should be an array our dater's locations
    var markers = [];
    // console.log(loctn);
    // set 1st dater location to geolocation pushed to markers array

    // sets bounds using markers array. currently two, but would be possible to use any number

    // finds the middle of the points from the markers array

    // function createDate() {
    navigator.geolocation.getCurrentPosition(function (position) {
      var loctn = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // console.log(loctn);
      // set 1st dater location to geolocation pushed to markers array
      markers.push(new google.maps.Marker({
        map: map,
        position: loctn,
        // position: { lat: 51.55, lng: -0.078 }

        icon: 'images/pinklocationicon.png'
      }));
      // preset 2nd dater location pushed to markers array
      markers.push(new google.maps.Marker({
        map: map,
        position: partnerLatLng
      }));
      // sets bounds using markers array. currently two, but would be possible to use any number
      markers.forEach(function (marker) {
        bounds.extend(marker.getPosition());
      });

      var centerOfBounds = bounds.getCenter();
      console.log("centerOfBounds", centerOfBounds);

      // adds a marker at the centerOfBounds latlng uses drop animation to indicate this
      // new google.maps.Marker({
      //   map: map,
      //   position: centerOfBounds,
      //   animation: google.maps.Animation.DROP
      // });

      var circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: centerOfBounds,
        radius: 1000
      });
      // recenters map on centerOfBounds/date location
      map.panTo(centerOfBounds);
      // circle.contains(markers[1].getPosition()); this returns true of false based on whether this marker falls with the radius for the circle. If we apply this to the events with a forEach we will be able to define which events show on map.
      console.log(circle.contains(markers[1].getPosition()));
      console.log(markers);
    });
  }

  googleMap.addInfoWindowForEvent = function (event, marker) {
    var _this = this;

    google.maps.event.addListener(marker, "click", function () {
      if (_this.infowindow) {
        _this.infowindow.close();
      }
      _this.infowindow = new google.maps.InfoWindow({
        content: '\n        <img src=' + event.largeimageurl + '>\n        <h2>' + event.description + '</h2></br>\n        <h2>' + event.venue.name + '</h2></br>\n        <h4>' + event.date + '</h4>\n        <p>' + event.venue.address + '</p>\n        <p>' + event.venue.town + '</p>\n        <p>' + event.venue.postcode + '</p>\n        <p>' + event.venue.phone + '</p>\n        <button><a href=' + event.link + ' target="_blank">Get Tickets</a></button>\n        <p>' + event.entryprice + '</p>\n      '
      });
      _this.infowindow.open(_this.map, marker);
    });
  };
});