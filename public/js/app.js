'use strict';

console.log("JS loaded!");
$(function () {

  var today = new Date();
  var dateBounds = new Date(new Date(today).setMonth(today.getMonth() + 1));
  var range = new Date(new Date(today).setDate(today.getDate() + 7));

  createMap();
  getEvents(today, range);
  dateSlider();

  var $mapDiv = $('#map');
  var eventMarkers = [];

  var map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5153, lng: -0.0722 },
    zoom: 14
  });

  function createMap() {

    navigator.geolocation.getCurrentPosition(function (position) {
      var latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.panTo(latLng);

      var marker = new google.maps.Marker({
        position: latLng,
        // animation: google.maps.Animation.DROP,
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

  function getEvents(min, max) {
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

  function addEventMarkers(events) {
    removeMarkers();
    events.forEach(function (event) {
      var latLng = {
        lat: event.venue.latitude,
        lng: event.venue.longitude
      };
      console.log(event.date);
      var marker = new google.maps.Marker({
        position: latLng,
        // animation: google.maps.Animation.DROP,
        map: map
      });
      eventMarkers.push(marker);
    });
  }

  function removeMarkers() {
    for (var i = 0; i < eventMarkers.length; i++) {
      eventMarkers[i].setMap(null);
    }
    eventMarkers = [];
  }

  var $main = $('main');
  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $main.on('submit', 'form', handleForm);
  $main.on('click', 'button.delete', deleteUser);
  $main.on('click', 'button.edit', getUser);
  $('.usersIndex').on('click', getUsers);
  $('.logout').on('click', logout);
  // $('.eventsIndex').on('click', getEvents);

  // function isLoggedIn() {
  //   return !!localStorage.getItem('token');
  // }
  // if(isLoggedIn()) {
  //   getUsers();
  // } else {
  //   showLoginForm();
  // }

  function showRegisterForm() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Register</h2>\n      <form method="post" action="/register">\n      <div class="form-group">\n      <input class="form-control" name="firstName" placeholder="First Name">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="lastName" placeholder="Last Name">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="email" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="age" placeholder="Age e.g 21">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="gender" placeholder="Male or Female?">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="interestedIn" placeholder="Men, Women, or Both?">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="postcode" placeholder="Postcode">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="fact" placeholder="Tell us a quick fact about yourself!">\n      </div>\n      <div class="form-group">\n      <input class="form-control" name="profilePic" placeholder="Upload your image here">\n      </div>\n      <button class="btn btn-primary">Register</button>\n      </form>\n      ');
  }

  function showLoginForm() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Login</h2>\n      <form method="post" action="/login">\n      <div class="form-group">\n      <input class="form-control" name="email" placeholder="Email">\n      </div>\n      <div class="form-group">\n      <input class="form-control" type="password" name="password" placeholder="Password">\n      </div>\n      <button class="btn btn-primary">Log In</button>\n      </form>\n      ');
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
    console.log(users);
    var $row = $('<div class="row"></div>');
    users.forEach(function (user) {
      $row.append('\n        <div class="col-md-4">\n        <div class="card">\n        <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">\n        <div class="card-block">\n        <h4 class="card-title">' + user.firstName + '</h4>\n        </div>\n        </div>\n        <button class="btn btn-danger delete" data-id="' + user._id + '">Delete</button>\n        <button class="btn btn-primary edit" data-id="' + user._id + '">Edit</button>\n        </div>\n        ');
    });
    $main.html($row);
  }

  // google.maps.Circle.prototype.contains = function(latLng) {
  //   return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
  // };
  //
  // let bounds = new google.maps.LatLngBounds();
  // let markers = [];
  //
  // markers.push(new google.maps.Marker({
  //   map: map,
  //   position: { lat: 51.55, lng: -0.078 }
  // }));
  //
  // markers.push(new google.maps.Marker({
  //   map: map,
  //   position: { lat: 51.45, lng: -0.078 }
  // }));
  //
  // markers.forEach((marker) => {
  //   bounds.extend(marker.getPosition());
  // });
  //
  // let centerOfBounds = bounds.getCenter();
  //
  // new google.maps.Marker({
  //   map: map,
  //   position: centerOfBounds,
  //   animation: google.maps.Animation.DROP
  // });
  //
  // let circle = new google.maps.Circle({
  //   strokeColor: '#FF0000',
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   fillColor: '#FF0000',
  //   fillOpacity: 0.35,
  //   map: map,
  //   center: centerOfBounds,
  //   radius: 1000
  // });
  //
  // console.log(circle.contains(markers[1].getPosition()));

  // });

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

  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
  }
});