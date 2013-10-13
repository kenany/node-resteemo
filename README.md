# node-resteemo

[![Build Status](https://travis-ci.org/KenanY/node-resteemo.png)](https://travis-ci.org/KenanY/node-resteemo)
[![Dependency Status](https://gemnasium.com/KenanY/node-resteemo.png)](https://gemnasium.com/KenanY/node-resteemo)

[RESTeemo API](https://www.mashape.com/meepo/league-of-legends) wrapper for
Node.js.

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
- `teemo.player.ingame(platform, summoner, callback)`
- `teemo.player.recentGames(platform, summoner, callback)`
- `teemo.player.influencePoints(platform, summoner, callback)`
- `teemo.player.runes(platform, summoner, callback)`
- `teemo.player.mastery(platform, summoner, callback)`
- `teemo.player.leagues(platform, summoner, callback)`
- `teemo.player.honor(platform, summoner, callback)`
- `teemo.player.teams(platform, summoner, callback)`

Here, `season` is a Number.

- `teemo.player.rankedStats(platform, summoner, season, callback)`

### Team requests

Looks up information for a team using String `tag` or String `guid` on String
`platform`.

- `teemo.team(platform, tag, callback)`
- `teemo.team.leagues(platform, guid, callback)`

### Platform requests

- `teemo.freeWeek(platform, callback)`

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

### 2.4.1

- Updated lodash.isundefined to 2.2.x
- Updated lodash.isstring to 2.2.x
- Updated lodash.isnull to 2.2.x
- Updated lodash.isfunction to 2.2.x

View previous releases [here](https://github.com/KenanY/node-resteemo/wiki/Changelog).