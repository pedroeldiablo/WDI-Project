const Event = require('../models/event');

function eventsIndex(req, res) {
  Event.find((err, events) => {
    if(err) return res.status(500).json({ error: "500: Server Error"});
    res.json(events);
  });
}

// function eventsCreate(req, res) {
//   Event.create(req.body, (err, event) => {
//     if(err) return res.status(400).json({ error: "400: Invalid Data"});
//     res.status(201).json(event);
//   });
// }

function eventsShow(req, res) {
  Shark.findById(req.params.id, (err, event) => {
    if(err) return res.status(500).json({ error: "500: Server Error"});
    res.json(event);
  });
}

// function eventsUpdate(req, res) {
//   Event.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, event) => {
//     if(err) return res.status(400).json({ error: "400: Invalid Data"});
//     res.json(event);
//   });
// }
//
// function eventsDelete(req, res) {
//   Event.findByIdAndRemove(req.params.id, (err) => {
//     if(err) return res.status(500).json({ error: "500: Server Error"});
//     res.status(204).send();
//   });
// }

module.exports = {
  index: eventsIndex,
  // create: eventsCreate,
  show: eventsShow
  // update: eventsUpdate,
  // delete: eventsDelete
};
