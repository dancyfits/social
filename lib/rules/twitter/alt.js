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
      if(meta[ 'twitter-image-alt' ] !== null && 
          meta[ 'twitter-image-alt' ] !== undefined) {

        // get the length of alt
        var alt         = S(meta[ 'twitter-image-alt' ] || '').trim().s;
        var len         = alt.length;

        // check if not empty
        if(len == 0) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('twitter:alt') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'error',
            message:      'alt property for Twitter card is empty',
            key:          'twitter.card.alt.empty'

          }, {

            display:      'code',
            message:      '$ is not required, but must not be blank',
            identifiers:  [ 'twitter:alt' ],
            code:         build

          })

        }

        // check if more than max
        if(len > 200) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('twitter:image:alt') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'notice',
            message:      'Maximum size of Twitter alt property is 200 characters',
            key:          'twitter.card.alt.length'

          }, {

            message:      '$ is $ characters long, while Twitter will truncate at $',
            identifiers:  [ alt, len, 200 ],

            display:      'code',
            code:         build

          })

        }

      }

      // done
      fn(null);

    });

  });

};