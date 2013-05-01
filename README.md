# node-resteemo

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

#### `teemo.player.create(platform, summoner)`

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

#### `teemo.player.recentGames(summoner, platform)`

> **Not ready for use**

Returns an Array of the last 10 matches (order is random) for String `summoner`
on String `platform`.

``` javascript
teemo.player.recentGames('euw', 'guardsmanbob', function(err, games) {
  if (err) throw err;

  // Do stuff with Array `games`.
}));
```

#### `teemo.player.influencePoints(summoner, platform)`

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
</table>

## Release notes

### 1.1.0

- Add `teemo.player.influencePoints(summoner, platform)`