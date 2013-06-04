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
  {'short': 'las', 'full': 'Latin_America_South'},
  {'short': 'lan', 'full': 'Latin_America_North'},
  {'short': 'tr', 'full': 'Turkey'}
];

/**
 * Converts a full platform string to its shorthand version.
 *
 * @param {String} platform The platform to shorten.
 * @param {Function} cb The callback, which is given two arguments:
 *   `(err, shortPlatform)`, where `shortPlatform` is the shorthand version of
 *   `platform`.
 */
var normalizePlatform = function(platform, cb) {
  if (_.size(platform) > 3) {
    var validPlatform = _.filter(PLATFORMS, {'full': platform});
    if (!_.isEmpty(validPlatform)) {
      platform = _.where(PLATFORMS, {'full': platform})[0].short;
    }
  }
  else if (_.isEmpty(_.filter(PLATFORMS, {'short': platform}))) {
    cb(new Error('node-resteemo - invalid platform'), null);
  }
  cb(platform);
};

/**
 * Parse JSON data from a request and refine said data.
 *
 * @param {Object} req The request instance to handle.
 * @param {Function} cb The callback, which is given two arguments:
 *   `(err, gift)`, where `gift` is the refined Object from the response that
 *   `req` gave.
 */
function responseHandler(req, cb) {
  req.on('response', function(res) {
    var response = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      response += chunk;
    });
    res.on('end', function() {
      try {
        response = json3.parse(response);
      }
      catch(e) {
        cb(new Error('node-resteemo - invalid json response'), null);
        return;
      }

      if (!response.success) {
        cb(new Error('node-resteemo - api failed'), null);
        return;
      }

      // Construct the final object.
      var info = response.data;
      var gift;
      if (_.contains(res.request.uri.path, 'recent_games')) {
        if (!info._success) {
          cb(new Error('node-resteemo - api failed to return recent games'), null);
        }
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
      cb(null, gift);
    });
  });
}

/**
 * Establishes the user agent of all API calls.
 *
 * @param {String} refererString The referer string to use in API calls.
 * @return {Object}
 */
module.exports = function(refererString) {
  if (!_.isString(refererString)) {
    throw new Error('node-resteemo - `refererString` not defined');
  }

  /**
   * Contructs the headers and options for the API request.
   *
   * @param {String} method The HTTP verb.
   * @param {String} path The path to query from the API endpoint.
   * @param {Function} cb The callback, which is passed to `responseHandler`.
   */
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

  /**
   * Begins the preparation for a GET request.
   *
   * @param {String} path The path to query from the API endpoint.
   * @param {Function} cb The callback, which is passed to `prepareRequest`.
   */
  var get = function(path, cb) {
    prepareRequest('GET', path, cb);
  };

  return {
    player: {
      create: function(platform, summoner, cb) {
        normalizePlatform(platform, function(shortPlatform) {
          get('/player/' + shortPlatform + '/' + summoner, cb);
        });
      },
      recentGames: function(platform, summoner, cb) {
        normalizePlatform(platform, function(shortPlatform) {
          get('/player/' + shortPlatform + '/' + summoner + '/recent_games', cb);
        });
      },
      influencePoints: function(platform, summoner, cb) {
        normalizePlatform(platform, function(shortPlatform) {
          get('/player/' + shortPlatform + '/' + summoner + '/influence_points', cb);
        });
      }
    }
  };
};
