# @passmarked/social

![NPM](https://img.shields.io/npm/dt/@passmarked/social.svg) [![Build Status](https://travis-ci.org/passmarked/social.svg)](https://travis-ci.org/passmarked/social)

[Passmarked](http://passmarked.com) is a suite of tests that can be run against any page/website to identify issues with parity to most online tools in one package.

The [Terminal Client](http://npmjs.org/package/passmarked) is intended for use by developers to integrate into their workflow/CI servers but also integrate into their own application that might need to test websites and provide realtime feedback.

All of the checks on [Passmarked](http://passmarked.com?source=github&repo=social) can be voted on importance and are [open-sourced](http://github.com/passmarked/suite), to encourage community involvement in fixing and adding new rules. We are building the living Web Standard and love any [contributions](#contributing).

## Synopsis

The rules checked in this module are:

* **og.missing** - OpenGraph was not configured on the page
* **og.image.empty** - Image property specified for OpenGraph was blank
* **og.image.protocol** - Image specified for OpenGraph must start with either http:// or https://
* **og.image.error** - Image specified for OpenGraph could not be downloaded, or received a error while trying to connect to the image.
* **og.image.size** - Image specified for OpenGraph exceeded the maxinum size of 5MB
* **facebook.appid.empty** - The custom [Facebook](https://facebook.com) property (`fb:app_id`) is specified but blank.
* **facebook.appid.invalid** - The specified [Facebook](https://facebook.com) app/page id specified in `fb:app_id` was not found
* **twitter.missing** - [Twitter](https://twitter.com) cards was not configured on the page
* **twitter.card.type** - Invalid [Twitter](https://twitter.com) card type given
* **twitter.card.title.empty** - The title for [Twitter](https://twitter.com) was a blank
* **twitter.card.title.length** - The title for [Twitter](https://twitter.com) is over the limit 70, after which Twitter will truncate
* **twitter.card.description.empty** - The description for [Twitter](https://twitter.com) was a blank
* **twitter.card.description.length** - The description for [Twitter](https://twitter.com) is over the limit 200, after which [Twitter](https://twitter.com) will truncate
* **twitter.card.alt.empty** - The alt text for [Twitter](https://twitter.com) was provided, but blank
* **twitter.card.alt.length** - The alt text for [Twitter](https://twitter.com) is over the limit 200, after which [Twitter](https://twitter.com) will truncate
* **twitter.card.image.empty** - The image for [Twitter](https://twitter.com) to preview is blank
* **twitter.card.image.protocol** - The image for [Twitter](https://twitter.com) did not include the protocol
* **twitter.card.image.error** - The image provided as preview for [Twitter](https://twitter.com) could not be downloaded while checking. This happens if the module fails to connect or if the HEAD request gets a non-**200** in the response.
* **twitter.card.image.size** - The image for [Twitter](https://twitter.com) to preview is more than the max of 1mb
* **twitter.card.image.dimensions** - The image for [Twitter](https://twitter.com) to preview is smaller than the minimum of 120px by 120px
* **twitter.card.site.empty** - The [Twitter](https://twitter.com) account specified was blank
* **twitter.card.site.prefix** - The [Twitter](https://twitter.com) account specified did not start with a @ as per docs
* **twitter.card.site.invalid** - The account specified could not be found on [Twitter](https://twitter.com)
* **twitter.card.deprecated** - One or more of the tags/properties for the [Twitter](https://twitter.com) card are deprecated
* **twitter.card.appid.missing** - When using a App Card on [Twitter](https://twitter.com) the app id is expected, we realise some apps might not have a all versions like Android and IOS. So this rule only returns a notice as it was maybe not specified on purpose.
* **twitter.card.appid.empty** - When using a App Card on [Twitter](https://twitter.com) the app id is expected to not be blank.
* **twitter.card.appid.empty** - When using a App Card on [Twitter](https://twitter.com) the app id must reference a existing app on the app store.

## Running

The rules are checked everytime a url is run through Passmarked or our API. To run using the hosted system head to [passmarked.com](http://passmarked.com?source=github&repo=social) or our [Terminal Client](http://npmjs.org/package/passmarked) use:

```bash
npm install -g passmarked
passmarked --filter=social example.com
```

The hosted version allows free runs from our homepage and the option to register a site to check in its entirety.

Using the Passmarked npm module (or directly via the API) integrations are also possible to get running reports with all the rules in a matter of seconds.

## Running Locally

All rules can be run locally using our main integration library. This requires installing the package and any dependencies that the code might have such as a specific version of OpenSSL, see [#dependencies](#dependencies)

First ensure `passmarked` is installed:

```bash
npm install passmarked
npm install @passmarked/social
```

After which the rules will be runnable using promises:

```social
passmarked.createRunner(
  require('@passmarked/social'), // this package
  require('@passmarked/ssl'), // to test SSL
  require('@passmarked/network') // to test network performance
).run({
  url: 'http://example.com',
  body: 'body of page here',
  har: {log: {entries: []}}
}).then(function(payload) {
  if (payload.hasRule('secure')) {
    console.log('better check that ...');
  }
  var rules = payload.getRules();
  for (var rule in rules) {
    console.log('*', rules[rule].getMessage());
  }
}).catch(console.error.bind(console));
```

Alternatively, callbacks are also available:

```social
passmarked.createRunner(
  require('@passmarked/social'),
  require('@passmarked/ssl'),
  require('@passmarked/network')
).run({
  url: 'http://example.com',
  body: 'body of page here',
  har: {log: {entries: []}}
}, function(err, payload) {
  if (payload.hasRule('secure')) {
    console.log("better check that ...");
  }
  var rules = payload.getRules();
  for (var rule in rules) {
    console.log('*', rules[rule].getMessage());
  }
});
```

## Dependencies

This module does not need any specific external services or packages. This section will be updated if that ever changes with detailed setup steps/links.

## Rules

Rules represent checks that occur in this module, all of these rules have a **UID** which can be used to check for specific rules. For the structure and more details see the [Wiki](https://github.com/passmarked/passmarked/wiki) page on [Rules](https://github.com/passmarked/passmarked/wiki/Create).

> Rules also include a `type` which could be `critical`, `error`, `warning` or `notice` giving a better view on the importance of the rule.

## Contributing

```bash
git clone git@github.com:passmarked/social.git
npm install
npm test
```

Pull requests have a prerequisite of passing tests. If your contribution is accepted, it will be merged into `develop` (and then `master` after staging tests by the team) which will then be deployed live to [passmarked.com](http://passmarked.com?source=github&repo=social) and on NPM for everyone to download and test.

## About

To learn more visit:

* [Passmarked](http://passmarked.com?source=github&repo=social)
* [Terminal Client](https://www.npmjs.com/package/passmarked)
* [NPM Package](https://www.npmjs.com/package/@passmarked/social)
* [Slack](http://passmarked.com/chat?source=github&repo=social) - We have a Slack team with all our team and open to anyone using the site to chat and figure out problems. To join head over to [passmarked.com/chat](http://passmarked.com/chat?source=github&repo=social) and request a invite.

## License

Copyright 2016 Passmarked Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
