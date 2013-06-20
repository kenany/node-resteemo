var _ = require('lodash');
var request = require('request');

var ENDPOINT = 'http://api.captainteemo.com';
var PLATFORMS = [
  {'short': 'na', 'full': 'North_America'},
  {'short': 'br', 'full': 'Brasil'},
  {'short': 'ru', 'full': 'Russia'},
  {'short': 'euw', 'full': 'Europe_West'},
  {'short': 'eun', 'full': 'Europe_East'},
  {'short': 'tr', 'full': 'Turkey'},
  {'short': 'las', 'full': 'Latin_America_South'},
  {'short': 'lan', 'full': 'Latin_America_North'}
];

/**
 * Create an error whose message begins with 'node-resteemo - '.
 *
 * @private
 * @param {String} value The error message.
 * @return {Error}
 */
function brandError(value) {
  return new Error('node-resteemo - ' + value);
}

/**
 * Converts a full platform string to its shorthand equivalent.
 *
 * @private
 * @param {String} platform The platform to shorten.
 * @param {Function} callback The callback, which is given two arguments:
 *   `(err, shortPlatform)`, where `shortPlatform` is the shorthand equivalent
 *   of `platform`.
 */
function normalizePlatform(platform, callback) {
  var error = null;
  var matchFromFullPlatform = _.find(PLATFORMS, {'full': platform});
  var matchFromShortPlatform = _.find(PLATFORMS, {'short': platform});

  if (!_.isUndefined(matchFromFullPlatform)) {
    return callback(error, matchFromFullPlatform['short']);
  }

  if (!_.isUndefined(matchFromShortPlatform)) {
    return callback(error, platform);
  }

  error = brandError('invalid platform');

  callback(error, null);
}

/**
 * Parse JSON data from a request.
 *
 * @private
 * @param {Object} req The request instance to handle.
 * @param {Function} callback The callback, which is given two arguments:
 *   `(err, response)`, where `response` is a JSON Object from `req`.
 */
function responseHandler(req, callback) {
  req.on('response', function(res) {
    var response = '';
    res.setEncoding('utf8');
    res.on('data', function(chunk) {
      response += chunk;
    });
    res.on('end', function() {
      try {
        response = JSON.parse(response);
      }
      catch(e) {
        var error = brandError('invalid json response');
        return callback(error);
      }

      if (!response.success) {
        var error = brandError('api failed');
        return callback(error);
      }

      if (_.contains(res.request.uri.path, 'recent_games')) {
        if (!response.data._success) {
          var error = brandError('api failed to return recent games');
          return callback(error);
        }
      }

      callback(null, response);
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
    var error = brandError('`refererString` not defined');
    throw error;
  }

  /**
   * Contructs the headers and options for the API request.
   *
   * @private
   * @param {String} method The HTTP verb.
   * @param {String} path The path to query from the API endpoint.
   * @param {Function} callback The callback, which is passed to
   *   `responseHandler`.
   */
  function prepareRequest(method, path, callback) {
    if (!_.isFunction(callback)) {
      var error = brandError('missing callback');
      throw error;
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
    responseHandler(req, callback);
    req.end();
  }

  /**
   * Begins the preparation for a GET request.
   *
   * @private
   * @param {String} path The path to query from the API endpoint.
   * @param {Function} callback The callback, which is passed to
   *   `prepareRequest`.
   */
  function get(path, callback) {
    prepareRequest('GET', path, callback);
  }

  return {
    player: {
      create: function(platform, summoner, callback) {
        normalizePlatform(platform, function(error, shortPlatform) {
          get('/player/' + shortPlatform + '/' + summoner, callback);
        });
      },
      recentGames: function(platform, summoner, callback) {
        normalizePlatform(platform, function(error, shortPlatform) {
          get('/player/' + shortPlatform + '/' + summoner + '/recent_games', callback);
        });
      },
      influencePoints: function(platform, summoner, callback) {
        normalizePlatform(platform, function(error, shortPlatform) {
          get('/player/' + shortPlatform + '/' + summoner + '/influence_points', callback);
        });
      }
    }
  };
};