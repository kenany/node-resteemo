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

### Player requests

#### `teemo.player.create(platform, summoner, callback)`

Returns an Object `profile` containing ID-based data for String `summoner` on
String `platform`. Account and summoner IDs are not unique across platforms.

``` javascript
teemo.player.create('euw', 'guardsmanbob', function(err, profile) {
  if (err) throw err;

  console.log(profile);
  // => {
  // =>   "_": {
  // =>     "APP_ID": null
  // =>   },
  // =>   "success": true,
  // =>   "shard": "Europe_West:NGUxZmQyNzU5MDY0NGZmNThlODE4YmZkODc5OTc3OWIyNzVmMzQ0Nw",
  // =>   "data": {
  // =>     "accountId": 24132405,
  // =>     "summonerId": 20820067,
  // =>     "name": "Guardsman Bob",
  // =>     "icon": 30,
  // =>     "internalName": "guardsmanbob",
  // =>     "level": 30
  // =>   }
  // => }
});
```

#### `teemo.player.recentGames(platform, summoner, callback)`

Returns an Object which contains the last 10 matches (order is random) for
String `summoner` on String `platform`.

``` javascript
teemo.player.recentGames('euw', 'guardsmanbob', function(err, games) {
  if (err) throw err;

  console.log(games);
  // => {
  // =>   ...
  // => }
}));
```

#### `teemo.player.influencePoints(platform, summoner, callback)`

Returns lifetime influence point gains for String `summoner` on String
`platform`.

``` javascript
teemo.player.influencePoints('euw', 'guardsmanbob', function(err, points) {
  if (err) throw err;

  console.log(points);
  // => {
  // =>   "_": {
  // =>     "APP_ID": null
  // =>   },
  // =>   "success": true,
  // =>   "shard": "Europe_West:MjIwN2MxYmJmMzMwZWM2NTI3Y2U5MmZlNmVhNWZjYTk1Mzc1NWZjNQ",
  // =>   "player": {
  // =>     "accountId": 24132405,
  // =>     "summonerId": 20820067,
  // =>     "name": "Guardsman Bob",
  // =>     "icon": 30,
  // =>     "internalName": "guardsmanbob",
  // =>     "level": 30
  // =>   },
  // =>   "data": 596797
  // => }
}));
```

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

### 1.2.1

- Support Latin America platforms

View previous releases [here](https://github.com/KenanY/node-resteemo/wiki/Changelog).