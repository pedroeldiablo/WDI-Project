const Event = require('../models/event');

function eventsIndex(req, res) {
  Event.find((err, events) => {
    if(err) return res.status(500).json({ error: "500: Server Error"});
    res.json(events);
  });
}

function eventsShow(req, res) {
  Event.findById(req.params.id, (err, event) => {
    if(err) return res.status(500).json({ error: "500: Server Error"});
    res.json(event);
  });
}

module.exports = {
  index: eventsIndex
};
