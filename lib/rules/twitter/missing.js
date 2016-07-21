/**
* get our required modules
**/
const _               = require('underscore');
const cheerio         = require('cheerio');
const url             = require('url');
const async           = require('async');
const S               = require('string');
const SchemaUtils     = require('../../utils');

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
      SchemaUtils.countPrefixedMetaTags(meta, 'twitter-', function(err, count) {

        // check for a error
        if(err) {

          // output the error
          payload.error('Something went wrong while trying to count the meta tags that match "og-"', err);

          // stop
          return fn(err);

        }

        // ok according to type should we return the error 
        if(count === 0) {

          // well when it was not respecified
          payload.addRule({

            type:       'notice',
            message:    'Missing Twitter tags to control how website page previews when sharing',
            key:        'twitter.card.missing'

          })

        }

        // done
        fn(null);

      });

    });

  });

};