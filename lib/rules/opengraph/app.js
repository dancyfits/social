/**
* get our required modules
**/
const _               = require('underscore');
const cheerio         = require('cheerio');
const url             = require('url');
const async           = require('async');
const request         = require('request');
const S               = require('string');
const SchemaUtils     = require('../../utils');

/**
* Checks that the required properties for a og
* app-id is present
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
      if(meta[ 'fb-app-id' ] !== null && 
          meta[ 'fb-app-id' ] !== undefined) {

        // get the length of app-id
        var appid = S(meta[ 'fb-app-id' ] || '').trim().s.toLowerCase();


        // first check if not empty
        if(S(appid).isEmpty() === true) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('fb:app_id') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'notice',
            message:      'Facebook App ID should not be blank',
            key:          'facebook.appid.empty'

          }, {

            display:      'code',
            message:      '$ was blank',
            identifiers:  [ 'fb:app_id' ],
            code:         build

          })

        } else {

          // check the graph API if this app/page exists
          return request({

            url:        'https://graph.facebook.com/' + appid,
            timeout:    10 * 1000

          }, function(err, response) {

            // ignore if we got a error
            if(err) {

              // output to log
              payload.error('Problem contacting graph.facebook.com', err);

              // problem connecting to Facebook
              return fn(null);

            }

            // if we got a 404 report back the error
            if((response || {}).statusCode === 404) {

              // get the lines of the file
              var lines = content.split('\n');

              // build a code snippet
              var build = payload.getSnippetManager().build(lines, -1, function(line) {

                return line.toLowerCase().indexOf('<meta') !== -1 && 
                          line.toLowerCase().indexOf('fb:app_id') !== -1;

              });

              // add the rule
              payload.addRule({

                type:         'error',
                message:      'Invalid Facebook app/page ID specified',
                key:          'facebook.appid.invalid'

              }, {

                display:      'code',
                message:      '$ does not represent a valid app/page on the $',
                identifiers:  [ appid, 'Facebook' ],
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