# implied-consent.js

An implied consent notice to comply with the UK's implementation of the EU
cookie laws (Note: this is not guaranteed to protect you!)

## Features

* __Responsive__: it should work with a responsively designed site to adapt to mobile devices, or
on a fixed-width site it'll stay fixed width
* __Asynchronous__: from version 1.0.0 onwards the loading and execution of the script is not blocking
as it is loaded and initialised in an asynchronous fashion.
* __Lightweight__: The script is self-contained and has no external
dependencies. It weighs only 5.38 kB when minified and gzipped.
* __Browser support__: This has been tested on IE9+ and all recent modern browsers.

## v1.1.0 Changes
In this version, legacy polyfills for older browsers (IE8 and below) were removed to reduce file size and 
prevent the polyfills from interfering with native browser APIs.

## Installation / Usage

Upload the minified JS file from the `dist/` folder to your CDN or web host of
choice, then add the following to the head section of your site.

Do not include the script directly from GitHub (http://raw.github.com/...). The
file is being served as text/plain and as such being blocked in Internet
Explorer on Windows 7 for instance (because of the wrong MIME type). Bottom
line: GitHub is not a CDN.

Add the following code to the head of your page:

```js
<script>
  var impliedConsent = impliedConsent || {}; impliedConsent.q = impliedConsent.q || [];
  impliedConsent.q.push(['init']);

  (function(w, d) {
    var s = d.createElement('script'), el = d.getElementsByTagName('script')[0]; s.async = true;
    s.src = '//example.com/implied-consent.min.js'; el.parentNode.insertBefore(s, el);
  })(this, this.document);
</script>
```

If only modern browsers are planned to be supported, load it via an asynchronous script tag:

```js
<script>
  var impliedConsent = impliedConsent || {}; impliedConsent.q = impliedConsent.q || [];
  impliedConsent.q.push(['init']);
</script>

<script async src="//example.com/implied-consent.min.js"></script>
```

It is possible to define custom configuration options in the `impliedConsent.q.push()` call:

```js
impliedConsent.q.push(["init", {
  noticeText: 'We use cookies as set out in our <a href="http://www.example.com/cookie-policy">cookie policy</a>. By using this website, you agree we may place these cookies on your device.',
  confirmText: "Close",
  cookieExpiresIn: 3650
}]);
```

See configuration options below.

## Configuration options

### options

Type: `Object`

An object of options can be passed as a second argument. The default values are
as follows.

### options.noticeText

Type: `String` Default value: `We use cookies as set out in our privacy policy. By using this website, you agree we may place these cookies on your device.`

Text content to display as the notice. Please note that the string defined here will be inserted using `Element.innerHTML()` so it may contain HTML tags.

### options.confirmText

Type: `String` Default value: `Close`

Text value of the close button.

### options.validateByClick

Type: `Boolean` Default value: `true`

If set to `true` extra event listeners are launched on `a`, `button` and
`input[type="submit"]` tags. The callback for these listeners sets the cookie as
if the Close button was clicked. `a` tags only trigger this if their href
attributes start with `#`, `/` or the current host name of the site.

### options.cookieExpiresIn

Type: `Integer` Default value: `365`

Cookie expiry value in days.

### options.backgroundColor

Type: `String` Default value: `#222`

CSS background-color value of the notice container element.

### options.textColor

Type: `String` Default value: `#eee`

CSS color value for any container text.

### options.textColor

Type: `String` Default value: `#eee`

CSS color value for any container text.

### options.linkColor

Type: `String` Default value: `#acf`

CSS color value for link text in container.

### options.buttonBackgroundColor

Type: `String` Default value: `#222`

CSS background-color value of the notice button.

### options.buttonColor

Type: `String` Default value: `#fff`

CSS color value of the button.

### options.fontSize

Type: `String` Default value: `12px`

CSS font-size value for text in the container.

### options.fontFamily

Type: `String` Default value: `sans-serif`

CSS font-family value for text in the container.

## Building from source

Development is based on `npm`, `bower` and `grunt` so make sure you have these
installed globally. Then install project dependencies:

`npm install && bower install`

Then run the build via

`grunt`

The build output files are located in the `dist/` folder.

## Authors

* Attila Beregszaszi
* Will Howlett
* Paul Lomax

## License

### Copyright 2015 Dennis Publishing

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
