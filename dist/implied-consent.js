(function(f) { f() }(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(root) {

var aug = function __aug() {
  var args = Array.prototype.slice.call(arguments);
  var deep = false;
  var org = args.shift();
  var type = '';
  if (typeof org === 'string' || typeof org === 'boolean') {
    type = (org === true)?'deep':org;
    org = args.shift();
    if (type == 'defaults') {
      org = aug({}, org); //clone defaults into new object
      type = 'strict';
    }
  }
  for (var i = 0, c = args.length; i < c; i++) {
    var prop = args[i];
    for (var name in prop) {
      if (type == 'deep' && typeof prop[name] === 'object' && typeof org[name] !== 'undefined') {
        aug(type, org[name], prop[name]);
      } else if (type != 'strict' || (type == 'strict' && typeof org[name] !== 'undefined')) {
        org[name] = prop[name];
      }
    }
  }
  return org;
};

if (typeof module !== 'undefined') {
  module.exports = aug;
} else {
  if (typeof define === 'function' && define.amd) {
    define(function() {return aug;});
  }
  root.aug = aug;
}

}(this));

},{}],2:[function(require,module,exports){
/*
 * Cookies.js - 1.2.3
 * https://github.com/ScottHamper/Cookies
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global, undefined) {
    'use strict';

    var factory = function (window) {
        if (typeof window.document !== 'object') {
            throw new Error('Cookies.js requires a `window` with a `document` object');
        }

        var Cookies = function (key, value, options) {
            return arguments.length === 1 ?
                Cookies.get(key) : Cookies.set(key, value, options);
        };

        // Allows for setter injection in unit tests
        Cookies._document = window.document;

        // Used to ensure cookie keys do not collide with
        // built-in `Object` properties
        Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)
        
        Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

        Cookies.defaults = {
            path: '/',
            secure: false
        };

        Cookies.get = function (key) {
            if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                Cookies._renewCache();
            }
            
            var value = Cookies._cache[Cookies._cacheKeyPrefix + key];

            return value === undefined ? undefined : decodeURIComponent(value);
        };

        Cookies.set = function (key, value, options) {
            options = Cookies._getExtendedOptions(options);
            options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);

            Cookies._document.cookie = Cookies._generateCookieString(key, value, options);

            return Cookies;
        };

        Cookies.expire = function (key, options) {
            return Cookies.set(key, undefined, options);
        };

        Cookies._getExtendedOptions = function (options) {
            return {
                path: options && options.path || Cookies.defaults.path,
                domain: options && options.domain || Cookies.defaults.domain,
                expires: options && options.expires || Cookies.defaults.expires,
                secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
            };
        };

        Cookies._isValidDate = function (date) {
            return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
        };

        Cookies._getExpiresDate = function (expires, now) {
            now = now || new Date();

            if (typeof expires === 'number') {
                expires = expires === Infinity ?
                    Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
            } else if (typeof expires === 'string') {
                expires = new Date(expires);
            }

            if (expires && !Cookies._isValidDate(expires)) {
                throw new Error('`expires` parameter cannot be converted to a valid Date instance');
            }

            return expires;
        };

        Cookies._generateCookieString = function (key, value, options) {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
            options = options || {};

            var cookieString = key + '=' + value;
            cookieString += options.path ? ';path=' + options.path : '';
            cookieString += options.domain ? ';domain=' + options.domain : '';
            cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
            cookieString += options.secure ? ';secure' : '';

            return cookieString;
        };

        Cookies._getCacheFromString = function (documentCookie) {
            var cookieCache = {};
            var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

            for (var i = 0; i < cookiesArray.length; i++) {
                var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

                if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                    cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                }
            }

            return cookieCache;
        };

        Cookies._getKeyValuePairFromCookieString = function (cookieString) {
            // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
            var separatorIndex = cookieString.indexOf('=');

            // IE omits the "=" when the cookie value is an empty string
            separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

            var key = cookieString.substr(0, separatorIndex);
            var decodedKey;
            try {
                decodedKey = decodeURIComponent(key);
            } catch (e) {
                if (console && typeof console.error === 'function') {
                    console.error('Could not decode cookie with key "' + key + '"', e);
                }
            }
            
            return {
                key: decodedKey,
                value: cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
            };
        };

        Cookies._renewCache = function () {
            Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
            Cookies._cachedDocumentCookie = Cookies._document.cookie;
        };

        Cookies._areEnabled = function () {
            var testKey = 'cookies.js';
            var areEnabled = Cookies.set(testKey, 1).get(testKey) === '1';
            Cookies.expire(testKey);
            return areEnabled;
        };

        Cookies.enabled = Cookies._areEnabled();

        return Cookies;
    };
    var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;

    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () { return cookiesExport; });
    // CommonJS/Node.js support
    } else if (typeof exports === 'object') {
        // Support Node.js specific `module.exports` (which can be a function)
        if (typeof module === 'object' && typeof module.exports === 'object') {
            exports = module.exports = cookiesExport;
        }
        // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
        exports.Cookies = cookiesExport;
    } else {
        global.Cookies = cookiesExport;
    }
})(typeof window === 'undefined' ? this : window);
},{}],3:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2012 - License MIT
  */
!function (name, definition) {
  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()
}('domready', function (ready) {

  var fns = [], fn, f = false
    , doc = document
    , testEl = doc.documentElement
    , hack = testEl.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , addEventListener = 'addEventListener'
    , onreadystatechange = 'onreadystatechange'
    , readyState = 'readyState'
    , loadedRgx = hack ? /^loaded|^c/ : /^loaded|c/
    , loaded = loadedRgx.test(doc[readyState])

  function flush(f) {
    loaded = 1
    while (f = fns.shift()) f()
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
    doc.removeEventListener(domContentLoaded, fn, f)
    flush()
  }, f)


  hack && doc.attachEvent(onreadystatechange, fn = function () {
    if (/^c/.test(doc[readyState])) {
      doc.detachEvent(onreadystatechange, fn)
      flush()
    }
  })

  return (ready = hack ?
    function (fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function () {
          try {
            testEl.doScroll('left')
          } catch (e) {
            return setTimeout(function() { ready(fn) }, 50)
          }
          fn()
        }()
    } :
    function (fn) {
      loaded ? fn() : fns.push(fn)
    })
})

},{}],4:[function(require,module,exports){
(function(exports, undefined) {

  // Other dependencies.
  var aug = require('aug');
  var Cookies = require('cookies-js');
  var domReady = require('domready');

  /**
   * Helper function to convert a string to camel case along dots.
   *
   * @param  {String} input String to convert
   * @return {String}       String converted to camel case
   */
  var camelCase = function(input) {
    return input.toLowerCase().replace(/\.(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  };

  /**
   * Helper function to prepare string for use as a RegExp pattern.
   *
   * @param  {String} str String to convert as pattern
   * @return {String}     An escaped string
   */
  var escapeRegExp = function(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  };

  /**
   * Default options
   * @type {Object}
   *
   * @property {String} noticeText Text content to display as the notice.
   *   Please note that the string defined here will be inserted using
   *   Element.innerHTML() so it may contain HTML tags.
   *   @default 'We use cookies as set out in our privacy policy. By using
   *   this website, you agree we may place these cookies on your device.'
   * @property {String} confirmText Text value of the close button.
   *   @default 'Close'.
   * @property {Boolean} validateByClick If set to `true` extra event listeners
   *   are launched on 'a', 'button' and 'input[type="submit"]' tags.
   *   The callback for these listeners sets the cookie as if the Close button
   *   was clicked. 'a' tags only trigger this if their href attributes start
   *   with '#', '/' or the current host name of the site.
   *   @default `true`.
   * @property {String} cookieExpiresIn Cookie expiry value in days.
   *   @default 365.
   * @property {String} backgroundColor CSS background-color value of the notice
   *   container element.
   *   @default '#222'.
   * @property {String} textColor CSS color value for any container text.
   *   @default '#eee'.
   * @property {String} linkColor CSS color value for link text in container.
   *   @default '#acf'.
   * @property {String} buttonBackgroundColor CSS background-color value of the
   *   notice button.
   *   @default '#222'.
   * @property {String} buttonColor CSS color value of the button.
   *   @default '#fff'
   * @property {String} fontSize CSS font-size value for text in the container.
   *   @default '12px'.
   * @property {String} fontFamily CSS font-family value for text in the
   *   container.
   *   @default 'sans-serif'.
   */
  var defaults = {
    noticeText: 'We use cookies as set out in our privacy policy. By using this website, you agree we may place these cookies on your device.',
    confirmText: 'Close',
    validateByClick: true,
    cookieExpiresIn: 365, // Defaults to one year, can be overridden
    cookieNamePrefix: '__ic_',
    backgroundColor: '#222', // Container background color.
    textColor: '#eee', // Text color in container.
    linkColor: '#acf', // Link color in container
    buttonBackgroundColor: '#555', // Button background color
    buttonColor: '#fff', // Button text color
    fontSize: '12px',
    fontFamily: 'sans-serif'
  };
  var hostname = camelCase(this.location.hostname);
  var hostnamePattern = new RegExp('^https?:\/\/' + escapeRegExp(window.location.hostname));
  var config;

  /**
   * Object containing exposed methods and properties.
   */
  var ic = {
    status: false,
    delegate: null
  };

  /**
   * Initialise plugin behaviour.
   *
   * This configures cookie defaults with path set to path '/' and expiry to the
   * configured value, default for this is 365 days.
   * It then checks for the acknowledgement cookie and renders the notice after
   * the DOM is ready only if the acknowledgement cookie was not found.
   *
   * @param  {Object} options An options object
   * @see @defaults
   */
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

  /**
   * Launch events on page interaction.
   */
  function validateByClick(wrapper) {
    wrapper.addEventListener('click', validateByClickHandler);
  }

  /**
   * Event handler to monitor page interaction and perform acknowledgement if
   * needed.
   */
  function validateByClickHandler(e) {
    var target = e.target;

    switch (target.tagName) {
      case 'A':
        if (!!target.href.match(/^#/) || !!target.href.match(/^\//) || !!target.href.match(hostnamePattern)) {
          return agree();
        }
        break;

      case 'INPUT':
        if (target.type === 'submit') {
          return agree();
        }
        break;

      case 'BUTTON':
        return agree();
    }
  }

  /**
   * Perform acknowledgement.
   *
   * This sets a cookie and removes the notice.
   */
  function agree() {
    Cookies.set(config.cookieNamePrefix + hostname, 'true');
    destroy();
  }

  /**
   * Render the notice container and set up event listeners.
   */
  function render() {
    var css = '#__ic-notice > * { display: inline; text-decoration: none; } #__ic-notice a, #__ic-notice a:link, #__ic-notice a:visited { color: ' + config.linkColor + '}';
    var s = document.createElement('style');
    var head = document.head || document.getElementsByTagName('head')[0];
    var button = document.createElement('button');
    var content = document.createElement('div');
    var wrapper = document.createElement('div');
    var container = document.createElement('div');
    var body = document.body;

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
    button.innerHTML = config.confirmText;
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

    // Add validate by click if set.
    if (config.validateByClick) {
      validateByClick(wrapper);
    } else {
      var activeButton = document.getElementById('__ic-continue-button');
      activeButton.addEventListener('click', agree);
    }

    ic.status = true;
  }

  /**
   * Remove any event listeners set and the notice container.
   */
  function destroy() {
    // Destroy notice element.
    var el = document.getElementById('__ic-notice-container');
    el.parentElement.removeChild(el);
    ic.status = false;
  }

  /**
   * Parse init code if it was issued before the script is loaded.
   *
   * The script can be initialised via creating the `impliedConsent` object and
   * the `impliedConsent.q` array and by pushing the init comand into it.
   */
  function run() {
    // Set context.
    var root = (typeof window !== 'undefined') ? window : this;
    var queue;

    // Set up command queue if not set already.
    root.impliedConsent = root.impliedConsent || {};
    root.impliedConsent.q = root.impliedConsent.q || [];

    // Set any initial queue items aside.
    queue = root.impliedConsent.q;

    // Implement our own push.
    root.impliedConsent.q.push = function(item) {
      if (ic.status || !(item instanceof Array) || !item[0] || typeof ic[item[0]] !== 'function') {
        return false;
      }
      var args = item[1] || {};
      ic[item[0]].apply(this, [args]);
    };

    // Process initial queue items.
    if (queue instanceof Array) {
      for (var i = 0; i < queue.length; i++) { 
        root.impliedConsent.q.push(queue[i]);
      }
    }
  }

  run();

  exports.impliedConsent = ic;

}(typeof exports === 'object' && exports || this));

},{"aug":1,"cookies-js":2,"domready":3}]},{},[4]);
}));