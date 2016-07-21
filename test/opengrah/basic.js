const assert      = require('assert');
const _           = require('underscore');
const fs          = require('fs');
const passmarked  = require('passmarked');
const testFunc    = require('../../lib/rules/opengraph/basic');

describe('OpenGraph', function() {

  describe('basic', function() {

    it('Should not return a error if all properties are present', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/basic/complete.html');

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

    it('Should return a error if title is not present', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/basic/title.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'og.required'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

    it('Should return a error if description is not present', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/basic/description.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'og.required'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

    it('Should return a error if site_name is not present', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/basic/site.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'og.required'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

    it('Should return a error if image is not present', function(done) {

      // read in the html sample
      var content = fs.readFileSync('./samples/opengraph/basic/image.html');

      // handle the payload
      var payload = passmarked.createPayload({

        url: 'http://example.com'

      }, { log: { entries: [] } }, content.toString())

      testFunc(payload, function(err) {

        if(err) assert.fail('Something went wrong');
        var rules = payload.getRules();
        var rule = _.find(rules || [], function(item) { return item.key === 'og.required'; });
        if(!rule)
          assert.fail('Was expecting a error');

        // done
        done()

      });

    });

  });

});
