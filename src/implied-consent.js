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
    fontSize: 12,
    fontFamily: 'sans-serif',
    animate: true, // If false no animation will occur.
    animationStyle: 'slideDown', // if you must then this works best
    animationSpeed: 'slow',
    noticeText: 'We use cookies as set out in our privacy policy. By using this website, you agree we may place these cookies on your device.',
    confirmText: 'Close',
    cookieExpiresIn: 365, // Defaults to one year, can be overridden
    containerHeight: 0,
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
    var css = '#__ic-message > * { display: inline; text-decoration: none; }';
    var s = document.createElement('style');
    var head = document.head || document.getElementsByTagName('head')[0];
    var button = document.createElement('button');
    var plug = document.createElement('p');
    var box = document.createElement('div');
    var body = document.body;
    var b;

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
    button.style.backgroundColor = config.buttonBackgroundColor;
    button.style.color = config.buttonColor;
    button.style.cursor = 'pointer';
    button.style.fontSize = config.fontSize;
    button.style.fontFamily = config.fontFamily;
    button.style.borderWidth = 0;
    button.style.paddingTop = 3;
    button.style.paddingBottom = 3;
    button.style.paddingLeft = 6;
    button.style.paddingRight = 6;
    button.style.marginLeft = 15;
    button.id = '__ic-continue-button';
    button.title = config.confirmText;
    button.innerText = config.confirmText;

    // Create content.
    plug.style.margin = 0;
    plug.style.padding = 8;
    plug.style.textAlign = 'center';
    plug.innerText = config.noticeText;

    // Create container.
    box.id = '__ic-notice-container';
    box.style.position = 'relative';
    box.style.backgroundColor = config.backgroundColor,
    box.style.color = config.textColor,
    box.style.fontSize = config.fontSize,
    box.style.fontFamily = config.fontFamily,
    box.style.zIndex = 999999;

    // Assemble and insert.
    plug.appendChild(button);
    box.appendChild(plug);
    body = document.body;
    body.insertBefore(box, body.firstChild);

    // Set up click listener on the notice button.
    b = document.querySelector('#__ic-continue-button');
    b.addEventListener('click', buttonHandler);

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

  // Process the queue.
  if (this.impliedConsent && this.impliedConsent.q  && this.impliedConsent.q instanceof Array) {
    forEach(this.impliedConsent.q, function(item) {
      var op = item[0];
      var args = item[1];
      if (typeof ic[op] === 'function') {
        ic[op].apply(this, [args]);
      }
    });
  }

  exports.impliedConsent = ic;

}(typeof exports === 'object' && exports || this));
