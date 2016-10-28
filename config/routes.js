const router = require('express').Router();
const sharksController = require('../controllers/sharks');
const usersController = require('../controllers/users');

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
  .post(secureRoute, authController.login);

router.route('/users')
  .get(secureRoute, usersController.index);

router.route('/users/:id')
  .all(secureRoute)
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.delete);

router.route('/sharks')
  .all(secureRoute)
  .get(sharksController.index)
  .post(sharksController.create);

router.route('/sharks/:id')
  .all(secureRoute)
  .get(sharksController.show)
  .put(sharksController.update)
  .delete(sharksController.delete);

module.exports = router;
