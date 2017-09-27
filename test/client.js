const Primus = require('../primus');
const jwt = require('jwt-simple');

  var feedback = 'feedback'
    , message = 'message'
    , output = 'output'
    , password = 'bar'
    , status = 'status'
    , username = 'foo';

  //
  // Create a new Primus instance specifying that we want to open the
  // connection manually.
  //
  const url = 'http://localhost:9000';
  const options = { strategy: 'online, timeout, disconnect' };
  const primus = new Primus(url, options);

  const payload = { foo: 'bar' };
  const secret = 'xxx1';
  const token = jwt.encode(payload, secret);
  //
  // For convenience we use the private event `outgoing::url` to append the
  // authorization token in the query string of our connection URL.
  //
  primus.on('outgoing::url', function connectionURL(url) {
    url.query = 'token=' + token;
    console.log('url : ', url);
    return
  });

  // primus.on('open', open);

  // primus.on('close', close);

  primus.on('data', received);

  function received(data) {
    const type = data.type;
    const payload = data.payload;
    console.log('received : ', type, payload);
  }
  function close(){
    console.log('close');
    primus.end();
  }
  function open() {
    console.log('open');
    //
    // Open a new connection with the server.
    // We use `primus.end()` before `primus.open()` to ensure that the
    // connection is closed before we try to open a new one.
    //
    primus.end().open();
  };

  function write(e) {
    console.log('write : ', e);
    //
    // Write the message to the server.
    //
    primus.write(e);
  };

  // function login(e) {
  //   console.log('login : ', e);
  //   if (password.value === '' || username.value === '') return;
  //
  //   //
  //   // Send an Ajax request to get an authorization token.
  //   //
  //   superagent.post('http://localhost:9000/login')
  //     .send({ password: password.value, username: username.value })
  //     .end(function (res) {
  //       console.log('post /login : ', res);
  //
  //       if (res.ok) {
  //         console.log('Authorization token received, try to connect');
  //         //
  //         // Save the token in localStorage.
  //         //
  //         return localStorage.setItem('token', res.body.token);
  //       }
  //
  //       console.log(res.body.message);
  //     });
  //   return
  // };
