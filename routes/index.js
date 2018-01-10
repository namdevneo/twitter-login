var express = require('express');
var util = require('util');
var oauth = require('oauth');
var router = express.Router();
var config = require('../config/config');

// Get your credentials here: https://dev.twitter.com/apps
var _twitterConsumerKey = config.TWIITER_SECRET_KEY;
var _twitterConsumerSecret = config.TWITTER_SECRETE_ID;
console.log(_twitterConsumerKey)
console.log(_twitterConsumerSecret)

var consumer = new oauth.OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    _twitterConsumerKey,
    _twitterConsumerSecret,
    "1.0A", 
    "http://127.0.0.1:3000/twitter/callback",
    "HMAC-SHA1"
  );

  /* GET home page. */
router.get('/', function(req, res){
  console.log('req.session')
  console.log(req.session)
   res.render('index', {title:'Neosoft Technology'});
});


/* GET Twitter login page. */
router.get('/twitter/connect', function(req, res, next) {
  consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.status(500).send(error)
    } else {
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
    }
  });
});


router.get('/twitter/callback', function(req, res){
  console.log(">>"+req.session.oauthRequestToken);
  console.log(">>"+req.session.oauthRequestTokenSecret);
  console.log(">>"+req.query.oauth_verifier);
  consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
     console.log(error)
      res.status(401).send(error)
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      res.redirect('/home');
    }
  });
});

router.get('/home', function(req, res){
  res.render('home', {title:'Neosoft Technology'});
});


module.exports = router;
