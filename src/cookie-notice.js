/**
 * Implied Consent - jQuery Cookie Notice plugin
 * self-contained version 0.2
 *
 * Copyright Dennis Publishing 2013
 * Released under MIT license
 *
 * Display a cookie notice bar at the top of the page and set a cookie to
 * prevent further display when any local link or the close button is clicked.
 */
jQQ.isolate(function($) {
  "use strict";
  $.fn.cookieNotice = function(options) {

    // get hold of the div this plugin applies to
    var cookieNoticeContainerId = $(this);
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
      'noticeText': 'We use cookies as set out in our <a href="http://www.dennis.co.uk/cookie-policy" target="_blank" title="Read more about our cookie policy">cookie policy</a>. By using this website, you agree we may place these cookies on your device.',
      'confirmText': 'Close',
      'cookieExpiresIn': 365, // Defaults to one year, can be overridden
      'containerHeight': 0,
      'cookieNamePrefix': 'dennisCookiesAccepted',
      'validateByClick': true
    };

    options = $.extend(settings, options);

    return this.each(function() {
      var $this = $(this),
        hostname = camelCase(window.location.hostname);

      // check if cookie is already set by this plugin and if so show nothing
      if ($.cookie && $.cookie(settings.cookieNamePrefix +'_'+ hostname) === 'true') {
        $this.hide().remove();
      }
      else {
        generate();
        settings.containerHeight = $this.height();
        $this.slideDown('slow');
      }

      // if button is clicked, set a cookie if jQuery.cookie is present and get rid
      $('#dennis-cookienote-continue-button').bind('click', function() {
        agree();
      });
      if (settings.validateByClick === true) {
        $('a[href^="#"], a[href^="/"], a[href*="https://'+ window.location.hostname +'/"], a[href*="http://'+ window.location.hostname +'/"]').bind('click', function() {
          agree();
        });
      }

      /**
       * Click on a local link or the button means agree, set the cookie, hide
       * the notice.
       */
      function agree() {
        if ($.cookie) {
          $.cookie(settings.cookieNamePrefix +'_'+ hostname, 'true', { expires: settings.cookieExpiresIn, path: '/' });
          if (settings.animate === true) {
            $(cookieNoticeContainerId).slideUp(settings.animationSpeed);
          }
          else {
            $(cookieNoticeContainerId).hide();
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
          fontFamily: settings.fontFamily
        });
        var containerDiv = '<div id="dennis-cookienote-container" style="position:relative;"></div>';
        $this.append(containerDiv);

        // Add/style notice text
        var p = '<p style="margin:0; padding:8px; text-align:center;">'+ settings.noticeText +'</p>';
        $('#dennis-cookienote-container').append(p);
        $this.find('a').css({
          color: settings.linkColor,
          textDecoration: 'none'
        });

        // Add/Style close button
        var button = '<button type="button" id="dennis-cookienote-continue-button" title="'+ settings.confirmText +'">'+ settings.confirmText +'</button>';
        $('#dennis-cookienote-container p').append(button);
        $('#dennis-cookienote-container button').css({
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
    });
  };
});

jQQ.isolate(function($) {
  "use strict";
  $('body').prepend('<div id="dennis-cookie-notice"></div>');
  $('#dennis-cookie-notice').cookieNotice();
});
