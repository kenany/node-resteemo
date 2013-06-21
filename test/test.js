var chai = require('chai');
var should = chai.should();

var nock = require('nock');
var scout = nock('http://api.captainteemo.com');

var resteemo = require('../');
var teemo = resteemo('node-resteemo test suite');

var TEST_SUMMONER = 'guardsmanbob';
var TEST_PLATFORM = 'euw';
var TEST_PLATFORM_FULL = 'Europe_West';
var PLAYER_PATH = '/player/' + TEST_PLATFORM + '/' + TEST_SUMMONER;
var DATA_FOLDER = __dirname + '/data/';

describe('node-resteemo', function() {
  it('should export a function', function() {
    resteemo.should.be.a('function');
  });
  it('should return an object', function() {
    teemo.should.be.an('object');
  });
  it('should throw error if referer string is not provided', function() {
    resteemo.should.throw(/refererString/);
  });

  describe('player', function() {
    before(function(done) {
      scout
        .get(PLAYER_PATH)
        .replyWithFile(200, DATA_FOLDER + 'profile.json');

      teemo.player(TEST_PLATFORM, TEST_SUMMONER, function(error, profile) {
        if (error) return done(error);
        this.profile = profile;
        done();
      });
    });
    after(function() {
      this.profile = null;
    });
    it('should be a function', function() {
      teemo.player.should.be.a('function');
    });
    it('should return an object', function() {
      profile.should.be.an('object');
    });
    it('should work with full platform names', function(done) {
      scout
        .get(PLAYER_PATH)
        .replyWithFile(200, DATA_FOLDER + 'profile.json');

      teemo.player(TEST_PLATFORM_FULL, TEST_SUMMONER, function(error, prof) {
        should.not.exist(error);
        should.exist(prof);
        done();
      });
    });
    it('should return error if api fails', function(done) {
      scout
        .get('/player/' + TEST_PLATFORM + '/guardsmanbo')
        .replyWithFile(503, DATA_FOLDER + 'error-profile.json');

      teemo.player(TEST_PLATFORM, 'guardsmanbo', function(error, nothing) {
        should.exist(error);
        should.not.exist(nothing);
        done();
      });
    });
    it('should return error if json cannot be parsed', function(done) {
      scout
        .get('/player/' + TEST_PLATFORM + '/fakejson')
        .replyWithFile(200, DATA_FOLDER + 'error-json.json');

      teemo.player(TEST_PLATFORM, 'fakejson', function(error, nothing) {
        should.exist(error);
        should.not.exist(nothing);
        done();
      });
    });

    describe('recentGames', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/recent_games')
          .replyWithFile(200, DATA_FOLDER + 'recent_games.json');

        teemo.player.recentGames(TEST_PLATFORM, TEST_SUMMONER, function(error, games) {
          if (error) return done(error);
          this.games = games;
          done();
        });
      });
      after(function() {
        this.games = null;
      });

      it('should be a function', function() {
        teemo.player.recentGames.should.be.a('function');
      });
      it('should return an object', function() {
        games.should.be.an('object');
      });
    });

    describe('influencePoints', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/influence_points')
          .replyWithFile(200, DATA_FOLDER + 'influence_points.json');

        teemo.player.influencePoints(TEST_PLATFORM, TEST_SUMMONER, function(error, points) {
          if (error) return done(error);
          this.points = points;
          done();
        });
      });
      after(function() {
        this.points = null;
      });

      it('should be a function', function() {
        teemo.player.influencePoints.should.be.a('function');
      });
      it('should return an object', function() {
        points.should.be.an('object');
      });
    });
  });
});