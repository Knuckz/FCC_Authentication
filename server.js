'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const passport    = require('passport');
const ObjectID    = require('mongodb').ObjectID;
const mongo       = require('mongodb').MongoClient;
const LocalStrategy = require('passport-local');
const bcrypt      = require('bcrypt');
const app = express();
const routes      = require('./routes');
const auth        = require('./auth');

fccTesting(app); //For FCC testing purposes
app.set('view engine', 'pug');
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//passport middleware


mongo.connect(process.env.MONGO_URI, (err, db) => {
  if (err) {
    console.error('Error connecting to DB');
  } else {
    console.log('Success connecting to DB');
    
    auth(app, db);
    routes(app, db);
    
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });
  }

});
