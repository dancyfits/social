const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../../lib/rules/twitter/description');

describe('Twitter', function() {

  describe('description', function() {

    it('Should not return a error if no description tag is on page', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/description/missing.html');

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

    it('Should not return a error if the description is ok', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/description/ok.html');

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

    it('Should return a error if the length of the description is more than 200', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/description/length.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'twitter.card.description.length'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

    it('Should return a error if the description was blank', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/description/blank.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'twitter.card.description.empty'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

  });

});
