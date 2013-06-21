# node-resteemo

[![Build Status](https://travis-ci.org/KenanY/node-resteemo.png)](https://travis-ci.org/KenanY/node-resteemo)
[![Dependency Status](https://gemnasium.com/KenanY/node-resteemo.png)](https://gemnasium.com/KenanY/node-resteemo)

RESTeemo API wrapper for Node. Powered by Quickfind.

![captain teemo on duty](https://a248.e.akamai.net/camo.github.com/32fb5a8ead7c5cdff5b8003b84b0a7189a05d67c/687474703a2f2f692e696d6775722e636f6d2f654964593746612e706e67)

## Installation

``` bash
$ npm install resteemo
```

## API

As per RESTeemo's Terms and Conditions, you must provide contact details in the
user agent of requests. node-resteemo will not fill in these details for you.

``` javascript
var teemo = require('resteemo')('string with contact info');
```

All functions are asynchronous. The callback is always executed as
`callback(error, response)`, where `response` is an Object unless there was an
error. Refer to RESTeemo's API docs for what each `response` looks like.

### Player requests

Looks up information for String `summoner` on String `platform`.

- `teemo.player(platform, summoner, callback)`
- `teemo.player.recentGames(platform, summoner, callback)`
- `teemo.player.influencePoints(platform, summoner, callback)`
- `teemo.player.runes(platform, summoner, callback)`
- `teemo.player.mastery(platform, summoner, callback)`

## Supported platforms

Below is a table of the platforms that RESTeemo supports. When polling
the API, the shorthand version of a platform is necessary, but you can pass the
full version to node-resteemo if you'd like and it will internally use the
shorthand version.

<table>
  <tr>
    <th>Short</th>
    <th>Full</th>
  </tr>
  <tr>
    <td>na</td>
    <td>North_America</td>
  </tr>
  <tr>
    <td>br</td>
    <td>Brasil</td>
  </tr>
  <tr>
    <td>ru</td>
    <td>Russia</td>
  </tr>
  <tr>
    <td>euw</td>
    <td>Europe_West</td>
  </tr>
  <tr>
    <td>eun</td>
    <td>Europe_East</td>
  </tr>
  <tr>
    <td>tr</td>
    <td>Turkey</td>
  </tr>
  <tr>
    <td>las</td>
    <td>Latin_America_South</td>
  </tr>
  <tr>
    <td>lan</td>
    <td>Latin_America_North</td>
  </tr>
</table>

## Release notes

### 2.0.0

- Response data is no longer modified (as expected from an API wrapper).
- [#2](https://github.com/KenanY/node-resteemo/issues/2): `player.create` is now simply `player`.
- [#4](https://github.com/KenanY/node-resteemo/issues/4): Use native JSON implementation instead of JSON 3.
- `null` is no longer passed as the second argument to callbacks if there's an error.
- Updated how some callbacks are passed around internally.
- Reduced internal redundancy by using a `playerRequest` function.
- Internal `normalizePlatform` function is now synchronous.
- Switched to using `.length` instead of `lodash.size` for Strings internally.
- Added `coverage` and `test` folders to `.npmignore`.
- Removed `node_modules` from `.npmignore` as it is ignored by default.
- Removed `CONTRIBUTING.md` from `.npmignore`.
- Added `license` field to `package.json`.
- Renamed `author.web` field to `author.url` in `package.json`.
- Removed "in Node" from `description` field in `package.json`.
- Removed "rest" keyword from `package.json`.
- Simplified `repository` field in `package.json`.
- Updated Lo-Dash to 1.3

View previous releases [here](https://github.com/KenanY/node-resteemo/wiki/Changelog).