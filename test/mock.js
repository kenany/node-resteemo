var nock = require('nock');
var _ = require('lodash');

var c = require('./constants.js');

// Below, RESTeemo's API is "mocked." This allows us to test node-resteemo
// without actually querying the online API. When multiple calls are made to
// the same path, multiple interceptors are required.
//
// Good: faster tests that work even when the API is down
// Bad: suite won't tell us when a RESTeemo update is not backwards-compatible
var scout = nock('http://api.captainteemo.com')

  // Summoner lookup failure mock
  .get('/player/' + c.TEST_PLATFORM + '/guardsmanbo')
  .replyWithFile(503, c.DATA_FOLDER + 'error-profile.json');

// .player.create
_([1, 2, 3]).forEach(function() {
  scout
    .get(c.PLAYER_PATH)
    .replyWithFile(200, c.DATA_FOLDER + 'profile.json');
});

// .player.recentGames
_([1, 2]).forEach(function() {
  scout
    .get(c.PLAYER_PATH + '/recent_games')
    .replyWithFile(200, c.DATA_FOLDER + 'recent_games.json');
});

// .player.influencePoints
_([1, 2]).forEach(function() {
  scout
    .get(c.PLAYER_PATH + '/influence_points')
    .replyWithFile(200, c.DATA_FOLDER + 'influence_points.json');
});