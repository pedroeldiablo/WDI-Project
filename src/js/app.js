console.log("JS loaded!");
$(() => {

  let today = new Date();
  let dateBounds = new Date(new Date(today).setMonth(today.getMonth()+1));
  let googleMap = googleMap || {};
  let range = new Date(new Date(today).setDate(today.getDate()+2));


  createMap();
  dateSlider();

  let $mapDiv =$('#map');
  let eventMarkers = [];

  let map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5153, lng: -0.0722 },
    zoom: 12
  });

  function dateSetup(data) {
    let partnerLat = $(this).data('lat');
    let partnerLng = $(this).data('lng');
    let partnerLatLng = {
      lat: partnerLat,
      lng: partnerLng
    };
    createEventRadius(partnerLatLng);

    removeCover();
  }

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

  function dateSlider() {
    $("#slider").dateRangeSlider({
      bounds:{
        min: today,
        max: dateBounds
      },
      defaultValues: {
        min: today,
        max: range
      }

    });

    $("#slider").bind("userValuesChanged", function(e, data){
      // get new events from API
      let min = data.values.min;
      let max = data.values.max;

      getEvents(min, max);
    });
  }

  function removeMarkers(){
    for (var i = 0; i < eventMarkers.length; i++) {
      eventMarkers[i].setMap(null);
    }
    eventMarkers = [];
  }

  function getEvents(min, max, centerLat, centerLng) {
    console.log(centerLat);
    console.log(centerLng);
    removeMarkers();
    let minDate = min.toISOString().split('T')[0];
    let maxDate = max.toISOString().split('T')[0];

    console.log('getting events');
    $.ajax({
      url: `/events`,
      data: {
        latitude: centerLat,
        longitude: centerLng,
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
    events.forEach((event, index) => {
      let latLng =  {
        lat: event.venue.latitude,
        lng: event.venue.longitude
      };
      let marker = new google.maps.Marker({
        position: latLng,
        // animation: google.maps.Animation.DROP,
        map
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

  let $main = $('main');
  let $loginForm = $('nav');
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
    if(event) event.preventDefault();
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
    let $row = $('<div class="row"></div>');
    users.forEach((user) => {
      $row.append(`
        <div class="col-md-4">
          <div class="card">
            <img class="card-img-top" src="${user.profilePic}" alt="Card image cap">
            <div class="card-block">
              <h4 class="card-title">${user.firstName}</h4>
            </div>
          </div>
          <!-- <button class="danger delete" data-id="${user._id}">Delete</button> -->
          <button class="edit" data-id="${user._id}">Edit</button>
          <button class="dateButton" data-id="${user._id}" data-lat="${user.lat}" data-lng="${user.lng}">Date</button>
        </div>
        `
      );
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
      `
    );
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

  function createEventRadius(partnerLatLng){
    console.log(partnerLatLng);
    google.maps.Circle.prototype.contains = function(latLng) {
      return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
    };
    let bounds = new google.maps.LatLngBounds();
    // markers should be an array our dater's locations
    let markers = [];
    // console.log(loctn);
    // set 1st dater location to geolocation pushed to markers array

    // sets bounds using markers array. currently two, but would be possible to use any number

    // finds the middle of the points from the markers array

    // function createDate() {
    navigator.geolocation.getCurrentPosition(function(position) {
      let loctn = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
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
      markers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });

      let centerOfBounds = bounds.getCenter();
      // console.log("centerOfBounds", centerOfBounds);
      // console.log(this.getCenter());

      // adds a marker at the centerOfBounds latlng uses drop animation to indicate this
      // new google.maps.Marker({
      //   map: map,
      //   position: centerOfBounds,
      //   animation: google.maps.Animation.DROP
      // });

      let circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: centerOfBounds,
        radius: 1600
      });
      // recenters map on centerOfBounds/date location
      map.panTo(centerOfBounds);
      // circle.contains(markers[1].getPosition()); this returns true of false based on whether this marker falls with the radius for the circle. If we apply this to the events with a forEach we will be able to define which events show on map.
      // console.log(circle.contains(markers[1].getPosition()));
      // console.log(circle.contains(event[1].getPosition()));
      // console.log(markers);
      console.log(today);
      console.log(range);
      let centerLat = centerOfBounds.lat();
      let centerLng =  centerOfBounds.lng();
      getEvents(today, range, centerLat, centerLng);
    });
  }

  googleMap.addInfoWindowForEvent = function (event, marker) {
  google.maps.event.addListener(marker, "click", () => {
    if (this.infowindow){
      this.infowindow.close();
    }
    this.infowindow = new google.maps.InfoWindow({
      content: `
        <img src=${event.largeimageurl}>
        <h2>${event.description}</h2></br>
        <h2>${event.venue.name}</h2></br>
        <h4>${event.date}</h4>
        <p>${event.venue.address}</p>
        <p>${event.venue.town}</p>
        <p>${event.venue.postcode}</p>
        <p>${event.venue.phone}</p>
        <button><a href=${event.link} target="_blank">Get Tickets</a></button>
        <p>${event.entryprice}</p>
      `
      });
      this.infowindow.open(this.map, marker);
    });
  };
});
