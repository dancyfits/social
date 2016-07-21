const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../../lib/rules/twitter/title');

describe('Twitter', function() {

  describe('title', function() {

    it('Should not return a error if no title tag is on page', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/title/missing.html');

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

    it('Should not return a error if the title is ok', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/title/ok.html');

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

    it('Should return a error if the length of the title is more than 70', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/title/length.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'twitter.card.title.length'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

    it('Should return a error if the title was blank', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/title/blank.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'twitter.card.title.empty'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

  });

});
