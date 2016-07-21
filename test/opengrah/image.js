const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../../lib/rules/opengraph/image');

describe('OpenGraph', function() {

  describe('image', function() {

    it('Should not return a error if no image tag is on page', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/image/missing.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        if(rules.length > 0)
          assert.fail('Was expecting 0 rules, but got ' + rules.length);

        // done
        done()

      });

    });

    it('Should not return a error if the image is ok', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/image/ok.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        if(rules.length > 0)
          assert.fail('Was expecting 0 rules, but got ' + rules.length);

        // done
        done()

      });

    });

    it('Should return a error if the image could not be found', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/image/notfound.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'og.image.error'; });
        if(!rule)
          assert.fail('Was expecting a rule to be returned');

        // done
        done()

      });

    });

    it('Should return a error if the image was blank', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/image/blank.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'og.image.empty'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

  });

});
