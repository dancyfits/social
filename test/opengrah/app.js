const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../../lib/rules/opengraph/app');

describe('OpenGraph', function() {

  describe('fb:app_id', function() {

    it('Should not return a error if not specified', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/app/missing.html');

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

    it('Should return a error if the app id is blank', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/app/blank.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'facebook.appid.empty'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

    it('Should return a error if the app id specified does not exist', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/app/invalid.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'facebook.appid.invalid'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

    it('Should not return a error if the appid specified was valid', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/app/ok.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'facebook.appid.invalid'; });
        if(rule)
          assert.fail('Was not expecting a error');

        // done
        done()

      });

    });

  });

});
