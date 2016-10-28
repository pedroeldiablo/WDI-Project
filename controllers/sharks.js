const Shark = require('../models/shark');

function sharksIndex(req, res) {
  Shark.find((err, sharks) => {
    if(err) return res.status(500).json({ error: "500: Server Error"});
    res.json(sharks);
  });
}

function sharksCreate(req, res) {
  Shark.create(req.body, (err, shark) => {
    if(err) return res.status(400).json({ error: "400: Invalid Data"});
    res.status(201).json(shark);
  });
}

function sharksShow(req, res) {
  Shark.findById(req.params.id, (err, shark) => {
    if(err) return res.status(500).json({ error: "500: Server Error"});
    res.json(shark);
  });
}

function sharksUpdate(req, res) {
  Shark.findByIdAndUpdate(req.params.id, req.body, { new: true}, (err, shark) => {
    if(err) return res.status(400).json({ error: "400: Invalid Data"});
    res.json(shark);
  });
}

function sharksDelete(req, res) {
  Shark.findByIdAndRemove(req.params.id, (err) => {
    if(err) return res.status(500).json({ error: "500: Server Error"});
    res.status(204).send();
  });
}

module.exports = {
  index: sharksIndex,
  create: sharksCreate,
  show: sharksShow,
  update: sharksUpdate,
  delete: sharksDelete
};
