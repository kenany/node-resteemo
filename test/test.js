var chai = require('chai');
var should = chai.should();

var resteemo = require('../');
var scout = require('./mock.js');
var c = require('./constants.js');

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
  it('should throw error if referer string is not provided', function() {
    this.veigar.should.throw(/refererString/);
  });

  describe('player', function() {
    it('should return an object', function() {
      this.teemo.player.should.be.an('object');
    });

    describe('create', function() {
      before(function(done) {
        this.teemo.player.create(c.TEST_PLATFORM, c.TEST_SUMMONER, function(err, profile) {
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
      it('should work with full platform names', function(done) {
        this.teemo.player.create(c.TEST_PLATFORM_FULL, c.TEST_SUMMONER, function(err, ignored) {
          should.not.exist(err);
          done();
        });
      });
      it('should return errors if api fails', function(done) {
        this.teemo.player.create(c.TEST_PLATFORM, 'guardsmanbo', function(err, noProfile) {
          should.not.exist(noProfile);
          done();
        });
      });
    });

    describe('recentGames', function() {
      before(function(done) {
        this.teemo.player.recentGames(c.TEST_PLATFORM, c.TEST_SUMMONER, function(err, games) {
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
      it('should work with full platform names', function(done) {
        this.teemo.player.recentGames(c.TEST_PLATFORM_FULL, c.TEST_SUMMONER, function(err, ignored) {
          should.not.exist(err);
          done();
        });
      });
    });

    describe('influencePoints', function() {
      before(function(done) {
        this.teemo.player.influencePoints(c.TEST_PLATFORM, c.TEST_SUMMONER, function(err, points) {
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
      it('should work with full platform names', function(done) {
        this.teemo.player.influencePoints(c.TEST_PLATFORM_FULL, c.TEST_SUMMONER, function(err, ignored) {
          should.not.exist(err);
          done();
        });
      });
    });
  });
});