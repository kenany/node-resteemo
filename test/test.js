var chai = require('chai');
var should = chai.should();

var nock = require('nock');
var scout = nock('http://api.captainteemo.com');

var resteemo = require('../');

// Constants
var TEST_SUMMONER = 'guardsmanbob';
var TEST_PLATFORM = 'euw';
var TEST_PLATFORM_FULL = 'Europe_West';
var PLAYER_PATH = '/player/' + TEST_PLATFORM + '/' + TEST_SUMMONER;
var DATA_FOLDER = __dirname + '/data/';

describe('node-resteemo', function() {
  before(function() {
    this.teemo = resteemo('node-resteemo test suite');
    this.veigar = resteemo;
  });
  after(function() {
    this.teemo = null;
    this.veigar = null;
  });

  it('should export a function', function() {
    resteemo.should.be.a('function');
  });
  it('should throw error if referer string is not provided', function() {
    this.veigar.should.throw(/refererString/);
  });

  describe('player', function() {
    it('should return an object', function() {
      this.teemo.player.should.be.an('object');
    });

    describe('create', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH)
          .replyWithFile(200, DATA_FOLDER + 'profile.json');

        this.teemo.player.create(TEST_PLATFORM, TEST_SUMMONER, function(err, profile) {
          if (err) return done(err);
          this.profile = profile;
          done();
        });
      });
      after(function() {
        this.profile = null;
      });

      it('should be a function', function() {
        this.teemo.player.create.should.be.a('function');
      });
      it('should return an object', function() {
        profile.should.be.an('object');
      });
      it('should work with full platform names', function(done) {
        scout
          .get(PLAYER_PATH)
          .replyWithFile(200, DATA_FOLDER + 'profile.json');

        this.teemo.player.create(TEST_PLATFORM_FULL, TEST_SUMMONER, function(err, ignored) {
          should.not.exist(err);
          should.exist(ignored);
          done();
        });
      });
      it('should return error if api fails', function(done) {
        scout
          .get('/player/' + TEST_PLATFORM + '/guardsmanbo')
          .replyWithFile(503, DATA_FOLDER + 'error-profile.json');

        this.teemo.player.create(TEST_PLATFORM, 'guardsmanbo', function(err, noProfile) {
          err.should.be.an('object');
          should.not.exist(noProfile);
          done();
        });
      });
      it('should return error if json cannot be parsed', function(done) {
        scout
          .get('/player/' + TEST_PLATFORM + '/fakejson')
          .replyWithFile(200, DATA_FOLDER + 'error-json.json');

        this.teemo.player.create(TEST_PLATFORM, 'fakejson', function(err, noProfile) {
          err.should.be.an('object');
          should.not.exist(noProfile);
          done();
        });
      });
    });

    describe('recentGames', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/recent_games')
          .replyWithFile(200, DATA_FOLDER + 'recent_games.json');

        this.teemo.player.recentGames(TEST_PLATFORM, TEST_SUMMONER, function(err, games) {
          if (err) return done(err);
          this.games = games;
          done();
        });
      });
      after(function() {
        this.games = null;
      });

      it('should be a function', function() {
        this.teemo.player.recentGames.should.be.a('function');
      });
      it('should return an object', function() {
        games.should.be.an('object');
      });
      it('should work with full platform names', function(done) {
        scout
          .get(PLAYER_PATH + '/recent_games')
          .replyWithFile(200, DATA_FOLDER + 'recent_games.json');

        this.teemo.player.recentGames(TEST_PLATFORM_FULL, TEST_SUMMONER, function(err, ignored) {
          should.not.exist(err);
          profile.should.be.an('object');
          done();
        });
      });
      it('should return error if json cannot be parsed', function(done) {
        scout
          .get('/player/' + TEST_PLATFORM + '/fakejson/recent_games')
          .replyWithFile(200, DATA_FOLDER + 'error-json.json');

        this.teemo.player.recentGames(TEST_PLATFORM, 'fakejson', function(err, noProfile) {
          err.should.be.an('object');
          should.not.exist(noProfile);
          done();
        });
      });
    });

    describe('influencePoints', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/influence_points')
          .replyWithFile(200, DATA_FOLDER + 'influence_points.json');

        this.teemo.player.influencePoints(TEST_PLATFORM, TEST_SUMMONER, function(err, points) {
          if (err) return done(err);
          this.points = points;
          done();
        });
      });
      after(function() {
        this.points = null;
      });

      it('should be a function', function() {
        this.teemo.player.influencePoints.should.be.a('function');
      });
      it('should return an object', function() {
        points.should.be.an('object');
      });
      it('should work with full platform names', function(done) {
        scout
          .get(PLAYER_PATH + '/influence_points')
          .replyWithFile(200, DATA_FOLDER + 'influence_points.json');

        this.teemo.player.influencePoints(TEST_PLATFORM_FULL, TEST_SUMMONER, function(err, ignored) {
          should.not.exist(err);
          profile.should.be.an('object');
          done();
        });
      });
      it('should return error if json cannot be parsed', function(done) {
        scout
          .get('/player/' + TEST_PLATFORM + '/fakejson/influence_points')
          .replyWithFile(200, DATA_FOLDER + 'error-json.json');

        this.teemo.player.influencePoints(TEST_PLATFORM, 'fakejson', function(err, noProfile) {
          err.should.be.an('object');
          should.not.exist(noProfile);
          done();
        });
      });
    });
  });
});