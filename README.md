# openGWMail

An always free, always open-source fork of [wmail](https://github.com/Thomas101/wmail) maintained by a volunteer community.

[![Download](https://img.shields.io/github/downloads/Dodenis/openGWMail/total.svg)](https://github.com/Dodenis/openGWMail/releases)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

The missing desktop client for Gmail & Google Inbox. Bringing the Gmail & Google Inbox experience to your desktop in a neatly packaged app

[Raise an issue or request a feature](https://github.com/Dodenis/openGWMail/issues)

![Screenshot](https://raw.githubusercontent.com/Dodenis/openGWMail/master/.github/screenshot.png "Screenshot")

### Installing
openGWMail is available on Windows, Mac OSX, and Linux

[Download releases](https://github.com/Dodenis/openGWMail/releases)

### License

openGWMail, like wmail before it, is licensed under the [Mozilla Public License 2.0](./LICENSE).

### Building from source

Feeling brave and want to build from source? Here's what you need to do

Firstly you need to get an OAuth client ID and secret from Google.
Visit https://console.developers.google.com to get started.
You'll need to [setup your OAuth Client ID](https://console.developers.google.com/apis/credentials) and enable the [Gmail](https://console.developers.google.com/apis/api/gmail/overview), [Google+](https://console.developers.google.com/apis/api/plus/overview) and [Identity Toolkit](https://console.developers.google.com/apis/api/identitytoolkit/overview) APIs.

To create OAuth client ID & secret, under "API Manager", choose "Create Credentials", then "OAuth client ID".
For "Application type", select "Other", and choose some name for the application, as described in these screenshots:

![Create credentials](https://raw.githubusercontent.com/Dodenis/openGWMail/master/.github/gdc-create-credentials.png "Create Credentials")
<br />
<br />
![Create OAuth client ID](https://raw.githubusercontent.com/Dodenis/openGWMail/master/.github/gdc-oauth-client-id-creation.png "Create OAuth Client ID")

Next create `src/shared/credentials.js` with your Google client ID and secret like so...

```js
module.exports = Object.freeze({
	GOOGLE_CLIENT_ID : '<Your google client id>',
	GOOGLE_CLIENT_SECRET: '<Your google client secret>'
})
```

Then run the following...

```
npm install webpack -g
npm run-script install-all
npm start
```

### Packaging Builds

To package builds. (Note packaging osx builds can only be done from osx)

MacOS requirement
```
# Install brew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# Install brew dependencies
brew install fakeroot
brew install dpkg
brew cask install xquartz
brew install wine
brew install mono
```

Packagin
```
npm install
npm rebuild
npm run-script package
```

