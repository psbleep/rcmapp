const express = require('express');
const router = express.Router();

const hackerschool = require('hackerschool-api');

var { User } = require("../models.js");

const authenticator = hackerschool.auth({
    client_id: process.env.RECURSE_ID,
    client_secret: process.env.SECRET_KEY,
    site: process.env.TOKEN_HOST,
    redirect_uri: process.env.REDIRECT_URI
});

const authUrl = authenticator.createAuthUrl();

router.get('/login', (req, res) => {
  res.json({authUrl: authUrl});
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
})

// Expects redirect URL of /api/authorize
router.get('/authorize', (req, res) => {
  const code = req.query.code;

  authenticator.getToken(code).then((token) => {
    let accessToken = token.token.access_token;
    let client = hackerschool.client();
    client.setToken(token);
    client.people.me().then(function(RCData) {
      let batches = RCData.batches;
      let batchesStr = '';
      for (var batch in RCData.batches) {
        batchesStr += batches[batch].name + '  ';
      }
      User.findOrCreate({where: {token: accessToken}, defaults: {expiration: token.token.expires_at, email: RCData.email}})
      .spread(user => {
        res.cookie('email', RCData.email);
        res.cookie('firstName', RCData.first_name);
        res.cookie('lastName', RCData.last_name);
        res.cookie('batches', batchesStr);
        res.cookie('token', accessToken);
        res.redirect('/');
      })
    })
  })
  .catch((err) => {
    console.log(err);
    res.end(err);
  });
});

module.exports = router;