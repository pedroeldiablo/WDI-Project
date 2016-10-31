console.log("JS loaded!");

$(() =>{

  createMap();
  getEvents();

  function createMap() {
    let $mapDiv =$('#map');

    let map = new google.maps.Map($mapDiv[0], {
      center: { lat: 51.5153, lng: -0.0722 },
      zoom: 16
    });

    navigator.geolocation.getCurrentPosition(function(position) {
      let latLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map.panTo(latLng);

      let marker = new google.maps.Marker({
        position: latLng,
        animation: google.maps.Animation.BOUNCE,
        draggable: true,
        map
      });
    });
  }

  let searchReqs = "";
  function getEvents() {
    console.log('getting events');
    $.ajax({
      url: `http://www.skiddle.com/api/v1/events/`,
      data: {
        api_key: "19e3e956478924a5391be5b5e37fee57"
      },
      method: "GET"
    }).done(function (data) {
      console.log('done: data:', data);
    }).fail(function () {
      console.log('Skiddle call failed: arguments:', arguments);
    });
  }

  // let $main = $('main');
  // $('.register').on('click', showRegisterForm);
  // $('.login').on('click', showLoginForm);
  // $main.on('submit', 'form', handleForm);
  // $main.on('click', 'button.delete', deleteUser);
  // $main.on('click', 'button.edit', getUser);
  // $('.usersIndex').on('click', getUsers);
  // $('.logout').on('click', logout);
  // $('.eventsIndex').on('click', getEvents);
  // function isLoggedIn() {
  //   return !!localStorage.getItem('token');
  // }
  // if(isLoggedIn()) {
  //   getUsers();
  // } else {
  //   showLoginForm();
  // }
  // function showRegisterForm() {
  //   if(event) event.preventDefault();
  //   $main.html(`
  //     <h2>Register</h2>
  //     <form method="post" action="/register">
  //       <div class="form-group">
  //         <input class="form-control" name="firstName" placeholder="First Name">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="lastName" placeholder="Last Name">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="email" placeholder="Email">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="age" placeholder="Age e.g 21">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" type="password" name="password" placeholder="Password">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="gender" placeholder="Male or Female?">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="interestedIn" placeholder="Men, Women, or Both?">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="postcode" placeholder="Postcode">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="fact" placeholder="Tell us a quick fact about yourself!">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="profilePic" placeholder="Upload your image here">
  //       </div>
  //       <button class="btn btn-primary">Register</button>
  //     </form>
  //   `);
  // }
  //
  // function showLoginForm() {
  //   if(event) event.preventDefault();
  //   $main.html(`
  //     <h2>Login</h2>
  //     <form method="post" action="/login">
  //       <div class="form-group">
  //         <input class="form-control" name="email" placeholder="Email">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" type="password" name="password" placeholder="Password">
  //       </div>
  //       <button class="btn btn-primary">Register</button>
  //     </form>
  //   `);
  // }
  // function showEditForm(user) {
  //   if(event) event.preventDefault();
  //   $main.html(`
  //     <h2>Edit User</h2>
  //     <form method="put" action="/users/${user._id}">
  //       <div class="form-group">
  //         <input class="form-control" name="username" placeholder="Username" value="${user.username}">
  //       </div>
  //       <button class="btn btn-primary">Update</button>
  //     </form>
  //   `);
  // }
  // function handleForm() {
  //   if(event) event.preventDefault();
  //   let token = localStorage.getItem('token');
  //   let $form = $(this);
  //   let url = $form.attr('action');
  //   let method = $form.attr('method');
  //   let data = $form.serialize();
  //   $.ajax({
  //     url,
  //     method,
  //     data,
  //     beforeSend: function(jqXHR) {
  //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  //     }
  //   }).done((data) => {
  //     if(data.token) localStorage.setItem('token', data.token);
  //     getUsers();
  //   }).fail(showLoginForm);
  // }
  // function getUsers() {}
  //
  // function showUsers(users) {
  //   console.log(users);
  //   let $row = $('<div class="row"></div>');
  //   users.forEach((user) => {
  //     $row.append(`
  //       <div class="col-md-4">
  //         <div class="card">
  //           <img class="card-img-top" src="http://fillmurray.com/300/300" alt="Card image cap">
  //           <div class="card-block">
  //             <h4 class="card-title">${user.firstName}</h4>
  //           </div>
  //         </div>
  //         <button class="btn btn-danger delete" data-id="${user._id}">Delete</button>
  //         <button class="btn btn-primary edit" data-id="${user._id}">Edit</button>
  //       </div>
  //     `);
  //   });
  //   $main.html($row);
  // }
  //
  // function showEvents(events) {
  //   console.log(events);
  //   let $row = $('<div class="row"></div>');
  //   events.forEach((event) => {
  //     $row.append(`
  //       <div class="col-md-4">
  //         <div class="card">
  //           <img class="card-img-top" src="${event.image}" alt="Card image cap">
  //           <div class="card-block">
  //             <h4 class="card-title">${event.species}</h4>
  //           </div>
  //           <div class="card-block">
  //             <h4 class="card-title">${event.maxLength} feet</h4>
  //           </div>
  //         </div>
  //         <button class="btn btn-danger delete" data-id="${event._id}">Delete</button>
  //         <button class="btn btn-primary edit" data-id="${event._id}">Edit</button>
  //       </div>
  //     `);
  //   });
  //   $main.html($row);
  // }
  // showEvents();
  //
  // function deleteUser() {
  //   let id = $(this).data('id');
  //   let token = localStorage.getItem('token');
  //   $.ajax({
  //     url: `/users/${id}`,
  //     method: "DELETE",
  //     beforeSend: function(jqXHR) {
  //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  //     }
  //   })
  //   .done(getUsers)
  //   .fail(showLoginForm);
  // }
  // function getUser() {
  //   let id = $(this).data('id');
  //   let token = localStorage.getItem('token');
  //   $.ajax({
  //     url: `/users/${id}`,
  //     method: "GET",
  //     beforeSend: function(jqXHR) {
  //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  //     }
  //   })
  //   .done(showEditForm)
  //   .fail(showLoginForm);
  // }
  // function logout() {
    if(event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
  }

// }
);
