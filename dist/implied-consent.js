/*!
 * Implied Consent - a jQuery Cookie Notice plugin
 * self-contained version 0.3.0
 * 
 * Copyright Dennis Publishing
 * Released under MIT license
 */
/**
 * jQuery Quarantine - isolate jQuery
 *
 * https://github.com/quickredfox/jQuery-Quarantine
 */
if(typeof window.jQQ !== 'object') {
  (function() {
    "use strict";
    var callbacks = [], jq;

    function loadScript(url, callback) {
      var script = document.createElement('script');
      script.type = "text/javascript";

      if (typeof script.readyState === 'undefined') {
        script.onload = function() {
          callback();
        };
      } else { // IE LAST!
        script.onreadystatechange = function() {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null;
            callback();
          }
        };
      }
      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
      return script;
    }

    function validateCallback(callback) {
      if (typeof callback === 'undefined') throw "Cannot validate callback: undefined";
      if (callback && callback.length<1) throw "Callback missing at least 1 placeholder argument";
      return callback;
    }

    function fillArray(data,qty) {
      var array  = [];
      for (var i=qty; i>0; i--) array.push(data);
      return array;
    }

    window.jQQ = {
      isReady: false,
      isolate: function() {
        var callback = validateCallback(arguments[0]);
        if(!window.jQQ.isReady) return callbacks.push(callback);
        return callback.apply(this, fillArray(jq, callback.length));
      },

      setup: function(version) {
        // Wait for document to load...
        if (!document.body) {
          window.onload = function() {
            window.jQQ.setup(version);
          };
          return;
        }
        var url = '//ajax.googleapis.com/ajax/libs/jquery/'+ (version || '1.2.6') +'/jquery.min.js';
        loadScript(url, function() {
          window.jQQ.isReady = true;
          // this stores the new version and gives back the old one, completely.
          jq = jQuery.noConflict(true);
          for (var thisCallback in callbacks) {
            window.jQQ.isolate(callbacks[thisCallback]);
          }
          callbacks = {};
        });
      }
    };
  })(window.jQuery, window.$);
}

jQQ.setup();

jQQ.isolate(function($) {
  /**
   * jQuery Cookie Plugin v1.3.1
   * https://github.com/carhartl/jquery-cookie
   *
   * Copyright 2013 Klaus Hartl
   * Released under the MIT license
   */
    "use strict";
    var pluses = /\+/g;

    function raw(s) {
      return s;
    }

    function decoded(s) {
      return unRfc2068(decodeURIComponent(s.replace(pluses, ' ')));
    }

    function unRfc2068(value) {
      if (value.indexOf('"') === 0) {
        // This is a quoted cookie as according to RFC2068, unescape
        value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      return value;
    }

    function fromJSON(value) {
      return config.json ? JSON.parse(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

      // write
      if (value !== undefined) {
        options = $.extend({}, config.defaults, options);

        if (value === null) {
          options.expires = -1;
        }

        if (typeof options.expires === 'number') {
          var days = options.expires, t = options.expires = new Date();
          t.setDate(t.getDate() + days);
        }

        value = config.json ? JSON.stringify(value) : String(value);

        return (document.cookie = [
          encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
          options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
          options.path    ? '; path=' + options.path : '',
          options.domain  ? '; domain=' + options.domain : '',
          options.secure  ? '; secure' : ''
        ].join(''));
      }

      // read
      var decode = config.raw ? raw : decoded;
      var cookies = document.cookie.split('; ');
      var result = key ? null : {};
      for (var i = 0, l = cookies.length; i < l; i++) {
        var parts = cookies[i].split('=');
        var name = decode(parts.shift());
        var cookie = decode(parts.join('='));

        if (key && key === name) {
          result = fromJSON(cookie);
          break;
        }

        if (!key) {
          result[name] = fromJSON(cookie);
        }
      }

      return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
      if ($.cookie(key) !== null) {
        $.cookie(key, null, options);
        return true;
      }
      return false;
    };
});

jQQ.isolate(function($) {
  'use strict';

  $.fn.impliedConsent = function(options) {

    // get hold of the div this plugin applies to
    var noticeContainer = $(this);
    // set up the plugin defaults - these should be pretty sensible out of the box
    var settings = {
      'backgroundColor': '#222', // Container background color.
      'textColor': '#eee', // Text color in container.
      'linkColor': '#acf', // Link color in container
      'buttonBackgroundColor': '#555', // Button background color
      'buttonColor': '#fff', // Button text color
      'fontSize': 12,
      'fontFamily': 'sans-serif',
      'animate': true, // If false no animation will occur.
      'animationStyle': 'slideDown', // if you must then this works best
      'animationSpeed': 'slow',
      'noticeText': 'We use cookies as set out in our privacy policy. By using this website, you agree we may place these cookies on your device.',
      'confirmText': 'Close',
      'cookieExpiresIn': 365, // Defaults to one year, can be overridden
      'containerHeight': 0,
      'cookieNamePrefix': '__ic_',
      'validateByClick': true
    };

    options = $.extend(settings, options);

    return this.each(function() {
      /**
       * Click on a local link or the button means agree, set the cookie, hide
       * the notice.
       */
      function agree() {
        if ($.cookie) {
          $.cookie(settings.cookieNamePrefix + hostname, 'true', { expires: settings.cookieExpiresIn, path: '/' });
          if (settings.animate === true) {
            $(noticeContainer).slideUp(settings.animationSpeed);
          }
          else {
            $(noticeContainer).hide();
          }
        }
        else {
          $.error('The jQuery.cookie plugin cannot be found!');
        }
      }

      /**
       * Generate and style the notice elements
       */
      function generate() {
        // Element and container CSS
        $this.css({
          backgroundColor: settings.backgroundColor,
          color: settings.textColor,
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          position: 'relative',
          zIndex: 999999
        });
        var containerDiv = '<style>#__ic-message > * { display: inline; }</style><div id="__ic-notice-container" style="position:relative;"></div>';
        $this.append(containerDiv);

        // Add/style notice text
        var p = '<div id="__ic-message" style="margin:0; padding:8px; text-align:center;">'+ settings.noticeText +'</div>';
        $('#__ic-notice-container').append(p);
        $this.find('a').css({
          color: settings.linkColor,
          textDecoration: 'none'
        });

        // Add/Style close button
        var button = '<button type="button" id="__ic-continue-button" title="'+ settings.confirmText +'">'+ settings.confirmText +'</button>';
        $('#__ic-message').append(button);
        $('#__ic-continue-button').css({
          backgroundColor: settings.buttonBackgroundColor,
          color: settings.buttonColor,
          cursor: 'pointer',
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
          borderWidth: 0,
          padding: '3px 6px',
          marginLeft: 15
        });
      }

      /**
       * Helper function to convert a string to camel case along dots.
       */
      function camelCase(input) {
        return input.toLowerCase().replace(/\.(.)/g, function(match, group1) {
          return group1.toUpperCase();
        });
      }


      var $this = $(this);
      var hostname = camelCase(window.location.hostname);

      // check if cookie is already set by this plugin and if so show nothing
      if ($.cookie && $.cookie(settings.cookieNamePrefix + hostname) === 'true') {
        $this.hide().remove();
      }
      else {
        generate();
        settings.containerHeight = $this.height();
        $this.slideDown('slow');
      }

      // if button is clicked, set a cookie if jQuery.cookie is present and get rid
      $('#__ic-continue-button').bind('click', function() {
        agree();
      });
      if (settings.validateByClick === true) {
        $('a[href^="#"], a[href^="/"], a[href*="https://'+ window.location.hostname +'/"], a[href*="http://'+ window.location.hostname +'/"]').bind('click', function() {
          agree();
        });
      }
    });
  };
});
