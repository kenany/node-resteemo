# node-resteemo

[![Build Status](https://travis-ci.org/KenanY/node-resteemo.png)](https://travis-ci.org/KenanY/node-resteemo)
[![Dependency Status](https://gemnasium.com/KenanY/node-resteemo.png)](https://gemnasium.com/KenanY/node-resteemo)

RESTeemo API wrapper for Node. Powered by Quickfind.

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
  // =>   summoner: {
  // =>     id: 20820067
  // =>   },
  // =>   account: {
  // =>     id: 24132405
  // =>   },
  // =>   name: 'Guardsman Bob',
  // =>   internalName: 'guardsmanbob',
  // =>   level: 30,
  // =>   icon: 30
  // => }
});
```

#### `teemo.player.recentGames(platform, summoner, callback)`

> **Not ready for use**

Returns an Array of the last 10 matches (order is random) for String `summoner`
on String `platform`.

``` javascript
teemo.player.recentGames('euw', 'guardsmanbob', function(err, games) {
  if (err) throw err;

  // Do stuff with Array `games`.
}));
```

#### `teemo.player.influencePoints(platform, summoner, callback)`

Returns lifetime influence point gains for String `summoner` on String
`platform`.

``` javascript
teemo.player.recentGames('euw', 'guardsmanbob', function(err, points) {
  if (err) throw err;

  console.log(points);
  // => 596797
}));
```

## Supported platforms

Below is a table of the platforms that RESTeemo claims it supports. When polling
the API, the shorthand version of a platform is necessary, but you can pass the
full version to node-resteemo if you'd like and it will internally use the
shorthand version.

<table>
  <tr>
    <th>Short</th>
    <th>Full</th>
    <th>Actually supported</th>
  </tr>
  <tr>
    <td>na</td>
    <td>North_America</td>
    <td>✔</td>
  </tr>
  <tr>
    <td>br</td>
    <td>Brasil</td>
    <td>✔</td>
  </tr>
  <tr>
    <td>euw</td>
    <td>Europe_West</td>
    <td>✔</td>
  </tr>
  <tr>
    <td>eun</td>
    <td>Europe_East</td>
    <td>✔</td>
  </tr>
  <tr>
    <td>ru</td>
    <td>Russia</td>
    <td>✘</td>
  </tr>
  <tr>
    <td>tr</td>
    <td>Turkey</td>
    <td>✘</td>
  </tr>
</table>

## Release notes

### 1.1.0

- Add `.player.influencePoints(platform, summoner, cb)`