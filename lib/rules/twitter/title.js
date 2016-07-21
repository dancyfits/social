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
      if(meta[ 'twitter-title' ] !== null && 
          meta[ 'twitter-title' ] !== undefined) {

        // get the length of title
        var title = S(meta[ 'twitter-title' ] || '').trim().s;
        var len         = title.length;

        // check if not empty
        if(len == 0) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('twitter:title') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'error',
            message:      'title property for Twitter card is empty',
            key:          'twitter.card.title.empty'

          }, {

            display:      'code',
            message:      '$ must not be blank',
            identifiers:  [ 'twitter:title' ],
            code:         build

          })

        }

        // check if more than max
        if(len > 70) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('twitter:title') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'notice',
            message:      'Maximum size of Twitter title property is 70 characters',
            key:          'twitter.card.title.length'

          }, {

            message:      '$ is $ characters long, while Twitter will truncate at $',
            identifiers:  [ title, len, 70 ],

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