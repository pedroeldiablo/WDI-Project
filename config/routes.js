const router = require('express').Router();
const eventsController = require('../controllers/events');
const usersController = require('../controllers/users');
const skiddleController = require('../controllers/skiddle');

const jwt = require('jsonwebtoken');

const authController = require("../controllers/auth");
const secret = require('./tokens').secret;

function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: "Unauthorized"});
  let token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, (err, payload) => {
    if(err) return res.status(401).json({message: "Unauthorized"});
    req.user = payload;
    next();
  });
}

router.route("/register")
  .post(authController.register);
router.route("/login")
  .post(authController.login);

router.route('/users')
  .all(secureRoute)
  .get(usersController.index);

router.route('/users/:id')
  .all(secureRoute)
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.delete);

router.route('/events')
  .get(skiddleController.index);

module.exports = router;
