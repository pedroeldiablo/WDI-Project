'use strict';

console.log("JS loaded!");

$(function () {
  var $mapDiv = $('#map');
  console.log($mapDiv);

  var map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5153, lng: -0.0722 },
    zoom: 16
  });

  navigator.geolocation.getCurrentPosition(function (position) {
    var latLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    map.panTo(latLng);

    var marker = new google.maps.Marker({
      position: latLng,
      animation: google.maps.Animation.BOUNCE,
      draggable: true,
      map: map
    });
  });

  var $main = $('main');
  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $main.on('submit', 'form', handleForm);
  $main.on('click', 'button.delete', deleteUser);
  $main.on('click', 'button.edit', getUser);
  $('.usersIndex').on('click', getUsers);
  $('.logout').on('click', logout);
  $('.eventsIndex').on('click', getEvents);
  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  if (isLoggedIn()) {
    getUsers();
  } else {
    showLoginForm();
  }
  function showRegisterForm() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Register</h2>\n      <form method="post" action="/register">\n        <div class="form-group">\n          <input class="form-control" name="username" placeholder="Username">\n        </div>\n        <div class="form-group">\n          <input class="form-control" name="email" placeholder="Email">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="password" name="password" placeholder="Password">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">\n        </div>\n        <button class="btn btn-primary">Register</button>\n      </form>\n    ');
  }
  function showLoginForm() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Login</h2>\n      <form method="post" action="/login">\n        <div class="form-group">\n          <input class="form-control" name="email" placeholder="Email">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="password" name="password" placeholder="Password">\n        </div>\n        <button class="btn btn-primary">Register</button>\n      </form>\n    ');
  }
  function showEditForm(user) {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Edit User</h2>\n      <form method="put" action="/users/' + user._id + '">\n        <div class="form-group">\n          <input class="form-control" name="username" placeholder="Username" value="' + user.username + '">\n        </div>\n        <button class="btn btn-primary">Update</button>\n      </form>\n    ');
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

  function getEvents() {
    if (event) event.preventDefault();
    var token = localStorage.getItem('token');
    $.ajax({
      url: '/events',
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(showEvents).fail(showLoginForm);
  }

  function showUsers(users) {
    console.log(users);
    var $row = $('<div class="row"></div>');
    users.forEach(function (user) {
      $row.append('\n        <div class="col-md-4">\n          <div class="card">\n            <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">\n            <div class="card-block">\n              <h4 class="card-title">' + user.username + '</h4>\n            </div>\n          </div>\n          <button class="btn btn-danger delete" data-id="' + user._id + '">Delete</button>\n          <button class="btn btn-primary edit" data-id="' + user._id + '">Edit</button>\n        </div>\n      ');
    });
    $main.html($row);
  }

  function showEvents(events) {
    console.log(events);
    var $row = $('<div class="row"></div>');
    events.forEach(function (event) {
      $row.append('\n        <div class="col-md-4">\n          <div class="card">\n            <img class="card-img-top" src="' + shark.image + '" alt="Card image cap">\n            <div class="card-block">\n              <h4 class="card-title">' + shark.species + '</h4>\n            </div>\n            <div class="card-block">\n              <h4 class="card-title">' + shark.maxLength + ' feet</h4>\n            </div>\n          </div>\n          <button class="btn btn-danger delete" data-id="' + shark._id + '">Delete</button>\n          <button class="btn btn-primary edit" data-id="' + shark._id + '">Edit</button>\n        </div>\n      ');
    });
    $main.html($row);
  }
  showEvents();

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
  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
  }
});