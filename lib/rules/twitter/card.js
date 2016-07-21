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
* Checks that the required properties for a Twitter
* card is present
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

      // check if defined
      if(meta[ 'twitter-card' ] !== null && 
          meta[ 'twitter-card' ] !== undefined) {

        // get the length of card
        var type = S(meta[ 'twitter-card' ] || '').trim().s.toLowerCase();

        // check if this is a valid type
        if([

          'summary',
          'summary_large_image',
          'photo',
          'gallery',
          'app',
          'player',
          'product'

        ].indexOf(type) === -1) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('twitter:card') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'error',
            message:      'Invalid Twitter card type',
            key:          'twitter.card.type'

          }, {

            display:      'code',
            message:      '$',
            identifiers:  [ 'twitter:card' ],
            code:         build

          })

        }

      }

      // done
      fn(null);

    });

  });

};