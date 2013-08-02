var should = require('chai').should();

var scout = require('nock')('http://api.captainteemo.com');

var resteemo = require('../');
var teemo = resteemo('node-resteemo test suite');

var TEST_SUMMONER = 'guardsmanbob';
var TEST_PLATFORM = 'euw';
var TEST_PLATFORM_FULL = 'Europe_West';
var PLAYER_PATH = '/player/' + TEST_PLATFORM + '/' + TEST_SUMMONER;
var TEAM_PATH = '/team/' + TEST_PLATFORM;
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
    it('should return an object that is deep equal', function() {
      profile.should.be.an('object');
      profile.should.deep.equal(require(DATA_FOLDER + 'profile.json'));
    });
    it('should work with full platform names', function(done) {
      scout
        .get(PLAYER_PATH)
        .replyWithFile(200, DATA_FOLDER + 'profile.json');

      teemo.player(TEST_PLATFORM_FULL, TEST_SUMMONER, function(error, prof) {
        should.not.exist(error);
        should.exist(prof);
        prof.should.deep.equal(require(DATA_FOLDER + 'profile.json'));
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
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/ingame')
          .replyWithFile(200, DATA_FOLDER + 'ingame.json');

        teemo.player.ingame(TEST_PLATFORM, TEST_SUMMONER, function(error, game) {
          if (error) return done(error);
          this.game = game;
          done();
        });
      });
      after(function() {
        this.game = null;
      });

      it('should be a function', function() {
        teemo.player.ingame.should.be.a('function');
      });
      it('should return an object that is deep equal', function() {
        game.should.be.an('object');
        game.should.deep.equal(require(DATA_FOLDER + 'ingame.json'));
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
      it('should return an object that is deep equal', function() {
        games.should.be.an('object');
        games.should.deep.equal(require(DATA_FOLDER + 'recent_games.json'));
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
      it('should return an object that is deep equal', function() {
        points.should.be.an('object');
        points.should.deep.equal(require(DATA_FOLDER + 'influence_points.json'));
      });
    });

    describe('runes', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/runes')
          .replyWithFile(200, DATA_FOLDER + 'runes.json');

        teemo.player.runes(TEST_PLATFORM, TEST_SUMMONER, function(error, runes) {
          if (error) return done(error);
          this.runes = runes;
          done();
        });
      });
      after(function() {
        this.runes = null;
      });

      it('should be a function', function() {
        teemo.player.runes.should.be.a('function');
      });
      it('should return an object that is deep equal', function() {
        runes.should.be.an('object');
        runes.should.deep.equal(require(DATA_FOLDER + 'runes.json'));
      });
    });

    describe('mastery', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/mastery')
          .replyWithFile(200, DATA_FOLDER + 'mastery.json');

        teemo.player.mastery(TEST_PLATFORM, TEST_SUMMONER, function(error, pages) {
          if (error) return done(error);
          this.pages = pages;
          done();
        });
      });
      after(function() {
        this.pages = null;
      });

      it('should be a function', function() {
        teemo.player.mastery.should.be.a('function');
      });
      it('should return an object that is deep equal', function() {
        pages.should.be.an('object');
        pages.should.deep.equal(require(DATA_FOLDER + 'mastery.json'));
      });
    });

    describe('leagues', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/leagues')
          .replyWithFile(200, DATA_FOLDER + 'leagues.json');

        teemo.player.leagues(TEST_PLATFORM, TEST_SUMMONER, function(error, leagues) {
          if (error) return done(error);
          this.leagues = leagues;
          done();
        });
      });
      after(function() {
        this.leagues = null;
      });

      it('should be a function', function() {
        teemo.player.leagues.should.be.a('function');
      });
      it('should return an object that is deep equal', function() {
        leagues.should.be.an('object');
        leagues.should.deep.equal(require(DATA_FOLDER + 'leagues.json'));
      });
    });

    describe('honor', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/honor')
          .replyWithFile(200, DATA_FOLDER + 'honor.json');

        teemo.player.honor(TEST_PLATFORM, TEST_SUMMONER, function(error, honor) {
          if (error) return done(error);
          this.honor = honor;
          done();
        });
      });
      after(function() {
        this.honor = null;
      });

      it('should be a function', function() {
        teemo.player.honor.should.be.a('function');
      });
      it('should return an object that is deep equal', function() {
        honor.should.be.an('object');
        honor.should.deep.equal(require(DATA_FOLDER + 'honor.json'));
      });
    });

    describe('rankedStats', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/ranked_stats/season/3')
          .replyWithFile(200, DATA_FOLDER + 'ranked_stats.json');

        teemo.player.rankedStats(TEST_PLATFORM, TEST_SUMMONER, 3, function(error, stats) {
          if (error) return done(error);
          this.stats = stats;
          done();
        });
      });
      after(function() {
        this.stats = null;
      });

      it('should be a function', function() {
        teemo.player.rankedStats.should.be.a('function');
      });
      it('should return an object that is deep equal', function() {
        stats.should.be.an('object');
        stats.should.deep.equal(require(DATA_FOLDER + 'ranked_stats.json'));
      });
    });

    describe('teams', function() {
      before(function(done) {
        scout
          .get(PLAYER_PATH + '/teams')
          .replyWithFile(200, DATA_FOLDER + 'teams.json');

        teemo.player.teams(TEST_PLATFORM, TEST_SUMMONER, function(error, teams) {
          if (error) return done(error);
          this.teams = teams;
          done();
        });
      });
      after(function() {
        this.teams = null;
      });

      it('should be a function', function() {
        teemo.player.teams.should.be.a('function');
      });
      it('should return an object that is deep equal', function() {
        teams.should.be.an('object');
        teams.should.deep.equal(require(DATA_FOLDER + 'teams.json'));
      });
    });
  });

  describe('team', function() {
    before(function(done) {
      scout
        .get(TEAM_PATH + '/tag/WHEELZ')
        .replyWithFile(200, DATA_FOLDER + 'tag.json');

      teemo.team(TEST_PLATFORM, 'WHEELZ', function(error, matches) {
        if (error) return done(error);
        this.matches = matches;
        done();
      });
    });
    after(function() {
      this.matches = null;
    });

    it('should be a function', function() {
      teemo.team.should.be.a('function');
    });
    it('should return an object that is deep equal', function() {
      matches.should.be.an('object');
      matches.should.deep.equal(require(DATA_FOLDER + 'tag.json'));
    });

    describe('leagues', function() {
      before(function(done) {
        scout
          .get(TEAM_PATH + '/guid/TEAM-1e4caa75-aaf0-11e2-8fcc-782bcb4d0bb2/leagues')
          .replyWithFile(200, DATA_FOLDER + 'team_leagues.json');

        teemo.team.leagues(TEST_PLATFORM, 'TEAM-1e4caa75-aaf0-11e2-8fcc-782bcb4d0bb2', function(error, leagues) {
          if (error) return done(error);
          this.leagues = leagues;
          done();
        });
      });
      after(function() {
        this.leagues = null;
      });

      it('should be a function', function() {
        teemo.team.leagues.should.be.a('function');
      });
      it('should return an object', function() {
        leagues.should.be.an('object');
        leagues.should.deep.equal(require(DATA_FOLDER + 'team_leagues.json'));
      });
    });
  });
  describe('freeWeek', function() {
    before(function(done) {
      scout
        .get('/service-state/na/free-week')
        .replyWithFile(200, DATA_FOLDER + 'free_week.json');

      teemo.freeWeek('na', function(error, week) {
        if (error) return done(error);
        this.week = week;
        done();
      });
    });
    after(function() {
      this.week = null;
    });

    it('should be a function', function() {
      teemo.freeWeek.should.be.a('function');
    });
    it('should return an object that is deep equal', function() {
      week.should.be.an('object');
      week.should.deep.equal(require(DATA_FOLDER + 'free_week.json'));
    });
  });
});