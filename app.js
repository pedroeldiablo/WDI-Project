const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressJWT = require("express-jwt");

const app = express();
const port = process.env.PORT || 8000;
const router = require('./config/routes');

let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/events-api';

mongoose.connect(mongoUri);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use('/', router);

app.listen(port, () => console.log(`Listening on port: ${port}`));
