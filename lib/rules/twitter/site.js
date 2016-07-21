/**
* get our required modules
**/
const _               = require('underscore');
const cheerio         = require('cheerio');
const url             = require('url');
const async           = require('async');
const S               = require('string');
const SchemaUtils     = require('../../utils');
const request         = require('request');

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
      if(meta[ 'twitter-site' ] !== null && 
          meta[ 'twitter-site' ] !== undefined) {

        // get the length of site
        var prefixedUserName  = S(meta[ 'twitter-site' ] || '').trim().s.toLowerCase();
        var username          = S(prefixedUserName).chompLeft('@').s;

        // the user should start with the @ symbol
        if(S(username).isEmpty() === true) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('twitter:site') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'error',
            message:      'Site property for Twitter card is empty',
            key:          'twitter.card.site.empty'

          }, {

            display:      'code',
            message:      '$ was blank',
            identifiers:  [ 'twitter:site' ],
            code:         build

          })

        } else if(prefixedUserName.indexOf('@') !== 0) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('twitter:site') !== -1;

          });

          // generate a meaningfull message
          var occurrenceMessage       = '$ should start with an $';
          var occurrenceIdentifiers   = [ 'twitter:card', '@' ];

          // check if we can just show the suggested username ?
          if(S(username).isEmpty() === false) {

            // add to message
            occurrenceMessage += ', did you mean $?';
            occurrenceIdentifiers.push('@' + username);

          }

          // add the rule
          payload.addRule({

            type:         'error',
            message:      'Invalid Twitter card type',
            key:          'twitter.card.site.prefix'

          }, {

            display:      'code',
            message:      occurrenceMessage,
            identifiers:  occurrenceIdentifiers,
            code:         build

          })

        } else {

          // right do a request then
          return request.head({

            url:      'https://twitter.com/' + username,
            timeout:  10 * 1000

          }, function(err, response, body) {

            // ignore if we got a error
            if(err) {

              // output to log
              payload.error('Problem contacting twitter.com', err);

              // problem connecting to Twitter
              return fn(err);

            }

            // if we got a 404 report back the error
            if((response || {}).statusCode === 404) {

              // get the lines of the file
              var lines = content.split('\n');

              // build a code snippet
              var build = payload.getSnippetManager().build(lines, -1, function(line) {

                return line.toLowerCase().indexOf('<meta') !== -1 && 
                          line.toLowerCase().indexOf('twitter:site') !== -1;

              });

              // add the rule
              payload.addRule({

                type:         'error',
                message:      'Invalid account specified for Twitter card',
                key:          'twitter.card.site.invalid'

              }, {

                display:      'code',
                message:      '$ could not be found on twitter.com',
                identifiers:  [ prefixedUserName ],
                code:         build

              })

            }

            // finish strong
            fn(null);

          });

        }

      }

      // done
      fn(null);

    });

  });

};
