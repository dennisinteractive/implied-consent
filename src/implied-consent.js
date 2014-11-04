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
