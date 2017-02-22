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
