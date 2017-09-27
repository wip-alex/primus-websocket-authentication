'use strict';

//
// Require all dependencies.
//
// var db = require('./db')
const jwt = require('jwt-simple');

//
// The secret that we use to calculate and validate the signature of the JWT.
//
const secret = 'xxx';
//
// Expose the authorization function.
//
module.exports = function authorize(req, authorized) {
  console.log('1.authorize query : ', req.query);
  var token = req.query.token
    , error
    , payload;

  if (!token) {
    error = 'Missing access token';
    console.log(error.message);
    return authorized(error);
  }

  console.log('2.authorize token : ', token);
  //
  // `jwt-simple` throws errors if something goes wrong when decoding the JWT.
  //
  try {
    payload = jwt.decode(token, secret);
    console.log('3.authorize key : ',  payload);
  }
  catch (e) {
    console.log('3.authorize key : ',e.message);
    return authorized(e.message);
  }

  //
  // At this point we have decoded and verified the token. Check if it is
  // expired.
  //
  if (Date.now() > payload.exp) {
    error = 'Expired access token';
    console.log('4.date error : ',error);
    return authorized(error);
  }

  //
  // Check if the user is still present and allowed in our db. You could tweak
  // this to invalidate a token.
  //
  var user = 'AUTHORIZED';
  if (user !== 'AUTHORIZED') {
    error = 'Invalid access token';
    console.log('5. user error : ', error);
    return authorized(error);
  }

  authorized();
};

//
// Expose the secret.
//
module.exports.secret = secret;
