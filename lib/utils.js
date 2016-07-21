/**
*
**/
const _               = require('underscore');
const cheerio         = require('cheerio');
const url             = require('url');
const async           = require('async');
const S               = require('string');

/**
* Object to expose
**/
var Utils = {};

/**
* Counts meta tags on the page that match 
* with the given prefix
**/
Utils.countPrefixedMetaTags = function(meta, prefix, fn) {

  // the count to return 
  var count = 0;

  // create a slug from the prefix given
  var slug = S(prefix).slugify().s;

  // get the keys
  var keys = _.keys(meta);

  // loop the keys
  for(var i = 0; i < keys.length; i++) {

    // check if the key matches
    if(keys[i].indexOf(slug) === 0) {

      // increment the count
      count++;

    }

  }

  // output the meta objs
  fn(null, count);

};

/**
* Returns a object that contains the slugged
* keys of all header on the page.
**/
Utils.getMetaOfPage = function(content, fn) {

  // use the twitter obj
  var meta = {};

  // load in the meta items
  var $ = cheerio.load(content);

  // loop all meta objects in the head
  $('head > meta').each(function(i, elem) {

    // ref of the link
    var rawName     = $(elem).attr('property') || $(elem).attr('name') || '';
    var rawValue    = $(elem).attr('content') || '';

    // clean up the params
    var name        = S( rawName.replace(/\:/gi, '-') ).slugify().s
    var value       = S( rawValue ).trim().s

    // set the key
    meta[ name ]    = value || '';

  });

  // output the meta objs
  fn(null, meta);

};

/**
* Expose the utils
**/ 
module.exports = exports = Utils;