/**
* get our required modules
**/
const _               = require('underscore');
const cheerio         = require('cheerio');
const url             = require('url');
const async           = require('async');
const S               = require('string');
const request         = require('request');
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
        if(type === 'app') {

          // get the appid
          var appid = S(meta['twitter-app-id-googleplay'] || '').trim().s.toLowerCase();

          // check if the playid was specified
          if( meta[ 'twitter-app-id-googleplay' ] === null && 
            meta[ 'twitter-app-id-googleplay' ] === undefined  ) {

            // get the lines of the file
            var lines = content.split('\n');

            // build a code snippet
            var build = payload.getSnippetManager().build(lines, -1, function(line) {

              return line.toLowerCase().indexOf('<meta') !== -1 && 
                        line.toLowerCase().indexOf('twitter:app:id:googleplay') !== -1;

            });

            // add the rule
            payload.addRule({

              type:         'notice',
              message:      'Missing App ID for a popular app store in the Twitter App Card details',
              key:          'twitter.card.appid.missing'

            }, {

              display:      'code',
              message:      '$ was not specified for the $',
              identifiers:  [ 'twitter:app:id:googleplay', 'Google Play Store (Android)' ],
              code:         build

            })

          } else if(S(appid).isEmpty() === true) {

            // get the lines of the file
            var lines = content.split('\n');

            // build a code snippet
            var build = payload.getSnippetManager().build(lines, -1, function(line) {

              return line.toLowerCase().indexOf('<meta') !== -1 && 
                        line.toLowerCase().indexOf('twitter:app:id:googleplay') !== -1;

            });

            // add the rule
            payload.addRule({

              type:         'notice',
              message:      'App ID for Twitter App Card is blank',
              key:          'twitter.card.appid.empty'

            }, {

              display:      'code',
              message:      '$ was blank, was expecting the app id for the $',
              identifiers:  [ 'twitter:app:id:googleplay', 'Google Play Store (Android)' ],
              code:         build

            })

          } else {

            // check if it exists
            return request.head({

              url:      'https://play.google.com/store/apps/details?id=' + appid,
              timeout:  10 * 1000

            }, function(err, response) {

              // ignore if we got a error
              if(err) {

                // output to log
                payload.error('Problem contacting play.google.com', err);

                // problem connecting to Twitter
                return fn(null);

              }

              // if we got a 404 report back the error
              if((response || {}).statusCode === 404) {

                // get the lines of the file
                var lines = content.split('\n');

                // build a code snippet
                var build = payload.getSnippetManager().build(lines, -1, function(line) {

                  return line.toLowerCase().indexOf('<meta') !== -1 && 
                            line.toLowerCase().indexOf('twitter:app:id:googleplay') !== -1;

                });

                // add the rule
                payload.addRule({

                  type:         'error',
                  message:      'Invalid App ID specified for Twitter App Card',
                  key:          'twitter.card.appid.invalid'

                }, {

                  display:      'code',
                  message:      '$ does not represent a valid mobile app on the $',
                  identifiers:  [ appid, 'Google Play Store (Android)' ],
                  code:         build

                })

              }

              // finish strong
              fn(null);

            });

          }

        }

      }

      // done
      fn(null);

    });

  });

};