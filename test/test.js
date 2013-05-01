var chai = require('chai');
var nock = require('nock');
var resteemo = require('../');
var expect = chai.expect;
var should = chai.should();

var testSummoner = 'guardsmanbob';
var testPlatform = 'euw';

// Below, RESTeemo's API is "mocked." This allows us to test node-resteemo
// without actually querying the online API.
//
// Good: faster tests
// Bad: suite won't tell us when a RESTeemo update is not backwards-compatible
var scout = nock('http://api.captainteemo.com')
  .get('/player/' + testPlatform + '/' + testSummoner)
  .replyWithFile(200, __dirname + '/data/profile.json')
  .get('/player/' + testPlatform + '/' + testSummoner + '/recent_games')
  .replyWithFile(200, __dirname + '/data/recent_games.json');

describe('node-resteemo', function() {
  before(function() {
    // A nice yordle who provides a referer string
    this.teemo = resteemo('node-resteemo test suite');

    // An evil yordle who wants to abuse the API
    this.veigar = resteemo;
  });

  it('should export a function', function() {
    resteemo.should.be.a('function');
  });

  it('should throw error if referrer string is not provided', function() {
    this.veigar.should.throw(/referrerString/);
  });

  describe('player', function() {
    it('should return profile ids', function(done) {
      this.teemo.player.create(testPlatform, testSummoner, function(err, profile) {
        profile.should.be.an('object');
        profile.summoner.id.should.be.a('number');
        profile.account.id.should.be.a('number');
        profile.name.should.be.a('string');
        profile.internalName.should.be.a('string');
        profile.level.should.be.a('number');
        profile.icon.should.be.a('number');
        done();
      });
    });

    it('should return recent games', function(done) {
      this.teemo.player.recentGames(testPlatform, testSummoner, function(err, games) {
        games.should.be.an('array');
        done();
      });
    });
  });
});