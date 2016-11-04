const request = require('request-promise');
const eventsIndex = (req, res) => {
  request({
    url: "http://www.skiddle.co.uk/api/v1/events/",
    method: "GET",
    qs: {
      api_key: process.env.SKIDDLE_KEY,
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      radius: req.query.radius,
      limit: req.query.limit,
      minDate: req.query.minDate,
      maxDate: req.query.maxDate
    },
    json: true
  })
  .then((data) => {
    res.json(data.results);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
};

module.exports = {
  index: eventsIndex
};
