#Event Cupid

###Go Dutch on Distance. Try it for yourself [Here](https://eventcupid.herokuapp.com/).

##Overview

Bringing together data from a hosted Restful API of users, an external API from Skiddle - an events website and Google Maps, the idea behind the project was to make dating both easier and more enjoyable. The premise was to find the midpoint between two users and then using bounds provide them with a selection of events that would be easy for them both to reach. Solving two problems, what to do and where to go in one simple step.

![alt text](/public/images/registration.png "The red and black themed registration page. Inspired by playing cards")

##Technology Used

JavaScript ES6 | JQuery | SCSS | Mongo | Git | Github | Ajax | Node.js | Express | Google Maps JavaScript API: Geometry, Geolocation | Skiddle API | Custom RESTful API of users | Balsamic for wireframes | Heroku for deployment

##Approach and Challenges

Working with [Théa Carter](https://github.com/Tcarter350) and [Aaron Hall](https://github.com/Rebehn)

As a first group project we were presented with the challenge to build a full-stack RESTful application that included a Google Map and an authenticated User.

We discussed options for possible directions that we might take and eventually concluded that it would be interesting to look at creating an alternative sort of dating site, one built around the date rather than just the daters.  

We then broke the task down using Trello as a planning tool to record the progression of the project.

The initial steps included discussing the user journey, wire-framing the look of the site and researching APIs.

Throughout the project we became familiar with pair coding and version control on GitHub and gained an appreciation for resolving merge conflicts.

While working together we tried to balance the tasks so that everyone had an opportunity to work on all aspects of the site, so each of us contributed and understood the whole.

![alt text](/public/images/example-date2.png "An example of the date")

An area that I worked on was incorporating the Google Geometry Library to return events within a bounds. Then push custom markers to display both the users and the event options.

```JavaScript

function createEventRadius(partnerLatLng){
  console.log(partnerLatLng);
  google.maps.Circle.prototype.contains = function(latLng) {
    return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
  };
  let bounds = new google.maps.LatLngBounds();
  navigator.geolocation.getCurrentPosition(function(position) {
    let loctn = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    markers.push(new google.maps.Marker({
      map: map,
      position: loctn,
      icon: '../images/heartpinsmall.png'

    }));
    markers.push(new google.maps.Marker({
      map: map,
      position: partnerLatLng,
      icon: '../images/heartpinsmall.png'

    }));
    markers.forEach((marker) => {
      bounds.extend(marker.getPosition());
    });
    let centerOfBounds = bounds.getCenter();

    circle.push(new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.65,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      map: map,
      center: centerOfBounds,
      radius: 2110
    }));

    map.panTo(centerOfBounds);

    eventCircle.lat = centerOfBounds.lat();
    eventCircle.lng = centerOfBounds.lng();
    getEvents(today, range);

  });
}

```
The unusual distance for the radius of the circle reflects one of the key challenges we faced: understanding the data that was provided by the API.

Having put in place a bounds function to return the events happening within a radius from the midpoint of our daters, we were seeing results returned that fell outside this range.

After much confusion we realised that the data being served from the API included events up to half a mile outside the bounds we had set, and that this meant they were rounding to the nearest mile. Once this was factored in we were able to adjust our results accordingly to avoid confusion.


##Where to From Here?

The next step would be to complete the user journey and add the option to message users to suggest a date. This would require there to be a internal messaging platform built within the site.

Adding search functions to narrow the date options further would also be helpful.

Given that the majority of people use their phones to access these sorts of services designing with a web app in mind and the possibility that there may be a need to create native apps seems sensible. Some steps have been taken to factor in that the site might be viewed on smaller screens, such as media queries that resize the logo, but there is a lot of room to improve on this front if this were taken any further.
