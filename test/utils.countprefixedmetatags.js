const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const utils       = require('../lib/utils');

describe('Utils', function() {

  describe('#countPrefixedMetaTags()', function() {

    it('Should return 0 if no tags are present', function(done) {

      // pass the content
      utils.countPrefixedMetaTags({



      }, 'og-', function(err, count) {

        if(err) assert.fail('Was not expecting a error');
        if(count > 0)
          assert.fail('Expected 0 keys, but got ' + count);
        done();

      });

    });

    it('Should return 0 if no tags match', function(done) {

      // pass the content
      utils.countPrefixedMetaTags({

        'og-title': 'test'

      }, 'twitter-', function(err, count) {

        if(err) assert.fail('Was not expecting a error');
        if(count > 0)
          assert.fail('Expected 0 keys, but got ' + count);
        done();

      });

    });

    it('Should return the 1 matching meta tag on the page', function(done) {

      // pass the content
      utils.countPrefixedMetaTags({

        'og-title': 'test'

      }, 'og-', function(err, count) {

        if(err) assert.fail('Was not expecting a error');
        if(count !== 1)
          assert.fail('Expected 0 keys, but got ' + count);
        done();

      });

    });

    it('Should return the 3 matching meta tag on the page', function(done) {

      // pass the content
      utils.countPrefixedMetaTags({

        'og-title': 'test',
        'og-description': 'test',
        'og-image': 'testing2'

      }, 'og-', function(err, count) {

        if(err) assert.fail('Was not expecting a error');
        if(count != 3)
          assert.fail('Expected 3 keys, but got ' + count);
        done();

      });

    });

  });

});
