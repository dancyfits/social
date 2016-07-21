/**
* get our required modules
**/
const _               = require('underscore');
const cheerio         = require('cheerio');
const url             = require('url');
const async           = require('async');
const S               = require('string');
const request         = require('request');
const sizeOf          = require('image-size');
const SchemaUtils     = require('../../utils');

/**
* Checks that the required properties for a og
* card is present
**/
module.exports = exports = function(payload, fn) {

  // make the callback a singleton just to be safe
  // with us requesting out to the network and all
  var callback = _.once(fn);

  // data
  var data = payload.getData();

  // get the content
  payload.getPageContent(function(err, content) {

    // check for a error
    if(err) {

      // output the error
      payload.error('Something went wrong while trying to get the page content', err);

      // done
      return callback(err);

    }

    // check that the content is not blank
    if(S(content).isEmpty() === true) return callback(null);

    // get the meta data
    SchemaUtils.getMetaOfPage(content, function(err, meta) {

      // did we get a error ?
      if(err) {

        // output err
        payload.error('Something went wrong while retrieving the meta tags', err);

        // done
        return callback(err);

      }

      // check if defined
      if(meta[ 'og-image' ] !== null && 
          meta[ 'og-image' ] !== undefined) {

        // get the length of image
        var image = S(meta[ 'og-image' ] || '').trim().s;

        // check if not empty
        if(S(image).isEmpty() === true) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('og:image') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'error',
            message:      'Image property for og card is empty',
            key:          'og.image.empty'

          }, {

            display:      'code',
            message:      '$ must not be blank',
            identifiers:  [ 'og:image' ],
            code:         build

          })

          // finish here
          return callback(null);

        }

        // check if not empty
        if((image || '').toLowerCase().indexOf('http://') !== 0 && 
            (image || '').toLowerCase().indexOf('https://') !== 0) {

          // get the lines of the file
          var lines = content.split('\n');

          // build a code snippet
          var build = payload.getSnippetManager().build(lines, -1, function(line) {

            return line.toLowerCase().indexOf('<meta') !== -1 && 
                      line.toLowerCase().indexOf('og:image') !== -1;

          });

          // add the rule
          payload.addRule({

            type:         'error',
            message:      'OG image should start with http:// or https://',
            key:          'og.image.protocol'

          }, {

            display:      'code',
            message:      '$ configured on the $ property must start with either http:// or https://',
            identifiers:  [ image, 'og:image' ],
            code:         build

          })

          // finish here
          return callback(null);

        }

        // the chunks that we have received
        var chunks      = [];
        var statusCode  = null;

        // do the actual request
        var client = request
          .get({

            url:      image,
            timeout:  10 * 1000

          })
          .on('data', function(chunk) {

            // sanity check
            if(!chunk) return;

            // push up to the chunk
            chunks.push(chunk);

          })
          .on('error', function(err) {
            
            // get the lines of the file
            var lines = content.split('\n');

            // build a code snippet
            var build = payload.getSnippetManager().build(lines, -1, function(line) {

              return line.toLowerCase().indexOf('<meta') !== -1 && 
                        line.toLowerCase().indexOf('og:image') !== -1;

            });

            // build the message
            payload.addRule({

              type:       'error',
              message:    'Image supplied by the OpenGraph returned an error',
              key:        'og.image.error'

            }, {

              display:      'code',
              message:      'Problem downloading og preview image $',
              identifiers:  [ image ],
              code:         build

            });

            // end it here
            client.end();

            // done
            callback(null);

          })
          .on('response', function(response) {

            // set the status code if we got it
            statusCode = (response || {}).statusCode || null;
            
            // check if this was not a 200
            if(response && response.statusCode !== 200) {

              // get the lines of the file
              var lines = content.split('\n');

              // build a code snippet
              var build = payload.getSnippetManager().build(lines, -1, function(line) {

                return line.toLowerCase().indexOf('<meta') !== -1 && 
                          line.toLowerCase().indexOf('og:image') !== -1;

              });

              // build the message
              payload.addRule({

                type:       'error',
                message:    'Image supplied by the OpenGraph returned an error',
                key:        'og.image.error'

              }, {

                display:      'code',
                message:      'og preview image $, returns a $ status code',
                identifiers:  [ image, 1 * response.statusCode ],
                code:         build

              });

            }

          })
          .on('end', function() {

            // check if we actually got a status code
            if(statusCode !== null && chunks.length > 0) {

              // check the size
              var dimensions = null;

              // try to find the size
              try {

                // parse the dimensions
                dimensions = sizeOf(Buffer.concat(chunks));

              } catch(err) {

                // log the error
                payload.error('Problem checking the size of the image of ' + chunks.length + ' chunks', err);

              }

              // check the size
              if(dimensions && 
                  (dimensions.width < 200 || 
                    dimensions.height < 200)) {

                // parse the lines
                var lines = content.split('\n');

                // build a code snippet
                var build = payload.getSnippetManager().build(lines, -1, function(line) {

                  return line.toLowerCase().indexOf('<meta') !== -1 && 
                            line.toLowerCase().indexOf('og:image') !== -1;

                });

                // build the message
                payload.addRule({

                  type:       'error',
                  message:    'Image supplied by the OpenGraph was smaller than the minimum',
                  key:        'og.image.dimensions'

                }, {

                  display:      'code',
                  message:      'OpenGraph preview image $, was $x$ but should (at a mimimum) be $px by $px',
                  identifiers:  [ image, dimensions.width, dimensions.height, 200, 200 ],
                  code:         build

                });

              }

            }

            // check the file size
            if(chunks.length > 0) {

              // get the size of the buffer
              var size = Buffer.byteLength(Buffer.concat(chunks), 'binary');

              // check if this is more than a megabyte,
              // and avoid tracking pixels which tend be 
              // at the 30 byte mark
              if(size > 30 && 
                  size > 5 * 1024 * 1000) {

                // it's bigger than 1 megabyte ...
                var lines = content.split('\n');

                // build a code snippet
                var build = payload.getSnippetManager().build(lines, -1, function(line) {

                  return line.toLowerCase().indexOf('<meta') !== -1 && 
                            line.toLowerCase().indexOf('og:image') !== -1;

                });

                // build the message
                payload.addRule({

                  type:       'error',
                  message:    'Image supplied by og image property exceeds the maximum size',
                  key:        'og.image.size'

                }, {

                  display:      'code',
                  message:      'og preview image $, was $kb which is more than the 5mb maximum',
                  identifiers:  [ image, Math.round(((size / 1024) * 100)) / 100 ],
                  code:         build

                });

              }

            }

            // done
            callback(null);

          });

      } else {

        // done
        callback(null);

      }

    });

  });

};
