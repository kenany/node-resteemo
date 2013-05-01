var json3 = require('json3');
var _ = require('lodash');
var request = require('request');

var ENDPOINT = 'http://api.captainteemo.com';
var PLATFORMS = [
  {'short': 'na', 'full': 'North_America'},
  {'short': 'br', 'full': 'Brasil'},
  {'short': 'euw', 'full': 'Europe_West'},
  {'short': 'eun', 'full': 'Europe_East'},
  {'short': 'ru', 'full': 'Russia'},
  {'short': 'tr', 'full': 'Turkey'}
];

function responseHandler(req, callback) {
  if (!_.isFunction(callback)) {
    throw new Error('node-resteemo - missing callback');
  }

  req.on('response', function(res) {
    var response = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      response += chunk;
    });
    res.on('end', function() {
      var err = 200 === res.statusCode ? null : res.statusCode;
      try {
        response = json3.parse(response);
      }
      catch(e) {
        err = 1;
        response = {error: {message: 'node-resteemo - invalid json response'}};
      }
      if (err) {
        err = {statusCode: err, response: response};
      }

      // Construct the final object.
      var info = response.data;
      var gift;
      if (_.contains(res.request.uri.path, 'recent_games')) {
        gift = info.gameStatistics.array;
      }
      else if (_.contains(res.request.uri.path, 'influence_points')) {
        gift = info;
      }
      else {
        gift = {
          summoner: {
            id: info.summonerId
          },
          account: {
            id: info.accountId
          },
          name: info.name,
          internalName: info.internalName,
          level: info.level,
          icon: info.icon
        };
      }
      callback(err, gift);
    });
  });
}

module.exports = function(refererString) {
  if (!_.isString(refererString)) {
    throw new Error('node-resteemo - `refererString` not defined');
  }

  function prepareRequest(method, path, cb) {
    if (!_.isFunction(cb)) {
      throw new Error('node-resteemo - missing callback');
    }

    var headers = {
      'Accept'    : 'application/json',
      'User-Agent': refererString
    };

    var requestOptions = {
      method : method,
      uri    : ENDPOINT + path,
      headers: headers
    };

    var req = request(requestOptions);
    responseHandler(req, cb);
    req.end();
  }

  var get = function(path, cb) {
    prepareRequest('GET', path, cb);
  };

  var prepareGet = function(platform, summoner, call, cb) {
    if (_.size(platform) > 3) {
      var validPlatform = _.filter(PLATFORMS, {'full': platform});
      if (!_.isEmpty(validPlatform)) {
        platform = _.where(PLATFORMS, {'full': platform})[0].short;
      }
    }
    else if (_.isEmpty(_.filter(PLATFORMS, {'short': platform}))) {
      throw new Error('node-resteemo - invalid platform');
    }

    if (_.isNull(call)) {
      get('/player/' + platform + '/' + summoner, cb);
    }
    else if (_.isEqual(call, '/recent_games')) {
      get('/player/' + platform + '/' + summoner + '/recent_games', cb);
    }
    else if (_.isEqual(call, '/influence_points')) {
      get('/player/' + platform + '/' + summoner + '/influence_points', cb);
    }
  };

  return {
    player: {
      create: function(platform, summoner, cb) {
        prepareGet(platform, summoner, null, cb);
      },
      recentGames: function(platform, summoner, cb) {
        prepareGet(platform, summoner, '/recent_games', cb);
      },
      influencePoints: function(platform, summoner, cb) {
        prepareGet(platform, summoner, '/influence_points', cb);
      }
    }
  };
};