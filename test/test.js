var should = require('chai').should();

var scout = require('nock')('https://teemojson.p.mashape.com');

var resteemo = require('../');
var teemo = resteemo('node-resteemo test suite');

var TEST_SUMMONER = 'guardsmanbob';
var TEST_PLATFORM = 'euw';
var TEST_PLATFORM_FULL = 'Europe_West';
var PLAYER_PATH = '/player/' + TEST_PLATFORM + '/' + TEST_SUMMONER;
var TEAM_PATH = '/team/' + TEST_PLATFORM;
var DATA_FOLDER = __dirname + '/data/';

var shouldShare = function(fn, file) {
  it('should be a function', function() {
    fn.should.be.a('function');
  });
  it('should return an object', function() {
    this.response.should.be.an('object');
  });
  it('should return the correct response', function() {
    this.response.should.deep.equal(require(file));
  });
};

describe('node-resteemo', function() {
  it('should export a function', function() {
    resteemo.should.be.a('function');
  });
  it('should return an object', function() {
    teemo.should.be.an('object');
  });
  it('should throw error if api key is not provided', function() {
    resteemo.should.throw(/apiKey/);
  });

  describe('player', function() {
    beforeEach(function(done) {
      var that = this;

      scout
        .get(PLAYER_PATH)
        .replyWithFile(200, DATA_FOLDER + 'profile.json');

      teemo.player(TEST_PLATFORM, TEST_SUMMONER, function(error, profile) {
        if (error) return done(error);
        that.response = profile;
        done();
      });
    });
    afterEach(function() {
      this.response = null;
    });

    shouldShare(teemo.player, DATA_FOLDER + 'profile.json');

    it('should work with full platform names', function(done) {
      scout
        .get(PLAYER_PATH)
        .replyWithFile(200, DATA_FOLDER + 'profile.json');

      teemo.player(TEST_PLATFORM_FULL, TEST_SUMMONER, function(error, response) {
        should.not.exist(error);
        should.exist(response);
        response.should.deep.equal(require(DATA_FOLDER + 'profile.json'));
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
    it('should return error if second api call fails', function(done) {
      scout
        .get('/player/' + TEST_PLATFORM + '/guardsmanbob')
        .replyWithFile(503, DATA_FOLDER + 'error-second.json');

      teemo.player(TEST_PLATFORM, 'guardsmanbob', function(error, nothing) {
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

    describe('ingame', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/ingame')
          .replyWithFile(200, DATA_FOLDER + 'ingame.json');

        teemo.player.ingame(TEST_PLATFORM, TEST_SUMMONER, function(error, game) {
          if (error) return done(error);
          that.response = game;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.ingame, DATA_FOLDER + 'ingame.json');
    });

    describe('recentGames', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/recent_games')
          .replyWithFile(200, DATA_FOLDER + 'recent_games.json');

        teemo.player.recentGames(TEST_PLATFORM, TEST_SUMMONER, function(error, games) {
          if (error) return done(error);
          that.response = games;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.recentGames, DATA_FOLDER + 'recent_games.json');
    });

    describe('influencePoints', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/influence_points')
          .replyWithFile(200, DATA_FOLDER + 'influence_points.json');

        teemo.player.influencePoints(TEST_PLATFORM, TEST_SUMMONER, function(error, points) {
          if (error) return done(error);
          that.response = points;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.influencePoints, DATA_FOLDER + 'influence_points.json');
    });

    describe('runes', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/runes')
          .replyWithFile(200, DATA_FOLDER + 'runes.json');

        teemo.player.runes(TEST_PLATFORM, TEST_SUMMONER, function(error, runes) {
          if (error) return done(error);
          that.response = runes;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.runes, DATA_FOLDER + 'runes.json');
    });

    describe('mastery', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/mastery')
          .replyWithFile(200, DATA_FOLDER + 'mastery.json');

        teemo.player.mastery(TEST_PLATFORM, TEST_SUMMONER, function(error, pages) {
          if (error) return done(error);
          that.response = pages;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.mastery, DATA_FOLDER + 'mastery.json');
    });

    describe('leagues', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/leagues')
          .replyWithFile(200, DATA_FOLDER + 'leagues.json');

        teemo.player.leagues(TEST_PLATFORM, TEST_SUMMONER, function(error, leagues) {
          if (error) return done(error);
          that.response = leagues;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.leagues, DATA_FOLDER + 'leagues.json');
    });

    describe('honor', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/honor')
          .replyWithFile(200, DATA_FOLDER + 'honor.json');

        teemo.player.honor(TEST_PLATFORM, TEST_SUMMONER, function(error, honor) {
          if (error) return done(error);
          that.response = honor;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.honor, DATA_FOLDER + 'honor.json');
    });

    describe('rankedStats', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/ranked_stats/season/3')
          .replyWithFile(200, DATA_FOLDER + 'ranked_stats.json');

        teemo.player.rankedStats(TEST_PLATFORM, TEST_SUMMONER, 3, function(error, stats) {
          if (error) return done(error);
          that.response = stats;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.rankedStats, DATA_FOLDER + 'ranked_stats.json');
    });

    describe('teams', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(PLAYER_PATH + '/teams')
          .replyWithFile(200, DATA_FOLDER + 'teams.json');

        teemo.player.teams(TEST_PLATFORM, TEST_SUMMONER, function(error, teams) {
          if (error) return done(error);
          that.response = teams;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.player.teams, DATA_FOLDER + 'teams.json');
    });
  });

  describe('team', function() {
    beforeEach(function(done) {
      var that = this;

      scout
        .get(TEAM_PATH + '/tag/WHEELZ')
        .replyWithFile(200, DATA_FOLDER + 'tag.json');

      teemo.team(TEST_PLATFORM, 'WHEELZ', function(error, matches) {
        if (error) return done(error);
        that.response = matches;
        done();
      });
    });
    afterEach(function() {
      this.response = null;
    });

    shouldShare(teemo.team, DATA_FOLDER + 'tag.json');

    describe('leagues', function() {
      beforeEach(function(done) {
        var that = this;

        scout
          .get(TEAM_PATH + '/guid/TEAM-1e4caa75-aaf0-11e2-8fcc-782bcb4d0bb2/leagues')
          .replyWithFile(200, DATA_FOLDER + 'team_leagues.json');

        teemo.team.leagues(TEST_PLATFORM, 'TEAM-1e4caa75-aaf0-11e2-8fcc-782bcb4d0bb2', function(error, leagues) {
          if (error) return done(error);
          that.response = leagues;
          done();
        });
      });
      afterEach(function() {
        this.response = null;
      });

      shouldShare(teemo.team.leagues, DATA_FOLDER + 'team_leagues.json');
    });
  });
  describe('freeWeek', function() {
    beforeEach(function(done) {
      var that = this;

      scout
        .get('/service-state/na/free-week')
        .replyWithFile(200, DATA_FOLDER + 'free_week.json');

      teemo.freeWeek('na', function(error, week) {
        if (error) return done(error);
        that.response = week;
        done();
      });
    });
    afterEach(function() {
      this.response = null;
    });

    shouldShare(teemo.freeWeek, DATA_FOLDER + 'free_week.json');
  });
});