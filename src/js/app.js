console.log("JS loaded!");
$(() => {

  let today = new Date();
  let bounds = new Date(new Date(today).setMonth(today.getMonth()+1));
  let range = new Date(new Date(today).setDate(today.getDate()+7));

  createMap();
  getEvents(today, range);
  dateSlider();

  let $mapDiv =$('#map');
  let markers = [];

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
        // animation: google.maps.Animation.DROP,
        icon: 'https://lh4.ggpht.com/Tr5sntMif9qOPrKV_UVl7K8A_V3xQDgA7Sw_qweLUFlg76d_vGFA7q1xIKZ6IcmeGqg=w300',
        map
      });
    });
  }

  function dateSlider() {
    $("#slider").dateRangeSlider({
      bounds:{
        min: today,
        max: bounds
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

  function getEvents(min, max) {
    let minDate = min.toISOString().split('T')[0];
    let maxDate = max.toISOString().split('T')[0];

    console.log('getting events');
    $.ajax({
      url: `/events`,
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
    events.forEach((event) => {
      let latLng =  {
        lat: event.venue.latitude,
        lng: event.venue.longitude
      };
      console.log(event.date);
      let marker = new google.maps.Marker({
        position: latLng,
        // animation: google.maps.Animation.DROP,
        map
      });
      markers.push(marker);
    });
  }

  function removeMarkers(){
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers = [];
  }

  let $main = $('main');
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

          function logout() {
            if(event) event.preventDefault();
            localStorage.removeItem('token');
            showLoginForm();
          }
        }
      );
