const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const utils       = require('../lib/utils');

describe('Utils', function() {

  describe('#getMetaOfPage()', function() {

    it('Should return all the tags on the page', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/utils/meta.empty.html').toString();

      // pass the content
      utils.getMetaOfPage(content, function(err, meta) {

        if(err) assert.fail('Was not expecting a error');
        if(_.keys(meta).length > 0)
          assert.fail('Expected 0 keys, but got ' + _.keys(meta).join(','));
        done();

      });

    });

    it('Should return a configured meta tag "og-title"', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/utils/meta.og.html').toString();

      // pass the content
      utils.getMetaOfPage(content, function(err, meta) {

        if(err) assert.fail('Was not expecting a error');
        if(!meta['og-title'])
          assert.fail('Expected key was not returned');
        if(meta['og-title'] !== 'TEST')
          assert.fail('Expected value of key should be "TEST", but got "' + meta['og-title'] + '"');
        done();

      });

    });

    it('Should return a configured meta tag "Twitter:title"', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/utils/meta.case.html').toString();

      // pass the content
      utils.getMetaOfPage(content, function(err, meta) {

        if(err) assert.fail('Was not expecting a error');
        if(!meta['twitter-title'])
          assert.fail('Expected key was not returned');
        if(meta['twitter-title'] !== 'TEST')
          assert.fail('Expected value of key should be "TEST", but got "' + meta['twitter-title'] + '"');
        done();

      });

    });

    it('Should return a configured meta tag "twitter:title"', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/utils/meta.single.html').toString();

      // pass the content
      utils.getMetaOfPage(content, function(err, meta) {

        if(err) assert.fail('Was not expecting a error');
        if(!meta['twitter-title'])
          assert.fail('Expected key was not returned');
        if(meta['twitter-title'] !== 'TEST')
          assert.fail('Expected value of key should be "TEST", but got "' + meta['twitter-title'] + '"');
        done();

      });

    });

    it('Should not return any meta tags in the body', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/utils/meta.outside.html').toString();

      // pass the content
      utils.getMetaOfPage(content, function(err, meta) {

        if(err) assert.fail('Was not expecting a error');
        if(_.keys(meta).length !== 0)
          assert.fail('Expected 0 keys, but got ' + _.keys(meta).join(','))
        done();

      });

    });

    it('Should not return anything if no meta tags were found', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/utils/meta.empty.html').toString();

      // pass the content
      utils.getMetaOfPage(content, function(err, meta) {

        if(err) assert.fail('Was not expecting a error');
        if(_.keys(meta).length > 0)
          assert.fail('Expected 0 keys, but got ' + _.keys(meta).join(','))
        done();

      });

    });

  });

});
