const request = require('request-promise');
const eventsIndex = (req, res) => {
  request({
    url: "http://www.skiddle.com/api/v1/events/",
    method: "GET",
    qs: {
      api_key: "19e3e956478924a5391be5b5e37fee57",
      latitude: req.query.lat,
      longitude: req.query.lng,
      radius: req.query.radius,
      limit: req.query.limit
    },
    json: true
  })
  .then((data) => {
    res.json(data.results);
  })
  .catch((err) => {
    res.status(500).json(err);
  });
};

module.exports = {
  index: eventsIndex
};

//process.env.HIUHUIHIUH
