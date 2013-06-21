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
 * @return {String} The shorthand equivalent of `platform` if one exists, else
 *   `null`.
 */
function normalizePlatform(platform) {
  var matchFromFullPlatform = _.find(PLATFORMS, {'full': platform});
  if (!_.isUndefined(matchFromFullPlatform)) {
    return matchFromFullPlatform['short'];
  }

  var matchFromShortPlatform = _.find(PLATFORMS, {'short': platform});
  if (!_.isUndefined(matchFromShortPlatform)) {
    return platform;
  }

  return null;
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

      var hasSecondSuccess;
      switch (false) {
        case !(_.contains(res.request.uri.path, 'recent_games')):
          hasSecondSuccess = true;
          break;
        case !(_.contains(res.request.uri.path, 'runes')):
          hasSecondSuccess = true;
          break;
        case !(_.contains(res.request.uri.path, 'mastery')):
          hasSecondSuccess = true;
          break;
        case !(_.contains(res.request.uri.path, 'leagues')):
          hasSecondSuccess = true;
          break;
        default:
          hasSecondSuccess = false;
      }

      if (hasSecondSuccess) {
        if (!response.data._success) {
          var error = brandError('api failed at second success check');
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

  /**
   * Sets up a player request.
   *
   * @private
   * @param {String} platform
   * @param {String} summoner
   * @param {String} path
   * @param {Function} callback
   */
  function playerRequest(platform, summoner, path, callback) {
    var shortPlatform = normalizePlatform(platform);
    if (_.isNull(shortPlatform)) {
      var error = brandError('invalid platform');
      return callback(error);
    }

    if (_.isNull(path)) {
      path = '';
    } else {
      path = '/' + path;
    }

    get('/player/' + shortPlatform + '/' + summoner + path, callback);
  }

  var teemo = {};

  /**
   * Returns primarily ID-based data for String `summoner` on String `platform`.
   * Account and summoner IDs are not unique across multiple platforms.
   *
   * @public
   * @param {String} platform
   * @param {String} summoner
   * @param {Function} callback Used as `callback(error, profile)` where
   *   `profile` is the API response as an Object.
   */
  teemo.player = function(platform, summoner, callback) {
    playerRequest(platform, summoner, null, callback);
  };

  /**
   * Returns last 10 matches (order is random) for String `summoner` on String
   * `platform`.
   *
   * @public
   * @param {String} platform
   * @param {String} summoner
   * @param {Function} callback Used as `callback(error, games)` where `games`
   *   is the API response as an Object.
   */
  teemo.player.recentGames = function(platform, summoner, callback) {
    playerRequest(platform, summoner, 'recent_games', callback);
  };

  /**
   * Returns lifetime influence point gains for String `summoner` on String
   * `platform`.
   *
   * @public
   * @param {String} platform
   * @param {String} summoner
   * @param {Function} callback Used as `callback(error, points)` where `points`
   *   is the API response as an Object.
   */
  teemo.player.influencePoints = function(platform, summoner, callback) {
    playerRequest(platform, summoner, 'influence_points', callback);
  };

  /**
   * Returns runepages for String `summoner` on String `platform`.
   *
   * @public
   * @param {String} platform
   * @param {String} summoner
   * @param {Function} callback Used as `callback(error, runes)` where `runes`
   *   is the API response as an Object.
   */
  teemo.player.runes = function(platform, summoner, callback) {
    playerRequest(platform, summoner, 'runes', callback);
  };

  /**
   * Returns mastery pages for String `summoner` on String `platform`.
   *
   * @public
   * @param {String} platform
   * @param {String} summoner
   * @param {Function} callback Used as `callback(error, pages)` where `pages`
   *   is the API response as an Object.
   */
  teemo.player.mastery = function(platform, summoner, callback) {
    playerRequest(platform, summoner, 'mastery', callback);
  };

  /**
   * Returns Season 3 Leagues info.
   *
   * @public
   * @param {String} platform
   * @param {String} summoner
   * @param {Function} callback Used as `callback(error, leagues)` where
   *   `leagues` is the API response as an Object.
   */
  teemo.player.leagues = function(platform, summoner, callback) {
    playerRequest(platform, summoner, 'leagues', callback);
  };

  return teemo;
};