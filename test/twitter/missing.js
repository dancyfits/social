const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../../lib/rules/twitter/missing');

describe('Twitter', function() {

  describe('missing', function() {

    it('Should return a error if no tags are configured', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/missing/empty.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'twitter.card.missing'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

    it('Should not return a error if a tag is found [random]', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/missing/present.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'twitter.card.missing'; });
        if(rule)
          assert.fail('Was not expecting a error');

        // done
        done()

      });

    });

    it('Should not return a error if a tag is found [title]', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/missing/title.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'twitter.card.missing'; });
        if(rule)
          assert.fail('Was not expecting a error');

        // done
        done()

      });

    });

    it('Should not return a error if a tag is found [description]', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/twitter/missing/description.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'twitter.card.missing'; });
        if(rule)
          assert.fail('Was not expecting a error');

        // done
        done()

      });

    });

  });

});
