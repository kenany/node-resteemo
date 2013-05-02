var chai = require('chai');
var _ = require('lodash');
var nock = require('nock');
var resteemo = require('../');
var should = chai.should();

var TEST_SUMMONER = 'guardsmanbob';
var TEST_PLATFORM = 'euw';
var TEST_PLATFORM_FULL = 'Europe_West';
var PLAYER_PATH = '/player/' + TEST_PLATFORM + '/' + TEST_SUMMONER;
var DATA_FOLDER = __dirname + '/data/';

// Below, RESTeemo's API is "mocked." This allows us to test node-resteemo
// without actually querying the online API.
//
// Good: faster tests that work even when the API is down
// Bad: suite won't tell us when a RESTeemo update is not backwards-compatible
var scout = nock('http://api.captainteemo.com')
  .get(PLAYER_PATH + '/recent_games')
  .replyWithFile(200, DATA_FOLDER + 'recent_games.json')
  .get(PLAYER_PATH + '/influence_points')
  .replyWithFile(200, DATA_FOLDER + 'influence_points.json');

// Two calls are made to this path, so two interceptors are required.
_([1, 2]).forEach(function() {
  scout
    .get(PLAYER_PATH)
    .replyWithFile(200, DATA_FOLDER + 'profile.json')
});

describe('node-resteemo', function() {
  before(function() {
    // A nice yordle who provides a referer string
    this.teemo = resteemo('node-resteemo test suite');

    // An evil yordle who wants to abuse the API
    this.veigar = resteemo;
  });
  after(function() {
    this.teemo = null;
    this.veigar = null;
  });

  it('should export a function', function() {
    resteemo.should.be.a('function');
  });
  it('should work with full platform names', function(done) {
    this.teemo.player.create(TEST_PLATFORM_FULL, TEST_SUMMONER, function(err, profile) {
      if (err) return done(err);
      done();
    });
  });
  it('should throw error if referer string is not provided', function() {
    this.veigar.should.throw(/refererString/);
  });

  describe('player', function() {
    describe('create', function() {
      before(function(done) {
        this.teemo.player.create(TEST_PLATFORM_FULL, TEST_SUMMONER, function(err, profile) {
          if (err) return done(err);
          this.profile = profile;
          done();
        });
      });
      after(function() {
        this.profile = null;
      });
      it('should return an object', function() {
        profile.should.be.an('object');
      });
      it('should return profile IDs as numbers', function() {
        profile.summoner.id.should.be.a('number');
        profile.account.id.should.be.a('number');
      });
      it('should return names as strings', function() {
        profile.name.should.be.a('string');
        profile.internalName.should.be.a('string');
      });
      it('should return level and icon as numbers', function() {
        profile.level.should.be.a('number');
        profile.icon.should.be.a('number');
      });
    });

    describe('recentGames', function() {
      before(function(done) {
        this.teemo.player.recentGames(TEST_PLATFORM, TEST_SUMMONER, function(err, games) {
          if (err) return done(err);
          this.games = games;
          done();
        });
      });
      after(function() {
        this.games = null;
      });

      it('should return recent games', function() {
        games.should.be.an('array');
      });
    });

    describe('influencePoints', function() {
      before(function(done) {
        this.teemo.player.influencePoints(TEST_PLATFORM, TEST_SUMMONER, function(err, points) {
          if (err) return done(err);
          this.points = points;
          done();
        });
      });
      after(function() {
        this.points = null;
      });

      it('should return influence points', function() {
        points.should.be.a('number');
      });
    });
  });
});