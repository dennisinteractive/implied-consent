(function(f) { f() }(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
;__browserify_shim_require__=require;(function browserifyShim(module, define, require) {
// EventListener | MIT/GPL2 | github.com/jonathantneal/EventListener

this.Element && Element.prototype.attachEvent && !Element.prototype.addEventListener && (function () {
	function addToPrototype(name, method) {
		Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
	}

	// add
	addToPrototype("addEventListener", function (type, listener) {
		var
		target = this,
		listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
		typeListeners = listeners[type] = listeners[type] || [];

		// if no events exist, attach the listener
		if (!typeListeners.length) {
			target.attachEvent("on" + type, typeListeners.event = function (event) {
				var documentElement = target.document && target.document.documentElement || target.documentElement || { scrollLeft: 0, scrollTop: 0 };

				// polyfill w3c properties and methods
				event.currentTarget = target;
				event.pageX = event.clientX + documentElement.scrollLeft;
				event.pageY = event.clientY + documentElement.scrollTop;
				event.preventDefault = function () { event.returnValue = false };
				event.relatedTarget = event.fromElement || null;
				event.stopImmediatePropagation = function () { immediatePropagation = false; event.cancelBubble = true };
				event.stopPropagation = function () { event.cancelBubble = true };
				event.target = event.srcElement || target;
				event.timeStamp = +new Date;

				// create an cached list of the master events list (to protect this loop from breaking when an event is removed)
				for (var i = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[i]); ++i) {
					// check to see if the cached event still exists in the master events list
					for (var ii = 0, typeListener; typeListener = typeListeners[ii]; ++ii) {
						if (typeListener == typeListenerCache) {
							typeListener.call(target, event);

							break;
						}
					}
				}
			});
		}

		// add the event to the master event list
		typeListeners.push(listener);
	});

	// remove
	addToPrototype("removeEventListener", function (type, listener) {
		var
		target = this,
		listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
		typeListeners = listeners[type] = listeners[type] || [];

		// remove the newest matching event from the master event list
		for (var i = typeListeners.length - 1, typeListener; typeListener = typeListeners[i]; --i) {
			if (typeListener == listener) {
				typeListeners.splice(i, 1);

				break;
			}
		}

		// if no events exist, detach the listener
		if (!typeListeners.length && typeListeners.event) {
			target.detachEvent("on" + type, typeListeners.event);
		}
	});

	// dispatch
	addToPrototype("dispatchEvent", function (eventObject) {
		var
		target = this,
		type = eventObject.type,
		listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
		typeListeners = listeners[type] = listeners[type] || [];

		try {
			return target.fireEvent("on" + type, eventObject);
		} catch (error) {
			if (typeListeners.event) {
				typeListeners.event(eventObject);
			}

			return;
		}
	});

	// CustomEvent
	Object.defineProperty(Window.prototype, "CustomEvent", {
		get: function () {
			var self = this;

			return function CustomEvent(type, eventInitDict) {
				var event = self.document.createEventObject(), key;

				event.type = type;
				for (key in eventInitDict) {
					if (key == 'cancelable'){
						event.returnValue = !eventInitDict.cancelable;
					} else if (key == 'bubbles'){
						event.cancelBubble = !eventInitDict.bubbles;
					} else if (key == 'detail'){
						event.detail = eventInitDict.detail;
					}
				}
				return event;
			};
		}
	});

	// ready
	function ready(event) {
		if (ready.interval && document.body) {
			ready.interval = clearInterval(ready.interval);

			document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
		}
	}

	ready.interval = setInterval(ready, 1);

	window.addEventListener("load", ready);
})();

!this.CustomEvent && (function() {
	// CustomEvent for browsers which don't natively support the Constructor method
	window.CustomEvent = function CustomEvent(type, eventInitDict) {
		var event;
		eventInitDict = eventInitDict || {bubbles: false, cancelable: false, detail: undefined};

		try {
			event = document.createEvent('CustomEvent');
			event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
		} catch (error) {
			// for browsers which don't support CustomEvent at all, we use a regular event instead
			event = document.createEvent('Event');
			event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
			event.detail = eventInitDict.detail;
		}

		return event;
	};
})();
}).call(global, module, undefined, undefined);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
/**
 * array-foreach
 *   Array#forEach ponyfill for older browsers
 *   (Ponyfill: A polyfill that doesn't overwrite the native method)
 * 
 * https://github.com/twada/array-foreach
 *
 * Copyright (c) 2015 Takuto Wada
 * Licensed under the MIT license.
 *   http://twada.mit-license.org/
 */
'use strict';

module.exports = function forEach (ary, callback, thisArg) {
    if (ary.forEach) {
        ary.forEach(callback, thisArg);
        return;
    }
    for (var i = 0; i < ary.length; i+=1) {
        callback.call(thisArg, ary[i], i, ary);
    }
};

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
/*
 * Cookies.js - 1.2.1
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

            return Cookies._cache[Cookies._cacheKeyPrefix + key];
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

            return {
                key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
                value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
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

    var cookiesExport = typeof global.document === 'object' ? factory(global) : factory;

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
},{}],5:[function(require,module,exports){
/*jshint browser:true, node:true*/

'use strict';

module.exports = Delegate;

/**
 * DOM event delegator
 *
 * The delegator will listen
 * for events that bubble up
 * to the root node.
 *
 * @constructor
 * @param {Node|string} [root] The root node or a selector string matching the root node
 */
function Delegate(root) {

  /**
   * Maintain a map of listener
   * lists, keyed by event name.
   *
   * @type Object
   */
  this.listenerMap = [{}, {}];
  if (root) {
    this.root(root);
  }

  /** @type function() */
  this.handle = Delegate.prototype.handle.bind(this);
}

/**
 * Start listening for events
 * on the provided DOM element
 *
 * @param  {Node|string} [root] The root node or a selector string matching the root node
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.root = function(root) {
  var listenerMap = this.listenerMap;
  var eventType;

  // Remove master event listeners
  if (this.rootElement) {
    for (eventType in listenerMap[1]) {
      if (listenerMap[1].hasOwnProperty(eventType)) {
        this.rootElement.removeEventListener(eventType, this.handle, true);
      }
    }
    for (eventType in listenerMap[0]) {
      if (listenerMap[0].hasOwnProperty(eventType)) {
        this.rootElement.removeEventListener(eventType, this.handle, false);
      }
    }
  }

  // If no root or root is not
  // a dom node, then remove internal
  // root reference and exit here
  if (!root || !root.addEventListener) {
    if (this.rootElement) {
      delete this.rootElement;
    }
    return this;
  }

  /**
   * The root node at which
   * listeners are attached.
   *
   * @type Node
   */
  this.rootElement = root;

  // Set up master event listeners
  for (eventType in listenerMap[1]) {
    if (listenerMap[1].hasOwnProperty(eventType)) {
      this.rootElement.addEventListener(eventType, this.handle, true);
    }
  }
  for (eventType in listenerMap[0]) {
    if (listenerMap[0].hasOwnProperty(eventType)) {
      this.rootElement.addEventListener(eventType, this.handle, false);
    }
  }

  return this;
};

/**
 * @param {string} eventType
 * @returns boolean
 */
Delegate.prototype.captureForType = function(eventType) {
  return ['blur', 'error', 'focus', 'load', 'resize', 'scroll'].indexOf(eventType) !== -1;
};

/**
 * Attach a handler to one
 * event for all elements
 * that match the selector,
 * now or in the future
 *
 * The handler function receives
 * three arguments: the DOM event
 * object, the node that matched
 * the selector while the event
 * was bubbling and a reference
 * to itself. Within the handler,
 * 'this' is equal to the second
 * argument.
 *
 * The node that actually received
 * the event can be accessed via
 * 'event.target'.
 *
 * @param {string} eventType Listen for these events
 * @param {string|undefined} selector Only handle events on elements matching this selector, if undefined match root element
 * @param {function()} handler Handler function - event data passed here will be in event.data
 * @param {Object} [eventData] Data to pass in event.data
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.on = function(eventType, selector, handler, useCapture) {
  var root, listenerMap, matcher, matcherParam;

  if (!eventType) {
    throw new TypeError('Invalid event type: ' + eventType);
  }

  // handler can be passed as
  // the second or third argument
  if (typeof selector === 'function') {
    useCapture = handler;
    handler = selector;
    selector = null;
  }

  // Fallback to sensible defaults
  // if useCapture not set
  if (useCapture === undefined) {
    useCapture = this.captureForType(eventType);
  }

  if (typeof handler !== 'function') {
    throw new TypeError('Handler must be a type of Function');
  }

  root = this.rootElement;
  listenerMap = this.listenerMap[useCapture ? 1 : 0];

  // Add master handler for type if not created yet
  if (!listenerMap[eventType]) {
    if (root) {
      root.addEventListener(eventType, this.handle, useCapture);
    }
    listenerMap[eventType] = [];
  }

  if (!selector) {
    matcherParam = null;

    // COMPLEX - matchesRoot needs to have access to
    // this.rootElement, so bind the function to this.
    matcher = matchesRoot.bind(this);

  // Compile a matcher for the given selector
  } else if (/^[a-z]+$/i.test(selector)) {
    matcherParam = selector;
    matcher = matchesTag;
  } else if (/^#[a-z0-9\-_]+$/i.test(selector)) {
    matcherParam = selector.slice(1);
    matcher = matchesId;
  } else {
    matcherParam = selector;
    matcher = matches;
  }

  // Add to the list of listeners
  listenerMap[eventType].push({
    selector: selector,
    handler: handler,
    matcher: matcher,
    matcherParam: matcherParam
  });

  return this;
};

/**
 * Remove an event handler
 * for elements that match
 * the selector, forever
 *
 * @param {string} [eventType] Remove handlers for events matching this type, considering the other parameters
 * @param {string} [selector] If this parameter is omitted, only handlers which match the other two will be removed
 * @param {function()} [handler] If this parameter is omitted, only handlers which match the previous two will be removed
 * @returns {Delegate} This method is chainable
 */
Delegate.prototype.off = function(eventType, selector, handler, useCapture) {
  var i, listener, listenerMap, listenerList, singleEventType;

  // Handler can be passed as
  // the second or third argument
  if (typeof selector === 'function') {
    useCapture = handler;
    handler = selector;
    selector = null;
  }

  // If useCapture not set, remove
  // all event listeners
  if (useCapture === undefined) {
    this.off(eventType, selector, handler, true);
    this.off(eventType, selector, handler, false);
    return this;
  }

  listenerMap = this.listenerMap[useCapture ? 1 : 0];
  if (!eventType) {
    for (singleEventType in listenerMap) {
      if (listenerMap.hasOwnProperty(singleEventType)) {
        this.off(singleEventType, selector, handler);
      }
    }

    return this;
  }

  listenerList = listenerMap[eventType];
  if (!listenerList || !listenerList.length) {
    return this;
  }

  // Remove only parameter matches
  // if specified
  for (i = listenerList.length - 1; i >= 0; i--) {
    listener = listenerList[i];

    if ((!selector || selector === listener.selector) && (!handler || handler === listener.handler)) {
      listenerList.splice(i, 1);
    }
  }

  // All listeners removed
  if (!listenerList.length) {
    delete listenerMap[eventType];

    // Remove the main handler
    if (this.rootElement) {
      this.rootElement.removeEventListener(eventType, this.handle, useCapture);
    }
  }

  return this;
};


/**
 * Handle an arbitrary event.
 *
 * @param {Event} event
 */
Delegate.prototype.handle = function(event) {
  var i, l, type = event.type, root, phase, listener, returned, listenerList = [], target, /** @const */ EVENTIGNORE = 'ftLabsDelegateIgnore';

  if (event[EVENTIGNORE] === true) {
    return;
  }

  target = event.target;

  // Hardcode value of Node.TEXT_NODE
  // as not defined in IE8
  if (target.nodeType === 3) {
    target = target.parentNode;
  }

  root = this.rootElement;

  phase = event.eventPhase || ( event.target !== event.currentTarget ? 3 : 2 );
  
  switch (phase) {
    case 1: //Event.CAPTURING_PHASE:
      listenerList = this.listenerMap[1][type];
    break;
    case 2: //Event.AT_TARGET:
      if (this.listenerMap[0] && this.listenerMap[0][type]) listenerList = listenerList.concat(this.listenerMap[0][type]);
      if (this.listenerMap[1] && this.listenerMap[1][type]) listenerList = listenerList.concat(this.listenerMap[1][type]);
    break;
    case 3: //Event.BUBBLING_PHASE:
      listenerList = this.listenerMap[0][type];
    break;
  }

  // Need to continuously check
  // that the specific list is
  // still populated in case one
  // of the callbacks actually
  // causes the list to be destroyed.
  l = listenerList.length;
  while (target && l) {
    for (i = 0; i < l; i++) {
      listener = listenerList[i];

      // Bail from this loop if
      // the length changed and
      // no more listeners are
      // defined between i and l.
      if (!listener) {
        break;
      }

      // Check for match and fire
      // the event if there's one
      //
      // TODO:MCG:20120117: Need a way
      // to check if event#stopImmediatePropagation
      // was called. If so, break both loops.
      if (listener.matcher.call(target, listener.matcherParam, target)) {
        returned = this.fire(event, target, listener);
      }

      // Stop propagation to subsequent
      // callbacks if the callback returned
      // false
      if (returned === false) {
        event[EVENTIGNORE] = true;
        event.preventDefault();
        return;
      }
    }

    // TODO:MCG:20120117: Need a way to
    // check if event#stopPropagation
    // was called. If so, break looping
    // through the DOM. Stop if the
    // delegation root has been reached
    if (target === root) {
      break;
    }

    l = listenerList.length;
    target = target.parentElement;
  }
};

/**
 * Fire a listener on a target.
 *
 * @param {Event} event
 * @param {Node} target
 * @param {Object} listener
 * @returns {boolean}
 */
Delegate.prototype.fire = function(event, target, listener) {
  return listener.handler.call(target, event, target);
};

/**
 * Check whether an element
 * matches a generic selector.
 *
 * @type function()
 * @param {string} selector A CSS selector
 */
var matches = (function(el) {
  if (!el) return;
  var p = el.prototype;
  return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
}(Element));

/**
 * Check whether an element
 * matches a tag selector.
 *
 * Tags are NOT case-sensitive,
 * except in XML (and XML-based
 * languages such as XHTML).
 *
 * @param {string} tagName The tag name to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesTag(tagName, element) {
  return tagName.toLowerCase() === element.tagName.toLowerCase();
}

/**
 * Check whether an element
 * matches the root.
 *
 * @param {?String} selector In this case this is always passed through as null and not used
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesRoot(selector, element) {
  /*jshint validthis:true*/
  if (this.rootElement === window) return element === document;
  return this.rootElement === element;
}

/**
 * Check whether the ID of
 * the element in 'this'
 * matches the given ID.
 *
 * IDs are case-sensitive.
 *
 * @param {string} id The ID to test against
 * @param {Element} element The element to test with
 * @returns boolean
 */
function matchesId(id, element) {
  return id === element.id;
}

/**
 * Short hand for off()
 * and root(), ie both
 * with no parameters
 *
 * @return void
 */
Delegate.prototype.destroy = function() {
  this.off();
  this.root();
};

},{}],6:[function(require,module,exports){
/*jshint browser:true, node:true*/

'use strict';

/**
 * @preserve Create and manage a DOM event delegator.
 *
 * @version 0.3.0
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */
var Delegate = require('./delegate');

module.exports = function(root) {
  return new Delegate(root);
};

module.exports.Delegate = Delegate;

},{"./delegate":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var slice = Array.prototype.slice;
var toStr = Object.prototype.toString;
var funcType = '[object Function]';

module.exports = function bind(that) {
    var target = this;
    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
    }
    var args = slice.call(arguments, 1);

    var binder = function () {
        if (this instanceof bound) {
            var result = target.apply(
                this,
                args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
                return result;
            }
            return this;
        } else {
            return target.apply(
                that,
                args.concat(slice.call(arguments))
            );
        }
    };

    var boundLength = Math.max(0, target.length - args.length);
    var boundArgs = [];
    for (var i = 0; i < boundLength; i++) {
        boundArgs.push('$' + i);
    }

    var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

    if (target.prototype) {
        var Empty = function Empty() {};
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
    }

    return bound;
};


},{}],9:[function(require,module,exports){
/* jshint bitwise: false */

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this === null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

},{}],10:[function(require,module,exports){
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
  function validateByClick() {
    ic.delegate = new Delegate(document);
    // Specify the listener targets one by one to retain old IE8 compatibility.
    ic.delegate.on('click', 'a', validateByClickHandler);
    ic.delegate.on('click', 'button', validateByClickHandler);
    ic.delegate.on('click', 'input', validateByClickHandler);
  }

  /**
   * Event handler to monitor page interaction and perform acknowledgement if
   * needed.
   */
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

  /**
   * Close button click handler.
   */
  function buttonHandler() {
    agree();
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

    ic.status = true;
  }

  /**
   * Remove any event listeners set and the notice container.
   */
  function destroy() {
    var button = document.querySelector('#__ic-continue-button');
    button.removeEventListener('click', buttonHandler);
    ic.delegate && ic.delegate.destroy();

    // Destroy notice element.
    var el = document.querySelector('#__ic-notice-container');
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
      forEach(queue, root.impliedConsent.q.push);
    }
  }

  run();

  exports.impliedConsent = ic;

}(typeof exports === 'object' && exports || this));

},{"array-foreach":2,"aug":3,"cookies-js":4,"dom-delegate":6,"domready":7,"eventlistener-polyfill":1,"function-bind":8,"prototype-indexof-shim":9}]},{},[10]);
}));