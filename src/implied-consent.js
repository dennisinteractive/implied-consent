(function(exports, undefined) {

  // Some polyfills & shims.
  require('eventlistener-polyfill');
  require('prototype-indexof-shim');
  var forEach = require('array-foreach');
  Function.prototype.bind = require('function-bind');

  // Other dependencies.
  var aug = require('aug');
  var Cookies = require('cookies-js');
  var Delegate = require('dom-delegate');
  var domReady = require('domready');

  /**
   * Helper function to convert a string to camel case along dots.
   */
  var camelCase = function(input) {
    return input.toLowerCase().replace(/\.(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  };

  var escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  };

  var defaults = {
    backgroundColor: '#222', // Container background color.
    textColor: '#eee', // Text color in container.
    linkColor: '#acf', // Link color in container
    buttonBackgroundColor: '#555', // Button background color
    buttonColor: '#fff', // Button text color
    fontSize: '12px',
    fontFamily: 'sans-serif',
    noticeText: 'We use cookies as set out in our privacy policy. By using this website, you agree we may place these cookies on your device.',
    confirmText: 'Close',
    cookieExpiresIn: 365, // Defaults to one year, can be overridden
    containerHeight: 0, // @todo implement setting the height.
    cookieNamePrefix: '__ic_',
    validateByClick: true
  };
  var hostname = camelCase(this.location.hostname);
  var hostnamePattern = new RegExp('^https?:\/\/' + escapeRegExp(window.location.hostname));
  var config;
  var ic = {
    delegate: null
  };

  ic.init = function(options) {
    // Merge defaults with passed options.
    config = aug(defaults, options);

    // Set cookie defaults.
    Cookies.defaults = {
      path: '/',
      expires: config.cookieExpiresIn * 24 * 60 * 60
    };

    if (Cookies.get(config.cookieNamePrefix + hostname) === undefined) {
      domReady(function() {
        render();
      });
    }
  };

  function validateByClick() {
    ic.delegate = new Delegate(document);
    // Specify the listener targets one by one to retain old IE8 compatibility.
    ic.delegate.on('click', 'a', validateByClickHandler);
    ic.delegate.on('click', 'button', validateByClickHandler);
    ic.delegate.on('click', 'input', validateByClickHandler);
  }

  function validateByClickHandler(e) {
    e.preventDefault();
    switch (this.tagName) {
      case 'A':
        if (!!this.href.match(/^#/) || !!this.href.match(/^\//) || !!this.href.match(hostnamePattern)) {
          return agree();
        }
        break;

      case 'INPUT':
        if (this.type === 'submit') {
          return agree();
        }
        break;

      case 'BUTTON':
        return agree();
    }
  }

  function buttonHandler() {
    agree();
  }

  function agree() {
    Cookies.set(config.cookieNamePrefix + hostname, 'true');
    destroy();
  }

  function render() {
    var css = '#__ic-notice > * { display: inline; text-decoration: none; } #__ic-notice a, #__ic-notice a:link, #__ic-notice a:visited { color: ' + config.linkColor + '}';
    var s = document.createElement('style');
    var head = document.head || document.getElementsByTagName('head')[0];
    var button = document.createElement('button');
    var content = document.createElement('div');
    var wrapper = document.createElement('div');
    var container = document.createElement('div');
    var body = document.body;
    var activeButton;

    // Embed styles.
    s.type = 'text/css';
    if (s.styleSheet) {
      s.styleSheet.cssText = css;
    }
    else {
      s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);

    // Create button.
    button.id = '__ic-continue-button';
    button.title = config.confirmText;
    button.innerText = config.confirmText;
    button.style.backgroundColor = config.buttonBackgroundColor;
    button.style.color = config.buttonColor;
    button.style.cursor = 'pointer';
    button.style.fontSize = config.fontSize;
    button.style.fontFamily = config.fontFamily;
    button.style.borderWidth = 0;
    button.style.padding = '3px 6px';
    button.style.marginLeft = '15px';

    // Create content.
    content.innerHTML = config.noticeText;
    content.id = '__ic-notice';
    content.style.margin = 0;
    content.style.padding = '8px';
    content.style.textAlign = 'center';

    // Create container.
    container.id = '__ic-notice-container';
    container.style.position = 'relative';

    // Create wrapper.
    wrapper.id = '__ic-notice';
    wrapper.style.position = 'relative';
    wrapper.style.backgroundColor = config.backgroundColor,
    wrapper.style.color = config.textColor,
    wrapper.style.fontSize = config.fontSize,
    wrapper.style.fontFamily = config.fontFamily,
    wrapper.style.zIndex = 999999;

    // Assemble and insert.
    content.appendChild(button);
    container.appendChild(content);
    wrapper.appendChild(container);
    body = document.body;
    body.insertBefore(wrapper, body.firstChild);

    // Set up click listener on the notice button.
    activeButton = document.querySelector('#__ic-continue-button');
    activeButton.addEventListener('click', buttonHandler);

    // Add validate by click if set.
    if (config.validateByClick) {
      validateByClick();
    }
  }

  function destroy() {
    var button = document.querySelector('#__ic-continue-button');
    button.removeEventListener('click', buttonHandler);
    ic.delegate && ic.delegate.destroy();

    // Destroy notice element.
    var el = document.querySelector('#__ic-notice-container');
    el.parentElement.removeChild(el);
  }

  function run() {
    // Set up command queue if not set already.
    this.impliedConsent = this.impliedConsent || {};
    this.impliedConsent.q = this.impliedConsent.q || [];

    // Set any initial queue items aside.
    var queue = this.impliedConsent.q;

    // Implement our own push.
    this.impliedConsent.q.push = function(item) {
      if (!(item instanceof Array) || !item[0]) {
        return;
      }
      if (typeof ic[item[0]] === 'function') {
        var args = item[1] || {};
        ic[item[0]].apply(this, [args]);
      }
    };

    // Process initial queue items.
    if (queue instanceof Array) {
      forEach(queue, this.impliedConsent.q.push);
    }
  }

  run();

  exports.impliedConsent = ic;

}(typeof exports === 'object' && exports || this));
