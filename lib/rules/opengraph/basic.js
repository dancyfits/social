/**
* get our required modules
**/
const _               = require('underscore');
const cheerio         = require('cheerio');
const url             = require('url');
const async           = require('async');
const S               = require('string');
const SchemaUtils     = require('../../utils');

// the required keys
var REQUIRED_PROPERTIES = [

  'title',
  'description',
  'site_name',
  'image'

];

/**
* Should check the basic output
**/
module.exports = exports = function(payload, fn) {

  // data
  var data = payload.getData();

  // get the content
  payload.getPageContent(function(err, content) {

    // check for a error
    if(err) {

      // output the error
      payload.error('Something went wrong while trying to get the page content', err);

      // done
      return fn(err);

    }

    // check that the content is not blank
    if(S(content).isEmpty() === true) return fn(null);

    // get the meta data
    SchemaUtils.getMetaOfPage(content, function(err, meta) {

      // did we get a error ?
      if(err) {

        // output err
        payload.error('Something went wrong while retrieving the meta tags', err);

        // done
        return fn(err);

      }

      // count if we have any opengraph tags
      SchemaUtils.countPrefixedMetaTags(meta, 'og-', function(err, count) {

        // check for a error
        if(err) {

          // output the error
          payload.error('Something went wrong while trying to count the meta tags that match "og-"', err);

          // stop
          return fn(err);

        }

        // only if there are tags defined
        if(count === 0) {

          // debug
          payload.debug('Skipping basic requirements check as no "og:*" properties were found');

          // finish here
          return fn(null);

        }

        // loop all the required keys
        for(var i = 0; i < REQUIRED_PROPERTIES.length; i++) {

          // get the object value
          var value = meta[ 'og-' + S(REQUIRED_PROPERTIES[i]).slugify().s ];

          // check if the key is specfied
          if( S(value || '').isEmpty() !== true ) continue;

          // add the rule
          payload.addRule({

            type:         'error',
            message:      'Missing a required property for Open Graph',
            key:          'og.required'

          }, {

            display:      'text',
            message:      'The required property $ is empty or missing',
            identifiers:  [ 'og:' + REQUIRED_PROPERTIES[i] ]

          });

        }

        // done
        fn(null);

      });

    });

  });

};