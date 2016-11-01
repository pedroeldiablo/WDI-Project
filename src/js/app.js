console.log("JS loaded!");
$(() => {

  createMap();
  getEvents();

  let $mapDiv =$('#map');

  let map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5153, lng: -0.0722 },
    zoom: 14
  });

  function createMap() {

    navigator.geolocation.getCurrentPosition(function(position) {
      let latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map.panTo(latLng);

      let marker = new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.DROP,
        icon: 'https://lh4.ggpht.com/Tr5sntMif9qOPrKV_UVl7K8A_V3xQDgA7Sw_qweLUFlg76d_vGFA7q1xIKZ6IcmeGqg=w300',
        map
      });
    });
  }

  function getEvents() {
    console.log('getting events');
    $.ajax({
      url: `/events`,
      data: {
        latitude: 51.5153,
        longitude: -0.0722,
        radius: 5,
        limit: 100,
        date: "2016-11-3",
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
    events.forEach((event) => {
      let latLng =  {
        lat: event.venue.latitude,
        lng: event.venue.longitude
      };
      console.log(event.date);
      let marker = new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.DROP,
        map
      });
    });
  }

  let $main = $('main');
  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $main.on('submit', 'form', handleForm);
  $main.on('click', 'button.delete', deleteUser);
  $main.on('click', 'button.edit', getUser);
  $('.usersIndex').on('click', getUsers);
  $('.logout').on('click', logout);
  $('.eventsIndex').on('click', getEvents);

  // function isLoggedIn() {
  //   return !!localStorage.getItem('token');
  // }
  // if(isLoggedIn()) {
  //   getUsers();
  // } else {
  //   showLoginForm();
  // }

  function showRegisterForm() {
    if(event) event.preventDefault();
    $main.html(`
      <h2>Register</h2>
      <form method="post" action="/register">
      <div class="form-group">
      <input class="form-control" name="firstName" placeholder="First Name">
      </div>
      <div class="form-group">
      <input class="form-control" name="lastName" placeholder="Last Name">
      </div>
      <div class="form-group">
      <input class="form-control" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" name="age" placeholder="Age e.g 21">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">
      </div>
      <div class="form-group">
      <input class="form-control" name="gender" placeholder="Male or Female?">
      </div>
      <div class="form-group">
      <input class="form-control" name="interestedIn" placeholder="Men, Women, or Both?">
      </div>
      <div class="form-group">
      <input class="form-control" name="postcode" placeholder="Postcode">
      </div>
      <div class="form-group">
      <input class="form-control" name="fact" placeholder="Tell us a quick fact about yourself!">
      </div>
      <div class="form-group">
      <input class="form-control" name="profilePic" placeholder="Upload your image here">
      </div>
      <button class="btn btn-primary">Register</button>
      </form>
      `);
  }

  function showLoginForm() {
    if(event) event.preventDefault();
    $main.html(`
      <h2>Login</h2>
      <form method="post" action="/login">
      <div class="form-group">
      <input class="form-control" name="email" placeholder="Email">
      </div>
      <div class="form-group">
      <input class="form-control" type="password" name="password" placeholder="Password">
      </div>
      <button class="btn btn-primary">Log In</button>
      </form>
      `);
    }

  function handleForm() {
    if(event) event.preventDefault();
    let token = localStorage.getItem('token');
    let $form = $(this);
    let url = $form.attr('action');
    let method = $form.attr('method');
    let data = $form.serialize();
    $.ajax({
      url,
      method,
      data,
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    }).done((data) => {
      if(data.token) localStorage.setItem('token', data.token);
      getUsers();
    }).fail(showLoginForm);
  }

  function getUsers() {
    if (event) event.preventDefault();
    let token = localStorage.getItem('token');
    $.ajax({
      url: `/users`,
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(showUsers)
    .fail(showLoginForm);
  }

  function showUsers(users) {
    console.log(users);
    let $row = $('<div class="row"></div>');
    users.forEach((user) => {
      $row.append(`
        <div class="col-md-4">
        <div class="card">
        <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
        <div class="card-block">
        <h4 class="card-title">${user.firstName}</h4>
        </div>
        </div>
        <button class="btn btn-danger delete" data-id="${user._id}">Delete</button>
        <button class="btn btn-primary edit" data-id="${user._id}">Edit</button>
        </div>
        `);
      });
      $main.html($row);
    }

  function getUser() {
    let id = $(this).data('id');
    let token = localStorage.getItem('token');
    $.ajax({
      url: `/users/${id}`,
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(showEditForm)
    .fail(showLoginForm);
  }

function showEditForm(user) {
  if(event) event.preventDefault();
  console.log(user);
  $main.html(`
    <h2>Edit User</h2>
    <form method="put" action="/users/${user._id}">
    <div class="form-group">
    <input class="form-control" name="firstName" placeholder="Firstname" value="${user.firstName}">
    </div>
    <div class="form-group">
    <input class="form-control" name="lastName" placeholder="Last Name" value="${user.lastName}">
    </div>
    <div class="form-group">
    <input class="form-control" name="email" placeholder="Email" value="${user.email}">
    </div>
    <div class="form-group">
    <input class="form-control" name="age" placeholder="Age e.g 21" value="${user.age}">
    </div>
    <div class="form-group">
    <input class="form-control" name="gender" placeholder="Male or Female?" value="${user.gender}">
    </div>
    <div class="form-group">
    <input class="form-control" name="interestedIn" placeholder="Men, Women, or Both?" value="${user.interestedIn}">
    </div>
    <div class="form-group">
    <input class="form-control" name="postcode" placeholder="Postcode" value="${user.postcode}">
    </div>
    <div class="form-group">
    <input class="form-control" name="fact" placeholder="Tell us a quick fact about yourself!" value="${user.fact}">
    </div>
    <div class="form-group">
    <input class="form-control" name="profilePic" placeholder="Image Url" value="${user.profilePic}">
    </div>
    <button class="btn btn-primary">Update</button>
    </form>
    `);
  }

  function deleteUser() {
    let id = $(this).data('id');
    let token = localStorage.getItem('token');
    $.ajax({
      url: `/users/${id}`,
      method: "DELETE",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(getUsers)
    .fail(showLoginForm);
  }
// logs user out by removing local token
  function logout() {
    if(event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
  }
  google.maps.Circle.prototype.contains = function(latLng) {
    return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
  };

  let bounds = new google.maps.LatLngBounds();
// markers should be an array our dater's locations
  let markers = [];

  // function createDate() {
  navigator.geolocation.getCurrentPosition(function(position) {
    let latLng = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
// preset 1st dater location pushed to markers array
    markers.push(new google.maps.Marker({
      map: map,
      position: latLng
      // position: { lat: 51.55, lng: -0.078 }
    }));
  // preset 2nd dater location pushed to markers array
    markers.push(new google.maps.Marker({
      map: map,
      position: { lat: 48.85, lng: 2.20 }
    }));
    // sets bounds using markers array. currently two, but would be possible to use any number
    markers.forEach((marker) => {
      bounds.extend(marker.getPosition());
    });
    // finds the middle of the points from the markers array
      let centerOfBounds = bounds.getCenter();
    // adds a marker at the centerOfBounds latlng uses drop animation to indicate this
      new google.maps.Marker({
        map: map,
        position: centerOfBounds,
        animation: google.maps.Animation.DROP
      });
    // adds a translucent circle to the map taking centreOfBounds as it's centre. This could be made adjustable by creating an input for radius
      let circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: centerOfBounds,
        radius: 1000
      });
    // circle.contains(markers[1].getPosition()); this returns true of false based on whether this marker falls with the radius for the circle. If we apply this to the events with a forEach we will be able to define which events show on map.
      console.log(circle.contains(markers[1].getPosition()));
  });

});
