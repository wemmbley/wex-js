(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jqvm"] = factory();
	else
		root["jqvm"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
module.exports = __webpack_require__(82);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__resourceQuery) {

/* global __resourceQuery WorkerGlobalScope self */

/* eslint prefer-destructuring: off */
var stripAnsi = __webpack_require__(8);
var socket = __webpack_require__(10);
var overlay = __webpack_require__(15);
var _require = __webpack_require__(22),
  log = _require.log,
  setLogLevel = _require.setLogLevel;
var sendMessage = __webpack_require__(24);
var reloadApp = __webpack_require__(25);
var createSocketUrl = __webpack_require__(28);
var status = {
  isUnloading: false,
  currentHash: ''
};
var options = {
  hot: false,
  hotReload: true,
  liveReload: false,
  initial: true,
  useWarningOverlay: false,
  useErrorOverlay: false,
  useProgress: false
};
var socketUrl = createSocketUrl(__resourceQuery);
self.addEventListener('beforeunload', function () {
  status.isUnloading = true;
});
if (typeof window !== 'undefined') {
  var qs = window.location.search.toLowerCase();
  options.hotReload = qs.indexOf('hotreload=false') === -1;
}
var onSocketMessage = {
  hot: function hot() {
    options.hot = true;
    log.info('[WDS] Hot Module Replacement enabled.');
  },
  liveReload: function liveReload() {
    options.liveReload = true;
    log.info('[WDS] Live Reloading enabled.');
  },
  invalid: function invalid() {
    log.info('[WDS] App updated. Recompiling...'); // fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.

    if (options.useWarningOverlay || options.useErrorOverlay) {
      overlay.clear();
    }
    sendMessage('Invalid');
  },
  hash: function hash(_hash) {
    status.currentHash = _hash;
  },
  'still-ok': function stillOk() {
    log.info('[WDS] Nothing changed.');
    if (options.useWarningOverlay || options.useErrorOverlay) {
      overlay.clear();
    }
    sendMessage('StillOk');
  },
  'log-level': function logLevel(level) {
    var hotCtx = __webpack_require__(80);
    if (hotCtx.keys().indexOf('./log') !== -1) {
      hotCtx('./log').setLogLevel(level);
    }
    setLogLevel(level);
  },
  overlay: function overlay(value) {
    if (typeof document !== 'undefined') {
      if (typeof value === 'boolean') {
        options.useWarningOverlay = false;
        options.useErrorOverlay = value;
      } else if (value) {
        options.useWarningOverlay = value.warnings;
        options.useErrorOverlay = value.errors;
      }
    }
  },
  progress: function progress(_progress) {
    if (typeof document !== 'undefined') {
      options.useProgress = _progress;
    }
  },
  'progress-update': function progressUpdate(data) {
    if (options.useProgress) {
      log.info("[WDS] ".concat(data.percent, "% - ").concat(data.msg, "."));
    }
    sendMessage('Progress', data);
  },
  ok: function ok() {
    sendMessage('Ok');
    if (options.useWarningOverlay || options.useErrorOverlay) {
      overlay.clear();
    }
    if (options.initial) {
      return options.initial = false;
    } // eslint-disable-line no-return-assign

    reloadApp(options, status);
  },
  'content-changed': function contentChanged() {
    log.info('[WDS] Content base changed. Reloading...');
    self.location.reload();
  },
  warnings: function warnings(_warnings) {
    log.warn('[WDS] Warnings while compiling.');
    var strippedWarnings = _warnings.map(function (warning) {
      return stripAnsi(warning);
    });
    sendMessage('Warnings', strippedWarnings);
    for (var i = 0; i < strippedWarnings.length; i++) {
      log.warn(strippedWarnings[i]);
    }
    if (options.useWarningOverlay) {
      overlay.showMessage(_warnings);
    }
    if (options.initial) {
      return options.initial = false;
    } // eslint-disable-line no-return-assign

    reloadApp(options, status);
  },
  errors: function errors(_errors) {
    log.error('[WDS] Errors while compiling. Reload prevented.');
    var strippedErrors = _errors.map(function (error) {
      return stripAnsi(error);
    });
    sendMessage('Errors', strippedErrors);
    for (var i = 0; i < strippedErrors.length; i++) {
      log.error(strippedErrors[i]);
    }
    if (options.useErrorOverlay) {
      overlay.showMessage(_errors);
    }
    options.initial = false;
  },
  error: function error(_error) {
    log.error(_error);
  },
  close: function close() {
    log.error('[WDS] Disconnected!');
    sendMessage('Close');
  }
};
socket(socketUrl, onSocketMessage);
/* WEBPACK VAR INJECTION */}.call(this, "?http://localhost:8099"))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ansiRegex = __webpack_require__(9)();
module.exports = function (str) {
  return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__webpack_dev_server_client__) {

/* global __webpack_dev_server_client__ */

/* eslint-disable
  camelcase
*/
// this SockJSClient is here as a default fallback, in case inline mode
// is off or the client is not injected. This will be switched to
// WebsocketClient when it becomes the default
// important: the path to SockJSClient here is made to work in the 'client'
// directory, but is updated via the webpack compilation when compiled from
// the 'client-src' directory
var Client = typeof __webpack_dev_server_client__ !== 'undefined' ? __webpack_dev_server_client__ :
// eslint-disable-next-line import/no-unresolved
__webpack_require__(11);
var retries = 0;
var client = null;
var socket = function initSocket(url, handlers) {
  client = new Client(url);
  client.onOpen(function () {
    retries = 0;
  });
  client.onClose(function () {
    if (retries === 0) {
      handlers.close();
    } // Try to reconnect.

    client = null; // After 10 retries stop trying, to prevent logspam.

    if (retries <= 10) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      // eslint-disable-next-line no-mixed-operators, no-restricted-properties
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;
      setTimeout(function () {
        socket(url, handlers);
      }, retryInMs);
    }
  });
  client.onMessage(function (data) {
    var msg = JSON.parse(data);
    if (handlers[msg.type]) {
      handlers[msg.type](msg.data);
    }
  });
};
module.exports = socket;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable
  no-unused-vars
*/
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
var SockJS = __webpack_require__(12);
var BaseClient = __webpack_require__(14);
module.exports = /*#__PURE__*/function (_BaseClient) {
  _inherits(SockJSClient, _BaseClient);
  var _super = _createSuper(SockJSClient);
  function SockJSClient(url) {
    var _this;
    _classCallCheck(this, SockJSClient);
    _this = _super.call(this);
    _this.sock = new SockJS(url);
    _this.sock.onerror = function (err) {// TODO: use logger to log the error event once client and client-src
      // are reorganized to have the same directory structure
    };
    return _this;
  }
  _createClass(SockJSClient, [{
    key: "onOpen",
    value: function onOpen(f) {
      this.sock.onopen = f;
    }
  }, {
    key: "onClose",
    value: function onClose(f) {
      this.sock.onclose = f;
    } // call f with the message string as the first argument
  }, {
    key: "onMessage",
    value: function onMessage(f) {
      this.sock.onmessage = function (e) {
        f(e.data);
      };
    }
  }], [{
    key: "getClientPath",
    value: function getClientPath(options) {
      return /*require.resolve*/(11);
    }
  }]);
  return SockJSClient;
}(BaseClient);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var require;var require;function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/* sockjs-client v1.6.1 | http://sockjs.org | MIT license */
(function (f) {
  if (( false ? undefined : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (f),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var g; }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return require(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var transportList = require('./transport-list');
          module.exports = require('./main')(transportList);

          // TODO can't get rid of this until all servers do
          if ('_sockjs_onload' in global) {
            setTimeout(global._sockjs_onload, 1);
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./main": 14,
      "./transport-list": 16
    }],
    2: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        Event = require('./event');
      function CloseEvent() {
        Event.call(this);
        this.initEvent('close', false, false);
        this.wasClean = false;
        this.code = 0;
        this.reason = '';
      }
      inherits(CloseEvent, Event);
      module.exports = CloseEvent;
    }, {
      "./event": 4,
      "inherits": 57
    }],
    3: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        EventTarget = require('./eventtarget');
      function EventEmitter() {
        EventTarget.call(this);
      }
      inherits(EventEmitter, EventTarget);
      EventEmitter.prototype.removeAllListeners = function (type) {
        if (type) {
          delete this._listeners[type];
        } else {
          this._listeners = {};
        }
      };
      EventEmitter.prototype.once = function (type, listener) {
        var self = this,
          fired = false;
        function g() {
          self.removeListener(type, g);
          if (!fired) {
            fired = true;
            listener.apply(this, arguments);
          }
        }
        this.on(type, g);
      };
      EventEmitter.prototype.emit = function () {
        var type = arguments[0];
        var listeners = this._listeners[type];
        if (!listeners) {
          return;
        }
        // equivalent of Array.prototype.slice.call(arguments, 1);
        var l = arguments.length;
        var args = new Array(l - 1);
        for (var ai = 1; ai < l; ai++) {
          args[ai - 1] = arguments[ai];
        }
        for (var i = 0; i < listeners.length; i++) {
          listeners[i].apply(this, args);
        }
      };
      EventEmitter.prototype.on = EventEmitter.prototype.addListener = EventTarget.prototype.addEventListener;
      EventEmitter.prototype.removeListener = EventTarget.prototype.removeEventListener;
      module.exports.EventEmitter = EventEmitter;
    }, {
      "./eventtarget": 5,
      "inherits": 57
    }],
    4: [function (require, module, exports) {
      'use strict';

      function Event(eventType) {
        this.type = eventType;
      }
      Event.prototype.initEvent = function (eventType, canBubble, cancelable) {
        this.type = eventType;
        this.bubbles = canBubble;
        this.cancelable = cancelable;
        this.timeStamp = +new Date();
        return this;
      };
      Event.prototype.stopPropagation = function () {};
      Event.prototype.preventDefault = function () {};
      Event.CAPTURING_PHASE = 1;
      Event.AT_TARGET = 2;
      Event.BUBBLING_PHASE = 3;
      module.exports = Event;
    }, {}],
    5: [function (require, module, exports) {
      'use strict';

      /* Simplified implementation of DOM2 EventTarget.
       *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
       */
      function EventTarget() {
        this._listeners = {};
      }
      EventTarget.prototype.addEventListener = function (eventType, listener) {
        if (!(eventType in this._listeners)) {
          this._listeners[eventType] = [];
        }
        var arr = this._listeners[eventType];
        // #4
        if (arr.indexOf(listener) === -1) {
          // Make a copy so as not to interfere with a current dispatchEvent.
          arr = arr.concat([listener]);
        }
        this._listeners[eventType] = arr;
      };
      EventTarget.prototype.removeEventListener = function (eventType, listener) {
        var arr = this._listeners[eventType];
        if (!arr) {
          return;
        }
        var idx = arr.indexOf(listener);
        if (idx !== -1) {
          if (arr.length > 1) {
            // Make a copy so as not to interfere with a current dispatchEvent.
            this._listeners[eventType] = arr.slice(0, idx).concat(arr.slice(idx + 1));
          } else {
            delete this._listeners[eventType];
          }
          return;
        }
      };
      EventTarget.prototype.dispatchEvent = function () {
        var event = arguments[0];
        var t = event.type;
        // equivalent of Array.prototype.slice.call(arguments, 0);
        var args = arguments.length === 1 ? [event] : Array.apply(null, arguments);
        // TODO: This doesn't match the real behavior; per spec, onfoo get
        // their place in line from the /first/ time they're set from
        // non-null. Although WebKit bumps it to the end every time it's
        // set.
        if (this['on' + t]) {
          this['on' + t].apply(this, args);
        }
        if (t in this._listeners) {
          // Grab a reference to the listeners list. removeEventListener may alter the list.
          var listeners = this._listeners[t];
          for (var i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
          }
        }
      };
      module.exports = EventTarget;
    }, {}],
    6: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        Event = require('./event');
      function TransportMessageEvent(data) {
        Event.call(this);
        this.initEvent('message', false, false);
        this.data = data;
      }
      inherits(TransportMessageEvent, Event);
      module.exports = TransportMessageEvent;
    }, {
      "./event": 4,
      "inherits": 57
    }],
    7: [function (require, module, exports) {
      'use strict';

      var iframeUtils = require('./utils/iframe');
      function FacadeJS(transport) {
        this._transport = transport;
        transport.on('message', this._transportMessage.bind(this));
        transport.on('close', this._transportClose.bind(this));
      }
      FacadeJS.prototype._transportClose = function (code, reason) {
        iframeUtils.postMessage('c', JSON.stringify([code, reason]));
      };
      FacadeJS.prototype._transportMessage = function (frame) {
        iframeUtils.postMessage('t', frame);
      };
      FacadeJS.prototype._send = function (data) {
        this._transport.send(data);
      };
      FacadeJS.prototype._close = function () {
        this._transport.close();
        this._transport.removeAllListeners();
      };
      module.exports = FacadeJS;
    }, {
      "./utils/iframe": 47
    }],
    8: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var urlUtils = require('./utils/url'),
            eventUtils = require('./utils/event'),
            FacadeJS = require('./facade'),
            InfoIframeReceiver = require('./info-iframe-receiver'),
            iframeUtils = require('./utils/iframe'),
            loc = require('./location');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:iframe-bootstrap');
          }
          module.exports = function (SockJS, availableTransports) {
            var transportMap = {};
            availableTransports.forEach(function (at) {
              if (at.facadeTransport) {
                transportMap[at.facadeTransport.transportName] = at.facadeTransport;
              }
            });

            // hard-coded for the info iframe
            // TODO see if we can make this more dynamic
            transportMap[InfoIframeReceiver.transportName] = InfoIframeReceiver;
            var parentOrigin;

            /* eslint-disable camelcase */
            SockJS.bootstrap_iframe = function () {
              /* eslint-enable camelcase */
              var facade;
              iframeUtils.currentWindowId = loc.hash.slice(1);
              var onMessage = function onMessage(e) {
                if (e.source !== parent) {
                  return;
                }
                if (typeof parentOrigin === 'undefined') {
                  parentOrigin = e.origin;
                }
                if (e.origin !== parentOrigin) {
                  return;
                }
                var iframeMessage;
                try {
                  iframeMessage = JSON.parse(e.data);
                } catch (ignored) {
                  debug('bad json', e.data);
                  return;
                }
                if (iframeMessage.windowId !== iframeUtils.currentWindowId) {
                  return;
                }
                switch (iframeMessage.type) {
                  case 's':
                    var p;
                    try {
                      p = JSON.parse(iframeMessage.data);
                    } catch (ignored) {
                      debug('bad json', iframeMessage.data);
                      break;
                    }
                    var version = p[0];
                    var transport = p[1];
                    var transUrl = p[2];
                    var baseUrl = p[3];
                    debug(version, transport, transUrl, baseUrl);
                    // change this to semver logic
                    if (version !== SockJS.version) {
                      throw new Error('Incompatible SockJS! Main site uses:' + ' "' + version + '", the iframe:' + ' "' + SockJS.version + '".');
                    }
                    if (!urlUtils.isOriginEqual(transUrl, loc.href) || !urlUtils.isOriginEqual(baseUrl, loc.href)) {
                      throw new Error('Can\'t connect to different domain from within an ' + 'iframe. (' + loc.href + ', ' + transUrl + ', ' + baseUrl + ')');
                    }
                    facade = new FacadeJS(new transportMap[transport](transUrl, baseUrl));
                    break;
                  case 'm':
                    facade._send(iframeMessage.data);
                    break;
                  case 'c':
                    if (facade) {
                      facade._close();
                    }
                    facade = null;
                    break;
                }
              };
              eventUtils.attachEvent('message', onMessage);

              // Start
              iframeUtils.postMessage('s');
            };
          };
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "./facade": 7,
      "./info-iframe-receiver": 10,
      "./location": 13,
      "./utils/event": 46,
      "./utils/iframe": 47,
      "./utils/url": 52,
      "debug": 55
    }],
    9: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            objectUtils = require('./utils/object');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:info-ajax');
          }
          function InfoAjax(url, AjaxObject) {
            EventEmitter.call(this);
            var self = this;
            var t0 = +new Date();
            this.xo = new AjaxObject('GET', url);
            this.xo.once('finish', function (status, text) {
              var info, rtt;
              if (status === 200) {
                rtt = +new Date() - t0;
                if (text) {
                  try {
                    info = JSON.parse(text);
                  } catch (e) {
                    debug('bad json', text);
                  }
                }
                if (!objectUtils.isObject(info)) {
                  info = {};
                }
              }
              self.emit('finish', info, rtt);
              self.removeAllListeners();
            });
          }
          inherits(InfoAjax, EventEmitter);
          InfoAjax.prototype.close = function () {
            this.removeAllListeners();
            this.xo.close();
          };
          module.exports = InfoAjax;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "./utils/object": 49,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    10: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        EventEmitter = require('events').EventEmitter,
        XHRLocalObject = require('./transport/sender/xhr-local'),
        InfoAjax = require('./info-ajax');
      function InfoReceiverIframe(transUrl) {
        var self = this;
        EventEmitter.call(this);
        this.ir = new InfoAjax(transUrl, XHRLocalObject);
        this.ir.once('finish', function (info, rtt) {
          self.ir = null;
          self.emit('message', JSON.stringify([info, rtt]));
        });
      }
      inherits(InfoReceiverIframe, EventEmitter);
      InfoReceiverIframe.transportName = 'iframe-info-receiver';
      InfoReceiverIframe.prototype.close = function () {
        if (this.ir) {
          this.ir.close();
          this.ir = null;
        }
        this.removeAllListeners();
      };
      module.exports = InfoReceiverIframe;
    }, {
      "./info-ajax": 9,
      "./transport/sender/xhr-local": 37,
      "events": 3,
      "inherits": 57
    }],
    11: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            utils = require('./utils/event'),
            IframeTransport = require('./transport/iframe'),
            InfoReceiverIframe = require('./info-iframe-receiver');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:info-iframe');
          }
          function InfoIframe(baseUrl, url) {
            var self = this;
            EventEmitter.call(this);
            var go = function go() {
              var ifr = self.ifr = new IframeTransport(InfoReceiverIframe.transportName, url, baseUrl);
              ifr.once('message', function (msg) {
                if (msg) {
                  var d;
                  try {
                    d = JSON.parse(msg);
                  } catch (e) {
                    debug('bad json', msg);
                    self.emit('finish');
                    self.close();
                    return;
                  }
                  var info = d[0],
                    rtt = d[1];
                  self.emit('finish', info, rtt);
                }
                self.close();
              });
              ifr.once('close', function () {
                self.emit('finish');
                self.close();
              });
            };

            // TODO this seems the same as the 'needBody' from transports
            if (!global.document.body) {
              utils.attachEvent('load', go);
            } else {
              go();
            }
          }
          inherits(InfoIframe, EventEmitter);
          InfoIframe.enabled = function () {
            return IframeTransport.enabled();
          };
          InfoIframe.prototype.close = function () {
            if (this.ifr) {
              this.ifr.close();
            }
            this.removeAllListeners();
            this.ifr = null;
          };
          module.exports = InfoIframe;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./info-iframe-receiver": 10,
      "./transport/iframe": 22,
      "./utils/event": 46,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    12: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            urlUtils = require('./utils/url'),
            XDR = require('./transport/sender/xdr'),
            XHRCors = require('./transport/sender/xhr-cors'),
            XHRLocal = require('./transport/sender/xhr-local'),
            XHRFake = require('./transport/sender/xhr-fake'),
            InfoIframe = require('./info-iframe'),
            InfoAjax = require('./info-ajax');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:info-receiver');
          }
          function InfoReceiver(baseUrl, urlInfo) {
            debug(baseUrl);
            var self = this;
            EventEmitter.call(this);
            setTimeout(function () {
              self.doXhr(baseUrl, urlInfo);
            }, 0);
          }
          inherits(InfoReceiver, EventEmitter);

          // TODO this is currently ignoring the list of available transports and the whitelist

          InfoReceiver._getReceiver = function (baseUrl, url, urlInfo) {
            // determine method of CORS support (if needed)
            if (urlInfo.sameOrigin) {
              return new InfoAjax(url, XHRLocal);
            }
            if (XHRCors.enabled) {
              return new InfoAjax(url, XHRCors);
            }
            if (XDR.enabled && urlInfo.sameScheme) {
              return new InfoAjax(url, XDR);
            }
            if (InfoIframe.enabled()) {
              return new InfoIframe(baseUrl, url);
            }
            return new InfoAjax(url, XHRFake);
          };
          InfoReceiver.prototype.doXhr = function (baseUrl, urlInfo) {
            var self = this,
              url = urlUtils.addPath(baseUrl, '/info');
            debug('doXhr', url);
            this.xo = InfoReceiver._getReceiver(baseUrl, url, urlInfo);
            this.timeoutRef = setTimeout(function () {
              debug('timeout');
              self._cleanup(false);
              self.emit('finish');
            }, InfoReceiver.timeout);
            this.xo.once('finish', function (info, rtt) {
              debug('finish', info, rtt);
              self._cleanup(true);
              self.emit('finish', info, rtt);
            });
          };
          InfoReceiver.prototype._cleanup = function (wasClean) {
            debug('_cleanup');
            clearTimeout(this.timeoutRef);
            this.timeoutRef = null;
            if (!wasClean && this.xo) {
              this.xo.close();
            }
            this.xo = null;
          };
          InfoReceiver.prototype.close = function () {
            debug('close');
            this.removeAllListeners();
            this._cleanup(false);
          };
          InfoReceiver.timeout = 8000;
          module.exports = InfoReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "./info-ajax": 9,
      "./info-iframe": 11,
      "./transport/sender/xdr": 34,
      "./transport/sender/xhr-cors": 35,
      "./transport/sender/xhr-fake": 36,
      "./transport/sender/xhr-local": 37,
      "./utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    13: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          module.exports = global.location || {
            origin: 'http://localhost:80',
            protocol: 'http:',
            host: 'localhost',
            port: 80,
            href: 'http://localhost/',
            hash: ''
          };
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    14: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          require('./shims');
          var URL = require('url-parse'),
            inherits = require('inherits'),
            random = require('./utils/random'),
            escape = require('./utils/escape'),
            urlUtils = require('./utils/url'),
            eventUtils = require('./utils/event'),
            transport = require('./utils/transport'),
            objectUtils = require('./utils/object'),
            browser = require('./utils/browser'),
            log = require('./utils/log'),
            Event = require('./event/event'),
            EventTarget = require('./event/eventtarget'),
            loc = require('./location'),
            CloseEvent = require('./event/close'),
            TransportMessageEvent = require('./event/trans-message'),
            InfoReceiver = require('./info-receiver');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:main');
          }
          var transports;

          // follow constructor steps defined at http://dev.w3.org/html5/websockets/#the-websocket-interface
          function SockJS(url, protocols, options) {
            if (!(this instanceof SockJS)) {
              return new SockJS(url, protocols, options);
            }
            if (arguments.length < 1) {
              throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");
            }
            EventTarget.call(this);
            this.readyState = SockJS.CONNECTING;
            this.extensions = '';
            this.protocol = '';

            // non-standard extension
            options = options || {};
            if (options.protocols_whitelist) {
              log.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead.");
            }
            this._transportsWhitelist = options.transports;
            this._transportOptions = options.transportOptions || {};
            this._timeout = options.timeout || 0;
            var sessionId = options.sessionId || 8;
            if (typeof sessionId === 'function') {
              this._generateSessionId = sessionId;
            } else if (typeof sessionId === 'number') {
              this._generateSessionId = function () {
                return random.string(sessionId);
              };
            } else {
              throw new TypeError('If sessionId is used in the options, it needs to be a number or a function.');
            }
            this._server = options.server || random.numberString(1000);

            // Step 1 of WS spec - parse and validate the url. Issue #8
            var parsedUrl = new URL(url);
            if (!parsedUrl.host || !parsedUrl.protocol) {
              throw new SyntaxError("The URL '" + url + "' is invalid");
            } else if (parsedUrl.hash) {
              throw new SyntaxError('The URL must not contain a fragment');
            } else if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
              throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '" + parsedUrl.protocol + "' is not allowed.");
            }
            var secure = parsedUrl.protocol === 'https:';
            // Step 2 - don't allow secure origin with an insecure protocol
            if (loc.protocol === 'https:' && !secure) {
              // exception is 127.0.0.0/8 and ::1 urls
              if (!urlUtils.isLoopbackAddr(parsedUrl.hostname)) {
                throw new Error('SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS');
              }
            }

            // Step 3 - check port access - no need here
            // Step 4 - parse protocols argument
            if (!protocols) {
              protocols = [];
            } else if (!Array.isArray(protocols)) {
              protocols = [protocols];
            }

            // Step 5 - check protocols argument
            var sortedProtocols = protocols.sort();
            sortedProtocols.forEach(function (proto, i) {
              if (!proto) {
                throw new SyntaxError("The protocols entry '" + proto + "' is invalid.");
              }
              if (i < sortedProtocols.length - 1 && proto === sortedProtocols[i + 1]) {
                throw new SyntaxError("The protocols entry '" + proto + "' is duplicated.");
              }
            });

            // Step 6 - convert origin
            var o = urlUtils.getOrigin(loc.href);
            this._origin = o ? o.toLowerCase() : null;

            // remove the trailing slash
            parsedUrl.set('pathname', parsedUrl.pathname.replace(/\/+$/, ''));

            // store the sanitized url
            this.url = parsedUrl.href;
            debug('using url', this.url);

            // Step 7 - start connection in background
            // obtain server info
            // http://sockjs.github.io/sockjs-protocol/sockjs-protocol-0.3.3.html#section-26
            this._urlInfo = {
              nullOrigin: !browser.hasDomain(),
              sameOrigin: urlUtils.isOriginEqual(this.url, loc.href),
              sameScheme: urlUtils.isSchemeEqual(this.url, loc.href)
            };
            this._ir = new InfoReceiver(this.url, this._urlInfo);
            this._ir.once('finish', this._receiveInfo.bind(this));
          }
          inherits(SockJS, EventTarget);
          function userSetCode(code) {
            return code === 1000 || code >= 3000 && code <= 4999;
          }
          SockJS.prototype.close = function (code, reason) {
            // Step 1
            if (code && !userSetCode(code)) {
              throw new Error('InvalidAccessError: Invalid code');
            }
            // Step 2.4 states the max is 123 bytes, but we are just checking length
            if (reason && reason.length > 123) {
              throw new SyntaxError('reason argument has an invalid length');
            }

            // Step 3.1
            if (this.readyState === SockJS.CLOSING || this.readyState === SockJS.CLOSED) {
              return;
            }

            // TODO look at docs to determine how to set this
            var wasClean = true;
            this._close(code || 1000, reason || 'Normal closure', wasClean);
          };
          SockJS.prototype.send = function (data) {
            // #13 - convert anything non-string to string
            // TODO this currently turns objects into [object Object]
            if (typeof data !== 'string') {
              data = '' + data;
            }
            if (this.readyState === SockJS.CONNECTING) {
              throw new Error('InvalidStateError: The connection has not been established yet');
            }
            if (this.readyState !== SockJS.OPEN) {
              return;
            }
            this._transport.send(escape.quote(data));
          };
          SockJS.version = require('./version');
          SockJS.CONNECTING = 0;
          SockJS.OPEN = 1;
          SockJS.CLOSING = 2;
          SockJS.CLOSED = 3;
          SockJS.prototype._receiveInfo = function (info, rtt) {
            debug('_receiveInfo', rtt);
            this._ir = null;
            if (!info) {
              this._close(1002, 'Cannot connect to server');
              return;
            }

            // establish a round-trip timeout (RTO) based on the
            // round-trip time (RTT)
            this._rto = this.countRTO(rtt);
            // allow server to override url used for the actual transport
            this._transUrl = info.base_url ? info.base_url : this.url;
            info = objectUtils.extend(info, this._urlInfo);
            debug('info', info);
            // determine list of desired and supported transports
            var enabledTransports = transports.filterToEnabled(this._transportsWhitelist, info);
            this._transports = enabledTransports.main;
            debug(this._transports.length + ' enabled transports');
            this._connect();
          };
          SockJS.prototype._connect = function () {
            for (var Transport = this._transports.shift(); Transport; Transport = this._transports.shift()) {
              debug('attempt', Transport.transportName);
              if (Transport.needBody) {
                if (!global.document.body || typeof global.document.readyState !== 'undefined' && global.document.readyState !== 'complete' && global.document.readyState !== 'interactive') {
                  debug('waiting for body');
                  this._transports.unshift(Transport);
                  eventUtils.attachEvent('load', this._connect.bind(this));
                  return;
                }
              }

              // calculate timeout based on RTO and round trips. Default to 5s
              var timeoutMs = Math.max(this._timeout, this._rto * Transport.roundTrips || 5000);
              this._transportTimeoutId = setTimeout(this._transportTimeout.bind(this), timeoutMs);
              debug('using timeout', timeoutMs);
              var transportUrl = urlUtils.addPath(this._transUrl, '/' + this._server + '/' + this._generateSessionId());
              var options = this._transportOptions[Transport.transportName];
              debug('transport url', transportUrl);
              var transportObj = new Transport(transportUrl, this._transUrl, options);
              transportObj.on('message', this._transportMessage.bind(this));
              transportObj.once('close', this._transportClose.bind(this));
              transportObj.transportName = Transport.transportName;
              this._transport = transportObj;
              return;
            }
            this._close(2000, 'All transports failed', false);
          };
          SockJS.prototype._transportTimeout = function () {
            debug('_transportTimeout');
            if (this.readyState === SockJS.CONNECTING) {
              if (this._transport) {
                this._transport.close();
              }
              this._transportClose(2007, 'Transport timed out');
            }
          };
          SockJS.prototype._transportMessage = function (msg) {
            debug('_transportMessage', msg);
            var self = this,
              type = msg.slice(0, 1),
              content = msg.slice(1),
              payload;

            // first check for messages that don't need a payload
            switch (type) {
              case 'o':
                this._open();
                return;
              case 'h':
                this.dispatchEvent(new Event('heartbeat'));
                debug('heartbeat', this.transport);
                return;
            }
            if (content) {
              try {
                payload = JSON.parse(content);
              } catch (e) {
                debug('bad json', content);
              }
            }
            if (typeof payload === 'undefined') {
              debug('empty payload', content);
              return;
            }
            switch (type) {
              case 'a':
                if (Array.isArray(payload)) {
                  payload.forEach(function (p) {
                    debug('message', self.transport, p);
                    self.dispatchEvent(new TransportMessageEvent(p));
                  });
                }
                break;
              case 'm':
                debug('message', this.transport, payload);
                this.dispatchEvent(new TransportMessageEvent(payload));
                break;
              case 'c':
                if (Array.isArray(payload) && payload.length === 2) {
                  this._close(payload[0], payload[1], true);
                }
                break;
            }
          };
          SockJS.prototype._transportClose = function (code, reason) {
            debug('_transportClose', this.transport, code, reason);
            if (this._transport) {
              this._transport.removeAllListeners();
              this._transport = null;
              this.transport = null;
            }
            if (!userSetCode(code) && code !== 2000 && this.readyState === SockJS.CONNECTING) {
              this._connect();
              return;
            }
            this._close(code, reason);
          };
          SockJS.prototype._open = function () {
            debug('_open', this._transport && this._transport.transportName, this.readyState);
            if (this.readyState === SockJS.CONNECTING) {
              if (this._transportTimeoutId) {
                clearTimeout(this._transportTimeoutId);
                this._transportTimeoutId = null;
              }
              this.readyState = SockJS.OPEN;
              this.transport = this._transport.transportName;
              this.dispatchEvent(new Event('open'));
              debug('connected', this.transport);
            } else {
              // The server might have been restarted, and lost track of our
              // connection.
              this._close(1006, 'Server lost session');
            }
          };
          SockJS.prototype._close = function (code, reason, wasClean) {
            debug('_close', this.transport, code, reason, wasClean, this.readyState);
            var forceFail = false;
            if (this._ir) {
              forceFail = true;
              this._ir.close();
              this._ir = null;
            }
            if (this._transport) {
              this._transport.close();
              this._transport = null;
              this.transport = null;
            }
            if (this.readyState === SockJS.CLOSED) {
              throw new Error('InvalidStateError: SockJS has already been closed');
            }
            this.readyState = SockJS.CLOSING;
            setTimeout(function () {
              this.readyState = SockJS.CLOSED;
              if (forceFail) {
                this.dispatchEvent(new Event('error'));
              }
              var e = new CloseEvent('close');
              e.wasClean = wasClean || false;
              e.code = code || 1000;
              e.reason = reason;
              this.dispatchEvent(e);
              this.onmessage = this.onclose = this.onerror = null;
              debug('disconnected');
            }.bind(this), 0);
          };

          // See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
          // and RFC 2988.
          SockJS.prototype.countRTO = function (rtt) {
            // In a local environment, when using IE8/9 and the `jsonp-polling`
            // transport the time needed to establish a connection (the time that pass
            // from the opening of the transport to the call of `_dispatchOpen`) is
            // around 200msec (the lower bound used in the article above) and this
            // causes spurious timeouts. For this reason we calculate a value slightly
            // larger than that used in the article.
            if (rtt > 100) {
              return 4 * rtt; // rto > 400msec
            }
            return 300 + rtt; // 300msec < rto <= 400msec
          };
          module.exports = function (availableTransports) {
            transports = transport(availableTransports);
            require('./iframe-bootstrap')(SockJS, availableTransports);
            return SockJS;
          };
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./event/close": 2,
      "./event/event": 4,
      "./event/eventtarget": 5,
      "./event/trans-message": 6,
      "./iframe-bootstrap": 8,
      "./info-receiver": 12,
      "./location": 13,
      "./shims": 15,
      "./utils/browser": 44,
      "./utils/escape": 45,
      "./utils/event": 46,
      "./utils/log": 48,
      "./utils/object": 49,
      "./utils/random": 50,
      "./utils/transport": 51,
      "./utils/url": 52,
      "./version": 53,
      "debug": 55,
      "inherits": 57,
      "url-parse": 60
    }],
    15: [function (require, module, exports) {
      /* eslint-disable */
      /* jscs: disable */
      'use strict';

      // pulled specific shims from https://github.com/es-shims/es5-shim
      var ArrayPrototype = Array.prototype;
      var ObjectPrototype = Object.prototype;
      var FunctionPrototype = Function.prototype;
      var StringPrototype = String.prototype;
      var array_slice = ArrayPrototype.slice;
      var _toString = ObjectPrototype.toString;
      var isFunction = function isFunction(val) {
        return ObjectPrototype.toString.call(val) === '[object Function]';
      };
      var isArray = function isArray(obj) {
        return _toString.call(obj) === '[object Array]';
      };
      var isString = function isString(obj) {
        return _toString.call(obj) === '[object String]';
      };
      var supportsDescriptors = Object.defineProperty && function () {
        try {
          Object.defineProperty({}, 'x', {});
          return true;
        } catch (e) {
          /* this is ES3 */
          return false;
        }
      }();

      // Define configurable, writable and non-enumerable props
      // if they don't exist.
      var defineProperty;
      if (supportsDescriptors) {
        defineProperty = function defineProperty(object, name, method, forceAssign) {
          if (!forceAssign && name in object) {
            return;
          }
          Object.defineProperty(object, name, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: method
          });
        };
      } else {
        defineProperty = function defineProperty(object, name, method, forceAssign) {
          if (!forceAssign && name in object) {
            return;
          }
          object[name] = method;
        };
      }
      var defineProperties = function defineProperties(object, map, forceAssign) {
        for (var name in map) {
          if (ObjectPrototype.hasOwnProperty.call(map, name)) {
            defineProperty(object, name, map[name], forceAssign);
          }
        }
      };
      var toObject = function toObject(o) {
        if (o == null) {
          // this matches both null and undefined
          throw new TypeError("can't convert " + o + ' to object');
        }
        return Object(o);
      };

      //
      // Util
      // ======
      //

      // ES5 9.4
      // http://es5.github.com/#x9.4
      // http://jsperf.com/to-integer

      function toInteger(num) {
        var n = +num;
        if (n !== n) {
          // isNaN
          n = 0;
        } else if (n !== 0 && n !== 1 / 0 && n !== -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
        return n;
      }
      function ToUint32(x) {
        return x >>> 0;
      }

      //
      // Function
      // ========
      //

      // ES-5 15.3.4.5
      // http://es5.github.com/#x15.3.4.5

      function Empty() {}
      defineProperties(FunctionPrototype, {
        bind: function bind(that) {
          // .length is 1
          // 1. Let Target be the this value.
          var target = this;
          // 2. If IsCallable(Target) is false, throw a TypeError exception.
          if (!isFunction(target)) {
            throw new TypeError('Function.prototype.bind called on incompatible ' + target);
          }
          // 3. Let A be a new (possibly empty) internal list of all of the
          //   argument values provided after thisArg (arg1, arg2 etc), in order.
          // XXX slicedArgs will stand in for "A" if used
          var args = array_slice.call(arguments, 1); // for normal call
          // 4. Let F be a new native ECMAScript object.
          // 11. Set the [[Prototype]] internal property of F to the standard
          //   built-in Function prototype object as specified in 15.3.3.1.
          // 12. Set the [[Call]] internal property of F as described in
          //   15.3.4.5.1.
          // 13. Set the [[Construct]] internal property of F as described in
          //   15.3.4.5.2.
          // 14. Set the [[HasInstance]] internal property of F as described in
          //   15.3.4.5.3.
          var binder = function binder() {
            if (this instanceof bound) {
              // 15.3.4.5.2 [[Construct]]
              // When the [[Construct]] internal method of a function object,
              // F that was created using the bind function is called with a
              // list of arguments ExtraArgs, the following steps are taken:
              // 1. Let target be the value of F's [[TargetFunction]]
              //   internal property.
              // 2. If target has no [[Construct]] internal method, a
              //   TypeError exception is thrown.
              // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
              //   property.
              // 4. Let args be a new list containing the same values as the
              //   list boundArgs in the same order followed by the same
              //   values as the list ExtraArgs in the same order.
              // 5. Return the result of calling the [[Construct]] internal
              //   method of target providing args as the arguments.

              var result = target.apply(this, args.concat(array_slice.call(arguments)));
              if (Object(result) === result) {
                return result;
              }
              return this;
            } else {
              // 15.3.4.5.1 [[Call]]
              // When the [[Call]] internal method of a function object, F,
              // which was created using the bind function is called with a
              // this value and a list of arguments ExtraArgs, the following
              // steps are taken:
              // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
              //   property.
              // 2. Let boundThis be the value of F's [[BoundThis]] internal
              //   property.
              // 3. Let target be the value of F's [[TargetFunction]] internal
              //   property.
              // 4. Let args be a new list containing the same values as the
              //   list boundArgs in the same order followed by the same
              //   values as the list ExtraArgs in the same order.
              // 5. Return the result of calling the [[Call]] internal method
              //   of target providing boundThis as the this value and
              //   providing args as the arguments.

              // equiv: target.call(this, ...boundArgs, ...args)
              return target.apply(that, args.concat(array_slice.call(arguments)));
            }
          };

          // 15. If the [[Class]] internal property of Target is "Function", then
          //     a. Let L be the length property of Target minus the length of A.
          //     b. Set the length own property of F to either 0 or L, whichever is
          //       larger.
          // 16. Else set the length own property of F to 0.

          var boundLength = Math.max(0, target.length - args.length);

          // 17. Set the attributes of the length own property of F to the values
          //   specified in 15.3.5.1.
          var boundArgs = [];
          for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
          }

          // XXX Build a dynamic function with desired amount of arguments is the only
          // way to set the length property of a function.
          // In environments where Content Security Policies enabled (Chrome extensions,
          // for ex.) all use of eval or Function costructor throws an exception.
          // However in all of these environments Function.prototype.bind exists
          // and so this code will never be executed.
          var bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
          if (target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
          }

          // TODO
          // 18. Set the [[Extensible]] internal property of F to true.

          // TODO
          // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
          // 20. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
          //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
          //   false.
          // 21. Call the [[DefineOwnProperty]] internal method of F with
          //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
          //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
          //   and false.

          // TODO
          // NOTE Function objects created using Function.prototype.bind do not
          // have a prototype property or the [[Code]], [[FormalParameters]], and
          // [[Scope]] internal properties.
          // XXX can't delete prototype in pure-js.

          // 22. Return F.
          return bound;
        }
      });

      //
      // Array
      // =====
      //

      // ES5 15.4.3.2
      // http://es5.github.com/#x15.4.3.2
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
      defineProperties(Array, {
        isArray: isArray
      });
      var boxedString = Object('a');
      var splitString = boxedString[0] !== 'a' || !(0 in boxedString);
      var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        if (method) {
          method.call('foo', function (_, __, context) {
            if (_typeof(context) !== 'object') {
              properlyBoxesNonStrict = false;
            }
          });
          method.call([1], function () {
            'use strict';

            properlyBoxesStrict = typeof this === 'string';
          }, 'x');
        }
        return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
      };
      defineProperties(ArrayPrototype, {
        forEach: function forEach(fun /*, thisp*/) {
          var object = toObject(this),
            self = splitString && isString(this) ? this.split('') : object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

          // If no callback function or if callback is not a callable function
          if (!isFunction(fun)) {
            throw new TypeError(); // TODO message
          }
          while (++i < length) {
            if (i in self) {
              // Invoke the callback function with call, passing arguments:
              // context, property value, property key, thisArg object
              // context
              fun.call(thisp, self[i], i, object);
            }
          }
        }
      }, !properlyBoxesContext(ArrayPrototype.forEach));

      // ES5 15.4.4.14
      // http://es5.github.com/#x15.4.4.14
      // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
      var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
      defineProperties(ArrayPrototype, {
        indexOf: function indexOf(sought /*, fromIndex */) {
          var self = splitString && isString(this) ? this.split('') : toObject(this),
            length = self.length >>> 0;
          if (!length) {
            return -1;
          }
          var i = 0;
          if (arguments.length > 1) {
            i = toInteger(arguments[1]);
          }

          // handle negative indices
          i = i >= 0 ? i : Math.max(0, length + i);
          for (; i < length; i++) {
            if (i in self && self[i] === sought) {
              return i;
            }
          }
          return -1;
        }
      }, hasFirefox2IndexOfBug);

      //
      // String
      // ======
      //

      // ES5 15.5.4.14
      // http://es5.github.com/#x15.5.4.14

      // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
      // Many browsers do not split properly with regular expressions or they
      // do not perform the split correctly under obscure conditions.
      // See http://blog.stevenlevithan.com/archives/cross-browser-split
      // I've tested in many browsers and this seems to cover the deviant ones:
      //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
      //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
      //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
      //       [undefined, "t", undefined, "e", ...]
      //    ''.split(/.?/) should be [], not [""]
      //    '.'.split(/()()/) should be ["."], not ["", "", "."]

      var string_split = StringPrototype.split;
      if ('ab'.split(/(?:ab)*/).length !== 2 || '.'.split(/(.?)(.?)/).length !== 4 || 'tesst'.split(/(s)*/)[1] === 't' || 'test'.split(/(?:)/, -1).length !== 4 || ''.split(/.?/).length || '.'.split(/()()/).length > 1) {
        (function () {
          var compliantExecNpcg = /()??/.exec('')[1] === void 0; // NPCG: nonparticipating capturing group

          StringPrototype.split = function (separator, limit) {
            var string = this;
            if (separator === void 0 && limit === 0) {
              return [];
            }

            // If `separator` is not a regex, use native split
            if (_toString.call(separator) !== '[object RegExp]') {
              return string_split.call(this, separator, limit);
            }
            var output = [],
              flags = (separator.ignoreCase ? 'i' : '') + (separator.multiline ? 'm' : '') + (separator.extended ? 'x' : '') + (
              // Proposed for ES6
              separator.sticky ? 'y' : ''),
              // Firefox 3+
              lastLastIndex = 0,
              // Make `global` and avoid `lastIndex` issues by working with a copy
              separator2,
              match,
              lastIndex,
              lastLength;
            separator = new RegExp(separator.source, flags + 'g');
            string += ''; // Type-convert
            if (!compliantExecNpcg) {
              // Doesn't need flags gy, but they don't hurt
              separator2 = new RegExp('^' + separator.source + '$(?!\\s)', flags);
            }
            /* Values for `limit`, per the spec:
             * If undefined: 4294967295 // Math.pow(2, 32) - 1
             * If 0, Infinity, or NaN: 0
             * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
             * If negative number: 4294967296 - Math.floor(Math.abs(limit))
             * If other: Type-convert, then use the above rules
             */
            limit = limit === void 0 ? -1 >>> 0 :
            // Math.pow(2, 32) - 1
            ToUint32(limit);
            while (match = separator.exec(string)) {
              // `separator.lastIndex` is not reliable cross-browser
              lastIndex = match.index + match[0].length;
              if (lastIndex > lastLastIndex) {
                output.push(string.slice(lastLastIndex, match.index));
                // Fix browsers whose `exec` methods don't consistently return `undefined` for
                // nonparticipating capturing groups
                if (!compliantExecNpcg && match.length > 1) {
                  match[0].replace(separator2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                      if (arguments[i] === void 0) {
                        match[i] = void 0;
                      }
                    }
                  });
                }
                if (match.length > 1 && match.index < string.length) {
                  ArrayPrototype.push.apply(output, match.slice(1));
                }
                lastLength = match[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= limit) {
                  break;
                }
              }
              if (separator.lastIndex === match.index) {
                separator.lastIndex++; // Avoid an infinite loop
              }
            }
            if (lastLastIndex === string.length) {
              if (lastLength || !separator.test('')) {
                output.push('');
              }
            } else {
              output.push(string.slice(lastLastIndex));
            }
            return output.length > limit ? output.slice(0, limit) : output;
          };
        })();

        // [bugfix, chrome]
        // If separator is undefined, then the result array contains just one String,
        // which is the this value (converted to a String). If limit is not undefined,
        // then the output array is truncated so that it contains no more than limit
        // elements.
        // "0".split(undefined, 0) -> []
      } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
          if (separator === void 0 && limit === 0) {
            return [];
          }
          return string_split.call(this, separator, limit);
        };
      }

      // ECMA-262, 3rd B.2.3
      // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
      // non-normative section suggesting uniform semantics and it should be
      // normalized across all browsers
      // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
      var string_substr = StringPrototype.substr;
      var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
      defineProperties(StringPrototype, {
        substr: function substr(start, length) {
          return string_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
        }
      }, hasNegativeSubstrBug);
    }, {}],
    16: [function (require, module, exports) {
      'use strict';

      module.exports = [
      // streaming transports
      require('./transport/websocket'), require('./transport/xhr-streaming'), require('./transport/xdr-streaming'), require('./transport/eventsource'), require('./transport/lib/iframe-wrap')(require('./transport/eventsource'))

      // polling transports
      , require('./transport/htmlfile'), require('./transport/lib/iframe-wrap')(require('./transport/htmlfile')), require('./transport/xhr-polling'), require('./transport/xdr-polling'), require('./transport/lib/iframe-wrap')(require('./transport/xhr-polling')), require('./transport/jsonp-polling')];
    }, {
      "./transport/eventsource": 20,
      "./transport/htmlfile": 21,
      "./transport/jsonp-polling": 23,
      "./transport/lib/iframe-wrap": 26,
      "./transport/websocket": 38,
      "./transport/xdr-polling": 39,
      "./transport/xdr-streaming": 40,
      "./transport/xhr-polling": 41,
      "./transport/xhr-streaming": 42
    }],
    17: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            utils = require('../../utils/event'),
            urlUtils = require('../../utils/url'),
            XHR = global.XMLHttpRequest;
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:browser:xhr');
          }
          function AbstractXHRObject(method, url, payload, opts) {
            debug(method, url);
            var self = this;
            EventEmitter.call(this);
            setTimeout(function () {
              self._start(method, url, payload, opts);
            }, 0);
          }
          inherits(AbstractXHRObject, EventEmitter);
          AbstractXHRObject.prototype._start = function (method, url, payload, opts) {
            var self = this;
            try {
              this.xhr = new XHR();
            } catch (x) {
              // intentionally empty
            }
            if (!this.xhr) {
              debug('no xhr');
              this.emit('finish', 0, 'no xhr support');
              this._cleanup();
              return;
            }

            // several browsers cache POSTs
            url = urlUtils.addQuery(url, 't=' + +new Date());

            // Explorer tends to keep connection open, even after the
            // tab gets closed: http://bugs.jquery.com/ticket/5280
            this.unloadRef = utils.unloadAdd(function () {
              debug('unload cleanup');
              self._cleanup(true);
            });
            try {
              this.xhr.open(method, url, true);
              if (this.timeout && 'timeout' in this.xhr) {
                this.xhr.timeout = this.timeout;
                this.xhr.ontimeout = function () {
                  debug('xhr timeout');
                  self.emit('finish', 0, '');
                  self._cleanup(false);
                };
              }
            } catch (e) {
              debug('exception', e);
              // IE raises an exception on wrong port.
              this.emit('finish', 0, '');
              this._cleanup(false);
              return;
            }
            if ((!opts || !opts.noCredentials) && AbstractXHRObject.supportsCORS) {
              debug('withCredentials');
              // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
              // "This never affects same-site requests."

              this.xhr.withCredentials = true;
            }
            if (opts && opts.headers) {
              for (var key in opts.headers) {
                this.xhr.setRequestHeader(key, opts.headers[key]);
              }
            }
            this.xhr.onreadystatechange = function () {
              if (self.xhr) {
                var x = self.xhr;
                var text, status;
                debug('readyState', x.readyState);
                switch (x.readyState) {
                  case 3:
                    // IE doesn't like peeking into responseText or status
                    // on Microsoft.XMLHTTP and readystate=3
                    try {
                      status = x.status;
                      text = x.responseText;
                    } catch (e) {
                      // intentionally empty
                    }
                    debug('status', status);
                    // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                    if (status === 1223) {
                      status = 204;
                    }

                    // IE does return readystate == 3 for 404 answers.
                    if (status === 200 && text && text.length > 0) {
                      debug('chunk');
                      self.emit('chunk', status, text);
                    }
                    break;
                  case 4:
                    status = x.status;
                    debug('status', status);
                    // IE returns 1223 for 204: http://bugs.jquery.com/ticket/1450
                    if (status === 1223) {
                      status = 204;
                    }
                    // IE returns this for a bad port
                    // http://msdn.microsoft.com/en-us/library/windows/desktop/aa383770(v=vs.85).aspx
                    if (status === 12005 || status === 12029) {
                      status = 0;
                    }
                    debug('finish', status, x.responseText);
                    self.emit('finish', status, x.responseText);
                    self._cleanup(false);
                    break;
                }
              }
            };
            try {
              self.xhr.send(payload);
            } catch (e) {
              self.emit('finish', 0, '');
              self._cleanup(false);
            }
          };
          AbstractXHRObject.prototype._cleanup = function (abort) {
            debug('cleanup');
            if (!this.xhr) {
              return;
            }
            this.removeAllListeners();
            utils.unloadDel(this.unloadRef);

            // IE needs this field to be a function
            this.xhr.onreadystatechange = function () {};
            if (this.xhr.ontimeout) {
              this.xhr.ontimeout = null;
            }
            if (abort) {
              try {
                this.xhr.abort();
              } catch (x) {
                // intentionally empty
              }
            }
            this.unloadRef = this.xhr = null;
          };
          AbstractXHRObject.prototype.close = function () {
            debug('close');
            this._cleanup(true);
          };
          AbstractXHRObject.enabled = !!XHR;
          // override XMLHttpRequest for IE6/7
          // obfuscate to avoid firewalls
          var axo = ['Active'].concat('Object').join('X');
          if (!AbstractXHRObject.enabled && axo in global) {
            debug('overriding xmlhttprequest');
            XHR = function XHR() {
              try {
                return new global[axo]('Microsoft.XMLHTTP');
              } catch (e) {
                return null;
              }
            };
            AbstractXHRObject.enabled = !!new XHR();
          }
          var cors = false;
          try {
            cors = 'withCredentials' in new XHR();
          } catch (ignored) {
            // intentionally empty
          }
          AbstractXHRObject.supportsCORS = cors;
          module.exports = AbstractXHRObject;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/event": 46,
      "../../utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    18: [function (require, module, exports) {
      (function (global) {
        (function () {
          module.exports = global.EventSource;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    19: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var Driver = global.WebSocket || global.MozWebSocket;
          if (Driver) {
            module.exports = function WebSocketBrowserDriver(url) {
              return new Driver(url);
            };
          } else {
            module.exports = undefined;
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    20: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        AjaxBasedTransport = require('./lib/ajax-based'),
        EventSourceReceiver = require('./receiver/eventsource'),
        XHRCorsObject = require('./sender/xhr-cors'),
        EventSourceDriver = require('eventsource');
      function EventSourceTransport(transUrl) {
        if (!EventSourceTransport.enabled()) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/eventsource', EventSourceReceiver, XHRCorsObject);
      }
      inherits(EventSourceTransport, AjaxBasedTransport);
      EventSourceTransport.enabled = function () {
        return !!EventSourceDriver;
      };
      EventSourceTransport.transportName = 'eventsource';
      EventSourceTransport.roundTrips = 2;
      module.exports = EventSourceTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/eventsource": 29,
      "./sender/xhr-cors": 35,
      "eventsource": 18,
      "inherits": 57
    }],
    21: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        HtmlfileReceiver = require('./receiver/htmlfile'),
        XHRLocalObject = require('./sender/xhr-local'),
        AjaxBasedTransport = require('./lib/ajax-based');
      function HtmlFileTransport(transUrl) {
        if (!HtmlfileReceiver.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/htmlfile', HtmlfileReceiver, XHRLocalObject);
      }
      inherits(HtmlFileTransport, AjaxBasedTransport);
      HtmlFileTransport.enabled = function (info) {
        return HtmlfileReceiver.enabled && info.sameOrigin;
      };
      HtmlFileTransport.transportName = 'htmlfile';
      HtmlFileTransport.roundTrips = 2;
      module.exports = HtmlFileTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/htmlfile": 30,
      "./sender/xhr-local": 37,
      "inherits": 57
    }],
    22: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          // Few cool transports do work only for same-origin. In order to make
          // them work cross-domain we shall use iframe, served from the
          // remote domain. New browsers have capabilities to communicate with
          // cross domain iframe using postMessage(). In IE it was implemented
          // from IE 8+, but of course, IE got some details wrong:
          //    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
          //    http://stevesouders.com/misc/test-postmessage.php
          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            version = require('../version'),
            urlUtils = require('../utils/url'),
            iframeUtils = require('../utils/iframe'),
            eventUtils = require('../utils/event'),
            random = require('../utils/random');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:transport:iframe');
          }
          function IframeTransport(transport, transUrl, baseUrl) {
            if (!IframeTransport.enabled()) {
              throw new Error('Transport created when disabled');
            }
            EventEmitter.call(this);
            var self = this;
            this.origin = urlUtils.getOrigin(baseUrl);
            this.baseUrl = baseUrl;
            this.transUrl = transUrl;
            this.transport = transport;
            this.windowId = random.string(8);
            var iframeUrl = urlUtils.addPath(baseUrl, '/iframe.html') + '#' + this.windowId;
            debug(transport, transUrl, iframeUrl);
            this.iframeObj = iframeUtils.createIframe(iframeUrl, function (r) {
              debug('err callback');
              self.emit('close', 1006, 'Unable to load an iframe (' + r + ')');
              self.close();
            });
            this.onmessageCallback = this._message.bind(this);
            eventUtils.attachEvent('message', this.onmessageCallback);
          }
          inherits(IframeTransport, EventEmitter);
          IframeTransport.prototype.close = function () {
            debug('close');
            this.removeAllListeners();
            if (this.iframeObj) {
              eventUtils.detachEvent('message', this.onmessageCallback);
              try {
                // When the iframe is not loaded, IE raises an exception
                // on 'contentWindow'.
                this.postMessage('c');
              } catch (x) {
                // intentionally empty
              }
              this.iframeObj.cleanup();
              this.iframeObj = null;
              this.onmessageCallback = this.iframeObj = null;
            }
          };
          IframeTransport.prototype._message = function (e) {
            debug('message', e.data);
            if (!urlUtils.isOriginEqual(e.origin, this.origin)) {
              debug('not same origin', e.origin, this.origin);
              return;
            }
            var iframeMessage;
            try {
              iframeMessage = JSON.parse(e.data);
            } catch (ignored) {
              debug('bad json', e.data);
              return;
            }
            if (iframeMessage.windowId !== this.windowId) {
              debug('mismatched window id', iframeMessage.windowId, this.windowId);
              return;
            }
            switch (iframeMessage.type) {
              case 's':
                this.iframeObj.loaded();
                // window global dependency
                this.postMessage('s', JSON.stringify([version, this.transport, this.transUrl, this.baseUrl]));
                break;
              case 't':
                this.emit('message', iframeMessage.data);
                break;
              case 'c':
                var cdata;
                try {
                  cdata = JSON.parse(iframeMessage.data);
                } catch (ignored) {
                  debug('bad json', iframeMessage.data);
                  return;
                }
                this.emit('close', cdata[0], cdata[1]);
                this.close();
                break;
            }
          };
          IframeTransport.prototype.postMessage = function (type, data) {
            debug('postMessage', type, data);
            this.iframeObj.post(JSON.stringify({
              windowId: this.windowId,
              type: type,
              data: data || ''
            }), this.origin);
          };
          IframeTransport.prototype.send = function (message) {
            debug('send', message);
            this.postMessage('m', message);
          };
          IframeTransport.enabled = function () {
            return iframeUtils.iframeEnabled;
          };
          IframeTransport.transportName = 'iframe';
          IframeTransport.roundTrips = 2;
          module.exports = IframeTransport;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "../utils/event": 46,
      "../utils/iframe": 47,
      "../utils/random": 50,
      "../utils/url": 52,
      "../version": 53,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    23: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          // The simplest and most robust transport, using the well-know cross
          // domain hack - JSONP. This transport is quite inefficient - one
          // message could use up to one http request. But at least it works almost
          // everywhere.
          // Known limitations:
          //   o you will get a spinning cursor
          //   o for Konqueror a dumb timer is needed to detect errors
          var inherits = require('inherits'),
            SenderReceiver = require('./lib/sender-receiver'),
            JsonpReceiver = require('./receiver/jsonp'),
            jsonpSender = require('./sender/jsonp');
          function JsonPTransport(transUrl) {
            if (!JsonPTransport.enabled()) {
              throw new Error('Transport created when disabled');
            }
            SenderReceiver.call(this, transUrl, '/jsonp', jsonpSender, JsonpReceiver);
          }
          inherits(JsonPTransport, SenderReceiver);
          JsonPTransport.enabled = function () {
            return !!global.document;
          };
          JsonPTransport.transportName = 'jsonp-polling';
          JsonPTransport.roundTrips = 1;
          JsonPTransport.needBody = true;
          module.exports = JsonPTransport;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./lib/sender-receiver": 28,
      "./receiver/jsonp": 31,
      "./sender/jsonp": 33,
      "inherits": 57
    }],
    24: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            urlUtils = require('../../utils/url'),
            SenderReceiver = require('./sender-receiver');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:ajax-based');
          }
          function createAjaxSender(AjaxObject) {
            return function (url, payload, callback) {
              debug('create ajax sender', url, payload);
              var opt = {};
              if (typeof payload === 'string') {
                opt.headers = {
                  'Content-type': 'text/plain'
                };
              }
              var ajaxUrl = urlUtils.addPath(url, '/xhr_send');
              var xo = new AjaxObject('POST', ajaxUrl, payload, opt);
              xo.once('finish', function (status) {
                debug('finish', status);
                xo = null;
                if (status !== 200 && status !== 204) {
                  return callback(new Error('http status ' + status));
                }
                callback();
              });
              return function () {
                debug('abort');
                xo.close();
                xo = null;
                var err = new Error('Aborted');
                err.code = 1000;
                callback(err);
              };
            };
          }
          function AjaxBasedTransport(transUrl, urlSuffix, Receiver, AjaxObject) {
            SenderReceiver.call(this, transUrl, urlSuffix, createAjaxSender(AjaxObject), Receiver, AjaxObject);
          }
          inherits(AjaxBasedTransport, SenderReceiver);
          module.exports = AjaxBasedTransport;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "../../utils/url": 52,
      "./sender-receiver": 28,
      "debug": 55,
      "inherits": 57
    }],
    25: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:buffered-sender');
          }
          function BufferedSender(url, sender) {
            debug(url);
            EventEmitter.call(this);
            this.sendBuffer = [];
            this.sender = sender;
            this.url = url;
          }
          inherits(BufferedSender, EventEmitter);
          BufferedSender.prototype.send = function (message) {
            debug('send', message);
            this.sendBuffer.push(message);
            if (!this.sendStop) {
              this.sendSchedule();
            }
          };

          // For polling transports in a situation when in the message callback,
          // new message is being send. If the sending connection was started
          // before receiving one, it is possible to saturate the network and
          // timeout due to the lack of receiving socket. To avoid that we delay
          // sending messages by some small time, in order to let receiving
          // connection be started beforehand. This is only a halfmeasure and
          // does not fix the big problem, but it does make the tests go more
          // stable on slow networks.
          BufferedSender.prototype.sendScheduleWait = function () {
            debug('sendScheduleWait');
            var self = this;
            var tref;
            this.sendStop = function () {
              debug('sendStop');
              self.sendStop = null;
              clearTimeout(tref);
            };
            tref = setTimeout(function () {
              debug('timeout');
              self.sendStop = null;
              self.sendSchedule();
            }, 25);
          };
          BufferedSender.prototype.sendSchedule = function () {
            debug('sendSchedule', this.sendBuffer.length);
            var self = this;
            if (this.sendBuffer.length > 0) {
              var payload = '[' + this.sendBuffer.join(',') + ']';
              this.sendStop = this.sender(this.url, payload, function (err) {
                self.sendStop = null;
                if (err) {
                  debug('error', err);
                  self.emit('close', err.code || 1006, 'Sending error: ' + err);
                  self.close();
                } else {
                  self.sendScheduleWait();
                }
              });
              this.sendBuffer = [];
            }
          };
          BufferedSender.prototype._cleanup = function () {
            debug('_cleanup');
            this.removeAllListeners();
          };
          BufferedSender.prototype.close = function () {
            debug('close');
            this._cleanup();
            if (this.sendStop) {
              this.sendStop();
              this.sendStop = null;
            }
          };
          module.exports = BufferedSender;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    26: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            IframeTransport = require('../iframe'),
            objectUtils = require('../../utils/object');
          module.exports = function (transport) {
            function IframeWrapTransport(transUrl, baseUrl) {
              IframeTransport.call(this, transport.transportName, transUrl, baseUrl);
            }
            inherits(IframeWrapTransport, IframeTransport);
            IframeWrapTransport.enabled = function (url, info) {
              if (!global.document) {
                return false;
              }
              var iframeInfo = objectUtils.extend({}, info);
              iframeInfo.sameOrigin = true;
              return transport.enabled(iframeInfo) && IframeTransport.enabled();
            };
            IframeWrapTransport.transportName = 'iframe-' + transport.transportName;
            IframeWrapTransport.needBody = true;
            IframeWrapTransport.roundTrips = IframeTransport.roundTrips + transport.roundTrips - 1; // html, javascript (2) + transport - no CORS (1)

            IframeWrapTransport.facadeTransport = transport;
            return IframeWrapTransport;
          };
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/object": 49,
      "../iframe": 22,
      "inherits": 57
    }],
    27: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:polling');
          }
          function Polling(Receiver, receiveUrl, AjaxObject) {
            debug(receiveUrl);
            EventEmitter.call(this);
            this.Receiver = Receiver;
            this.receiveUrl = receiveUrl;
            this.AjaxObject = AjaxObject;
            this._scheduleReceiver();
          }
          inherits(Polling, EventEmitter);
          Polling.prototype._scheduleReceiver = function () {
            debug('_scheduleReceiver');
            var self = this;
            var poll = this.poll = new this.Receiver(this.receiveUrl, this.AjaxObject);
            poll.on('message', function (msg) {
              debug('message', msg);
              self.emit('message', msg);
            });
            poll.once('close', function (code, reason) {
              debug('close', code, reason, self.pollIsClosing);
              self.poll = poll = null;
              if (!self.pollIsClosing) {
                if (reason === 'network') {
                  self._scheduleReceiver();
                } else {
                  self.emit('close', code || 1006, reason);
                  self.removeAllListeners();
                }
              }
            });
          };
          Polling.prototype.abort = function () {
            debug('abort');
            this.removeAllListeners();
            this.pollIsClosing = true;
            if (this.poll) {
              this.poll.abort();
            }
          };
          module.exports = Polling;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    28: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            urlUtils = require('../../utils/url'),
            BufferedSender = require('./buffered-sender'),
            Polling = require('./polling');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:sender-receiver');
          }
          function SenderReceiver(transUrl, urlSuffix, senderFunc, Receiver, AjaxObject) {
            var pollUrl = urlUtils.addPath(transUrl, urlSuffix);
            debug(pollUrl);
            var self = this;
            BufferedSender.call(this, transUrl, senderFunc);
            this.poll = new Polling(Receiver, pollUrl, AjaxObject);
            this.poll.on('message', function (msg) {
              debug('poll message', msg);
              self.emit('message', msg);
            });
            this.poll.once('close', function (code, reason) {
              debug('poll close', code, reason);
              self.poll = null;
              self.emit('close', code, reason);
              self.close();
            });
          }
          inherits(SenderReceiver, BufferedSender);
          SenderReceiver.prototype.close = function () {
            BufferedSender.prototype.close.call(this);
            debug('close');
            this.removeAllListeners();
            if (this.poll) {
              this.poll.abort();
              this.poll = null;
            }
          };
          module.exports = SenderReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "../../utils/url": 52,
      "./buffered-sender": 25,
      "./polling": 27,
      "debug": 55,
      "inherits": 57
    }],
    29: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            EventSourceDriver = require('eventsource');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:receiver:eventsource');
          }
          function EventSourceReceiver(url) {
            debug(url);
            EventEmitter.call(this);
            var self = this;
            var es = this.es = new EventSourceDriver(url);
            es.onmessage = function (e) {
              debug('message', e.data);
              self.emit('message', decodeURI(e.data));
            };
            es.onerror = function (e) {
              debug('error', es.readyState, e);
              // ES on reconnection has readyState = 0 or 1.
              // on network error it's CLOSED = 2
              var reason = es.readyState !== 2 ? 'network' : 'permanent';
              self._cleanup();
              self._close(reason);
            };
          }
          inherits(EventSourceReceiver, EventEmitter);
          EventSourceReceiver.prototype.abort = function () {
            debug('abort');
            this._cleanup();
            this._close('user');
          };
          EventSourceReceiver.prototype._cleanup = function () {
            debug('cleanup');
            var es = this.es;
            if (es) {
              es.onmessage = es.onerror = null;
              es.close();
              this.es = null;
            }
          };
          EventSourceReceiver.prototype._close = function (reason) {
            debug('close', reason);
            var self = this;
            // Safari and chrome < 15 crash if we close window before
            // waiting for ES cleanup. See:
            // https://code.google.com/p/chromium/issues/detail?id=89155
            setTimeout(function () {
              self.emit('close', null, reason);
              self.removeAllListeners();
            }, 200);
          };
          module.exports = EventSourceReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "events": 3,
      "eventsource": 18,
      "inherits": 57
    }],
    30: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            iframeUtils = require('../../utils/iframe'),
            urlUtils = require('../../utils/url'),
            EventEmitter = require('events').EventEmitter,
            random = require('../../utils/random');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:receiver:htmlfile');
          }
          function HtmlfileReceiver(url) {
            debug(url);
            EventEmitter.call(this);
            var self = this;
            iframeUtils.polluteGlobalNamespace();
            this.id = 'a' + random.string(6);
            url = urlUtils.addQuery(url, 'c=' + decodeURIComponent(iframeUtils.WPrefix + '.' + this.id));
            debug('using htmlfile', HtmlfileReceiver.htmlfileEnabled);
            var constructFunc = HtmlfileReceiver.htmlfileEnabled ? iframeUtils.createHtmlfile : iframeUtils.createIframe;
            global[iframeUtils.WPrefix][this.id] = {
              start: function start() {
                debug('start');
                self.iframeObj.loaded();
              },
              message: function message(data) {
                debug('message', data);
                self.emit('message', data);
              },
              stop: function stop() {
                debug('stop');
                self._cleanup();
                self._close('network');
              }
            };
            this.iframeObj = constructFunc(url, function () {
              debug('callback');
              self._cleanup();
              self._close('permanent');
            });
          }
          inherits(HtmlfileReceiver, EventEmitter);
          HtmlfileReceiver.prototype.abort = function () {
            debug('abort');
            this._cleanup();
            this._close('user');
          };
          HtmlfileReceiver.prototype._cleanup = function () {
            debug('_cleanup');
            if (this.iframeObj) {
              this.iframeObj.cleanup();
              this.iframeObj = null;
            }
            delete global[iframeUtils.WPrefix][this.id];
          };
          HtmlfileReceiver.prototype._close = function (reason) {
            debug('_close', reason);
            this.emit('close', null, reason);
            this.removeAllListeners();
          };
          HtmlfileReceiver.htmlfileEnabled = false;

          // obfuscate to avoid firewalls
          var axo = ['Active'].concat('Object').join('X');
          if (axo in global) {
            try {
              HtmlfileReceiver.htmlfileEnabled = !!new global[axo]('htmlfile');
            } catch (x) {
              // intentionally empty
            }
          }
          HtmlfileReceiver.enabled = HtmlfileReceiver.htmlfileEnabled || iframeUtils.iframeEnabled;
          module.exports = HtmlfileReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/iframe": 47,
      "../../utils/random": 50,
      "../../utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    31: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var utils = require('../../utils/iframe'),
            random = require('../../utils/random'),
            browser = require('../../utils/browser'),
            urlUtils = require('../../utils/url'),
            inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:receiver:jsonp');
          }
          function JsonpReceiver(url) {
            debug(url);
            var self = this;
            EventEmitter.call(this);
            utils.polluteGlobalNamespace();
            this.id = 'a' + random.string(6);
            var urlWithId = urlUtils.addQuery(url, 'c=' + encodeURIComponent(utils.WPrefix + '.' + this.id));
            global[utils.WPrefix][this.id] = this._callback.bind(this);
            this._createScript(urlWithId);

            // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
            this.timeoutId = setTimeout(function () {
              debug('timeout');
              self._abort(new Error('JSONP script loaded abnormally (timeout)'));
            }, JsonpReceiver.timeout);
          }
          inherits(JsonpReceiver, EventEmitter);
          JsonpReceiver.prototype.abort = function () {
            debug('abort');
            if (global[utils.WPrefix][this.id]) {
              var err = new Error('JSONP user aborted read');
              err.code = 1000;
              this._abort(err);
            }
          };
          JsonpReceiver.timeout = 35000;
          JsonpReceiver.scriptErrorTimeout = 1000;
          JsonpReceiver.prototype._callback = function (data) {
            debug('_callback', data);
            this._cleanup();
            if (this.aborting) {
              return;
            }
            if (data) {
              debug('message', data);
              this.emit('message', data);
            }
            this.emit('close', null, 'network');
            this.removeAllListeners();
          };
          JsonpReceiver.prototype._abort = function (err) {
            debug('_abort', err);
            this._cleanup();
            this.aborting = true;
            this.emit('close', err.code, err.message);
            this.removeAllListeners();
          };
          JsonpReceiver.prototype._cleanup = function () {
            debug('_cleanup');
            clearTimeout(this.timeoutId);
            if (this.script2) {
              this.script2.parentNode.removeChild(this.script2);
              this.script2 = null;
            }
            if (this.script) {
              var script = this.script;
              // Unfortunately, you can't really abort script loading of
              // the script.
              script.parentNode.removeChild(script);
              script.onreadystatechange = script.onerror = script.onload = script.onclick = null;
              this.script = null;
            }
            delete global[utils.WPrefix][this.id];
          };
          JsonpReceiver.prototype._scriptError = function () {
            debug('_scriptError');
            var self = this;
            if (this.errorTimer) {
              return;
            }
            this.errorTimer = setTimeout(function () {
              if (!self.loadedOkay) {
                self._abort(new Error('JSONP script loaded abnormally (onerror)'));
              }
            }, JsonpReceiver.scriptErrorTimeout);
          };
          JsonpReceiver.prototype._createScript = function (url) {
            debug('_createScript', url);
            var self = this;
            var script = this.script = global.document.createElement('script');
            var script2; // Opera synchronous load trick.

            script.id = 'a' + random.string(8);
            script.src = url;
            script.type = 'text/javascript';
            script.charset = 'UTF-8';
            script.onerror = this._scriptError.bind(this);
            script.onload = function () {
              debug('onload');
              self._abort(new Error('JSONP script loaded abnormally (onload)'));
            };

            // IE9 fires 'error' event after onreadystatechange or before, in random order.
            // Use loadedOkay to determine if actually errored
            script.onreadystatechange = function () {
              debug('onreadystatechange', script.readyState);
              if (/loaded|closed/.test(script.readyState)) {
                if (script && script.htmlFor && script.onclick) {
                  self.loadedOkay = true;
                  try {
                    // In IE, actually execute the script.
                    script.onclick();
                  } catch (x) {
                    // intentionally empty
                  }
                }
                if (script) {
                  self._abort(new Error('JSONP script loaded abnormally (onreadystatechange)'));
                }
              }
            };
            // IE: event/htmlFor/onclick trick.
            // One can't rely on proper order for onreadystatechange. In order to
            // make sure, set a 'htmlFor' and 'event' properties, so that
            // script code will be installed as 'onclick' handler for the
            // script object. Later, onreadystatechange, manually execute this
            // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
            // set. For reference see:
            //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
            // Also, read on that about script ordering:
            //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            if (typeof script.async === 'undefined' && global.document.attachEvent) {
              // According to mozilla docs, in recent browsers script.async defaults
              // to 'true', so we may use it to detect a good browser:
              // https://developer.mozilla.org/en/HTML/Element/script
              if (!browser.isOpera()) {
                // Naively assume we're in IE
                try {
                  script.htmlFor = script.id;
                  script.event = 'onclick';
                } catch (x) {
                  // intentionally empty
                }
                script.async = true;
              } else {
                // Opera, second sync script hack
                script2 = this.script2 = global.document.createElement('script');
                script2.text = "try{var a = document.getElementById('" + script.id + "'); if(a)a.onerror();}catch(x){};";
                script.async = script2.async = false;
              }
            }
            if (typeof script.async !== 'undefined') {
              script.async = true;
            }
            var head = global.document.getElementsByTagName('head')[0];
            head.insertBefore(script, head.firstChild);
            if (script2) {
              head.insertBefore(script2, head.firstChild);
            }
          };
          module.exports = JsonpReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/browser": 44,
      "../../utils/iframe": 47,
      "../../utils/random": 50,
      "../../utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    32: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter;
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:receiver:xhr');
          }
          function XhrReceiver(url, AjaxObject) {
            debug(url);
            EventEmitter.call(this);
            var self = this;
            this.bufferPosition = 0;
            this.xo = new AjaxObject('POST', url, null);
            this.xo.on('chunk', this._chunkHandler.bind(this));
            this.xo.once('finish', function (status, text) {
              debug('finish', status, text);
              self._chunkHandler(status, text);
              self.xo = null;
              var reason = status === 200 ? 'network' : 'permanent';
              debug('close', reason);
              self.emit('close', null, reason);
              self._cleanup();
            });
          }
          inherits(XhrReceiver, EventEmitter);
          XhrReceiver.prototype._chunkHandler = function (status, text) {
            debug('_chunkHandler', status);
            if (status !== 200 || !text) {
              return;
            }
            for (var idx = -1;; this.bufferPosition += idx + 1) {
              var buf = text.slice(this.bufferPosition);
              idx = buf.indexOf('\n');
              if (idx === -1) {
                break;
              }
              var msg = buf.slice(0, idx);
              if (msg) {
                debug('message', msg);
                this.emit('message', msg);
              }
            }
          };
          XhrReceiver.prototype._cleanup = function () {
            debug('_cleanup');
            this.removeAllListeners();
          };
          XhrReceiver.prototype.abort = function () {
            debug('abort');
            if (this.xo) {
              this.xo.close();
              debug('close');
              this.emit('close', null, 'user');
              this.xo = null;
            }
            this._cleanup();
          };
          module.exports = XhrReceiver;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    33: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var random = require('../../utils/random'),
            urlUtils = require('../../utils/url');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:sender:jsonp');
          }
          var form, area;
          function createIframe(id) {
            debug('createIframe', id);
            try {
              // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
              return global.document.createElement('<iframe name="' + id + '">');
            } catch (x) {
              var iframe = global.document.createElement('iframe');
              iframe.name = id;
              return iframe;
            }
          }
          function createForm() {
            debug('createForm');
            form = global.document.createElement('form');
            form.style.display = 'none';
            form.style.position = 'absolute';
            form.method = 'POST';
            form.enctype = 'application/x-www-form-urlencoded';
            form.acceptCharset = 'UTF-8';
            area = global.document.createElement('textarea');
            area.name = 'd';
            form.appendChild(area);
            global.document.body.appendChild(form);
          }
          module.exports = function (url, payload, callback) {
            debug(url, payload);
            if (!form) {
              createForm();
            }
            var id = 'a' + random.string(8);
            form.target = id;
            form.action = urlUtils.addQuery(urlUtils.addPath(url, '/jsonp_send'), 'i=' + id);
            var iframe = createIframe(id);
            iframe.id = id;
            iframe.style.display = 'none';
            form.appendChild(iframe);
            try {
              area.value = payload;
            } catch (e) {
              // seriously broken browsers get here
            }
            form.submit();
            var completed = function completed(err) {
              debug('completed', id, err);
              if (!iframe.onerror) {
                return;
              }
              iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
              // Opera mini doesn't like if we GC iframe
              // immediately, thus this timeout.
              setTimeout(function () {
                debug('cleaning up', id);
                iframe.parentNode.removeChild(iframe);
                iframe = null;
              }, 500);
              area.value = '';
              // It is not possible to detect if the iframe succeeded or
              // failed to submit our form.
              callback(err);
            };
            iframe.onerror = function () {
              debug('onerror', id);
              completed();
            };
            iframe.onload = function () {
              debug('onload', id);
              completed();
            };
            iframe.onreadystatechange = function (e) {
              debug('onreadystatechange', id, iframe.readyState, e);
              if (iframe.readyState === 'complete') {
                completed();
              }
            };
            return function () {
              debug('aborted', id);
              completed(new Error('Aborted'));
            };
          };
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/random": 50,
      "../../utils/url": 52,
      "debug": 55
    }],
    34: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var EventEmitter = require('events').EventEmitter,
            inherits = require('inherits'),
            eventUtils = require('../../utils/event'),
            browser = require('../../utils/browser'),
            urlUtils = require('../../utils/url');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:sender:xdr');
          }

          // References:
          //   http://ajaxian.com/archives/100-line-ajax-wrapper
          //   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx

          function XDRObject(method, url, payload) {
            debug(method, url);
            var self = this;
            EventEmitter.call(this);
            setTimeout(function () {
              self._start(method, url, payload);
            }, 0);
          }
          inherits(XDRObject, EventEmitter);
          XDRObject.prototype._start = function (method, url, payload) {
            debug('_start');
            var self = this;
            var xdr = new global.XDomainRequest();
            // IE caches even POSTs
            url = urlUtils.addQuery(url, 't=' + +new Date());
            xdr.onerror = function () {
              debug('onerror');
              self._error();
            };
            xdr.ontimeout = function () {
              debug('ontimeout');
              self._error();
            };
            xdr.onprogress = function () {
              debug('progress', xdr.responseText);
              self.emit('chunk', 200, xdr.responseText);
            };
            xdr.onload = function () {
              debug('load');
              self.emit('finish', 200, xdr.responseText);
              self._cleanup(false);
            };
            this.xdr = xdr;
            this.unloadRef = eventUtils.unloadAdd(function () {
              self._cleanup(true);
            });
            try {
              // Fails with AccessDenied if port number is bogus
              this.xdr.open(method, url);
              if (this.timeout) {
                this.xdr.timeout = this.timeout;
              }
              this.xdr.send(payload);
            } catch (x) {
              this._error();
            }
          };
          XDRObject.prototype._error = function () {
            this.emit('finish', 0, '');
            this._cleanup(false);
          };
          XDRObject.prototype._cleanup = function (abort) {
            debug('cleanup', abort);
            if (!this.xdr) {
              return;
            }
            this.removeAllListeners();
            eventUtils.unloadDel(this.unloadRef);
            this.xdr.ontimeout = this.xdr.onerror = this.xdr.onprogress = this.xdr.onload = null;
            if (abort) {
              try {
                this.xdr.abort();
              } catch (x) {
                // intentionally empty
              }
            }
            this.unloadRef = this.xdr = null;
          };
          XDRObject.prototype.close = function () {
            debug('close');
            this._cleanup(true);
          };

          // IE 8/9 if the request target uses the same scheme - #79
          XDRObject.enabled = !!(global.XDomainRequest && browser.hasDomain());
          module.exports = XDRObject;
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../../utils/browser": 44,
      "../../utils/event": 46,
      "../../utils/url": 52,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    35: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        XhrDriver = require('../driver/xhr');
      function XHRCorsObject(method, url, payload, opts) {
        XhrDriver.call(this, method, url, payload, opts);
      }
      inherits(XHRCorsObject, XhrDriver);
      XHRCorsObject.enabled = XhrDriver.enabled && XhrDriver.supportsCORS;
      module.exports = XHRCorsObject;
    }, {
      "../driver/xhr": 17,
      "inherits": 57
    }],
    36: [function (require, module, exports) {
      'use strict';

      var EventEmitter = require('events').EventEmitter,
        inherits = require('inherits');
      function XHRFake(/* method, url, payload, opts */
      ) {
        var self = this;
        EventEmitter.call(this);
        this.to = setTimeout(function () {
          self.emit('finish', 200, '{}');
        }, XHRFake.timeout);
      }
      inherits(XHRFake, EventEmitter);
      XHRFake.prototype.close = function () {
        clearTimeout(this.to);
      };
      XHRFake.timeout = 2000;
      module.exports = XHRFake;
    }, {
      "events": 3,
      "inherits": 57
    }],
    37: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        XhrDriver = require('../driver/xhr');
      function XHRLocalObject(method, url, payload /*, opts */) {
        XhrDriver.call(this, method, url, payload, {
          noCredentials: true
        });
      }
      inherits(XHRLocalObject, XhrDriver);
      XHRLocalObject.enabled = XhrDriver.enabled;
      module.exports = XHRLocalObject;
    }, {
      "../driver/xhr": 17,
      "inherits": 57
    }],
    38: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var utils = require('../utils/event'),
            urlUtils = require('../utils/url'),
            inherits = require('inherits'),
            EventEmitter = require('events').EventEmitter,
            WebsocketDriver = require('./driver/websocket');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:websocket');
          }
          function WebSocketTransport(transUrl, ignore, options) {
            if (!WebSocketTransport.enabled()) {
              throw new Error('Transport created when disabled');
            }
            EventEmitter.call(this);
            debug('constructor', transUrl);
            var self = this;
            var url = urlUtils.addPath(transUrl, '/websocket');
            if (url.slice(0, 5) === 'https') {
              url = 'wss' + url.slice(5);
            } else {
              url = 'ws' + url.slice(4);
            }
            this.url = url;
            this.ws = new WebsocketDriver(this.url, [], options);
            this.ws.onmessage = function (e) {
              debug('message event', e.data);
              self.emit('message', e.data);
            };
            // Firefox has an interesting bug. If a websocket connection is
            // created after onunload, it stays alive even when user
            // navigates away from the page. In such situation let's lie -
            // let's not open the ws connection at all. See:
            // https://github.com/sockjs/sockjs-client/issues/28
            // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
            this.unloadRef = utils.unloadAdd(function () {
              debug('unload');
              self.ws.close();
            });
            this.ws.onclose = function (e) {
              debug('close event', e.code, e.reason);
              self.emit('close', e.code, e.reason);
              self._cleanup();
            };
            this.ws.onerror = function (e) {
              debug('error event', e);
              self.emit('close', 1006, 'WebSocket connection broken');
              self._cleanup();
            };
          }
          inherits(WebSocketTransport, EventEmitter);
          WebSocketTransport.prototype.send = function (data) {
            var msg = '[' + data + ']';
            debug('send', msg);
            this.ws.send(msg);
          };
          WebSocketTransport.prototype.close = function () {
            debug('close');
            var ws = this.ws;
            this._cleanup();
            if (ws) {
              ws.close();
            }
          };
          WebSocketTransport.prototype._cleanup = function () {
            debug('_cleanup');
            var ws = this.ws;
            if (ws) {
              ws.onmessage = ws.onclose = ws.onerror = null;
            }
            utils.unloadDel(this.unloadRef);
            this.unloadRef = this.ws = null;
            this.removeAllListeners();
          };
          WebSocketTransport.enabled = function () {
            debug('enabled');
            return !!WebsocketDriver;
          };
          WebSocketTransport.transportName = 'websocket';

          // In theory, ws should require 1 round trip. But in chrome, this is
          // not very stable over SSL. Most likely a ws connection requires a
          // separate SSL connection, in which case 2 round trips are an
          // absolute minumum.
          WebSocketTransport.roundTrips = 2;
          module.exports = WebSocketTransport;
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "../utils/event": 46,
      "../utils/url": 52,
      "./driver/websocket": 19,
      "debug": 55,
      "events": 3,
      "inherits": 57
    }],
    39: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        AjaxBasedTransport = require('./lib/ajax-based'),
        XdrStreamingTransport = require('./xdr-streaming'),
        XhrReceiver = require('./receiver/xhr'),
        XDRObject = require('./sender/xdr');
      function XdrPollingTransport(transUrl) {
        if (!XDRObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XDRObject);
      }
      inherits(XdrPollingTransport, AjaxBasedTransport);
      XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
      XdrPollingTransport.transportName = 'xdr-polling';
      XdrPollingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XdrPollingTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xdr": 34,
      "./xdr-streaming": 40,
      "inherits": 57
    }],
    40: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        AjaxBasedTransport = require('./lib/ajax-based'),
        XhrReceiver = require('./receiver/xhr'),
        XDRObject = require('./sender/xdr');

      // According to:
      //   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
      //   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/

      function XdrStreamingTransport(transUrl) {
        if (!XDRObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XDRObject);
      }
      inherits(XdrStreamingTransport, AjaxBasedTransport);
      XdrStreamingTransport.enabled = function (info) {
        if (info.cookie_needed || info.nullOrigin) {
          return false;
        }
        return XDRObject.enabled && info.sameScheme;
      };
      XdrStreamingTransport.transportName = 'xdr-streaming';
      XdrStreamingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XdrStreamingTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xdr": 34,
      "inherits": 57
    }],
    41: [function (require, module, exports) {
      'use strict';

      var inherits = require('inherits'),
        AjaxBasedTransport = require('./lib/ajax-based'),
        XhrReceiver = require('./receiver/xhr'),
        XHRCorsObject = require('./sender/xhr-cors'),
        XHRLocalObject = require('./sender/xhr-local');
      function XhrPollingTransport(transUrl) {
        if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
          throw new Error('Transport created when disabled');
        }
        AjaxBasedTransport.call(this, transUrl, '/xhr', XhrReceiver, XHRCorsObject);
      }
      inherits(XhrPollingTransport, AjaxBasedTransport);
      XhrPollingTransport.enabled = function (info) {
        if (info.nullOrigin) {
          return false;
        }
        if (XHRLocalObject.enabled && info.sameOrigin) {
          return true;
        }
        return XHRCorsObject.enabled;
      };
      XhrPollingTransport.transportName = 'xhr-polling';
      XhrPollingTransport.roundTrips = 2; // preflight, ajax

      module.exports = XhrPollingTransport;
    }, {
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xhr-cors": 35,
      "./sender/xhr-local": 37,
      "inherits": 57
    }],
    42: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var inherits = require('inherits'),
            AjaxBasedTransport = require('./lib/ajax-based'),
            XhrReceiver = require('./receiver/xhr'),
            XHRCorsObject = require('./sender/xhr-cors'),
            XHRLocalObject = require('./sender/xhr-local'),
            browser = require('../utils/browser');
          function XhrStreamingTransport(transUrl) {
            if (!XHRLocalObject.enabled && !XHRCorsObject.enabled) {
              throw new Error('Transport created when disabled');
            }
            AjaxBasedTransport.call(this, transUrl, '/xhr_streaming', XhrReceiver, XHRCorsObject);
          }
          inherits(XhrStreamingTransport, AjaxBasedTransport);
          XhrStreamingTransport.enabled = function (info) {
            if (info.nullOrigin) {
              return false;
            }
            // Opera doesn't support xhr-streaming #60
            // But it might be able to #92
            if (browser.isOpera()) {
              return false;
            }
            return XHRCorsObject.enabled;
          };
          XhrStreamingTransport.transportName = 'xhr-streaming';
          XhrStreamingTransport.roundTrips = 2; // preflight, ajax

          // Safari gets confused when a streaming ajax request is started
          // before onload. This causes the load indicator to spin indefinetely.
          // Only require body when used in a browser
          XhrStreamingTransport.needBody = !!global.document;
          module.exports = XhrStreamingTransport;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "../utils/browser": 44,
      "./lib/ajax-based": 24,
      "./receiver/xhr": 32,
      "./sender/xhr-cors": 35,
      "./sender/xhr-local": 37,
      "inherits": 57
    }],
    43: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          if (global.crypto && global.crypto.getRandomValues) {
            module.exports.randomBytes = function (length) {
              var bytes = new Uint8Array(length);
              global.crypto.getRandomValues(bytes);
              return bytes;
            };
          } else {
            module.exports.randomBytes = function (length) {
              var bytes = new Array(length);
              for (var i = 0; i < length; i++) {
                bytes[i] = Math.floor(Math.random() * 256);
              }
              return bytes;
            };
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    44: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          module.exports = {
            isOpera: function isOpera() {
              return global.navigator && /opera/i.test(global.navigator.userAgent);
            },
            isKonqueror: function isKonqueror() {
              return global.navigator && /konqueror/i.test(global.navigator.userAgent);
            }

            // #187 wrap document.domain in try/catch because of WP8 from file:///
            ,
            hasDomain: function hasDomain() {
              // non-browser client always has a domain
              if (!global.document) {
                return true;
              }
              try {
                return !!global.document.domain;
              } catch (e) {
                return false;
              }
            }
          };
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    45: [function (require, module, exports) {
      'use strict';

      // Some extra characters that Chrome gets wrong, and substitutes with
      // something else on the wire.
      // eslint-disable-next-line no-control-regex, no-misleading-character-class
      var extraEscapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
        extraLookup;

      // This may be quite slow, so let's delay until user actually uses bad
      // characters.
      var unrollLookup = function unrollLookup(escapable) {
        var i;
        var unrolled = {};
        var c = [];
        for (i = 0; i < 65536; i++) {
          c.push(String.fromCharCode(i));
        }
        escapable.lastIndex = 0;
        c.join('').replace(escapable, function (a) {
          unrolled[a] = "\\u" + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          return '';
        });
        escapable.lastIndex = 0;
        return unrolled;
      };

      // Quote string, also taking care of unicode characters that browsers
      // often break. Especially, take care of unicode surrogates:
      // http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
      module.exports = {
        quote: function quote(string) {
          var quoted = JSON.stringify(string);

          // In most cases this should be very fast and good enough.
          extraEscapable.lastIndex = 0;
          if (!extraEscapable.test(quoted)) {
            return quoted;
          }
          if (!extraLookup) {
            extraLookup = unrollLookup(extraEscapable);
          }
          return quoted.replace(extraEscapable, function (a) {
            return extraLookup[a];
          });
        }
      };
    }, {}],
    46: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var random = require('./random');
          var onUnload = {},
            afterUnload = false
            // detect google chrome packaged apps because they don't allow the 'unload' event
            ,
            isChromePackagedApp = global.chrome && global.chrome.app && global.chrome.app.runtime;
          module.exports = {
            attachEvent: function attachEvent(event, listener) {
              if (typeof global.addEventListener !== 'undefined') {
                global.addEventListener(event, listener, false);
              } else if (global.document && global.attachEvent) {
                // IE quirks.
                // According to: http://stevesouders.com/misc/test-postmessage.php
                // the message gets delivered only to 'document', not 'window'.
                global.document.attachEvent('on' + event, listener);
                // I get 'window' for ie8.
                global.attachEvent('on' + event, listener);
              }
            },
            detachEvent: function detachEvent(event, listener) {
              if (typeof global.addEventListener !== 'undefined') {
                global.removeEventListener(event, listener, false);
              } else if (global.document && global.detachEvent) {
                global.document.detachEvent('on' + event, listener);
                global.detachEvent('on' + event, listener);
              }
            },
            unloadAdd: function unloadAdd(listener) {
              if (isChromePackagedApp) {
                return null;
              }
              var ref = random.string(8);
              onUnload[ref] = listener;
              if (afterUnload) {
                setTimeout(this.triggerUnloadCallbacks, 0);
              }
              return ref;
            },
            unloadDel: function unloadDel(ref) {
              if (ref in onUnload) {
                delete onUnload[ref];
              }
            },
            triggerUnloadCallbacks: function triggerUnloadCallbacks() {
              for (var ref in onUnload) {
                onUnload[ref]();
                delete onUnload[ref];
              }
            }
          };
          var unloadTriggered = function unloadTriggered() {
            if (afterUnload) {
              return;
            }
            afterUnload = true;
            module.exports.triggerUnloadCallbacks();
          };

          // 'unload' alone is not reliable in opera within an iframe, but we
          // can't use `beforeunload` as IE fires it on javascript: links.
          if (!isChromePackagedApp) {
            module.exports.attachEvent('unload', unloadTriggered);
          }
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./random": 50
    }],
    47: [function (require, module, exports) {
      (function (process, global) {
        (function () {
          'use strict';

          var eventUtils = require('./event'),
            browser = require('./browser');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:utils:iframe');
          }
          module.exports = {
            WPrefix: '_jp',
            currentWindowId: null,
            polluteGlobalNamespace: function polluteGlobalNamespace() {
              if (!(module.exports.WPrefix in global)) {
                global[module.exports.WPrefix] = {};
              }
            },
            postMessage: function postMessage(type, data) {
              if (global.parent !== global) {
                global.parent.postMessage(JSON.stringify({
                  windowId: module.exports.currentWindowId,
                  type: type,
                  data: data || ''
                }), '*');
              } else {
                debug('Cannot postMessage, no parent window.', type, data);
              }
            },
            createIframe: function createIframe(iframeUrl, errorCallback) {
              var iframe = global.document.createElement('iframe');
              var tref, unloadRef;
              var unattach = function unattach() {
                debug('unattach');
                clearTimeout(tref);
                // Explorer had problems with that.
                try {
                  iframe.onload = null;
                } catch (x) {
                  // intentionally empty
                }
                iframe.onerror = null;
              };
              var cleanup = function cleanup() {
                debug('cleanup');
                if (iframe) {
                  unattach();
                  // This timeout makes chrome fire onbeforeunload event
                  // within iframe. Without the timeout it goes straight to
                  // onunload.
                  setTimeout(function () {
                    if (iframe) {
                      iframe.parentNode.removeChild(iframe);
                    }
                    iframe = null;
                  }, 0);
                  eventUtils.unloadDel(unloadRef);
                }
              };
              var onerror = function onerror(err) {
                debug('onerror', err);
                if (iframe) {
                  cleanup();
                  errorCallback(err);
                }
              };
              var post = function post(msg, origin) {
                debug('post', msg, origin);
                setTimeout(function () {
                  try {
                    // When the iframe is not loaded, IE raises an exception
                    // on 'contentWindow'.
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage(msg, origin);
                    }
                  } catch (x) {
                    // intentionally empty
                  }
                }, 0);
              };
              iframe.src = iframeUrl;
              iframe.style.display = 'none';
              iframe.style.position = 'absolute';
              iframe.onerror = function () {
                onerror('onerror');
              };
              iframe.onload = function () {
                debug('onload');
                // `onload` is triggered before scripts on the iframe are
                // executed. Give it few seconds to actually load stuff.
                clearTimeout(tref);
                tref = setTimeout(function () {
                  onerror('onload timeout');
                }, 2000);
              };
              global.document.body.appendChild(iframe);
              tref = setTimeout(function () {
                onerror('timeout');
              }, 15000);
              unloadRef = eventUtils.unloadAdd(cleanup);
              return {
                post: post,
                cleanup: cleanup,
                loaded: unattach
              };
            }

            /* eslint no-undef: "off", new-cap: "off" */,
            createHtmlfile: function createHtmlfile(iframeUrl, errorCallback) {
              var axo = ['Active'].concat('Object').join('X');
              var doc = new global[axo]('htmlfile');
              var tref, unloadRef;
              var iframe;
              var unattach = function unattach() {
                clearTimeout(tref);
                iframe.onerror = null;
              };
              var cleanup = function cleanup() {
                if (doc) {
                  unattach();
                  eventUtils.unloadDel(unloadRef);
                  iframe.parentNode.removeChild(iframe);
                  iframe = doc = null;
                  CollectGarbage();
                }
              };
              var onerror = function onerror(r) {
                debug('onerror', r);
                if (doc) {
                  cleanup();
                  errorCallback(r);
                }
              };
              var post = function post(msg, origin) {
                try {
                  // When the iframe is not loaded, IE raises an exception
                  // on 'contentWindow'.
                  setTimeout(function () {
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage(msg, origin);
                    }
                  }, 0);
                } catch (x) {
                  // intentionally empty
                }
              };
              doc.open();
              doc.write('<html><s' + 'cript>' + 'document.domain="' + global.document.domain + '";' + '</s' + 'cript></html>');
              doc.close();
              doc.parentWindow[module.exports.WPrefix] = global[module.exports.WPrefix];
              var c = doc.createElement('div');
              doc.body.appendChild(c);
              iframe = doc.createElement('iframe');
              c.appendChild(iframe);
              iframe.src = iframeUrl;
              iframe.onerror = function () {
                onerror('onerror');
              };
              tref = setTimeout(function () {
                onerror('timeout');
              }, 15000);
              unloadRef = eventUtils.unloadAdd(cleanup);
              return {
                post: post,
                cleanup: cleanup,
                loaded: unattach
              };
            }
          };
          module.exports.iframeEnabled = false;
          if (global.document) {
            // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
            // huge delay, or not at all.
            module.exports.iframeEnabled = (typeof global.postMessage === 'function' || _typeof(global.postMessage) === 'object') && !browser.isKonqueror();
          }
        }).call(this);
      }).call(this, {
        env: {}
      }, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "./browser": 44,
      "./event": 46,
      "debug": 55
    }],
    48: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var logObject = {};
          ['log', 'debug', 'warn'].forEach(function (level) {
            var levelExists;
            try {
              levelExists = global.console && global.console[level] && global.console[level].apply;
            } catch (e) {
              // do nothing
            }
            logObject[level] = levelExists ? function () {
              return global.console[level].apply(global.console, arguments);
            } : level === 'log' ? function () {} : logObject.log;
          });
          module.exports = logObject;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {}],
    49: [function (require, module, exports) {
      'use strict';

      module.exports = {
        isObject: function isObject(obj) {
          var type = _typeof(obj);
          return type === 'function' || type === 'object' && !!obj;
        },
        extend: function extend(obj) {
          if (!this.isObject(obj)) {
            return obj;
          }
          var source, prop;
          for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
              if (Object.prototype.hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
              }
            }
          }
          return obj;
        }
      };
    }, {}],
    50: [function (require, module, exports) {
      'use strict';

      var crypto = require('crypto');

      // This string has length 32, a power of 2, so the modulus doesn't introduce a
      // bias.
      var _randomStringChars = 'abcdefghijklmnopqrstuvwxyz012345';
      module.exports = {
        string: function string(length) {
          var max = _randomStringChars.length;
          var bytes = crypto.randomBytes(length);
          var ret = [];
          for (var i = 0; i < length; i++) {
            ret.push(_randomStringChars.substr(bytes[i] % max, 1));
          }
          return ret.join('');
        },
        number: function number(max) {
          return Math.floor(Math.random() * max);
        },
        numberString: function numberString(max) {
          var t = ('' + (max - 1)).length;
          var p = new Array(t + 1).join('0');
          return (p + this.number(max)).slice(-t);
        }
      };
    }, {
      "crypto": 43
    }],
    51: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:utils:transport');
          }
          module.exports = function (availableTransports) {
            return {
              filterToEnabled: function filterToEnabled(transportsWhitelist, info) {
                var transports = {
                  main: [],
                  facade: []
                };
                if (!transportsWhitelist) {
                  transportsWhitelist = [];
                } else if (typeof transportsWhitelist === 'string') {
                  transportsWhitelist = [transportsWhitelist];
                }
                availableTransports.forEach(function (trans) {
                  if (!trans) {
                    return;
                  }
                  if (trans.transportName === 'websocket' && info.websocket === false) {
                    debug('disabled from server', 'websocket');
                    return;
                  }
                  if (transportsWhitelist.length && transportsWhitelist.indexOf(trans.transportName) === -1) {
                    debug('not in whitelist', trans.transportName);
                    return;
                  }
                  if (trans.enabled(info)) {
                    debug('enabled', trans.transportName);
                    transports.main.push(trans);
                    if (trans.facadeTransport) {
                      transports.facade.push(trans.facadeTransport);
                    }
                  } else {
                    debug('disabled', trans.transportName);
                  }
                });
                return transports;
              }
            };
          };
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55
    }],
    52: [function (require, module, exports) {
      (function (process) {
        (function () {
          'use strict';

          var URL = require('url-parse');
          var debug = function debug() {};
          if (process.env.NODE_ENV !== 'production') {
            debug = require('debug')('sockjs-client:utils:url');
          }
          module.exports = {
            getOrigin: function getOrigin(url) {
              if (!url) {
                return null;
              }
              var p = new URL(url);
              if (p.protocol === 'file:') {
                return null;
              }
              var port = p.port;
              if (!port) {
                port = p.protocol === 'https:' ? '443' : '80';
              }
              return p.protocol + '//' + p.hostname + ':' + port;
            },
            isOriginEqual: function isOriginEqual(a, b) {
              var res = this.getOrigin(a) === this.getOrigin(b);
              debug('same', a, b, res);
              return res;
            },
            isSchemeEqual: function isSchemeEqual(a, b) {
              return a.split(':')[0] === b.split(':')[0];
            },
            addPath: function addPath(url, path) {
              var qs = url.split('?');
              return qs[0] + path + (qs[1] ? '?' + qs[1] : '');
            },
            addQuery: function addQuery(url, q) {
              return url + (url.indexOf('?') === -1 ? '?' + q : '&' + q);
            },
            isLoopbackAddr: function isLoopbackAddr(addr) {
              return /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^\[::1\]$/.test(addr);
            }
          };
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "debug": 55,
      "url-parse": 60
    }],
    53: [function (require, module, exports) {
      module.exports = '1.6.1';
    }, {}],
    54: [function (require, module, exports) {
      /**
       * Helpers.
       */

      var s = 1000;
      var m = s * 60;
      var h = m * 60;
      var d = h * 24;
      var w = d * 7;
      var y = d * 365.25;

      /**
       * Parse or format the given `val`.
       *
       * Options:
       *
       *  - `long` verbose formatting [false]
       *
       * @param {String|Number} val
       * @param {Object} [options]
       * @throws {Error} throw an error if val is not a non-empty string or a number
       * @return {String|Number}
       * @api public
       */

      module.exports = function (val, options) {
        options = options || {};
        var type = _typeof(val);
        if (type === 'string' && val.length > 0) {
          return parse(val);
        } else if (type === 'number' && isFinite(val)) {
          return options["long"] ? fmtLong(val) : fmtShort(val);
        }
        throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
      };

      /**
       * Parse the given `str` and return milliseconds.
       *
       * @param {String} str
       * @return {Number}
       * @api private
       */

      function parse(str) {
        str = String(str);
        if (str.length > 100) {
          return;
        }
        var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
        if (!match) {
          return;
        }
        var n = parseFloat(match[1]);
        var type = (match[2] || 'ms').toLowerCase();
        switch (type) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return n * y;
          case 'weeks':
          case 'week':
          case 'w':
            return n * w;
          case 'days':
          case 'day':
          case 'd':
            return n * d;
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return n * h;
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return n * m;
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return n * s;
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return n;
          default:
            return undefined;
        }
      }

      /**
       * Short format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */

      function fmtShort(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return Math.round(ms / d) + 'd';
        }
        if (msAbs >= h) {
          return Math.round(ms / h) + 'h';
        }
        if (msAbs >= m) {
          return Math.round(ms / m) + 'm';
        }
        if (msAbs >= s) {
          return Math.round(ms / s) + 's';
        }
        return ms + 'ms';
      }

      /**
       * Long format for `ms`.
       *
       * @param {Number} ms
       * @return {String}
       * @api private
       */

      function fmtLong(ms) {
        var msAbs = Math.abs(ms);
        if (msAbs >= d) {
          return plural(ms, msAbs, d, 'day');
        }
        if (msAbs >= h) {
          return plural(ms, msAbs, h, 'hour');
        }
        if (msAbs >= m) {
          return plural(ms, msAbs, m, 'minute');
        }
        if (msAbs >= s) {
          return plural(ms, msAbs, s, 'second');
        }
        return ms + ' ms';
      }

      /**
       * Pluralization helper.
       */

      function plural(ms, msAbs, n, name) {
        var isPlural = msAbs >= n * 1.5;
        return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
      }
    }, {}],
    55: [function (require, module, exports) {
      (function (process) {
        (function () {
          /* eslint-env browser */

          /**
           * This is the web browser implementation of `debug()`.
           */

          exports.formatArgs = formatArgs;
          exports.save = save;
          exports.load = load;
          exports.useColors = useColors;
          exports.storage = localstorage();
          exports.destroy = function () {
            var warned = false;
            return function () {
              if (!warned) {
                warned = true;
                console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
              }
            };
          }();

          /**
           * Colors.
           */

          exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

          /**
           * Currently only WebKit-based Web Inspectors, Firefox >= v31,
           * and the Firebug extension (any Firefox version) are known
           * to support "%c" CSS customizations.
           *
           * TODO: add a `localStorage` variable to explicitly enable/disable colors
           */

          // eslint-disable-next-line complexity
          function useColors() {
            // NB: In an Electron preload script, document will be defined but not fully
            // initialized. Since we know we're in Chrome, we'll just detect this case
            // explicitly
            if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
              return true;
            }

            // Internet Explorer and Edge do not support colors.
            if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
              return false;
            }

            // Is webkit? http://stackoverflow.com/a/16459606/376773
            // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
            return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
            // Is firebug? http://stackoverflow.com/a/398120/376773
            typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
            // Is firefox >= v31?
            // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
            typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
            // Double check webkit in userAgent just in case we are in a worker
            typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
          }

          /**
           * Colorize log arguments if enabled.
           *
           * @api public
           */

          function formatArgs(args) {
            args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);
            if (!this.useColors) {
              return;
            }
            var c = 'color: ' + this.color;
            args.splice(1, 0, c, 'color: inherit');

            // The final "%c" is somewhat tricky, because there could be other
            // arguments passed either before or after the %c, so we need to
            // figure out the correct index to insert the CSS into
            var index = 0;
            var lastC = 0;
            args[0].replace(/%[a-zA-Z%]/g, function (match) {
              if (match === '%%') {
                return;
              }
              index++;
              if (match === '%c') {
                // We only are interested in the *last* %c
                // (the user may have provided their own)
                lastC = index;
              }
            });
            args.splice(lastC, 0, c);
          }

          /**
           * Invokes `console.debug()` when available.
           * No-op when `console.debug` is not a "function".
           * If `console.debug` is not available, falls back
           * to `console.log`.
           *
           * @api public
           */
          exports.log = console.debug || console.log || function () {};

          /**
           * Save `namespaces`.
           *
           * @param {String} namespaces
           * @api private
           */
          function save(namespaces) {
            try {
              if (namespaces) {
                exports.storage.setItem('debug', namespaces);
              } else {
                exports.storage.removeItem('debug');
              }
            } catch (error) {
              // Swallow
              // XXX (@Qix-) should we be logging these?
            }
          }

          /**
           * Load `namespaces`.
           *
           * @return {String} returns the previously persisted debug modes
           * @api private
           */
          function load() {
            var r;
            try {
              r = exports.storage.getItem('debug');
            } catch (error) {
              // Swallow
              // XXX (@Qix-) should we be logging these?
            }

            // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
            if (!r && typeof process !== 'undefined' && 'env' in process) {
              r = process.env.DEBUG;
            }
            return r;
          }

          /**
           * Localstorage attempts to return the localstorage.
           *
           * This is necessary because safari throws
           * when a user disables cookies/localstorage
           * and you attempt to access it.
           *
           * @return {LocalStorage}
           * @api private
           */

          function localstorage() {
            try {
              // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
              // The Browser also has localStorage in the global context.
              return localStorage;
            } catch (error) {
              // Swallow
              // XXX (@Qix-) should we be logging these?
            }
          }
          module.exports = require('./common')(exports);
          var formatters = module.exports.formatters;

          /**
           * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
           */

          formatters.j = function (v) {
            try {
              return JSON.stringify(v);
            } catch (error) {
              return '[UnexpectedJSONParseError]: ' + error.message;
            }
          };
        }).call(this);
      }).call(this, {
        env: {}
      });
    }, {
      "./common": 56
    }],
    56: [function (require, module, exports) {
      /**
       * This is the common logic for both the Node.js and web browser
       * implementations of `debug()`.
       */

      function setup(env) {
        createDebug.debug = createDebug;
        createDebug["default"] = createDebug;
        createDebug.coerce = coerce;
        createDebug.disable = disable;
        createDebug.enable = enable;
        createDebug.enabled = enabled;
        createDebug.humanize = require('ms');
        createDebug.destroy = destroy;
        Object.keys(env).forEach(function (key) {
          createDebug[key] = env[key];
        });

        /**
        * The currently active debug mode names, and names to skip.
        */

        createDebug.names = [];
        createDebug.skips = [];

        /**
        * Map of special "%n" handling functions, for the debug "format" argument.
        *
        * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
        */
        createDebug.formatters = {};

        /**
        * Selects a color for a debug namespace
        * @param {String} namespace The namespace string for the debug instance to be colored
        * @return {Number|String} An ANSI color code for the given namespace
        * @api private
        */
        function selectColor(namespace) {
          var hash = 0;
          for (var i = 0; i < namespace.length; i++) {
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
          }
          return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
        }
        createDebug.selectColor = selectColor;

        /**
        * Create a debugger with the given `namespace`.
        *
        * @param {String} namespace
        * @return {Function}
        * @api public
        */
        function createDebug(namespace) {
          var prevTime;
          var enableOverride = null;
          var namespacesCache;
          var enabledCache;
          function debug() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            // Disabled?
            if (!debug.enabled) {
              return;
            }
            var self = debug;

            // Set `diff` timestamp
            var curr = Number(new Date());
            var ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== 'string') {
              // Anything else let's inspect with %O
              args.unshift('%O');
            }

            // Apply any `formatters` transformations
            var index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, function (match, format) {
              // If we encounter an escaped % then don't increase the array index
              if (match === '%%') {
                return '%';
              }
              index++;
              var formatter = createDebug.formatters[format];
              if (typeof formatter === 'function') {
                var val = args[index];
                match = formatter.call(self, val);

                // Now we need to remove `args[index]` since it's inlined in the `format`
                args.splice(index, 1);
                index--;
              }
              return match;
            });

            // Apply env-specific formatting (colors, etc.)
            createDebug.formatArgs.call(self, args);
            var logFn = self.log || createDebug.log;
            logFn.apply(self, args);
          }
          debug.namespace = namespace;
          debug.useColors = createDebug.useColors();
          debug.color = createDebug.selectColor(namespace);
          debug.extend = extend;
          debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

          Object.defineProperty(debug, 'enabled', {
            enumerable: true,
            configurable: false,
            get: function get() {
              if (enableOverride !== null) {
                return enableOverride;
              }
              if (namespacesCache !== createDebug.namespaces) {
                namespacesCache = createDebug.namespaces;
                enabledCache = createDebug.enabled(namespace);
              }
              return enabledCache;
            },
            set: function set(v) {
              enableOverride = v;
            }
          });

          // Env-specific initialization logic for debug instances
          if (typeof createDebug.init === 'function') {
            createDebug.init(debug);
          }
          return debug;
        }
        function extend(namespace, delimiter) {
          var newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
          newDebug.log = this.log;
          return newDebug;
        }

        /**
        * Enables a debug mode by namespaces. This can include modes
        * separated by a colon and wildcards.
        *
        * @param {String} namespaces
        * @api public
        */
        function enable(namespaces) {
          createDebug.save(namespaces);
          createDebug.namespaces = namespaces;
          createDebug.names = [];
          createDebug.skips = [];
          var i;
          var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
          var len = split.length;
          for (i = 0; i < len; i++) {
            if (!split[i]) {
              // ignore empty strings
              continue;
            }
            namespaces = split[i].replace(/\*/g, '.*?');
            if (namespaces[0] === '-') {
              createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
            } else {
              createDebug.names.push(new RegExp('^' + namespaces + '$'));
            }
          }
        }

        /**
        * Disable debug output.
        *
        * @return {String} namespaces
        * @api public
        */
        function disable() {
          var namespaces = [].concat(_toConsumableArray(createDebug.names.map(toNamespace)), _toConsumableArray(createDebug.skips.map(toNamespace).map(function (namespace) {
            return '-' + namespace;
          }))).join(',');
          createDebug.enable('');
          return namespaces;
        }

        /**
        * Returns true if the given mode name is enabled, false otherwise.
        *
        * @param {String} name
        * @return {Boolean}
        * @api public
        */
        function enabled(name) {
          if (name[name.length - 1] === '*') {
            return true;
          }
          var i;
          var len;
          for (i = 0, len = createDebug.skips.length; i < len; i++) {
            if (createDebug.skips[i].test(name)) {
              return false;
            }
          }
          for (i = 0, len = createDebug.names.length; i < len; i++) {
            if (createDebug.names[i].test(name)) {
              return true;
            }
          }
          return false;
        }

        /**
        * Convert regexp to namespace
        *
        * @param {RegExp} regxep
        * @return {String} namespace
        * @api private
        */
        function toNamespace(regexp) {
          return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
        }

        /**
        * Coerce `val`.
        *
        * @param {Mixed} val
        * @return {Mixed}
        * @api private
        */
        function coerce(val) {
          if (val instanceof Error) {
            return val.stack || val.message;
          }
          return val;
        }

        /**
        * XXX DO NOT USE. This is a temporary stub function.
        * XXX It WILL be removed in the next major release.
        */
        function destroy() {
          console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
        }
        createDebug.enable(createDebug.load());
        return createDebug;
      }
      module.exports = setup;
    }, {
      "ms": 54
    }],
    57: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        // old school shim for old browsers
        module.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function TempCtor() {};
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }, {}],
    58: [function (require, module, exports) {
      'use strict';

      var has = Object.prototype.hasOwnProperty,
        undef;

      /**
       * Decode a URI encoded string.
       *
       * @param {String} input The URI encoded string.
       * @returns {String|Null} The decoded string.
       * @api private
       */
      function decode(input) {
        try {
          return decodeURIComponent(input.replace(/\+/g, ' '));
        } catch (e) {
          return null;
        }
      }

      /**
       * Attempts to encode a given input.
       *
       * @param {String} input The string that needs to be encoded.
       * @returns {String|Null} The encoded string.
       * @api private
       */
      function encode(input) {
        try {
          return encodeURIComponent(input);
        } catch (e) {
          return null;
        }
      }

      /**
       * Simple query string parser.
       *
       * @param {String} query The query string that needs to be parsed.
       * @returns {Object}
       * @api public
       */
      function querystring(query) {
        var parser = /([^=?&]+)=?([^&]*)/g,
          result = {},
          part;
        while (part = parser.exec(query)) {
          var key = decode(part[1]),
            value = decode(part[2]);

          //
          // Prevent overriding of existing properties. This ensures that build-in
          // methods like `toString` or __proto__ are not overriden by malicious
          // querystrings.
          //
          // In the case if failed decoding, we want to omit the key/value pairs
          // from the result.
          //
          if (key === null || value === null || key in result) continue;
          result[key] = value;
        }
        return result;
      }

      /**
       * Transform a query string to an object.
       *
       * @param {Object} obj Object that should be transformed.
       * @param {String} prefix Optional prefix.
       * @returns {String}
       * @api public
       */
      function querystringify(obj, prefix) {
        prefix = prefix || '';
        var pairs = [],
          value,
          key;

        //
        // Optionally prefix with a '?' if needed
        //
        if ('string' !== typeof prefix) prefix = '?';
        for (key in obj) {
          if (has.call(obj, key)) {
            value = obj[key];

            //
            // Edge cases where we actually want to encode the value to an empty
            // string instead of the stringified value.
            //
            if (!value && (value === null || value === undef || isNaN(value))) {
              value = '';
            }
            key = encodeURIComponent(key);
            value = encodeURIComponent(value);

            //
            // If we failed to encode the strings, we should bail out as we don't
            // want to add invalid strings to the query.
            //
            if (key === null || value === null) continue;
            pairs.push(key + '=' + value);
          }
        }
        return pairs.length ? prefix + pairs.join('&') : '';
      }

      //
      // Expose the module.
      //
      exports.stringify = querystringify;
      exports.parse = querystring;
    }, {}],
    59: [function (require, module, exports) {
      'use strict';

      /**
       * Check if we're required to add a port number.
       *
       * @see https://url.spec.whatwg.org/#default-port
       * @param {Number|String} port Port number we need to check
       * @param {String} protocol Protocol we need to check against.
       * @returns {Boolean} Is it a default port for the given protocol
       * @api private
       */
      module.exports = function required(port, protocol) {
        protocol = protocol.split(':')[0];
        port = +port;
        if (!port) return false;
        switch (protocol) {
          case 'http':
          case 'ws':
            return port !== 80;
          case 'https':
          case 'wss':
            return port !== 443;
          case 'ftp':
            return port !== 21;
          case 'gopher':
            return port !== 70;
          case 'file':
            return false;
        }
        return port !== 0;
      };
    }, {}],
    60: [function (require, module, exports) {
      (function (global) {
        (function () {
          'use strict';

          var required = require('requires-port'),
            qs = require('querystringify'),
            controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/,
            CRHTLF = /[\n\r\t]/g,
            slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
            port = /:\d+$/,
            protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i,
            windowsDriveLetter = /^[a-zA-Z]:/;

          /**
           * Remove control characters and whitespace from the beginning of a string.
           *
           * @param {Object|String} str String to trim.
           * @returns {String} A new string representing `str` stripped of control
           *     characters and whitespace from its beginning.
           * @public
           */
          function trimLeft(str) {
            return (str ? str : '').toString().replace(controlOrWhitespace, '');
          }

          /**
           * These are the parse rules for the URL parser, it informs the parser
           * about:
           *
           * 0. The char it Needs to parse, if it's a string it should be done using
           *    indexOf, RegExp using exec and NaN means set as current value.
           * 1. The property we should set when parsing this value.
           * 2. Indication if it's backwards or forward parsing, when set as number it's
           *    the value of extra chars that should be split off.
           * 3. Inherit from location if non existing in the parser.
           * 4. `toLowerCase` the resulting value.
           */
          var rules = [['#', 'hash'],
          // Extract from the back.
          ['?', 'query'],
          // Extract from the back.
          function sanitize(address, url) {
            // Sanitize what is left of the address
            return isSpecial(url.protocol) ? address.replace(/\\/g, '/') : address;
          }, ['/', 'pathname'],
          // Extract from the back.
          ['@', 'auth', 1],
          // Extract from the front.
          [NaN, 'host', undefined, 1, 1],
          // Set left over value.
          [/:(\d*)$/, 'port', undefined, 1],
          // RegExp the back.
          [NaN, 'hostname', undefined, 1, 1] // Set left over.
          ];

          /**
           * These properties should not be copied or inherited from. This is only needed
           * for all non blob URL's as a blob URL does not include a hash, only the
           * origin.
           *
           * @type {Object}
           * @private
           */
          var ignore = {
            hash: 1,
            query: 1
          };

          /**
           * The location object differs when your code is loaded through a normal page,
           * Worker or through a worker using a blob. And with the blobble begins the
           * trouble as the location object will contain the URL of the blob, not the
           * location of the page where our code is loaded in. The actual origin is
           * encoded in the `pathname` so we can thankfully generate a good "default"
           * location from it so we can generate proper relative URL's again.
           *
           * @param {Object|String} loc Optional default location object.
           * @returns {Object} lolcation object.
           * @public
           */
          function lolcation(loc) {
            var globalVar;
            if (typeof window !== 'undefined') globalVar = window;else if (typeof global !== 'undefined') globalVar = global;else if (typeof self !== 'undefined') globalVar = self;else globalVar = {};
            var location = globalVar.location || {};
            loc = loc || location;
            var finaldestination = {},
              type = _typeof(loc),
              key;
            if ('blob:' === loc.protocol) {
              finaldestination = new Url(unescape(loc.pathname), {});
            } else if ('string' === type) {
              finaldestination = new Url(loc, {});
              for (key in ignore) delete finaldestination[key];
            } else if ('object' === type) {
              for (key in loc) {
                if (key in ignore) continue;
                finaldestination[key] = loc[key];
              }
              if (finaldestination.slashes === undefined) {
                finaldestination.slashes = slashes.test(loc.href);
              }
            }
            return finaldestination;
          }

          /**
           * Check whether a protocol scheme is special.
           *
           * @param {String} The protocol scheme of the URL
           * @return {Boolean} `true` if the protocol scheme is special, else `false`
           * @private
           */
          function isSpecial(scheme) {
            return scheme === 'file:' || scheme === 'ftp:' || scheme === 'http:' || scheme === 'https:' || scheme === 'ws:' || scheme === 'wss:';
          }

          /**
           * @typedef ProtocolExtract
           * @type Object
           * @property {String} protocol Protocol matched in the URL, in lowercase.
           * @property {Boolean} slashes `true` if protocol is followed by "//", else `false`.
           * @property {String} rest Rest of the URL that is not part of the protocol.
           */

          /**
           * Extract protocol information from a URL with/without double slash ("//").
           *
           * @param {String} address URL we want to extract from.
           * @param {Object} location
           * @return {ProtocolExtract} Extracted information.
           * @private
           */
          function extractProtocol(address, location) {
            address = trimLeft(address);
            address = address.replace(CRHTLF, '');
            location = location || {};
            var match = protocolre.exec(address);
            var protocol = match[1] ? match[1].toLowerCase() : '';
            var forwardSlashes = !!match[2];
            var otherSlashes = !!match[3];
            var slashesCount = 0;
            var rest;
            if (forwardSlashes) {
              if (otherSlashes) {
                rest = match[2] + match[3] + match[4];
                slashesCount = match[2].length + match[3].length;
              } else {
                rest = match[2] + match[4];
                slashesCount = match[2].length;
              }
            } else {
              if (otherSlashes) {
                rest = match[3] + match[4];
                slashesCount = match[3].length;
              } else {
                rest = match[4];
              }
            }
            if (protocol === 'file:') {
              if (slashesCount >= 2) {
                rest = rest.slice(2);
              }
            } else if (isSpecial(protocol)) {
              rest = match[4];
            } else if (protocol) {
              if (forwardSlashes) {
                rest = rest.slice(2);
              }
            } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
              rest = match[4];
            }
            return {
              protocol: protocol,
              slashes: forwardSlashes || isSpecial(protocol),
              slashesCount: slashesCount,
              rest: rest
            };
          }

          /**
           * Resolve a relative URL pathname against a base URL pathname.
           *
           * @param {String} relative Pathname of the relative URL.
           * @param {String} base Pathname of the base URL.
           * @return {String} Resolved pathname.
           * @private
           */
          function resolve(relative, base) {
            if (relative === '') return base;
            var path = (base || '/').split('/').slice(0, -1).concat(relative.split('/')),
              i = path.length,
              last = path[i - 1],
              unshift = false,
              up = 0;
            while (i--) {
              if (path[i] === '.') {
                path.splice(i, 1);
              } else if (path[i] === '..') {
                path.splice(i, 1);
                up++;
              } else if (up) {
                if (i === 0) unshift = true;
                path.splice(i, 1);
                up--;
              }
            }
            if (unshift) path.unshift('');
            if (last === '.' || last === '..') path.push('');
            return path.join('/');
          }

          /**
           * The actual URL instance. Instead of returning an object we've opted-in to
           * create an actual constructor as it's much more memory efficient and
           * faster and it pleases my OCD.
           *
           * It is worth noting that we should not use `URL` as class name to prevent
           * clashes with the global URL instance that got introduced in browsers.
           *
           * @constructor
           * @param {String} address URL we want to parse.
           * @param {Object|String} [location] Location defaults for relative paths.
           * @param {Boolean|Function} [parser] Parser for the query string.
           * @private
           */
          function Url(address, location, parser) {
            address = trimLeft(address);
            address = address.replace(CRHTLF, '');
            if (!(this instanceof Url)) {
              return new Url(address, location, parser);
            }
            var relative,
              extracted,
              parse,
              instruction,
              index,
              key,
              instructions = rules.slice(),
              type = _typeof(location),
              url = this,
              i = 0;

            //
            // The following if statements allows this module two have compatibility with
            // 2 different API:
            //
            // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
            //    where the boolean indicates that the query string should also be parsed.
            //
            // 2. The `URL` interface of the browser which accepts a URL, object as
            //    arguments. The supplied object will be used as default values / fall-back
            //    for relative paths.
            //
            if ('object' !== type && 'string' !== type) {
              parser = location;
              location = null;
            }
            if (parser && 'function' !== typeof parser) parser = qs.parse;
            location = lolcation(location);

            //
            // Extract protocol information before running the instructions.
            //
            extracted = extractProtocol(address || '', location);
            relative = !extracted.protocol && !extracted.slashes;
            url.slashes = extracted.slashes || relative && location.slashes;
            url.protocol = extracted.protocol || location.protocol || '';
            address = extracted.rest;

            //
            // When the authority component is absent the URL starts with a path
            // component.
            //
            if (extracted.protocol === 'file:' && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
              instructions[3] = [/(.*)/, 'pathname'];
            }
            for (; i < instructions.length; i++) {
              instruction = instructions[i];
              if (typeof instruction === 'function') {
                address = instruction(address, url);
                continue;
              }
              parse = instruction[0];
              key = instruction[1];
              if (parse !== parse) {
                url[key] = address;
              } else if ('string' === typeof parse) {
                index = parse === '@' ? address.lastIndexOf(parse) : address.indexOf(parse);
                if (~index) {
                  if ('number' === typeof instruction[2]) {
                    url[key] = address.slice(0, index);
                    address = address.slice(index + instruction[2]);
                  } else {
                    url[key] = address.slice(index);
                    address = address.slice(0, index);
                  }
                }
              } else if (index = parse.exec(address)) {
                url[key] = index[1];
                address = address.slice(0, index.index);
              }
              url[key] = url[key] || (relative && instruction[3] ? location[key] || '' : '');

              //
              // Hostname, host and protocol should be lowercased so they can be used to
              // create a proper `origin`.
              //
              if (instruction[4]) url[key] = url[key].toLowerCase();
            }

            //
            // Also parse the supplied query string in to an object. If we're supplied
            // with a custom parser as function use that instead of the default build-in
            // parser.
            //
            if (parser) url.query = parser(url.query);

            //
            // If the URL is relative, resolve the pathname against the base URL.
            //
            if (relative && location.slashes && url.pathname.charAt(0) !== '/' && (url.pathname !== '' || location.pathname !== '')) {
              url.pathname = resolve(url.pathname, location.pathname);
            }

            //
            // Default to a / for pathname if none exists. This normalizes the URL
            // to always have a /
            //
            if (url.pathname.charAt(0) !== '/' && isSpecial(url.protocol)) {
              url.pathname = '/' + url.pathname;
            }

            //
            // We should not add port numbers if they are already the default port number
            // for a given protocol. As the host also contains the port number we're going
            // override it with the hostname which contains no port number.
            //
            if (!required(url.port, url.protocol)) {
              url.host = url.hostname;
              url.port = '';
            }

            //
            // Parse down the `auth` for the username and password.
            //
            url.username = url.password = '';
            if (url.auth) {
              index = url.auth.indexOf(':');
              if (~index) {
                url.username = url.auth.slice(0, index);
                url.username = encodeURIComponent(decodeURIComponent(url.username));
                url.password = url.auth.slice(index + 1);
                url.password = encodeURIComponent(decodeURIComponent(url.password));
              } else {
                url.username = encodeURIComponent(decodeURIComponent(url.auth));
              }
              url.auth = url.password ? url.username + ':' + url.password : url.username;
            }
            url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host ? url.protocol + '//' + url.host : 'null';

            //
            // The href is just the compiled result.
            //
            url.href = url.toString();
          }

          /**
           * This is convenience method for changing properties in the URL instance to
           * insure that they all propagate correctly.
           *
           * @param {String} part          Property we need to adjust.
           * @param {Mixed} value          The newly assigned value.
           * @param {Boolean|Function} fn  When setting the query, it will be the function
           *                               used to parse the query.
           *                               When setting the protocol, double slash will be
           *                               removed from the final url if it is true.
           * @returns {URL} URL instance for chaining.
           * @public
           */
          function set(part, value, fn) {
            var url = this;
            switch (part) {
              case 'query':
                if ('string' === typeof value && value.length) {
                  value = (fn || qs.parse)(value);
                }
                url[part] = value;
                break;
              case 'port':
                url[part] = value;
                if (!required(value, url.protocol)) {
                  url.host = url.hostname;
                  url[part] = '';
                } else if (value) {
                  url.host = url.hostname + ':' + value;
                }
                break;
              case 'hostname':
                url[part] = value;
                if (url.port) value += ':' + url.port;
                url.host = value;
                break;
              case 'host':
                url[part] = value;
                if (port.test(value)) {
                  value = value.split(':');
                  url.port = value.pop();
                  url.hostname = value.join(':');
                } else {
                  url.hostname = value;
                  url.port = '';
                }
                break;
              case 'protocol':
                url.protocol = value.toLowerCase();
                url.slashes = !fn;
                break;
              case 'pathname':
              case 'hash':
                if (value) {
                  var _char = part === 'pathname' ? '/' : '#';
                  url[part] = value.charAt(0) !== _char ? _char + value : value;
                } else {
                  url[part] = value;
                }
                break;
              case 'username':
              case 'password':
                url[part] = encodeURIComponent(value);
                break;
              case 'auth':
                var index = value.indexOf(':');
                if (~index) {
                  url.username = value.slice(0, index);
                  url.username = encodeURIComponent(decodeURIComponent(url.username));
                  url.password = value.slice(index + 1);
                  url.password = encodeURIComponent(decodeURIComponent(url.password));
                } else {
                  url.username = encodeURIComponent(decodeURIComponent(value));
                }
            }
            for (var i = 0; i < rules.length; i++) {
              var ins = rules[i];
              if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
            }
            url.auth = url.password ? url.username + ':' + url.password : url.username;
            url.origin = url.protocol !== 'file:' && isSpecial(url.protocol) && url.host ? url.protocol + '//' + url.host : 'null';
            url.href = url.toString();
            return url;
          }

          /**
           * Transform the properties back in to a valid and full URL string.
           *
           * @param {Function} stringify Optional query stringify function.
           * @returns {String} Compiled version of the URL.
           * @public
           */
          function toString(stringify) {
            if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;
            var query,
              url = this,
              host = url.host,
              protocol = url.protocol;
            if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';
            var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? '//' : '');
            if (url.username) {
              result += url.username;
              if (url.password) result += ':' + url.password;
              result += '@';
            } else if (url.password) {
              result += ':' + url.password;
              result += '@';
            } else if (url.protocol !== 'file:' && isSpecial(url.protocol) && !host && url.pathname !== '/') {
              //
              // Add back the empty userinfo, otherwise the original invalid URL
              // might be transformed into a valid one with `url.pathname` as host.
              //
              result += '@';
            }

            //
            // Trailing colon is removed from `url.host` when it is parsed. If it still
            // ends with a colon, then add back the trailing colon that was removed. This
            // prevents an invalid URL from being transformed into a valid one.
            //
            if (host[host.length - 1] === ':' || port.test(url.hostname) && !url.port) {
              host += ':';
            }
            result += host + url.pathname;
            query = 'object' === _typeof(url.query) ? stringify(url.query) : url.query;
            if (query) result += '?' !== query.charAt(0) ? '?' + query : query;
            if (url.hash) result += url.hash;
            return result;
          }
          Url.prototype = {
            set: set,
            toString: toString
          };

          //
          // Expose the URL parser and some additional properties that might be useful for
          // others or testing.
          //
          Url.extractProtocol = extractProtocol;
          Url.location = lolcation;
          Url.trimLeft = trimLeft;
          Url.qs = qs;
          module.exports = Url;
        }).call(this);
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
    }, {
      "querystringify": 58,
      "requires-port": 59
    }]
  }, {}, [1])(1);
});
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var g;

// This works in non-strict mode
g = function () {
  return this;
}();
try {
  // This works if eval is allowed (see CSP)
  g = g || new Function("return this")();
} catch (e) {
  // This works if the window reference is available
  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable
  no-unused-vars
*/
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
module.exports = /*#__PURE__*/function () {
  function BaseClient() {
    _classCallCheck(this, BaseClient);
  }
  _createClass(BaseClient, null, [{
    key: "getClientPath",
    value: function getClientPath(options) {
      throw new Error('Client needs implementation');
    }
  }]);
  return BaseClient;
}();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).
var ansiHTML = __webpack_require__(16);
var _require = __webpack_require__(17),
  AllHtmlEntities = _require.AllHtmlEntities;
var entities = new AllHtmlEntities();
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};
var overlayIframe = null;
var overlayDiv = null;
var lastOnOverlayDivReady = null;
ansiHTML.setColors(colors);
function createOverlayIframe(onIframeLoad) {
  var iframe = document.createElement('iframe');
  iframe.id = 'webpack-dev-server-client-overlay';
  iframe.src = 'about:blank';
  iframe.style.position = 'fixed';
  iframe.style.left = 0;
  iframe.style.top = 0;
  iframe.style.right = 0;
  iframe.style.bottom = 0;
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.zIndex = 9999999999;
  iframe.onload = onIframeLoad;
  return iframe;
}
function addOverlayDivTo(iframe) {
  var div = iframe.contentDocument.createElement('div');
  div.id = 'webpack-dev-server-client-overlay-div';
  div.style.position = 'fixed';
  div.style.boxSizing = 'border-box';
  div.style.left = 0;
  div.style.top = 0;
  div.style.right = 0;
  div.style.bottom = 0;
  div.style.width = '100vw';
  div.style.height = '100vh';
  div.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  div.style.color = '#E8E8E8';
  div.style.fontFamily = 'Menlo, Consolas, monospace';
  div.style.fontSize = 'large';
  div.style.padding = '2rem';
  div.style.lineHeight = '1.2';
  div.style.whiteSpace = 'pre-wrap';
  div.style.overflow = 'auto';
  iframe.contentDocument.body.appendChild(div);
  return div;
}
function ensureOverlayDivExists(onOverlayDivReady) {
  if (overlayDiv) {
    // Everything is ready, call the callback right away.
    onOverlayDivReady(overlayDiv);
    return;
  } // Creating an iframe may be asynchronous so we'll schedule the callback.
  // In case of multiple calls, last callback wins.

  lastOnOverlayDivReady = onOverlayDivReady;
  if (overlayIframe) {
    // We've already created it.
    return;
  } // Create iframe and, when it is ready, a div inside it.

  overlayIframe = createOverlayIframe(function () {
    overlayDiv = addOverlayDivTo(overlayIframe); // Now we can talk!

    lastOnOverlayDivReady(overlayDiv);
  }); // Zalgo alert: onIframeLoad() will be called either synchronously
  // or asynchronously depending on the browser.
  // We delay adding it so `overlayIframe` is set when `onIframeLoad` fires.

  document.body.appendChild(overlayIframe);
} // Successful compilation.

function clear() {
  if (!overlayDiv) {
    // It is not there in the first place.
    return;
  } // Clean up and reset internal state.

  document.body.removeChild(overlayIframe);
  overlayDiv = null;
  overlayIframe = null;
  lastOnOverlayDivReady = null;
} // Compilation with errors (e.g. syntax error or missing modules).

function showMessage(messages) {
  ensureOverlayDivExists(function (div) {
    // Make it look similar to our terminal.
    div.innerHTML = "<span style=\"color: #".concat(colors.red, "\">Failed to compile.</span><br><br>").concat(ansiHTML(entities.encode(messages[0])));
  });
}
module.exports = {
  clear: clear,
  showMessage: showMessage
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
module.exports = ansiHTML;

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/;
var _defColors = {
  reset: ['fff', '000'],
  // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
};
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
};
var _openTags = {
  '1': 'font-weight:bold',
  // bold
  '2': 'opacity:0.5',
  // dim
  '3': '<i>',
  // italic
  '4': '<u>',
  // underscore
  '8': 'display:none',
  // hidden
  '9': '<del>' // delete
};
var _closeTags = {
  '23': '</i>',
  // reset italic
  '24': '</u>',
  // reset underscore
  '29': '</del>' // reset delete
};
[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>';
});

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML(text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text;
  }

  // Cache opened sequence.
  var ansiCodes = [];
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)m/g, function (match, seq) {
    var ot = _openTags[seq];
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) {
        // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop();
        return '</span>';
      }
      // Open tag.
      ansiCodes.push(seq);
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">';
    }
    var ct = _closeTags[seq];
    if (ct) {
      // Pop sequence
      ansiCodes.pop();
      return ct;
    }
    return '';
  });

  // Make sure tags are closed.
  var l = ansiCodes.length;
  l > 0 && (ret += Array(l + 1).join('</span>'));
  return ret;
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (_typeof(colors) !== 'object') {
    throw new Error('`colors` parameter must be an Object.');
  }
  var _finalColors = {};
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null;
    if (!hex) {
      _finalColors[key] = _defColors[key];
      continue;
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex];
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string';
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000');
      }
      var defHexColor = _defColors[key];
      if (!hex[0]) {
        hex[0] = defHexColor[0];
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]];
        hex.push(defHexColor[1]);
      }
      hex = hex.slice(0, 2);
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000');
    }
    _finalColors[key] = hex;
  }
  _setTags(_finalColors);
};

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors);
};

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {};
if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function get() {
      return _openTags;
    }
  });
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function get() {
      return _closeTags;
    }
  });
} else {
  ansiHTML.tags.open = _openTags;
  ansiHTML.tags.close = _closeTags;
}
function _setTags(colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1];
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0];
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey;
  for (var code in _styles) {
    var color = _styles[code];
    var oriColor = colors[color] || '000';
    _openTags[code] = 'color:#' + oriColor;
    code = parseInt(code);
    _openTags[(code + 10).toString()] = 'background:#' + oriColor;
  }
}
ansiHTML.reset();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var xml_entities_1 = __webpack_require__(18);
exports.XmlEntities = xml_entities_1.XmlEntities;
var html4_entities_1 = __webpack_require__(20);
exports.Html4Entities = html4_entities_1.Html4Entities;
var html5_entities_1 = __webpack_require__(21);
exports.Html5Entities = html5_entities_1.Html5Entities;
exports.AllHtmlEntities = html5_entities_1.Html5Entities;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var surrogate_pairs_1 = __webpack_require__(19);
var ALPHA_INDEX = {
  '&lt': '<',
  '&gt': '>',
  '&quot': '"',
  '&apos': '\'',
  '&amp': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': '\'',
  '&amp;': '&'
};
var CHAR_INDEX = {
  60: 'lt',
  62: 'gt',
  34: 'quot',
  39: 'apos',
  38: 'amp'
};
var CHAR_S_INDEX = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&apos;',
  '&': '&amp;'
};
var XmlEntities = /** @class */function () {
  function XmlEntities() {}
  XmlEntities.prototype.encode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    return str.replace(/[<>"'&]/g, function (s) {
      return CHAR_S_INDEX[s];
    });
  };
  XmlEntities.encode = function (str) {
    return new XmlEntities().encode(str);
  };
  XmlEntities.prototype.decode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function (s) {
      if (s.charAt(1) === '#') {
        var code = s.charAt(2).toLowerCase() === 'x' ? parseInt(s.substr(3), 16) : parseInt(s.substr(2));
        if (!isNaN(code) || code >= -32768) {
          if (code <= 65535) {
            return String.fromCharCode(code);
          } else {
            return surrogate_pairs_1.fromCodePoint(code);
          }
        }
        return '';
      }
      return ALPHA_INDEX[s] || s;
    });
  };
  XmlEntities.decode = function (str) {
    return new XmlEntities().decode(str);
  };
  XmlEntities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      var alpha = CHAR_INDEX[c];
      if (alpha) {
        result += "&" + alpha + ";";
        i++;
        continue;
      }
      if (c < 32 || c > 126) {
        if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
          result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
          i++;
        } else {
          result += '&#' + c + ';';
        }
      } else {
        result += str.charAt(i);
      }
      i++;
    }
    return result;
  };
  XmlEntities.encodeNonUTF = function (str) {
    return new XmlEntities().encodeNonUTF(str);
  };
  XmlEntities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      if (c <= 255) {
        result += str[i++];
        continue;
      }
      if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
        result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
        i++;
      } else {
        result += '&#' + c + ';';
      }
      i++;
    }
    return result;
  };
  XmlEntities.encodeNonASCII = function (str) {
    return new XmlEntities().encodeNonASCII(str);
  };
  return XmlEntities;
}();
exports.XmlEntities = XmlEntities;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromCodePoint = String.fromCodePoint || function (astralCodePoint) {
  return String.fromCharCode(Math.floor((astralCodePoint - 0x10000) / 0x400) + 0xD800, (astralCodePoint - 0x10000) % 0x400 + 0xDC00);
};
exports.getCodePoint = String.prototype.codePointAt ? function (input, position) {
  return input.codePointAt(position);
} : function (input, position) {
  return (input.charCodeAt(position) - 0xD800) * 0x400 + input.charCodeAt(position + 1) - 0xDC00 + 0x10000;
};
exports.highSurrogateFrom = 0xD800;
exports.highSurrogateTo = 0xDBFF;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var surrogate_pairs_1 = __webpack_require__(19);
var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'AElig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];
var alphaIndex = {};
var numIndex = {};
(function () {
  var i = 0;
  var length = HTML_ALPHA.length;
  while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
  }
})();
var Html4Entities = /** @class */function () {
  function Html4Entities() {}
  Html4Entities.prototype.decode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function (s, entity) {
      var chr;
      if (entity.charAt(0) === "#") {
        var code = entity.charAt(1).toLowerCase() === 'x' ? parseInt(entity.substr(2), 16) : parseInt(entity.substr(1));
        if (!isNaN(code) || code >= -32768) {
          if (code <= 65535) {
            chr = String.fromCharCode(code);
          } else {
            chr = surrogate_pairs_1.fromCodePoint(code);
          }
        }
      } else {
        chr = alphaIndex[entity];
      }
      return chr || s;
    });
  };
  Html4Entities.decode = function (str) {
    return new Html4Entities().decode(str);
  };
  Html4Entities.prototype.encode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var alpha = numIndex[str.charCodeAt(i)];
      result += alpha ? "&" + alpha + ";" : str.charAt(i);
      i++;
    }
    return result;
  };
  Html4Entities.encode = function (str) {
    return new Html4Entities().encode(str);
  };
  Html4Entities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var cc = str.charCodeAt(i);
      var alpha = numIndex[cc];
      if (alpha) {
        result += "&" + alpha + ";";
      } else if (cc < 32 || cc > 126) {
        if (cc >= surrogate_pairs_1.highSurrogateFrom && cc <= surrogate_pairs_1.highSurrogateTo) {
          result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
          i++;
        } else {
          result += '&#' + cc + ';';
        }
      } else {
        result += str.charAt(i);
      }
      i++;
    }
    return result;
  };
  Html4Entities.encodeNonUTF = function (str) {
    return new Html4Entities().encodeNonUTF(str);
  };
  Html4Entities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      if (c <= 255) {
        result += str[i++];
        continue;
      }
      if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
        result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
        i++;
      } else {
        result += '&#' + c + ';';
      }
      i++;
    }
    return result;
  };
  Html4Entities.encodeNonASCII = function (str) {
    return new Html4Entities().encodeNonASCII(str);
  };
  return Html4Entities;
}();
exports.Html4Entities = Html4Entities;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var surrogate_pairs_1 = __webpack_require__(19);
var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];
var DECODE_ONLY_ENTITIES = [['NewLine', [10]]];
var alphaIndex = {};
var charIndex = {};
createIndexes(alphaIndex, charIndex);
var Html5Entities = /** @class */function () {
  function Html5Entities() {}
  Html5Entities.prototype.decode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function (s, entity) {
      var chr;
      if (entity.charAt(0) === "#") {
        var code = entity.charAt(1) === 'x' ? parseInt(entity.substr(2).toLowerCase(), 16) : parseInt(entity.substr(1));
        if (!isNaN(code) || code >= -32768) {
          if (code <= 65535) {
            chr = String.fromCharCode(code);
          } else {
            chr = surrogate_pairs_1.fromCodePoint(code);
          }
        }
      } else {
        chr = alphaIndex[entity];
      }
      return chr || s;
    });
  };
  Html5Entities.decode = function (str) {
    return new Html5Entities().decode(str);
  };
  Html5Entities.prototype.encode = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var charInfo = charIndex[str.charCodeAt(i)];
      if (charInfo) {
        var alpha = charInfo[str.charCodeAt(i + 1)];
        if (alpha) {
          i++;
        } else {
          alpha = charInfo[''];
        }
        if (alpha) {
          result += "&" + alpha + ";";
          i++;
          continue;
        }
      }
      result += str.charAt(i);
      i++;
    }
    return result;
  };
  Html5Entities.encode = function (str) {
    return new Html5Entities().encode(str);
  };
  Html5Entities.prototype.encodeNonUTF = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      var charInfo = charIndex[c];
      if (charInfo) {
        var alpha = charInfo[str.charCodeAt(i + 1)];
        if (alpha) {
          i++;
        } else {
          alpha = charInfo[''];
        }
        if (alpha) {
          result += "&" + alpha + ";";
          i++;
          continue;
        }
      }
      if (c < 32 || c > 126) {
        if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
          result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
          i++;
        } else {
          result += '&#' + c + ';';
        }
      } else {
        result += str.charAt(i);
      }
      i++;
    }
    return result;
  };
  Html5Entities.encodeNonUTF = function (str) {
    return new Html5Entities().encodeNonUTF(str);
  };
  Html5Entities.prototype.encodeNonASCII = function (str) {
    if (!str || !str.length) {
      return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
      var c = str.charCodeAt(i);
      if (c <= 255) {
        result += str[i++];
        continue;
      }
      if (c >= surrogate_pairs_1.highSurrogateFrom && c <= surrogate_pairs_1.highSurrogateTo) {
        result += '&#' + surrogate_pairs_1.getCodePoint(str, i) + ';';
        i += 2;
      } else {
        result += '&#' + c + ';';
        i++;
      }
    }
    return result;
  };
  Html5Entities.encodeNonASCII = function (str) {
    return new Html5Entities().encodeNonASCII(str);
  };
  return Html5Entities;
}();
exports.Html5Entities = Html5Entities;
function createIndexes(alphaIndex, charIndex) {
  var i = ENTITIES.length;
  while (i--) {
    var _a = ENTITIES[i],
      alpha = _a[0],
      _b = _a[1],
      chr = _b[0],
      chr2 = _b[1];
    var addChar = chr < 32 || chr > 126 || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
    var charInfo = void 0;
    if (addChar) {
      charInfo = charIndex[chr] = charIndex[chr] || {};
    }
    if (chr2) {
      alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
      addChar && (charInfo[chr2] = alpha);
    } else {
      alphaIndex[alpha] = String.fromCharCode(chr);
      addChar && (charInfo[''] = alpha);
    }
  }
  i = DECODE_ONLY_ENTITIES.length;
  while (i--) {
    var _c = DECODE_ONLY_ENTITIES[i],
      alpha = _c[0],
      _d = _c[1],
      chr = _d[0],
      chr2 = _d[1];
    alphaIndex[alpha] = String.fromCharCode(chr) + (chr2 ? String.fromCharCode(chr2) : '');
  }
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var log = __webpack_require__(23).getLogger('webpack-dev-server');
var INFO = 'info';
var WARN = 'warn';
var ERROR = 'error';
var DEBUG = 'debug';
var TRACE = 'trace';
var SILENT = 'silent'; // deprecated
// TODO: remove these at major released
// https://github.com/webpack/webpack-dev-server/pull/1825

var WARNING = 'warning';
var NONE = 'none'; // Set the default log level

log.setDefaultLevel(INFO);
function setLogLevel(level) {
  switch (level) {
    case INFO:
    case WARN:
    case ERROR:
    case DEBUG:
    case TRACE:
      log.setLevel(level);
      break;
    // deprecated

    case WARNING:
      // loglevel's warning name is different from webpack's
      log.setLevel('warn');
      break;
    // deprecated

    case NONE:
    case SILENT:
      log.disableAll();
      break;
    default:
      log.error("[WDS] Unknown clientLogLevel '".concat(level, "'"));
  }
}
module.exports = {
  log: log,
  setLogLevel: setLogLevel
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
  "use strict";

  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(this, function () {
  "use strict";

  // Slightly dubious tricks to cut down minimized file size
  var noop = function noop() {};
  var undefinedType = "undefined";
  var isIE = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefinedType && _typeof(window.navigator) !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
  var logMethods = ["trace", "debug", "info", "warn", "error"];
  var _loggersByName = {};
  var defaultLogger = null;

  // Cross-browser bind equivalent that works at least back to IE6
  function bindMethod(obj, methodName) {
    var method = obj[methodName];
    if (typeof method.bind === 'function') {
      return method.bind(obj);
    } else {
      try {
        return Function.prototype.bind.call(method, obj);
      } catch (e) {
        // Missing bind shim or IE8 + Modernizr, fallback to wrapping
        return function () {
          return Function.prototype.apply.apply(method, [obj, arguments]);
        };
      }
    }
  }

  // Trace() doesn't print the message in IE, so for that case we need to wrap it
  function traceForIE() {
    if (console.log) {
      if (console.log.apply) {
        console.log.apply(console, arguments);
      } else {
        // In old IE, native console methods themselves don't have apply().
        Function.prototype.apply.apply(console.log, [console, arguments]);
      }
    }
    if (console.trace) console.trace();
  }

  // Build the best logging method possible for this env
  // Wherever possible we want to bind, not wrap, to preserve stack traces
  function realMethod(methodName) {
    if (methodName === 'debug') {
      methodName = 'log';
    }
    if ((typeof console === "undefined" ? "undefined" : _typeof(console)) === undefinedType) {
      return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
    } else if (methodName === 'trace' && isIE) {
      return traceForIE;
    } else if (console[methodName] !== undefined) {
      return bindMethod(console, methodName);
    } else if (console.log !== undefined) {
      return bindMethod(console, 'log');
    } else {
      return noop;
    }
  }

  // These private functions always need `this` to be set properly

  function replaceLoggingMethods() {
    /*jshint validthis:true */
    var level = this.getLevel();

    // Replace the actual methods.
    for (var i = 0; i < logMethods.length; i++) {
      var methodName = logMethods[i];
      this[methodName] = i < level ? noop : this.methodFactory(methodName, level, this.name);
    }

    // Define log.log as an alias for log.debug
    this.log = this.debug;

    // Return any important warnings.
    if ((typeof console === "undefined" ? "undefined" : _typeof(console)) === undefinedType && level < this.levels.SILENT) {
      return "No console available for logging";
    }
  }

  // In old IE versions, the console isn't present until you first open it.
  // We build realMethod() replacements here that regenerate logging methods
  function enableLoggingWhenConsoleArrives(methodName) {
    return function () {
      if ((typeof console === "undefined" ? "undefined" : _typeof(console)) !== undefinedType) {
        replaceLoggingMethods.call(this);
        this[methodName].apply(this, arguments);
      }
    };
  }

  // By default, we use closely bound real methods wherever possible, and
  // otherwise we wait for a console to appear, and then try again.
  function defaultMethodFactory(methodName, _level, _loggerName) {
    /*jshint validthis:true */
    return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
  }
  function Logger(name, factory) {
    // Private instance variables.
    var self = this;
    /**
     * The level inherited from a parent logger (or a global default). We
     * cache this here rather than delegating to the parent so that it stays
     * in sync with the actual logging methods that we have installed (the
     * parent could change levels but we might not have rebuilt the loggers
     * in this child yet).
     * @type {number}
     */
    var inheritedLevel;
    /**
     * The default level for this logger, if any. If set, this overrides
     * `inheritedLevel`.
     * @type {number|null}
     */
    var defaultLevel;
    /**
     * A user-specific level for this logger. If set, this overrides
     * `defaultLevel`.
     * @type {number|null}
     */
    var userLevel;
    var storageKey = "loglevel";
    if (typeof name === "string") {
      storageKey += ":" + name;
    } else if (_typeof(name) === "symbol") {
      storageKey = undefined;
    }
    function persistLevelIfPossible(levelNum) {
      var levelName = (logMethods[levelNum] || 'silent').toUpperCase();
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === undefinedType || !storageKey) return;

      // Use localStorage if available
      try {
        window.localStorage[storageKey] = levelName;
        return;
      } catch (ignore) {}

      // Use session cookie as fallback
      try {
        window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
      } catch (ignore) {}
    }
    function getPersistedLevel() {
      var storedLevel;
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === undefinedType || !storageKey) return;
      try {
        storedLevel = window.localStorage[storageKey];
      } catch (ignore) {}

      // Fallback to cookies if local storage gives us nothing
      if (_typeof(storedLevel) === undefinedType) {
        try {
          var cookie = window.document.cookie;
          var cookieName = encodeURIComponent(storageKey);
          var location = cookie.indexOf(cookieName + "=");
          if (location !== -1) {
            storedLevel = /^([^;]+)/.exec(cookie.slice(location + cookieName.length + 1))[1];
          }
        } catch (ignore) {}
      }

      // If the stored level is not valid, treat it as if nothing was stored.
      if (self.levels[storedLevel] === undefined) {
        storedLevel = undefined;
      }
      return storedLevel;
    }
    function clearPersistedLevel() {
      if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === undefinedType || !storageKey) return;

      // Use localStorage if available
      try {
        window.localStorage.removeItem(storageKey);
      } catch (ignore) {}

      // Use session cookie as fallback
      try {
        window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
      } catch (ignore) {}
    }
    function normalizeLevel(input) {
      var level = input;
      if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
        level = self.levels[level.toUpperCase()];
      }
      if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
        return level;
      } else {
        throw new TypeError("log.setLevel() called with invalid level: " + input);
      }
    }

    /*
     *
     * Public logger API - see https://github.com/pimterry/loglevel for details
     *
     */

    self.name = name;
    self.levels = {
      "TRACE": 0,
      "DEBUG": 1,
      "INFO": 2,
      "WARN": 3,
      "ERROR": 4,
      "SILENT": 5
    };
    self.methodFactory = factory || defaultMethodFactory;
    self.getLevel = function () {
      if (userLevel != null) {
        return userLevel;
      } else if (defaultLevel != null) {
        return defaultLevel;
      } else {
        return inheritedLevel;
      }
    };
    self.setLevel = function (level, persist) {
      userLevel = normalizeLevel(level);
      if (persist !== false) {
        // defaults to true
        persistLevelIfPossible(userLevel);
      }

      // NOTE: in v2, this should call rebuild(), which updates children.
      return replaceLoggingMethods.call(self);
    };
    self.setDefaultLevel = function (level) {
      defaultLevel = normalizeLevel(level);
      if (!getPersistedLevel()) {
        self.setLevel(level, false);
      }
    };
    self.resetLevel = function () {
      userLevel = null;
      clearPersistedLevel();
      replaceLoggingMethods.call(self);
    };
    self.enableAll = function (persist) {
      self.setLevel(self.levels.TRACE, persist);
    };
    self.disableAll = function (persist) {
      self.setLevel(self.levels.SILENT, persist);
    };
    self.rebuild = function () {
      if (defaultLogger !== self) {
        inheritedLevel = normalizeLevel(defaultLogger.getLevel());
      }
      replaceLoggingMethods.call(self);
      if (defaultLogger === self) {
        for (var childName in _loggersByName) {
          _loggersByName[childName].rebuild();
        }
      }
    };

    // Initialize all the internal levels.
    inheritedLevel = normalizeLevel(defaultLogger ? defaultLogger.getLevel() : "WARN");
    var initialLevel = getPersistedLevel();
    if (initialLevel != null) {
      userLevel = normalizeLevel(initialLevel);
    }
    replaceLoggingMethods.call(self);
  }

  /*
   *
   * Top-level API
   *
   */

  defaultLogger = new Logger();
  defaultLogger.getLogger = function getLogger(name) {
    if (_typeof(name) !== "symbol" && typeof name !== "string" || name === "") {
      throw new TypeError("You must supply a name when creating a logger.");
    }
    var logger = _loggersByName[name];
    if (!logger) {
      logger = _loggersByName[name] = new Logger(name, defaultLogger.methodFactory);
    }
    return logger;
  };

  // Grab the current global log variable in case of overwrite
  var _log = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefinedType ? window.log : undefined;
  defaultLogger.noConflict = function () {
    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== undefinedType && window.log === defaultLogger) {
      window.log = _log;
    }
    return defaultLogger;
  };
  defaultLogger.getLoggers = function getLoggers() {
    return _loggersByName;
  };

  // ES6 default export, for compatibility
  defaultLogger['default'] = defaultLogger;
  return defaultLogger;
});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global __resourceQuery WorkerGlobalScope self */
// Send messages to the outside, so plugins can consume it.
function sendMsg(type, data) {
  if (typeof self !== 'undefined' && (typeof WorkerGlobalScope === 'undefined' || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: "webpack".concat(type),
      data: data
    }, '*');
  }
}
module.exports = sendMsg;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global WorkerGlobalScope self */
var _require = __webpack_require__(22),
  log = _require.log;
function reloadApp(_ref, _ref2) {
  var hotReload = _ref.hotReload,
    hot = _ref.hot,
    liveReload = _ref.liveReload;
  var isUnloading = _ref2.isUnloading,
    currentHash = _ref2.currentHash;
  if (isUnloading || !hotReload) {
    return;
  }
  if (hot) {
    log.info('[WDS] App hot update...');
    var hotEmitter = __webpack_require__(26);
    hotEmitter.emit('webpackHotUpdate', currentHash);
    if (typeof self !== 'undefined' && self.window) {
      // broadcast update to window
      self.postMessage("webpackHotUpdate".concat(currentHash), '*');
    }
  } // allow refreshing the page only if liveReload isn't disabled
  else if (liveReload) {
    var rootWindow = self; // use parent window for reload (in case we're in an iframe with no valid src)

    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== 'about:') {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }
  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    log.info('[WDS] App updated. Reloading...');
    rootWindow.location.reload();
  }
}
module.exports = reloadApp;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(27);
module.exports = new EventEmitter();

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var R = (typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === 'object' ? Reflect : null;
var ReflectApply = R && typeof R.apply === 'function' ? R.apply : function ReflectApply(target, receiver, args) {
  return Function.prototype.apply.call(target, receiver, args);
};
var ReflectOwnKeys;
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys;
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}
function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}
var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
};
function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;
function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + _typeof(listener));
  }
}
Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function get() {
    return defaultMaxListeners;
  },
  set: function set(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});
EventEmitter.init = function () {
  if (this._events === undefined || this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }
  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};
function _getMaxListeners(that) {
  if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};
EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = type === 'error';
  var events = this._events;
  if (events !== undefined) doError = doError && events.error === undefined;else if (!doError) return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0) er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }
  var handler = events[type];
  if (handler === undefined) return false;
  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i) ReflectApply(listeners[i], this, args);
  }
  return true;
};
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  checkListener(listener);
  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type, listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }
  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + String(type) + ' listeners ' + 'added. Use emitter.setMaxListeners() to ' + 'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }
  return target;
}
EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};
EventEmitter.prototype.on = EventEmitter.prototype.addListener;
EventEmitter.prototype.prependListener = function prependListener(type, listener) {
  return _addListener(this, type, listener, true);
};
function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0) return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}
function _onceWrap(target, type, listener) {
  var state = {
    fired: false,
    wrapFn: undefined,
    target: target,
    type: type,
    listener: listener
  };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}
EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};
EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
  checkListener(listener);
  this.prependListener(type, _onceWrap(this, type, listener));
  return this;
};

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener = function removeListener(type, listener) {
  var list, events, position, i, originalListener;
  checkListener(listener);
  events = this._events;
  if (events === undefined) return this;
  list = events[type];
  if (list === undefined) return this;
  if (list === listener || list.listener === listener) {
    if (--this._eventsCount === 0) this._events = Object.create(null);else {
      delete events[type];
      if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
    }
  } else if (typeof list !== 'function') {
    position = -1;
    for (i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener || list[i].listener === listener) {
        originalListener = list[i].listener;
        position = i;
        break;
      }
    }
    if (position < 0) return this;
    if (position === 0) list.shift();else {
      spliceOne(list, position);
    }
    if (list.length === 1) events[type] = list[0];
    if (events.removeListener !== undefined) this.emit('removeListener', type, originalListener || listener);
  }
  return this;
};
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
  var listeners, events, i;
  events = this._events;
  if (events === undefined) return this;

  // not listening for removeListener, no need to emit
  if (events.removeListener === undefined) {
    if (arguments.length === 0) {
      this._events = Object.create(null);
      this._eventsCount = 0;
    } else if (events[type] !== undefined) {
      if (--this._eventsCount === 0) this._events = Object.create(null);else delete events[type];
    }
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    var keys = Object.keys(events);
    var key;
    for (i = 0; i < keys.length; ++i) {
      key = keys[i];
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = Object.create(null);
    this._eventsCount = 0;
    return this;
  }
  listeners = events[type];
  if (typeof listeners === 'function') {
    this.removeListener(type, listeners);
  } else if (listeners !== undefined) {
    // LIFO order
    for (i = listeners.length - 1; i >= 0; i--) {
      this.removeListener(type, listeners[i]);
    }
  }
  return this;
};
function _listeners(target, type, unwrap) {
  var events = target._events;
  if (events === undefined) return [];
  var evlistener = events[type];
  if (evlistener === undefined) return [];
  if (typeof evlistener === 'function') return unwrap ? [evlistener.listener || evlistener] : [evlistener];
  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}
EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};
EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};
EventEmitter.listenerCount = function (emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};
EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;
  if (events !== undefined) {
    var evlistener = events[type];
    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }
  return 0;
}
EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};
function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i) copy[i] = arr[i];
  return copy;
}
function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }
    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    }
    ;
    eventTargetAgnosticAddListener(emitter, name, resolver, {
      once: true
    });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, {
        once: true
      });
    }
  });
}
function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}
function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + _typeof(emitter));
  }
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global self */
var url = __webpack_require__(29);
var getCurrentScriptSource = __webpack_require__(79);
function createSocketUrl(resourceQuery, currentLocation) {
  var urlParts;
  if (typeof resourceQuery === 'string' && resourceQuery !== '') {
    // If this bundle is inlined, use the resource query to get the correct url.
    // format is like `?http://0.0.0.0:8096&sockPort=8097&sockHost=localhost`
    urlParts = url.parse(resourceQuery // strip leading `?` from query string to get a valid URL
    .substr(1) // replace first `&` with `?` to have a valid query string
    .replace('&', '?'), true);
  } else {
    // Else, get the url from the <script> this file was called with.
    var scriptHost = getCurrentScriptSource();
    urlParts = url.parse(scriptHost || '/', true, true);
  } // Use parameter to allow passing location in unit tests

  if (typeof currentLocation === 'string' && currentLocation !== '') {
    currentLocation = url.parse(currentLocation);
  } else {
    currentLocation = self.location;
  }
  return getSocketUrl(urlParts, currentLocation);
}
/*
 * Gets socket URL based on Script Source/Location
 * (scriptSrc: URL, location: URL) -> URL
 */

function getSocketUrl(urlParts, loc) {
  var auth = urlParts.auth,
    query = urlParts.query;
  var hostname = urlParts.hostname,
    protocol = urlParts.protocol,
    port = urlParts.port;
  if (!port || port === '0') {
    port = loc.port;
  } // check ipv4 and ipv6 `all hostname`
  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384

  if ((hostname === '0.0.0.0' || hostname === '::') && loc.hostname && loc.protocol.indexOf('http') === 0) {
    hostname = loc.hostname;
  } // `hostname` can be empty when the script path is relative. In that case, specifying
  // a protocol would result in an invalid URL.
  // When https is used in the app, secure websockets are always necessary
  // because the browser doesn't accept non-secure websockets.

  if (hostname && hostname !== '127.0.0.1' && (loc.protocol === 'https:' || urlParts.hostname === '0.0.0.0')) {
    protocol = loc.protocol;
  } // all of these sock url params are optionally passed in through
  // resourceQuery, so we need to fall back to the default if
  // they are not provided

  var sockHost = query.sockHost || hostname;
  var sockPath = query.sockPath || '/sockjs-node';
  var sockPort = query.sockPort || port;
  if (sockPort === 'location') {
    sockPort = loc.port;
  }
  return url.format({
    protocol: protocol,
    auth: auth,
    hostname: sockHost,
    port: sockPort,
    // If sockPath is provided it'll be passed in via the resourceQuery as a
    // query param so it has to be parsed out of the querystring in order for the
    // client to open the socket to the correct location.
    pathname: sockPath
  });
}
module.exports = createSocketUrl;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * Copyright Joyent, Inc. and other Node contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the
 * following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var punycode = __webpack_require__(30);
function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

/*
 * define these here so at least they only have to be
 * compiled once on the first module load.
 */
var protocolPattern = /^([a-z0-9.+-]+:)/i,
  portPattern = /:[0-9]*$/,
  // Special case for a simple path URL
  simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/,
  /*
   * RFC 2396: characters reserved for delimiting URLs.
   * We actually just auto-escape these.
   */
  delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],
  // RFC 2396: characters not allowed for various reasons.
  unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),
  // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
  autoEscape = ['\''].concat(unwise),
  /*
   * Characters that are never ever allowed in a hostname.
   * Note that any invalid chars are also handled, but these
   * are the ones that are *expected* to be seen, so we fast-path
   * them.
   */
  nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
  hostEndingChars = ['/', '?', '#'],
  hostnameMaxLen = 255,
  hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
  hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
  // protocols that can allow "unsafe" and "unwise" chars.
  unsafeProtocol = {
    javascript: true,
    'javascript:': true
  },
  // protocols that never have a hostname.
  hostlessProtocol = {
    javascript: true,
    'javascript:': true
  },
  // protocols that always contain a // bit.
  slashedProtocol = {
    http: true,
    https: true,
    ftp: true,
    gopher: true,
    file: true,
    'http:': true,
    'https:': true,
    'ftp:': true,
    'gopher:': true,
    'file:': true
  },
  querystring = __webpack_require__(33);
function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && _typeof(url) === 'object' && url instanceof Url) {
    return url;
  }
  var u = new Url();
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}
Url.prototype.parse = function (url, parseQueryString, slashesDenoteHost) {
  if (typeof url !== 'string') {
    throw new TypeError("Parameter 'url' must be a string, not " + _typeof(url));
  }

  /*
   * Copy chrome, IE, opera backslash-handling behavior.
   * Back slashes before the query string get converted to forward slashes
   * See: https://code.google.com/p/chromium/issues/detail?id=25916
   */
  var queryIndex = url.indexOf('?'),
    splitter = queryIndex !== -1 && queryIndex < url.indexOf('#') ? '?' : '#',
    uSplit = url.split(splitter),
    slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);
  var rest = url;

  /*
   * trim before proceeding.
   * This is to support parse stuff like "  http://foo.com  \n"
   */
  rest = rest.trim();
  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }
  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  /*
   * figure out if it's got a host
   * user@server is *always* interpreted as a hostname, and url
   * resolution will treat //foo/bar as host=foo,path=bar because that's
   * how the browser resolves relative URLs.
   */
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@/]+@[^@/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }
  if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
    /*
     * there's a hostname.
     * the first instance of /, ?, ;, or # ends the host.
     *
     * If there is an @ in the hostname, then non-host chars *are* allowed
     * to the left of the last @ sign, unless some host-ending character
     * comes *before* the @-sign.
     * URLs are obnoxious.
     *
     * ex:
     * http://a@b@c/ => user:a@b host:c
     * http://a@b?@c => user:a host:c path:/?@c
     */

    /*
     * v0.12 TODO(isaacs): This is not quite how Chrome does things.
     * Review our test case against browsers more comprehensively.
     */

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }

    /*
     * at this point, either we have an explicit point where the
     * auth portion cannot go past, or the last @ char is the decider.
     */
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      /*
       * atSign must be in auth portion.
       * http://a@b/c@d => host:b auth:a path:/c@d
       */
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    /*
     * Now we have a portion which is definitely the auth.
     * Pull that off.
     */
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) {
      hostEnd = rest.length;
    }
    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    /*
     * we've indicated that there is a hostname,
     * so even if it's empty, it has to be present.
     */
    this.hostname = this.hostname || '';

    /*
     * if hostname begins with [ and ends with ]
     * assume that it's an IPv6 address.
     */
    var ipv6Hostname = this.hostname[0] === '[' && this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) {
          continue;
        }
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              /*
               * we replace non-ASCII char with a temporary placeholder
               * we need this to make sure size of hostname is not
               * broken by replacing non-ASCII by nothing
               */
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }
    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }
    if (!ipv6Hostname) {
      /*
       * IDNA Support: Returns a punycoded representation of "domain".
       * It only converts parts of the domain name that
       * have non-ASCII characters, i.e. it doesn't matter if
       * you call it with a domain that already is ASCII-only.
       */
      this.hostname = punycode.toASCII(this.hostname);
    }
    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    /*
     * strip [ and ] from the hostname
     * the host field still retains them, though
     */
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  /*
   * now rest is set to the post-host stuff.
   * chop off any delim chars.
   */
  if (!unsafeProtocol[lowerProto]) {
    /*
     * First, make 100% sure that any "autoEscape" chars get
     * escaped, even if encodeURIComponent doesn't think they
     * need to be.
     */
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1) {
        continue;
      }
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) {
    this.pathname = rest;
  }
  if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  // to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  /*
   * ensure it's an object, and not a string url.
   * If it's an obj, this is a no-op.
   * this way, you can call url_format() on strings
   * to clean up potentially wonky urls.
   */
  if (typeof obj === 'string') {
    obj = urlParse(obj);
  }
  if (!(obj instanceof Url)) {
    return Url.prototype.format.call(obj);
  }
  return obj.format();
}
Url.prototype.format = function () {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }
  var protocol = this.protocol || '',
    pathname = this.pathname || '',
    hash = this.hash || '',
    host = false,
    query = '';
  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ? this.hostname : '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }
  if (this.query && _typeof(this.query) === 'object' && Object.keys(this.query).length) {
    query = querystring.stringify(this.query, {
      arrayFormat: 'repeat',
      addQueryPrefix: false
    });
  }
  var search = this.search || query && '?' + query || '';
  if (protocol && protocol.substr(-1) !== ':') {
    protocol += ':';
  }

  /*
   * only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
   * unless they had them to begin with.
   */
  if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') {
      pathname = '/' + pathname;
    }
  } else if (!host) {
    host = '';
  }
  if (hash && hash.charAt(0) !== '#') {
    hash = '#' + hash;
  }
  if (search && search.charAt(0) !== '?') {
    search = '?' + search;
  }
  pathname = pathname.replace(/[?#]/g, function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');
  return protocol + host + pathname + search + hash;
};
function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}
Url.prototype.resolve = function (relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};
function urlResolveObject(source, relative) {
  if (!source) {
    return relative;
  }
  return urlParse(source, false, true).resolveObject(relative);
}
Url.prototype.resolveObject = function (relative) {
  if (typeof relative === 'string') {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }
  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  /*
   * hash is always overridden, no matter what.
   * even href="" will remove it.
   */
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol') {
        result[rkey] = relative[rkey];
      }
    }

    // urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
      result.pathname = '/';
      result.path = result.pathname;
    }
    result.href = result.format();
    return result;
  }
  if (relative.protocol && relative.protocol !== result.protocol) {
    /*
     * if it's a known url protocol, then changing
     * the protocol does weird things
     * first, if it's not file:, then we MUST have a host,
     * and if there was a path
     * to begin with, then we MUST have a path.
     * if it is file:, then the host is dropped,
     * because that's known to be hostless.
     * anything else is assumed to be absolute.
     */
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }
    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift())) {}
      if (!relative.host) {
        relative.host = '';
      }
      if (!relative.hostname) {
        relative.hostname = '';
      }
      if (relPath[0] !== '') {
        relPath.unshift('');
      }
      if (relPath.length < 2) {
        relPath.unshift('');
      }
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }
  var isSourceAbs = result.pathname && result.pathname.charAt(0) === '/',
    isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === '/',
    mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname,
    removeAllDots = mustEndAbs,
    srcPath = result.pathname && result.pathname.split('/') || [],
    relPath = relative.pathname && relative.pathname.split('/') || [],
    psychotic = result.protocol && !slashedProtocol[result.protocol];

  /*
   * if the url is a non-slashed url, then relative
   * links like ../.. should be able
   * to crawl up to the hostname, as well.  This is strange.
   * result.protocol has already been set by now.
   * Later on, put the first path part into the host field.
   */
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') {
        srcPath[0] = result.host;
      } else {
        srcPath.unshift(result.host);
      }
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') {
          relPath[0] = relative.host;
        } else {
          relPath.unshift(relative.host);
        }
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }
  if (isRelAbs) {
    // it's absolute.
    result.host = relative.host || relative.host === '' ? relative.host : result.host;
    result.hostname = relative.hostname || relative.hostname === '' ? relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    /*
     * it's relative
     * throw away the existing file, and take the new path instead.
     */
    if (!srcPath) {
      srcPath = [];
    }
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (relative.search != null) {
    /*
     * just pull out the search.
     * like href='?foo'.
     * Put this after the other two cases because it simplifies the booleans
     */
    if (psychotic) {
      result.host = srcPath.shift();
      result.hostname = result.host;
      /*
       * occationaly the auth can get stuck only in host
       * this especially happens in cases like
       * url.resolveObject('mailto:local1@domain1', 'local2@domain2')
       */
      var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.hostname = authInHost.shift();
        result.host = result.hostname;
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    // to support http.request
    if (result.pathname !== null || result.search !== null) {
      result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }
  if (!srcPath.length) {
    /*
     * no path at all.  easy.
     * we've already handled the other stuff above.
     */
    result.pathname = null;
    // to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  /*
   * if a url ENDs in . or .., then it must get a trailing slash.
   * however, if it ends in anything else non-slashy,
   * then it must NOT get a trailing slash.
   */
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === '.' || last === '..') || last === '';

  /*
   * strip single dots, resolve double dots to parent dir
   * if the path tries to go above the root, `up` ends up > 0
   */
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }
  if (mustEndAbs && srcPath[0] !== '' && (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }
  if (hasTrailingSlash && srcPath.join('/').substr(-1) !== '/') {
    srcPath.push('');
  }
  var isAbsolute = srcPath[0] === '' || srcPath[0] && srcPath[0].charAt(0) === '/';

  // put the host back
  if (psychotic) {
    result.hostname = isAbsolute ? '' : srcPath.length ? srcPath.shift() : '';
    result.host = result.hostname;
    /*
     * occationaly the auth can get stuck only in host
     * this especially happens in cases like
     * url.resolveObject('mailto:local1@domain1', 'local2@domain2')
     */
    var authInHost = result.host && result.host.indexOf('@') > 0 ? result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.hostname = authInHost.shift();
      result.host = result.hostname;
    }
  }
  mustEndAbs = mustEndAbs || result.host && srcPath.length;
  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }
  if (srcPath.length > 0) {
    result.pathname = srcPath.join('/');
  } else {
    result.pathname = null;
    result.path = null;
  }

  // to support request.http
  if (result.pathname !== null || result.search !== null) {
    result.path = (result.pathname ? result.pathname : '') + (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};
Url.prototype.parseHost = function () {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) {
    this.hostname = host;
  }
};
exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;
exports.Url = Url;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/*! https://mths.be/punycode v1.4.1 by @mathias */
;
(function (root) {
  /** Detect free variables */
  var freeExports = ( false ? undefined : _typeof(exports)) == 'object' && exports && !exports.nodeType && exports;
  var freeModule = ( false ? undefined : _typeof(module)) == 'object' && module && !module.nodeType && module;
  var freeGlobal = (typeof global === "undefined" ? "undefined" : _typeof(global)) == 'object' && global;
  if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
    root = freeGlobal;
  }

  /**
   * The `punycode` object.
   * @name punycode
   * @type Object
   */
  var punycode,
    /** Highest positive signed 32-bit float value */
    maxInt = 2147483647,
    // aka. 0x7FFFFFFF or 2^31-1

    /** Bootstring parameters */
    base = 36,
    tMin = 1,
    tMax = 26,
    skew = 38,
    damp = 700,
    initialBias = 72,
    initialN = 128,
    // 0x80
    delimiter = '-',
    // '\x2D'

    /** Regular expressions */
    regexPunycode = /^xn--/,
    regexNonASCII = /[^\x20-\x7E]/,
    // unprintable ASCII chars + non-ASCII chars
    regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g,
    // RFC 3490 separators

    /** Error messages */
    errors = {
      'overflow': 'Overflow: input needs wider integers to process',
      'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
      'invalid-input': 'Invalid input'
    },
    /** Convenience shortcuts */
    baseMinusTMin = base - tMin,
    floor = Math.floor,
    stringFromCharCode = String.fromCharCode,
    /** Temporary variable */
    key;

  /*--------------------------------------------------------------------------*/

  /**
   * A generic error utility function.
   * @private
   * @param {String} type The error type.
   * @returns {Error} Throws a `RangeError` with the applicable error message.
   */
  function error(type) {
    throw new RangeError(errors[type]);
  }

  /**
   * A generic `Array#map` utility function.
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} callback The function that gets called for every array
   * item.
   * @returns {Array} A new array of values returned by the callback function.
   */
  function map(array, fn) {
    var length = array.length;
    var result = [];
    while (length--) {
      result[length] = fn(array[length]);
    }
    return result;
  }

  /**
   * A simple `Array#map`-like wrapper to work with domain name strings or email
   * addresses.
   * @private
   * @param {String} domain The domain name or email address.
   * @param {Function} callback The function that gets called for every
   * character.
   * @returns {Array} A new string of characters returned by the callback
   * function.
   */
  function mapDomain(string, fn) {
    var parts = string.split('@');
    var result = '';
    if (parts.length > 1) {
      // In email addresses, only the domain name should be punycoded. Leave
      // the local part (i.e. everything up to `@`) intact.
      result = parts[0] + '@';
      string = parts[1];
    }
    // Avoid `split(regex)` for IE8 compatibility. See #17.
    string = string.replace(regexSeparators, '\x2E');
    var labels = string.split('.');
    var encoded = map(labels, fn).join('.');
    return result + encoded;
  }

  /**
   * Creates an array containing the numeric code points of each Unicode
   * character in the string. While JavaScript uses UCS-2 internally,
   * this function will convert a pair of surrogate halves (each of which
   * UCS-2 exposes as separate characters) into a single code point,
   * matching UTF-16.
   * @see `punycode.ucs2.encode`
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode.ucs2
   * @name decode
   * @param {String} string The Unicode input string (UCS-2).
   * @returns {Array} The new array of code points.
   */
  function ucs2decode(string) {
    var output = [],
      counter = 0,
      length = string.length,
      value,
      extra;
    while (counter < length) {
      value = string.charCodeAt(counter++);
      if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
        // high surrogate, and there is a next character
        extra = string.charCodeAt(counter++);
        if ((extra & 0xFC00) == 0xDC00) {
          // low surrogate
          output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
        } else {
          // unmatched surrogate; only append this code unit, in case the next
          // code unit is the high surrogate of a surrogate pair
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }

  /**
   * Creates a string based on an array of numeric code points.
   * @see `punycode.ucs2.decode`
   * @memberOf punycode.ucs2
   * @name encode
   * @param {Array} codePoints The array of numeric code points.
   * @returns {String} The new Unicode string (UCS-2).
   */
  function ucs2encode(array) {
    return map(array, function (value) {
      var output = '';
      if (value > 0xFFFF) {
        value -= 0x10000;
        output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
        value = 0xDC00 | value & 0x3FF;
      }
      output += stringFromCharCode(value);
      return output;
    }).join('');
  }

  /**
   * Converts a basic code point into a digit/integer.
   * @see `digitToBasic()`
   * @private
   * @param {Number} codePoint The basic numeric code point value.
   * @returns {Number} The numeric value of a basic code point (for use in
   * representing integers) in the range `0` to `base - 1`, or `base` if
   * the code point does not represent a value.
   */
  function basicToDigit(codePoint) {
    if (codePoint - 48 < 10) {
      return codePoint - 22;
    }
    if (codePoint - 65 < 26) {
      return codePoint - 65;
    }
    if (codePoint - 97 < 26) {
      return codePoint - 97;
    }
    return base;
  }

  /**
   * Converts a digit/integer into a basic code point.
   * @see `basicToDigit()`
   * @private
   * @param {Number} digit The numeric value of a basic code point.
   * @returns {Number} The basic code point whose value (when used for
   * representing integers) is `digit`, which needs to be in the range
   * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
   * used; else, the lowercase form is used. The behavior is undefined
   * if `flag` is non-zero and `digit` has no uppercase form.
   */
  function digitToBasic(digit, flag) {
    //  0..25 map to ASCII a..z or A..Z
    // 26..35 map to ASCII 0..9
    return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  }

  /**
   * Bias adaptation function as per section 3.4 of RFC 3492.
   * https://tools.ietf.org/html/rfc3492#section-3.4
   * @private
   */
  function adapt(delta, numPoints, firstTime) {
    var k = 0;
    delta = firstTime ? floor(delta / damp) : delta >> 1;
    delta += floor(delta / numPoints);
    for /* no initialization */
    (; delta > baseMinusTMin * tMax >> 1; k += base) {
      delta = floor(delta / baseMinusTMin);
    }
    return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  }

  /**
   * Converts a Punycode string of ASCII-only symbols to a string of Unicode
   * symbols.
   * @memberOf punycode
   * @param {String} input The Punycode string of ASCII-only symbols.
   * @returns {String} The resulting string of Unicode symbols.
   */
  function decode(input) {
    // Don't use UCS-2
    var output = [],
      inputLength = input.length,
      out,
      i = 0,
      n = initialN,
      bias = initialBias,
      basic,
      j,
      index,
      oldi,
      w,
      k,
      digit,
      t,
      /** Cached calculation results */
      baseMinusT;

    // Handle the basic code points: let `basic` be the number of input code
    // points before the last delimiter, or `0` if there is none, then copy
    // the first basic code points to the output.

    basic = input.lastIndexOf(delimiter);
    if (basic < 0) {
      basic = 0;
    }
    for (j = 0; j < basic; ++j) {
      // if it's not a basic code point
      if (input.charCodeAt(j) >= 0x80) {
        error('not-basic');
      }
      output.push(input.charCodeAt(j));
    }

    // Main decoding loop: start just after the last delimiter if any basic code
    // points were copied; start at the beginning otherwise.

    for /* no final expression */
    (index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
      // `index` is the index of the next character to be consumed.
      // Decode a generalized variable-length integer into `delta`,
      // which gets added to `i`. The overflow checking is easier
      // if we increase `i` as we go, then subtract off its starting
      // value at the end to obtain `delta`.
      for /* no condition */
      (oldi = i, w = 1, k = base;; k += base) {
        if (index >= inputLength) {
          error('invalid-input');
        }
        digit = basicToDigit(input.charCodeAt(index++));
        if (digit >= base || digit > floor((maxInt - i) / w)) {
          error('overflow');
        }
        i += digit * w;
        t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
        if (digit < t) {
          break;
        }
        baseMinusT = base - t;
        if (w > floor(maxInt / baseMinusT)) {
          error('overflow');
        }
        w *= baseMinusT;
      }
      out = output.length + 1;
      bias = adapt(i - oldi, out, oldi == 0);

      // `i` was supposed to wrap around from `out` to `0`,
      // incrementing `n` each time, so we'll fix that now:
      if (floor(i / out) > maxInt - n) {
        error('overflow');
      }
      n += floor(i / out);
      i %= out;

      // Insert `n` at position `i` of the output
      output.splice(i++, 0, n);
    }
    return ucs2encode(output);
  }

  /**
   * Converts a string of Unicode symbols (e.g. a domain name label) to a
   * Punycode string of ASCII-only symbols.
   * @memberOf punycode
   * @param {String} input The string of Unicode symbols.
   * @returns {String} The resulting Punycode string of ASCII-only symbols.
   */
  function encode(input) {
    var n,
      delta,
      handledCPCount,
      basicLength,
      bias,
      j,
      m,
      q,
      k,
      t,
      currentValue,
      output = [],
      /** `inputLength` will hold the number of code points in `input`. */
      inputLength,
      /** Cached calculation results */
      handledCPCountPlusOne,
      baseMinusT,
      qMinusT;

    // Convert the input in UCS-2 to Unicode
    input = ucs2decode(input);

    // Cache the length
    inputLength = input.length;

    // Initialize the state
    n = initialN;
    delta = 0;
    bias = initialBias;

    // Handle the basic code points
    for (j = 0; j < inputLength; ++j) {
      currentValue = input[j];
      if (currentValue < 0x80) {
        output.push(stringFromCharCode(currentValue));
      }
    }
    handledCPCount = basicLength = output.length;

    // `handledCPCount` is the number of code points that have been handled;
    // `basicLength` is the number of basic code points.

    // Finish the basic string - if it is not empty - with a delimiter
    if (basicLength) {
      output.push(delimiter);
    }

    // Main encoding loop:
    while (handledCPCount < inputLength) {
      // All non-basic code points < n have been handled already. Find the next
      // larger one:
      for (m = maxInt, j = 0; j < inputLength; ++j) {
        currentValue = input[j];
        if (currentValue >= n && currentValue < m) {
          m = currentValue;
        }
      }

      // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
      // but guard against overflow
      handledCPCountPlusOne = handledCPCount + 1;
      if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
        error('overflow');
      }
      delta += (m - n) * handledCPCountPlusOne;
      n = m;
      for (j = 0; j < inputLength; ++j) {
        currentValue = input[j];
        if (currentValue < n && ++delta > maxInt) {
          error('overflow');
        }
        if (currentValue == n) {
          // Represent delta as a generalized variable-length integer
          for /* no condition */
          (q = delta, k = base;; k += base) {
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (q < t) {
              break;
            }
            qMinusT = q - t;
            baseMinusT = base - t;
            output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
            q = floor(qMinusT / baseMinusT);
          }
          output.push(stringFromCharCode(digitToBasic(q, 0)));
          bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
          delta = 0;
          ++handledCPCount;
        }
      }
      ++delta;
      ++n;
    }
    return output.join('');
  }

  /**
   * Converts a Punycode string representing a domain name or an email address
   * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
   * it doesn't matter if you call it on a string that has already been
   * converted to Unicode.
   * @memberOf punycode
   * @param {String} input The Punycoded domain name or email address to
   * convert to Unicode.
   * @returns {String} The Unicode representation of the given Punycode
   * string.
   */
  function toUnicode(input) {
    return mapDomain(input, function (string) {
      return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
    });
  }

  /**
   * Converts a Unicode string representing a domain name or an email address to
   * Punycode. Only the non-ASCII parts of the domain name will be converted,
   * i.e. it doesn't matter if you call it with a domain that's already in
   * ASCII.
   * @memberOf punycode
   * @param {String} input The domain name or email address to convert, as a
   * Unicode string.
   * @returns {String} The Punycode representation of the given domain name or
   * email address.
   */
  function toASCII(input) {
    return mapDomain(input, function (string) {
      return regexNonASCII.test(string) ? 'xn--' + encode(string) : string;
    });
  }

  /*--------------------------------------------------------------------------*/

  /** Define the public API */
  punycode = {
    /**
     * A string representing the current Punycode.js version number.
     * @memberOf punycode
     * @type String
     */
    'version': '1.4.1',
    /**
     * An object of methods to convert from JavaScript's internal character
     * representation (UCS-2) to Unicode code points, and back.
     * @see <https://mathiasbynens.be/notes/javascript-encoding>
     * @memberOf punycode
     * @type Object
     */
    'ucs2': {
      'decode': ucs2decode,
      'encode': ucs2encode
    },
    'decode': decode,
    'encode': encode,
    'toASCII': toASCII,
    'toUnicode': toUnicode
  };

  /** Expose `punycode` */
  // Some AMD build optimizers, like r.js, check for specific condition patterns
  // like the following:
  if ( true && _typeof(__webpack_require__(32)) == 'object' && __webpack_require__(32)) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return punycode;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (freeExports && freeModule) {
    if (module.exports == freeExports) {
      // in Node.js, io.js, or RingoJS v0.8.0+
      freeModule.exports = punycode;
    } else {
      // in Narwhal or RingoJS v0.7.0-
      for (key in punycode) {
        punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
      }
    }
  } else {
    // in Rhino or a web browser
    root.punycode = punycode;
  }
})(this);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(31)(module), __webpack_require__(13)))

/***/ }),
/* 31 */
/***/ (function(module, exports) {

module.exports = function (module) {
  if (!module.webpackPolyfill) {
    module.deprecate = function () {};
    module.paths = [];
    // module.parent = undefined by default
    if (!module.children) module.children = [];
    Object.defineProperty(module, "loaded", {
      enumerable: true,
      get: function get() {
        return module.l;
      }
    });
    Object.defineProperty(module, "id", {
      enumerable: true,
      get: function get() {
        return module.i;
      }
    });
    module.webpackPolyfill = 1;
  }
  return module;
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(this, {}))

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var stringify = __webpack_require__(34);
var parse = __webpack_require__(78);
var formats = __webpack_require__(77);
module.exports = {
  formats: formats,
  parse: parse,
  stringify: stringify
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var getSideChannel = __webpack_require__(35);
var utils = __webpack_require__(76);
var formats = __webpack_require__(77);
var has = Object.prototype.hasOwnProperty;
var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + '[]';
  },
  comma: 'comma',
  indices: function indices(prefix, key) {
    return prefix + '[' + key + ']';
  },
  repeat: function repeat(prefix) {
    return prefix;
  }
};
var isArray = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function pushToArray(arr, valueOrArray) {
  push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
};
var toISO = Date.prototype.toISOString;
var defaultFormat = formats['default'];
var defaults = {
  addQueryPrefix: false,
  allowDots: false,
  allowEmptyArrays: false,
  arrayFormat: 'indices',
  charset: 'utf-8',
  charsetSentinel: false,
  commaRoundTrip: false,
  delimiter: '&',
  encode: true,
  encodeDotInKeys: false,
  encoder: utils.encode,
  encodeValuesOnly: false,
  filter: void undefined,
  format: defaultFormat,
  formatter: formats.formatters[defaultFormat],
  // deprecated
  indices: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || _typeof(v) === 'symbol' || typeof v === 'bigint';
};
var sentinel = {};
var stringify = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
  var obj = object;
  var tmpSc = sideChannel;
  var step = 0;
  var findFlag = false;
  while ((tmpSc = tmpSc.get(sentinel)) !== void undefined && !findFlag) {
    // Where object last appeared in the ref tree
    var pos = tmpSc.get(object);
    step += 1;
    if (typeof pos !== 'undefined') {
      if (pos === step) {
        throw new RangeError('Cyclic object value');
      } else {
        findFlag = true; // Break while
      }
    }
    if (typeof tmpSc.get(sentinel) === 'undefined') {
      step = 0;
    }
  }
  if (typeof filter === 'function') {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate(obj);
  } else if (generateArrayPrefix === 'comma' && isArray(obj)) {
    obj = utils.maybeMap(obj, function (value) {
      if (value instanceof Date) {
        return serializeDate(value);
      }
      return value;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key', format) : prefix;
    }
    obj = '';
  }
  if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
    if (encoder) {
      var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key', format);
      return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value', format))];
    }
    return [formatter(prefix) + '=' + formatter(String(obj))];
  }
  var values = [];
  if (typeof obj === 'undefined') {
    return values;
  }
  var objKeys;
  if (generateArrayPrefix === 'comma' && isArray(obj)) {
    // we need to join elements in
    if (encodeValuesOnly && encoder) {
      obj = utils.maybeMap(obj, encoder);
    }
    objKeys = [{
      value: obj.length > 0 ? obj.join(',') || null : void undefined
    }];
  } else if (isArray(filter)) {
    objKeys = filter;
  } else {
    var keys = Object.keys(obj);
    objKeys = sort ? keys.sort(sort) : keys;
  }
  var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, '%2E') : String(prefix);
  var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + '[]' : encodedPrefix;
  if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
    return adjustedPrefix + '[]';
  }
  for (var j = 0; j < objKeys.length; ++j) {
    var key = objKeys[j];
    var value = _typeof(key) === 'object' && key && typeof key.value !== 'undefined' ? key.value : obj[key];
    if (skipNulls && value === null) {
      continue;
    }
    var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, '%2E') : String(key);
    var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === 'function' ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? '.' + encodedKey : '[' + encodedKey + ']');
    sideChannel.set(object, step);
    var valueSideChannel = getSideChannel();
    valueSideChannel.set(sentinel, sideChannel);
    pushToArray(values, stringify(value, keyPrefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === 'comma' && encodeValuesOnly && isArray(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel));
  }
  return values;
};
var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
  if (!opts) {
    return defaults;
  }
  if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
    throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
  }
  if (typeof opts.encodeDotInKeys !== 'undefined' && typeof opts.encodeDotInKeys !== 'boolean') {
    throw new TypeError('`encodeDotInKeys` option can only be `true` or `false`, when provided');
  }
  if (opts.encoder !== null && typeof opts.encoder !== 'undefined' && typeof opts.encoder !== 'function') {
    throw new TypeError('Encoder has to be a function.');
  }
  var charset = opts.charset || defaults.charset;
  if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
    throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
  }
  var format = formats['default'];
  if (typeof opts.format !== 'undefined') {
    if (!has.call(formats.formatters, opts.format)) {
      throw new TypeError('Unknown format option provided.');
    }
    format = opts.format;
  }
  var formatter = formats.formatters[format];
  var filter = defaults.filter;
  if (typeof opts.filter === 'function' || isArray(opts.filter)) {
    filter = opts.filter;
  }
  var arrayFormat;
  if (opts.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = opts.arrayFormat;
  } else if ('indices' in opts) {
    arrayFormat = opts.indices ? 'indices' : 'repeat';
  } else {
    arrayFormat = defaults.arrayFormat;
  }
  if ('commaRoundTrip' in opts && typeof opts.commaRoundTrip !== 'boolean') {
    throw new TypeError('`commaRoundTrip` must be a boolean, or absent');
  }
  var allowDots = typeof opts.allowDots === 'undefined' ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
    allowDots: allowDots,
    allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
    arrayFormat: arrayFormat,
    charset: charset,
    charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
    commaRoundTrip: !!opts.commaRoundTrip,
    delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
    encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
    encodeDotInKeys: typeof opts.encodeDotInKeys === 'boolean' ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
    encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
    filter: filter,
    format: format,
    formatter: formatter,
    serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
    skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
    sort: typeof opts.sort === 'function' ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
  };
};
module.exports = function (object, opts) {
  var obj = object;
  var options = normalizeStringifyOptions(opts);
  var objKeys;
  var filter;
  if (typeof options.filter === 'function') {
    filter = options.filter;
    obj = filter('', obj);
  } else if (isArray(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }
  var keys = [];
  if (_typeof(obj) !== 'object' || obj === null) {
    return '';
  }
  var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
  var commaRoundTrip = generateArrayPrefix === 'comma' && options.commaRoundTrip;
  if (!objKeys) {
    objKeys = Object.keys(obj);
  }
  if (options.sort) {
    objKeys.sort(options.sort);
  }
  var sideChannel = getSideChannel();
  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    var value = obj[key];
    if (options.skipNulls && value === null) {
      continue;
    }
    pushToArray(keys, stringify(value, key, generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel));
  }
  var joined = keys.join(options.delimiter);
  var prefix = options.addQueryPrefix === true ? '?' : '';
  if (options.charsetSentinel) {
    if (options.charset === 'iso-8859-1') {
      // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
      prefix += 'utf8=%26%2310003%3B&';
    } else {
      // encodeURIComponent('✓')
      prefix += 'utf8=%E2%9C%93&';
    }
  }
  return joined.length > 0 ? prefix + joined : '';
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $TypeError = __webpack_require__(36);
var inspect = __webpack_require__(37);
var getSideChannelList = __webpack_require__(39);
var getSideChannelMap = __webpack_require__(40);
var getSideChannelWeakMap = __webpack_require__(75);
var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;

/** @type {import('.')} */
module.exports = function getSideChannel() {
  /** @typedef {ReturnType<typeof getSideChannel>} Channel */

  /** @type {Channel | undefined} */var $channelData;

  /** @type {Channel} */
  var channel = {
    assert: function assert(key) {
      if (!channel.has(key)) {
        throw new $TypeError('Side channel does not contain ' + inspect(key));
      }
    },
    'delete': function _delete(key) {
      return !!$channelData && $channelData['delete'](key);
    },
    get: function get(key) {
      return $channelData && $channelData.get(key);
    },
    has: function has(key) {
      return !!$channelData && $channelData.has(key);
    },
    set: function set(key, value) {
      if (!$channelData) {
        $channelData = makeChannel();
      }
      $channelData.set(key, value);
    }
  };
  // @ts-expect-error TODO: figure out why this is erroring
  return channel;
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./type')} */
module.exports = TypeError;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var hasMap = typeof Map === 'function' && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === 'function' && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === 'function' && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === 'function' && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === 'function' && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === 'function' ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'symbol' ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === 'function' && _typeof(Symbol.iterator) === 'object';
// ie, `has-tostringtag/shams
var toStringTag = typeof Symbol === 'function' && Symbol.toStringTag && (_typeof(Symbol.toStringTag) === hasShammedSymbols ? 'object' : 'symbol') ? Symbol.toStringTag : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;
var gPO = (typeof Reflect === 'function' ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype // eslint-disable-line no-proto
? function (O) {
  return O.__proto__; // eslint-disable-line no-proto
} : null);
function addNumericSeparator(num, str) {
  if (num === Infinity || num === -Infinity || num !== num || num && num > -1000 && num < 1000 || $test.call(/e/, str)) {
    return str;
  }
  var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof num === 'number') {
    var _int = num < 0 ? -$floor(-num) : $floor(num); // trunc(num)
    if (_int !== num) {
      var intStr = String(_int);
      var dec = $slice.call(str, intStr.length + 1);
      return $replace.call(intStr, sepRegex, '$&_') + '.' + $replace.call($replace.call(dec, /([0-9]{3})/g, '$&_'), /_$/, '');
    }
  }
  return $replace.call(str, sepRegex, '$&_');
}
var utilInspect = __webpack_require__(38);
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
var quotes = {
  __proto__: null,
  'double': '"',
  single: "'"
};
var quoteREs = {
  __proto__: null,
  'double': /(["\\])/g,
  single: /(['\\])/g
};
module.exports = function inspect_(obj, options, depth, seen) {
  var opts = options || {};
  if (has(opts, 'quoteStyle') && !has(quotes, opts.quoteStyle)) {
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  }
  if (has(opts, 'maxStringLength') && (typeof opts.maxStringLength === 'number' ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  }
  var customInspect = has(opts, 'customInspect') ? opts.customInspect : true;
  if (typeof customInspect !== 'boolean' && customInspect !== 'symbol') {
    throw new TypeError('option "customInspect", if provided, must be `true`, `false`, or `\'symbol\'`');
  }
  if (has(opts, 'indent') && opts.indent !== null && opts.indent !== '\t' && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  }
  if (has(opts, 'numericSeparator') && typeof opts.numericSeparator !== 'boolean') {
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  }
  var numericSeparator = opts.numericSeparator;
  if (typeof obj === 'undefined') {
    return 'undefined';
  }
  if (obj === null) {
    return 'null';
  }
  if (typeof obj === 'boolean') {
    return obj ? 'true' : 'false';
  }
  if (typeof obj === 'string') {
    return inspectString(obj, opts);
  }
  if (typeof obj === 'number') {
    if (obj === 0) {
      return Infinity / obj > 0 ? '0' : '-0';
    }
    var str = String(obj);
    return numericSeparator ? addNumericSeparator(obj, str) : str;
  }
  if (typeof obj === 'bigint') {
    var bigIntStr = String(obj) + 'n';
    return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
  }
  var maxDepth = typeof opts.depth === 'undefined' ? 5 : opts.depth;
  if (typeof depth === 'undefined') {
    depth = 0;
  }
  if (depth >= maxDepth && maxDepth > 0 && _typeof(obj) === 'object') {
    return isArray(obj) ? '[Array]' : '[Object]';
  }
  var indent = getIndent(opts, depth);
  if (typeof seen === 'undefined') {
    seen = [];
  } else if (indexOf(seen, obj) >= 0) {
    return '[Circular]';
  }
  function inspect(value, from, noIndent) {
    if (from) {
      seen = $arrSlice.call(seen);
      seen.push(from);
    }
    if (noIndent) {
      var newOpts = {
        depth: opts.depth
      };
      if (has(opts, 'quoteStyle')) {
        newOpts.quoteStyle = opts.quoteStyle;
      }
      return inspect_(value, newOpts, depth + 1, seen);
    }
    return inspect_(value, opts, depth + 1, seen);
  }
  if (typeof obj === 'function' && !isRegExp(obj)) {
    // in older engines, regexes are callable
    var name = nameOf(obj);
    var keys = arrObjKeys(obj, inspect);
    return '[Function' + (name ? ': ' + name : ' (anonymous)') + ']' + (keys.length > 0 ? ' { ' + $join.call(keys, ', ') + ' }' : '');
  }
  if (isSymbol(obj)) {
    var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, '$1') : symToString.call(obj);
    return _typeof(obj) === 'object' && !hasShammedSymbols ? markBoxed(symString) : symString;
  }
  if (isElement(obj)) {
    var s = '<' + $toLowerCase.call(String(obj.nodeName));
    var attrs = obj.attributes || [];
    for (var i = 0; i < attrs.length; i++) {
      s += ' ' + attrs[i].name + '=' + wrapQuotes(quote(attrs[i].value), 'double', opts);
    }
    s += '>';
    if (obj.childNodes && obj.childNodes.length) {
      s += '...';
    }
    s += '</' + $toLowerCase.call(String(obj.nodeName)) + '>';
    return s;
  }
  if (isArray(obj)) {
    if (obj.length === 0) {
      return '[]';
    }
    var xs = arrObjKeys(obj, inspect);
    if (indent && !singleLineValues(xs)) {
      return '[' + indentedJoin(xs, indent) + ']';
    }
    return '[ ' + $join.call(xs, ', ') + ' ]';
  }
  if (isError(obj)) {
    var parts = arrObjKeys(obj, inspect);
    if (!('cause' in Error.prototype) && 'cause' in obj && !isEnumerable.call(obj, 'cause')) {
      return '{ [' + String(obj) + '] ' + $join.call($concat.call('[cause]: ' + inspect(obj.cause), parts), ', ') + ' }';
    }
    if (parts.length === 0) {
      return '[' + String(obj) + ']';
    }
    return '{ [' + String(obj) + '] ' + $join.call(parts, ', ') + ' }';
  }
  if (_typeof(obj) === 'object' && customInspect) {
    if (inspectSymbol && typeof obj[inspectSymbol] === 'function' && utilInspect) {
      return utilInspect(obj, {
        depth: maxDepth - depth
      });
    } else if (customInspect !== 'symbol' && typeof obj.inspect === 'function') {
      return obj.inspect();
    }
  }
  if (isMap(obj)) {
    var mapParts = [];
    if (mapForEach) {
      mapForEach.call(obj, function (value, key) {
        mapParts.push(inspect(key, obj, true) + ' => ' + inspect(value, obj));
      });
    }
    return collectionOf('Map', mapSize.call(obj), mapParts, indent);
  }
  if (isSet(obj)) {
    var setParts = [];
    if (setForEach) {
      setForEach.call(obj, function (value) {
        setParts.push(inspect(value, obj));
      });
    }
    return collectionOf('Set', setSize.call(obj), setParts, indent);
  }
  if (isWeakMap(obj)) {
    return weakCollectionOf('WeakMap');
  }
  if (isWeakSet(obj)) {
    return weakCollectionOf('WeakSet');
  }
  if (isWeakRef(obj)) {
    return weakCollectionOf('WeakRef');
  }
  if (isNumber(obj)) {
    return markBoxed(inspect(Number(obj)));
  }
  if (isBigInt(obj)) {
    return markBoxed(inspect(bigIntValueOf.call(obj)));
  }
  if (isBoolean(obj)) {
    return markBoxed(booleanValueOf.call(obj));
  }
  if (isString(obj)) {
    return markBoxed(inspect(String(obj)));
  }
  // note: in IE 8, sometimes `global !== window` but both are the prototypes of each other
  /* eslint-env browser */
  if (typeof window !== 'undefined' && obj === window) {
    return '{ [object Window] }';
  }
  if (typeof globalThis !== 'undefined' && obj === globalThis || typeof global !== 'undefined' && obj === global) {
    return '{ [object globalThis] }';
  }
  if (!isDate(obj) && !isRegExp(obj)) {
    var ys = arrObjKeys(obj, inspect);
    var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
    var protoTag = obj instanceof Object ? '' : 'null prototype';
    var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? 'Object' : '';
    var constructorTag = isPlainObject || typeof obj.constructor !== 'function' ? '' : obj.constructor.name ? obj.constructor.name + ' ' : '';
    var tag = constructorTag + (stringTag || protoTag ? '[' + $join.call($concat.call([], stringTag || [], protoTag || []), ': ') + '] ' : '');
    if (ys.length === 0) {
      return tag + '{}';
    }
    if (indent) {
      return tag + '{' + indentedJoin(ys, indent) + '}';
    }
    return tag + '{ ' + $join.call(ys, ', ') + ' }';
  }
  return String(obj);
};
function wrapQuotes(s, defaultStyle, opts) {
  var style = opts.quoteStyle || defaultStyle;
  var quoteChar = quotes[style];
  return quoteChar + s + quoteChar;
}
function quote(s) {
  return $replace.call(String(s), /"/g, '&quot;');
}
function canTrustToString(obj) {
  return !toStringTag || !(_typeof(obj) === 'object' && (toStringTag in obj || typeof obj[toStringTag] !== 'undefined'));
}
function isArray(obj) {
  return toStr(obj) === '[object Array]' && canTrustToString(obj);
}
function isDate(obj) {
  return toStr(obj) === '[object Date]' && canTrustToString(obj);
}
function isRegExp(obj) {
  return toStr(obj) === '[object RegExp]' && canTrustToString(obj);
}
function isError(obj) {
  return toStr(obj) === '[object Error]' && canTrustToString(obj);
}
function isString(obj) {
  return toStr(obj) === '[object String]' && canTrustToString(obj);
}
function isNumber(obj) {
  return toStr(obj) === '[object Number]' && canTrustToString(obj);
}
function isBoolean(obj) {
  return toStr(obj) === '[object Boolean]' && canTrustToString(obj);
}

// Symbol and BigInt do have Symbol.toStringTag by spec, so that can't be used to eliminate false positives
function isSymbol(obj) {
  if (hasShammedSymbols) {
    return obj && _typeof(obj) === 'object' && obj instanceof Symbol;
  }
  if (_typeof(obj) === 'symbol') {
    return true;
  }
  if (!obj || _typeof(obj) !== 'object' || !symToString) {
    return false;
  }
  try {
    symToString.call(obj);
    return true;
  } catch (e) {}
  return false;
}
function isBigInt(obj) {
  if (!obj || _typeof(obj) !== 'object' || !bigIntValueOf) {
    return false;
  }
  try {
    bigIntValueOf.call(obj);
    return true;
  } catch (e) {}
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty || function (key) {
  return key in this;
};
function has(obj, key) {
  return hasOwn.call(obj, key);
}
function toStr(obj) {
  return objectToString.call(obj);
}
function nameOf(f) {
  if (f.name) {
    return f.name;
  }
  var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
  if (m) {
    return m[1];
  }
  return null;
}
function indexOf(xs, x) {
  if (xs.indexOf) {
    return xs.indexOf(x);
  }
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) {
      return i;
    }
  }
  return -1;
}
function isMap(x) {
  if (!mapSize || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    mapSize.call(x);
    try {
      setSize.call(x);
    } catch (s) {
      return true;
    }
    return x instanceof Map; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
}
function isWeakMap(x) {
  if (!weakMapHas || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    weakMapHas.call(x, weakMapHas);
    try {
      weakSetHas.call(x, weakSetHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakMap; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
}
function isWeakRef(x) {
  if (!weakRefDeref || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    weakRefDeref.call(x);
    return true;
  } catch (e) {}
  return false;
}
function isSet(x) {
  if (!setSize || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    setSize.call(x);
    try {
      mapSize.call(x);
    } catch (m) {
      return true;
    }
    return x instanceof Set; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
}
function isWeakSet(x) {
  if (!weakSetHas || !x || _typeof(x) !== 'object') {
    return false;
  }
  try {
    weakSetHas.call(x, weakSetHas);
    try {
      weakMapHas.call(x, weakMapHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakSet; // core-js workaround, pre-v2.5.0
  } catch (e) {}
  return false;
}
function isElement(x) {
  if (!x || _typeof(x) !== 'object') {
    return false;
  }
  if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
    return true;
  }
  return typeof x.nodeName === 'string' && typeof x.getAttribute === 'function';
}
function inspectString(str, opts) {
  if (str.length > opts.maxStringLength) {
    var remaining = str.length - opts.maxStringLength;
    var trailer = '... ' + remaining + ' more character' + (remaining > 1 ? 's' : '');
    return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
  }
  var quoteRE = quoteREs[opts.quoteStyle || 'single'];
  quoteRE.lastIndex = 0;
  // eslint-disable-next-line no-control-regex
  var s = $replace.call($replace.call(str, quoteRE, '\\$1'), /[\x00-\x1f]/g, lowbyte);
  return wrapQuotes(s, 'single', opts);
}
function lowbyte(c) {
  var n = c.charCodeAt(0);
  var x = {
    8: 'b',
    9: 't',
    10: 'n',
    12: 'f',
    13: 'r'
  }[n];
  if (x) {
    return '\\' + x;
  }
  return '\\x' + (n < 0x10 ? '0' : '') + $toUpperCase.call(n.toString(16));
}
function markBoxed(str) {
  return 'Object(' + str + ')';
}
function weakCollectionOf(type) {
  return type + ' { ? }';
}
function collectionOf(type, size, entries, indent) {
  var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ', ');
  return type + ' (' + size + ') {' + joinedEntries + '}';
}
function singleLineValues(xs) {
  for (var i = 0; i < xs.length; i++) {
    if (indexOf(xs[i], '\n') >= 0) {
      return false;
    }
  }
  return true;
}
function getIndent(opts, depth) {
  var baseIndent;
  if (opts.indent === '\t') {
    baseIndent = '\t';
  } else if (typeof opts.indent === 'number' && opts.indent > 0) {
    baseIndent = $join.call(Array(opts.indent + 1), ' ');
  } else {
    return null;
  }
  return {
    base: baseIndent,
    prev: $join.call(Array(depth + 1), baseIndent)
  };
}
function indentedJoin(xs, indent) {
  if (xs.length === 0) {
    return '';
  }
  var lineJoiner = '\n' + indent.prev + indent.base;
  return lineJoiner + $join.call(xs, ',' + lineJoiner) + '\n' + indent.prev;
}
function arrObjKeys(obj, inspect) {
  var isArr = isArray(obj);
  var xs = [];
  if (isArr) {
    xs.length = obj.length;
    for (var i = 0; i < obj.length; i++) {
      xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
    }
  }
  var syms = typeof gOPS === 'function' ? gOPS(obj) : [];
  var symMap;
  if (hasShammedSymbols) {
    symMap = {};
    for (var k = 0; k < syms.length; k++) {
      symMap['$' + syms[k]] = syms[k];
    }
  }
  for (var key in obj) {
    // eslint-disable-line no-restricted-syntax
    if (!has(obj, key)) {
      continue;
    } // eslint-disable-line no-restricted-syntax, no-continue
    if (isArr && String(Number(key)) === key && key < obj.length) {
      continue;
    } // eslint-disable-line no-restricted-syntax, no-continue
    if (hasShammedSymbols && symMap['$' + key] instanceof Symbol) {
      // this is to prevent shammed Symbols, which are stored as strings, from being included in the string key section
      continue; // eslint-disable-line no-restricted-syntax, no-continue
    } else if ($test.call(/[^\w$]/, key)) {
      xs.push(inspect(key, obj) + ': ' + inspect(obj[key], obj));
    } else {
      xs.push(key + ': ' + inspect(obj[key], obj));
    }
  }
  if (typeof gOPS === 'function') {
    for (var j = 0; j < syms.length; j++) {
      if (isEnumerable.call(obj, syms[j])) {
        xs.push('[' + inspect(syms[j]) + ']: ' + inspect(obj[syms[j]], obj));
      }
    }
  }
  return xs;
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(13)))

/***/ }),
/* 38 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var inspect = __webpack_require__(37);
var $TypeError = __webpack_require__(36);

/*
* This function traverses the list returning the node corresponding to the given key.
*
* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list.
* By doing so, all the recently used nodes can be accessed relatively quickly.
*/
/** @type {import('./list.d.ts').listGetNode} */
// eslint-disable-next-line consistent-return
var listGetNode = function listGetNode(list, key, isDelete) {
  /** @type {typeof list | NonNullable<(typeof list)['next']>} */
  var prev = list;
  /** @type {(typeof list)['next']} */
  var curr;
  // eslint-disable-next-line eqeqeq
  for (; (curr = prev.next) != null; prev = curr) {
    if (curr.key === key) {
      prev.next = curr.next;
      if (!isDelete) {
        // eslint-disable-next-line no-extra-parens
        curr.next = /** @type {NonNullable<typeof list.next>} */list.next;
        list.next = curr; // eslint-disable-line no-param-reassign
      }
      return curr;
    }
  }
};

/** @type {import('./list.d.ts').listGet} */
var listGet = function listGet(objects, key) {
  if (!objects) {
    return void undefined;
  }
  var node = listGetNode(objects, key);
  return node && node.value;
};
/** @type {import('./list.d.ts').listSet} */
var listSet = function listSet(objects, key, value) {
  var node = listGetNode(objects, key);
  if (node) {
    node.value = value;
  } else {
    // Prepend the new node to the beginning of the list
    objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */{
      // eslint-disable-line no-param-reassign, no-extra-parens
      key: key,
      next: objects.next,
      value: value
    };
  }
};
/** @type {import('./list.d.ts').listHas} */
var listHas = function listHas(objects, key) {
  if (!objects) {
    return false;
  }
  return !!listGetNode(objects, key);
};
/** @type {import('./list.d.ts').listDelete} */
// eslint-disable-next-line consistent-return
var listDelete = function listDelete(objects, key) {
  if (objects) {
    return listGetNode(objects, key, true);
  }
};

/** @type {import('.')} */
module.exports = function getSideChannelList() {
  /** @typedef {ReturnType<typeof getSideChannelList>} Channel */
  /** @typedef {Parameters<Channel['get']>[0]} K */
  /** @typedef {Parameters<Channel['set']>[1]} V */

  /** @type {import('./list.d.ts').RootNode<V, K> | undefined} */var $o;

  /** @type {Channel} */
  var channel = {
    assert: function assert(key) {
      if (!channel.has(key)) {
        throw new $TypeError('Side channel does not contain ' + inspect(key));
      }
    },
    'delete': function _delete(key) {
      var root = $o && $o.next;
      var deletedNode = listDelete($o, key);
      if (deletedNode && root && root === deletedNode) {
        $o = void undefined;
      }
      return !!deletedNode;
    },
    get: function get(key) {
      return listGet($o, key);
    },
    has: function has(key) {
      return listHas($o, key);
    },
    set: function set(key, value) {
      if (!$o) {
        // Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
        $o = {
          next: void undefined
        };
      }
      // eslint-disable-next-line no-extra-parens
      listSet(/** @type {NonNullable<typeof $o>} */$o, key, value);
    }
  };
  // @ts-expect-error TODO: figure out why this is erroring
  return channel;
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(41);
var callBound = __webpack_require__(74);
var inspect = __webpack_require__(37);
var $TypeError = __webpack_require__(36);
var $Map = GetIntrinsic('%Map%', true);

/** @type {<K, V>(thisArg: Map<K, V>, key: K) => V} */
var $mapGet = callBound('Map.prototype.get', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K, value: V) => void} */
var $mapSet = callBound('Map.prototype.set', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
var $mapHas = callBound('Map.prototype.has', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
var $mapDelete = callBound('Map.prototype.delete', true);
/** @type {<K, V>(thisArg: Map<K, V>) => number} */
var $mapSize = callBound('Map.prototype.size', true);

/** @type {import('.')} */
module.exports = !!$Map && /** @type {Exclude<import('.'), false>} */function getSideChannelMap() {
  /** @typedef {ReturnType<typeof getSideChannelMap>} Channel */
  /** @typedef {Parameters<Channel['get']>[0]} K */
  /** @typedef {Parameters<Channel['set']>[1]} V */

  /** @type {Map<K, V> | undefined} */var $m;

  /** @type {Channel} */
  var channel = {
    assert: function assert(key) {
      if (!channel.has(key)) {
        throw new $TypeError('Side channel does not contain ' + inspect(key));
      }
    },
    'delete': function _delete(key) {
      if ($m) {
        var result = $mapDelete($m, key);
        if ($mapSize($m) === 0) {
          $m = void undefined;
        }
        return result;
      }
      return false;
    },
    get: function get(key) {
      // eslint-disable-line consistent-return
      if ($m) {
        return $mapGet($m, key);
      }
    },
    has: function has(key) {
      if ($m) {
        return $mapHas($m, key);
      }
      return false;
    },
    set: function set(key, value) {
      if (!$m) {
        // @ts-expect-error TS can't handle narrowing a variable inside a closure
        $m = new $Map();
      }
      $mapSet($m, key, value);
    }
  };

  // @ts-expect-error TODO: figure out why TS is erroring here
  return channel;
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var undefined;
var $Object = __webpack_require__(42);
var $Error = __webpack_require__(43);
var $EvalError = __webpack_require__(44);
var $RangeError = __webpack_require__(45);
var $ReferenceError = __webpack_require__(46);
var $SyntaxError = __webpack_require__(47);
var $TypeError = __webpack_require__(36);
var $URIError = __webpack_require__(48);
var abs = __webpack_require__(49);
var floor = __webpack_require__(50);
var max = __webpack_require__(51);
var min = __webpack_require__(52);
var pow = __webpack_require__(53);
var round = __webpack_require__(54);
var sign = __webpack_require__(55);
var $Function = Function;

// eslint-disable-next-line consistent-return
var getEvalledConstructor = function getEvalledConstructor(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ').constructor;')();
  } catch (e) {}
};
var $gOPD = __webpack_require__(57);
var $defineProperty = __webpack_require__(59);
var throwTypeError = function throwTypeError() {
  throw new $TypeError();
};
var ThrowTypeError = $gOPD ? function () {
  try {
    // eslint-disable-next-line no-unused-expressions, no-caller, no-restricted-properties
    arguments.callee; // IE 8 does not throw here
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      // IE 8 throws on Object.getOwnPropertyDescriptor(arguments, '')
      return $gOPD(arguments, 'callee').get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols = __webpack_require__(60)();
var getProto = __webpack_require__(62);
var $ObjectGPO = __webpack_require__(64);
var $ReflectGPO = __webpack_require__(63);
var $apply = __webpack_require__(71);
var $call = __webpack_require__(69);
var needsEval = {};
var TypedArray = typeof Uint8Array === 'undefined' || !getProto ? undefined : getProto(Uint8Array);
var INTRINSICS = {
  __proto__: null,
  '%AggregateError%': typeof AggregateError === 'undefined' ? undefined : AggregateError,
  '%Array%': Array,
  '%ArrayBuffer%': typeof ArrayBuffer === 'undefined' ? undefined : ArrayBuffer,
  '%ArrayIteratorPrototype%': hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
  '%AsyncFromSyncIteratorPrototype%': undefined,
  '%AsyncFunction%': needsEval,
  '%AsyncGenerator%': needsEval,
  '%AsyncGeneratorFunction%': needsEval,
  '%AsyncIteratorPrototype%': needsEval,
  '%Atomics%': typeof Atomics === 'undefined' ? undefined : Atomics,
  '%BigInt%': typeof BigInt === 'undefined' ? undefined : BigInt,
  '%BigInt64Array%': typeof BigInt64Array === 'undefined' ? undefined : BigInt64Array,
  '%BigUint64Array%': typeof BigUint64Array === 'undefined' ? undefined : BigUint64Array,
  '%Boolean%': Boolean,
  '%DataView%': typeof DataView === 'undefined' ? undefined : DataView,
  '%Date%': Date,
  '%decodeURI%': decodeURI,
  '%decodeURIComponent%': decodeURIComponent,
  '%encodeURI%': encodeURI,
  '%encodeURIComponent%': encodeURIComponent,
  '%Error%': $Error,
  '%eval%': eval,
  // eslint-disable-line no-eval
  '%EvalError%': $EvalError,
  '%Float16Array%': typeof Float16Array === 'undefined' ? undefined : Float16Array,
  '%Float32Array%': typeof Float32Array === 'undefined' ? undefined : Float32Array,
  '%Float64Array%': typeof Float64Array === 'undefined' ? undefined : Float64Array,
  '%FinalizationRegistry%': typeof FinalizationRegistry === 'undefined' ? undefined : FinalizationRegistry,
  '%Function%': $Function,
  '%GeneratorFunction%': needsEval,
  '%Int8Array%': typeof Int8Array === 'undefined' ? undefined : Int8Array,
  '%Int16Array%': typeof Int16Array === 'undefined' ? undefined : Int16Array,
  '%Int32Array%': typeof Int32Array === 'undefined' ? undefined : Int32Array,
  '%isFinite%': isFinite,
  '%isNaN%': isNaN,
  '%IteratorPrototype%': hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
  '%JSON%': (typeof JSON === "undefined" ? "undefined" : _typeof(JSON)) === 'object' ? JSON : undefined,
  '%Map%': typeof Map === 'undefined' ? undefined : Map,
  '%MapIteratorPrototype%': typeof Map === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Map()[Symbol.iterator]()),
  '%Math%': Math,
  '%Number%': Number,
  '%Object%': $Object,
  '%Object.getOwnPropertyDescriptor%': $gOPD,
  '%parseFloat%': parseFloat,
  '%parseInt%': parseInt,
  '%Promise%': typeof Promise === 'undefined' ? undefined : Promise,
  '%Proxy%': typeof Proxy === 'undefined' ? undefined : Proxy,
  '%RangeError%': $RangeError,
  '%ReferenceError%': $ReferenceError,
  '%Reflect%': typeof Reflect === 'undefined' ? undefined : Reflect,
  '%RegExp%': RegExp,
  '%Set%': typeof Set === 'undefined' ? undefined : Set,
  '%SetIteratorPrototype%': typeof Set === 'undefined' || !hasSymbols || !getProto ? undefined : getProto(new Set()[Symbol.iterator]()),
  '%SharedArrayBuffer%': typeof SharedArrayBuffer === 'undefined' ? undefined : SharedArrayBuffer,
  '%String%': String,
  '%StringIteratorPrototype%': hasSymbols && getProto ? getProto(''[Symbol.iterator]()) : undefined,
  '%Symbol%': hasSymbols ? Symbol : undefined,
  '%SyntaxError%': $SyntaxError,
  '%ThrowTypeError%': ThrowTypeError,
  '%TypedArray%': TypedArray,
  '%TypeError%': $TypeError,
  '%Uint8Array%': typeof Uint8Array === 'undefined' ? undefined : Uint8Array,
  '%Uint8ClampedArray%': typeof Uint8ClampedArray === 'undefined' ? undefined : Uint8ClampedArray,
  '%Uint16Array%': typeof Uint16Array === 'undefined' ? undefined : Uint16Array,
  '%Uint32Array%': typeof Uint32Array === 'undefined' ? undefined : Uint32Array,
  '%URIError%': $URIError,
  '%WeakMap%': typeof WeakMap === 'undefined' ? undefined : WeakMap,
  '%WeakRef%': typeof WeakRef === 'undefined' ? undefined : WeakRef,
  '%WeakSet%': typeof WeakSet === 'undefined' ? undefined : WeakSet,
  '%Function.prototype.call%': $call,
  '%Function.prototype.apply%': $apply,
  '%Object.defineProperty%': $defineProperty,
  '%Object.getPrototypeOf%': $ObjectGPO,
  '%Math.abs%': abs,
  '%Math.floor%': floor,
  '%Math.max%': max,
  '%Math.min%': min,
  '%Math.pow%': pow,
  '%Math.round%': round,
  '%Math.sign%': sign,
  '%Reflect.getPrototypeOf%': $ReflectGPO
};
if (getProto) {
  try {
    null.error; // eslint-disable-line no-unused-expressions
  } catch (e) {
    // https://github.com/tc39/proposal-shadowrealm/pull/384#issuecomment-1364264229
    var errorProto = getProto(getProto(e));
    INTRINSICS['%Error.prototype%'] = errorProto;
  }
}
var doEval = function doEval(name) {
  var value;
  if (name === '%AsyncFunction%') {
    value = getEvalledConstructor('async function () {}');
  } else if (name === '%GeneratorFunction%') {
    value = getEvalledConstructor('function* () {}');
  } else if (name === '%AsyncGeneratorFunction%') {
    value = getEvalledConstructor('async function* () {}');
  } else if (name === '%AsyncGenerator%') {
    var fn = doEval('%AsyncGeneratorFunction%');
    if (fn) {
      value = fn.prototype;
    }
  } else if (name === '%AsyncIteratorPrototype%') {
    var gen = doEval('%AsyncGenerator%');
    if (gen && getProto) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  __proto__: null,
  '%ArrayBufferPrototype%': ['ArrayBuffer', 'prototype'],
  '%ArrayPrototype%': ['Array', 'prototype'],
  '%ArrayProto_entries%': ['Array', 'prototype', 'entries'],
  '%ArrayProto_forEach%': ['Array', 'prototype', 'forEach'],
  '%ArrayProto_keys%': ['Array', 'prototype', 'keys'],
  '%ArrayProto_values%': ['Array', 'prototype', 'values'],
  '%AsyncFunctionPrototype%': ['AsyncFunction', 'prototype'],
  '%AsyncGenerator%': ['AsyncGeneratorFunction', 'prototype'],
  '%AsyncGeneratorPrototype%': ['AsyncGeneratorFunction', 'prototype', 'prototype'],
  '%BooleanPrototype%': ['Boolean', 'prototype'],
  '%DataViewPrototype%': ['DataView', 'prototype'],
  '%DatePrototype%': ['Date', 'prototype'],
  '%ErrorPrototype%': ['Error', 'prototype'],
  '%EvalErrorPrototype%': ['EvalError', 'prototype'],
  '%Float32ArrayPrototype%': ['Float32Array', 'prototype'],
  '%Float64ArrayPrototype%': ['Float64Array', 'prototype'],
  '%FunctionPrototype%': ['Function', 'prototype'],
  '%Generator%': ['GeneratorFunction', 'prototype'],
  '%GeneratorPrototype%': ['GeneratorFunction', 'prototype', 'prototype'],
  '%Int8ArrayPrototype%': ['Int8Array', 'prototype'],
  '%Int16ArrayPrototype%': ['Int16Array', 'prototype'],
  '%Int32ArrayPrototype%': ['Int32Array', 'prototype'],
  '%JSONParse%': ['JSON', 'parse'],
  '%JSONStringify%': ['JSON', 'stringify'],
  '%MapPrototype%': ['Map', 'prototype'],
  '%NumberPrototype%': ['Number', 'prototype'],
  '%ObjectPrototype%': ['Object', 'prototype'],
  '%ObjProto_toString%': ['Object', 'prototype', 'toString'],
  '%ObjProto_valueOf%': ['Object', 'prototype', 'valueOf'],
  '%PromisePrototype%': ['Promise', 'prototype'],
  '%PromiseProto_then%': ['Promise', 'prototype', 'then'],
  '%Promise_all%': ['Promise', 'all'],
  '%Promise_reject%': ['Promise', 'reject'],
  '%Promise_resolve%': ['Promise', 'resolve'],
  '%RangeErrorPrototype%': ['RangeError', 'prototype'],
  '%ReferenceErrorPrototype%': ['ReferenceError', 'prototype'],
  '%RegExpPrototype%': ['RegExp', 'prototype'],
  '%SetPrototype%': ['Set', 'prototype'],
  '%SharedArrayBufferPrototype%': ['SharedArrayBuffer', 'prototype'],
  '%StringPrototype%': ['String', 'prototype'],
  '%SymbolPrototype%': ['Symbol', 'prototype'],
  '%SyntaxErrorPrototype%': ['SyntaxError', 'prototype'],
  '%TypedArrayPrototype%': ['TypedArray', 'prototype'],
  '%TypeErrorPrototype%': ['TypeError', 'prototype'],
  '%Uint8ArrayPrototype%': ['Uint8Array', 'prototype'],
  '%Uint8ClampedArrayPrototype%': ['Uint8ClampedArray', 'prototype'],
  '%Uint16ArrayPrototype%': ['Uint16Array', 'prototype'],
  '%Uint32ArrayPrototype%': ['Uint32Array', 'prototype'],
  '%URIErrorPrototype%': ['URIError', 'prototype'],
  '%WeakMapPrototype%': ['WeakMap', 'prototype'],
  '%WeakSetPrototype%': ['WeakSet', 'prototype']
};
var bind = __webpack_require__(67);
var hasOwn = __webpack_require__(73);
var $concat = bind.call($call, Array.prototype.concat);
var $spliceApply = bind.call($apply, Array.prototype.splice);
var $replace = bind.call($call, String.prototype.replace);
var $strSlice = bind.call($call, String.prototype.slice);
var $exec = bind.call($call, RegExp.prototype.exec);

/* adapted from https://github.com/lodash/lodash/blob/4.17.15/dist/lodash.js#L6735-L6744 */
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g; /** Used to match backslashes in property paths. */
var stringToPath = function stringToPath(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === '%' && last !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected closing `%`');
  } else if (last === '%' && first !== '%') {
    throw new $SyntaxError('invalid intrinsic syntax, expected opening `%`');
  }
  var result = [];
  $replace(string, rePropName, function (match, number, quote, subString) {
    result[result.length] = quote ? $replace(subString, reEscapeChar, '$1') : number || match;
  });
  return result;
};
/* end adaptation */

var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = '%' + alias[0] + '%';
  }
  if (hasOwn(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === 'undefined' && !allowMissing) {
      throw new $TypeError('intrinsic ' + name + ' exists, but is not available. Please file an issue!');
    }
    return {
      alias: alias,
      name: intrinsicName,
      value: value
    };
  }
  throw new $SyntaxError('intrinsic ' + name + ' does not exist!');
};
module.exports = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== 'string' || name.length === 0) {
    throw new $TypeError('intrinsic name must be a non-empty string');
  }
  if (arguments.length > 1 && typeof allowMissing !== 'boolean') {
    throw new $TypeError('"allowMissing" argument must be a boolean');
  }
  if ($exec(/^%?[^%]*%?$/, name) === null) {
    throw new $SyntaxError('`%` may not be present anywhere but at the beginning and end of the intrinsic name');
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : '';
  var intrinsic = getBaseIntrinsic('%' + intrinsicBaseName + '%', allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === '`' || last === '"' || last === "'" || last === '`') && first !== last) {
      throw new $SyntaxError('property names with quotes must have matching quotes');
    }
    if (part === 'constructor' || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += '.' + part;
    intrinsicRealName = '%' + intrinsicBaseName + '%';
    if (hasOwn(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError('base intrinsic for ' + name + ' exists, but the property is not available.');
        }
        return void undefined;
      }
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc;

        // By convention, when a data property is converted to an accessor
        // property to emulate a data property that does not suffer from
        // the override mistake, that accessor's getter is marked with
        // an `originalValue` property. Here, when we detect this, we
        // uphold the illusion by pretending to see that original data
        // property, i.e., returning the value rather than the getter
        // itself.
        if (isOwn && 'get' in desc && !('originalValue' in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('.')} */
module.exports = Object;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('.')} */
module.exports = Error;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./eval')} */
module.exports = EvalError;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./range')} */
module.exports = RangeError;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./ref')} */
module.exports = ReferenceError;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./syntax')} */
module.exports = SyntaxError;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./uri')} */
module.exports = URIError;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./abs')} */
module.exports = Math.abs;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./floor')} */
module.exports = Math.floor;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./max')} */
module.exports = Math.max;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./min')} */
module.exports = Math.min;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./pow')} */
module.exports = Math.pow;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./round')} */
module.exports = Math.round;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $isNaN = __webpack_require__(56);

/** @type {import('./sign')} */
module.exports = function sign(number) {
  if ($isNaN(number) || number === 0) {
    return number;
  }
  return number < 0 ? -1 : +1;
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./isNaN')} */
module.exports = Number.isNaN || function isNaN(a) {
  return a !== a;
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('.')} */
var $gOPD = __webpack_require__(58);
if ($gOPD) {
  try {
    $gOPD([], 'length');
  } catch (e) {
    // IE 8 has a broken gOPD
    $gOPD = null;
  }
}
module.exports = $gOPD;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./gOPD')} */
module.exports = Object.getOwnPropertyDescriptor;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('.')} */
var $defineProperty = Object.defineProperty || false;
if ($defineProperty) {
  try {
    $defineProperty({}, 'a', {
      value: 1
    });
  } catch (e) {
    // IE 8 has a broken defineProperty
    $defineProperty = false;
  }
}
module.exports = $defineProperty;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var origSymbol = typeof Symbol !== 'undefined' && Symbol;
var hasSymbolSham = __webpack_require__(61);

/** @type {import('.')} */
module.exports = function hasNativeSymbols() {
  if (typeof origSymbol !== 'function') {
    return false;
  }
  if (typeof Symbol !== 'function') {
    return false;
  }
  if (_typeof(origSymbol('foo')) !== 'symbol') {
    return false;
  }
  if (_typeof(Symbol('bar')) !== 'symbol') {
    return false;
  }
  return hasSymbolSham();
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./shams')} */
/* eslint complexity: [2, 18], max-statements: [2, 33] */
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
module.exports = function hasSymbols() {
  if (typeof Symbol !== 'function' || typeof Object.getOwnPropertySymbols !== 'function') {
    return false;
  }
  if (_typeof(Symbol.iterator) === 'symbol') {
    return true;
  }

  /** @type {{ [k in symbol]?: unknown }} */
  var obj = {};
  var sym = Symbol('test');
  var symObj = Object(sym);
  if (typeof sym === 'string') {
    return false;
  }
  if (Object.prototype.toString.call(sym) !== '[object Symbol]') {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== '[object Symbol]') {
    return false;
  }

  // temp disabled per https://github.com/ljharb/object.assign/issues/17
  // if (sym instanceof Symbol) { return false; }
  // temp disabled per https://github.com/WebReflection/get-own-property-symbols/issues/4
  // if (!(symObj instanceof Symbol)) { return false; }

  // if (typeof Symbol.prototype.toString !== 'function') { return false; }
  // if (String(sym) !== Symbol.prototype.toString.call(sym)) { return false; }

  var symVal = 42;
  obj[sym] = symVal;
  for (var _ in obj) {
    return false;
  } // eslint-disable-line no-restricted-syntax, no-unreachable-loop
  if (typeof Object.keys === 'function' && Object.keys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === 'function' && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }
  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }
  if (typeof Object.getOwnPropertyDescriptor === 'function') {
    // eslint-disable-next-line no-extra-parens
    var descriptor = /** @type {PropertyDescriptor} */Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }
  return true;
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var reflectGetProto = __webpack_require__(63);
var originalGetProto = __webpack_require__(64);
var getDunderProto = __webpack_require__(65);

/** @type {import('.')} */
module.exports = reflectGetProto ? function getProto(O) {
  // @ts-expect-error TS can't narrow inside a closure, for some reason
  return reflectGetProto(O);
} : originalGetProto ? function getProto(O) {
  if (!O || _typeof(O) !== 'object' && typeof O !== 'function') {
    throw new TypeError('getProto: not an object');
  }
  // @ts-expect-error TS can't narrow inside a closure, for some reason
  return originalGetProto(O);
} : getDunderProto ? function getProto(O) {
  // @ts-expect-error TS can't narrow inside a closure, for some reason
  return getDunderProto(O);
} : null;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./Reflect.getPrototypeOf')} */
module.exports = typeof Reflect !== 'undefined' && Reflect.getPrototypeOf || null;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var $Object = __webpack_require__(42);

/** @type {import('./Object.getPrototypeOf')} */
module.exports = $Object.getPrototypeOf || null;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var callBind = __webpack_require__(66);
var gOPD = __webpack_require__(57);
var hasProtoAccessor;
try {
  // eslint-disable-next-line no-extra-parens, no-proto
  hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */[].__proto__ === Array.prototype;
} catch (e) {
  if (!e || _typeof(e) !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {
    throw e;
  }
}

// eslint-disable-next-line no-extra-parens
var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, /** @type {keyof typeof Object.prototype} */'__proto__');
var $Object = Object;
var $getPrototypeOf = $Object.getPrototypeOf;

/** @type {import('./get')} */
module.exports = desc && typeof desc.get === 'function' ? callBind([desc.get]) : typeof $getPrototypeOf === 'function' ? /** @type {import('./get')} */function getDunder(value) {
  // eslint-disable-next-line eqeqeq
  return $getPrototypeOf(value == null ? value : $Object(value));
} : false;

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(67);
var $TypeError = __webpack_require__(36);
var $call = __webpack_require__(69);
var $actualApply = __webpack_require__(70);

/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
module.exports = function callBindBasic(args) {
  if (args.length < 1 || typeof args[0] !== 'function') {
    throw new $TypeError('a function is required');
  }
  return $actualApply(bind, $call, args);
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var implementation = __webpack_require__(68);
module.exports = Function.prototype.bind || implementation;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint no-invalid-this: 1 */
var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
var toStr = Object.prototype.toString;
var max = Math.max;
var funcType = '[object Function]';
var concatty = function concatty(a, b) {
  var arr = [];
  for (var i = 0; i < a.length; i += 1) {
    arr[i] = a[i];
  }
  for (var j = 0; j < b.length; j += 1) {
    arr[j + a.length] = b[j];
  }
  return arr;
};
var slicy = function slicy(arrLike, offset) {
  var arr = [];
  for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
    arr[j] = arrLike[i];
  }
  return arr;
};
var joiny = function joiny(arr, joiner) {
  var str = '';
  for (var i = 0; i < arr.length; i += 1) {
    str += arr[i];
    if (i + 1 < arr.length) {
      str += joiner;
    }
  }
  return str;
};
module.exports = function bind(that) {
  var target = this;
  if (typeof target !== 'function' || toStr.apply(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }
  var args = slicy(arguments, 1);
  var bound;
  var binder = function binder() {
    if (this instanceof bound) {
      var result = target.apply(this, concatty(args, arguments));
      if (Object(result) === result) {
        return result;
      }
      return this;
    }
    return target.apply(that, concatty(args, arguments));
  };
  var boundLength = max(0, target.length - args.length);
  var boundArgs = [];
  for (var i = 0; i < boundLength; i++) {
    boundArgs[i] = '$' + i;
  }
  bound = Function('binder', 'return function (' + joiny(boundArgs, ',') + '){ return binder.apply(this,arguments); }')(binder);
  if (target.prototype) {
    var Empty = function Empty() {};
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound;
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./functionCall')} */
module.exports = Function.prototype.call;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(67);
var $apply = __webpack_require__(71);
var $call = __webpack_require__(69);
var $reflectApply = __webpack_require__(72);

/** @type {import('./actualApply')} */
module.exports = $reflectApply || bind.call($call, $apply);

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./functionApply')} */
module.exports = Function.prototype.apply;

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/** @type {import('./reflectApply')} */
module.exports = typeof Reflect !== 'undefined' && Reflect && Reflect.apply;

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var call = Function.prototype.call;
var $hasOwn = Object.prototype.hasOwnProperty;
var bind = __webpack_require__(67);

/** @type {import('.')} */
module.exports = bind.call(call, $hasOwn);

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var GetIntrinsic = __webpack_require__(41);
var callBindBasic = __webpack_require__(66);

/** @type {(thisArg: string, searchString: string, position?: number) => number} */
var $indexOf = callBindBasic([GetIntrinsic('%String.prototype.indexOf%')]);

/** @type {import('.')} */
module.exports = function callBoundIntrinsic(name, allowMissing) {
  /* eslint no-extra-parens: 0 */

  var intrinsic = /** @type {(this: unknown, ...args: unknown[]) => unknown} */GetIntrinsic(name, !!allowMissing);
  if (typeof intrinsic === 'function' && $indexOf(name, '.prototype.') > -1) {
    return callBindBasic(/** @type {const} */[intrinsic]);
  }
  return intrinsic;
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var GetIntrinsic = __webpack_require__(41);
var callBound = __webpack_require__(74);
var inspect = __webpack_require__(37);
var getSideChannelMap = __webpack_require__(40);
var $TypeError = __webpack_require__(36);
var $WeakMap = GetIntrinsic('%WeakMap%', true);

/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => V} */
var $weakMapGet = callBound('WeakMap.prototype.get', true);
/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K, value: V) => void} */
var $weakMapSet = callBound('WeakMap.prototype.set', true);
/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
var $weakMapHas = callBound('WeakMap.prototype.has', true);
/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
var $weakMapDelete = callBound('WeakMap.prototype.delete', true);

/** @type {import('.')} */
module.exports = $WeakMap ? /** @type {Exclude<import('.'), false>} */function getSideChannelWeakMap() {
  /** @typedef {ReturnType<typeof getSideChannelWeakMap>} Channel */
  /** @typedef {Parameters<Channel['get']>[0]} K */
  /** @typedef {Parameters<Channel['set']>[1]} V */

  /** @type {WeakMap<K & object, V> | undefined} */var $wm;
  /** @type {Channel | undefined} */
  var $m;

  /** @type {Channel} */
  var channel = {
    assert: function assert(key) {
      if (!channel.has(key)) {
        throw new $TypeError('Side channel does not contain ' + inspect(key));
      }
    },
    'delete': function _delete(key) {
      if ($WeakMap && key && (_typeof(key) === 'object' || typeof key === 'function')) {
        if ($wm) {
          return $weakMapDelete($wm, key);
        }
      } else if (getSideChannelMap) {
        if ($m) {
          return $m['delete'](key);
        }
      }
      return false;
    },
    get: function get(key) {
      if ($WeakMap && key && (_typeof(key) === 'object' || typeof key === 'function')) {
        if ($wm) {
          return $weakMapGet($wm, key);
        }
      }
      return $m && $m.get(key);
    },
    has: function has(key) {
      if ($WeakMap && key && (_typeof(key) === 'object' || typeof key === 'function')) {
        if ($wm) {
          return $weakMapHas($wm, key);
        }
      }
      return !!$m && $m.has(key);
    },
    set: function set(key, value) {
      if ($WeakMap && key && (_typeof(key) === 'object' || typeof key === 'function')) {
        if (!$wm) {
          $wm = new $WeakMap();
        }
        $weakMapSet($wm, key, value);
      } else if (getSideChannelMap) {
        if (!$m) {
          $m = getSideChannelMap();
        }
        // eslint-disable-next-line no-extra-parens
        /** @type {NonNullable<typeof $m>} */
        $m.set(key, value);
      }
    }
  };

  // @ts-expect-error TODO: figure out why this is erroring
  return channel;
} : getSideChannelMap;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var formats = __webpack_require__(77);
var getSideChannel = __webpack_require__(35);
var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

// Track objects created from arrayLimit overflow using side-channel
// Stores the current max numeric index for O(1) lookup
var overflowChannel = getSideChannel();
var markOverflow = function markOverflow(obj, maxIndex) {
  overflowChannel.set(obj, maxIndex);
  return obj;
};
var isOverflow = function isOverflow(obj) {
  return overflowChannel.has(obj);
};
var getMaxIndex = function getMaxIndex(obj) {
  return overflowChannel.get(obj);
};
var setMaxIndex = function setMaxIndex(obj, maxIndex) {
  overflowChannel.set(obj, maxIndex);
};
var hexTable = function () {
  var array = [];
  for (var i = 0; i < 256; ++i) {
    array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
  }
  return array;
}();
var compactQueue = function compactQueue(queue) {
  while (queue.length > 1) {
    var item = queue.pop();
    var obj = item.obj[item.prop];
    if (isArray(obj)) {
      var compacted = [];
      for (var j = 0; j < obj.length; ++j) {
        if (typeof obj[j] !== 'undefined') {
          compacted.push(obj[j]);
        }
      }
      item.obj[item.prop] = compacted;
    }
  }
};
var arrayToObject = function arrayToObject(source, options) {
  var obj = options && options.plainObjects ? {
    __proto__: null
  } : {};
  for (var i = 0; i < source.length; ++i) {
    if (typeof source[i] !== 'undefined') {
      obj[i] = source[i];
    }
  }
  return obj;
};
var merge = function merge(target, source, options) {
  /* eslint no-param-reassign: 0 */
  if (!source) {
    return target;
  }
  if (_typeof(source) !== 'object' && typeof source !== 'function') {
    if (isArray(target)) {
      target.push(source);
    } else if (target && _typeof(target) === 'object') {
      if (isOverflow(target)) {
        // Add at next numeric index for overflow objects
        var newIndex = getMaxIndex(target) + 1;
        target[newIndex] = source;
        setMaxIndex(target, newIndex);
      } else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }
    return target;
  }
  if (!target || _typeof(target) !== 'object') {
    if (isOverflow(source)) {
      // Create new object with target at 0, source values shifted by 1
      var sourceKeys = Object.keys(source);
      var result = options && options.plainObjects ? {
        __proto__: null,
        0: target
      } : {
        0: target
      };
      for (var m = 0; m < sourceKeys.length; m++) {
        var oldKey = parseInt(sourceKeys[m], 10);
        result[oldKey + 1] = source[sourceKeys[m]];
      }
      return markOverflow(result, getMaxIndex(source) + 1);
    }
    return [target].concat(source);
  }
  var mergeTarget = target;
  if (isArray(target) && !isArray(source)) {
    mergeTarget = arrayToObject(target, options);
  }
  if (isArray(target) && isArray(source)) {
    source.forEach(function (item, i) {
      if (has.call(target, i)) {
        var targetItem = target[i];
        if (targetItem && _typeof(targetItem) === 'object' && item && _typeof(item) === 'object') {
          target[i] = merge(targetItem, item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }
  return Object.keys(source).reduce(function (acc, key) {
    var value = source[key];
    if (has.call(acc, key)) {
      acc[key] = merge(acc[key], value, options);
    } else {
      acc[key] = value;
    }
    return acc;
  }, mergeTarget);
};
var assign = function assignSingleSource(target, source) {
  return Object.keys(source).reduce(function (acc, key) {
    acc[key] = source[key];
    return acc;
  }, target);
};
var decode = function decode(str, defaultDecoder, charset) {
  var strWithoutPlus = str.replace(/\+/g, ' ');
  if (charset === 'iso-8859-1') {
    // unescape never throws, no try...catch needed:
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }
  // utf-8
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};
var limit = 1024;

/* eslint operator-linebreak: [2, "before"] */

var encode = function encode(str, defaultEncoder, charset, kind, format) {
  // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
  // It has been adapted here for stricter adherence to RFC 3986
  if (str.length === 0) {
    return str;
  }
  var string = str;
  if (_typeof(str) === 'symbol') {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== 'string') {
    string = String(str);
  }
  if (charset === 'iso-8859-1') {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
      return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
    });
  }
  var out = '';
  for (var j = 0; j < string.length; j += limit) {
    var segment = string.length >= limit ? string.slice(j, j + limit) : string;
    var arr = [];
    for (var i = 0; i < segment.length; ++i) {
      var c = segment.charCodeAt(i);
      if (c === 0x2D // -
      || c === 0x2E // .
      || c === 0x5F // _
      || c === 0x7E // ~
      || c >= 0x30 && c <= 0x39 // 0-9
      || c >= 0x41 && c <= 0x5A // a-z
      || c >= 0x61 && c <= 0x7A // A-Z
      || format === formats.RFC1738 && (c === 0x28 || c === 0x29) // ( )
      ) {
        arr[arr.length] = segment.charAt(i);
        continue;
      }
      if (c < 0x80) {
        arr[arr.length] = hexTable[c];
        continue;
      }
      if (c < 0x800) {
        arr[arr.length] = hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F];
        continue;
      }
      if (c < 0xD800 || c >= 0xE000) {
        arr[arr.length] = hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
        continue;
      }
      i += 1;
      c = 0x10000 + ((c & 0x3FF) << 10 | segment.charCodeAt(i) & 0x3FF);
      arr[arr.length] = hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
    }
    out += arr.join('');
  }
  return out;
};
var compact = function compact(value) {
  var queue = [{
    obj: {
      o: value
    },
    prop: 'o'
  }];
  var refs = [];
  for (var i = 0; i < queue.length; ++i) {
    var item = queue[i];
    var obj = item.obj[item.prop];
    var keys = Object.keys(obj);
    for (var j = 0; j < keys.length; ++j) {
      var key = keys[j];
      var val = obj[key];
      if (_typeof(val) === 'object' && val !== null && refs.indexOf(val) === -1) {
        queue.push({
          obj: obj,
          prop: key
        });
        refs.push(val);
      }
    }
  }
  compactQueue(queue);
  return value;
};
var isRegExp = function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
};
var isBuffer = function isBuffer(obj) {
  if (!obj || _typeof(obj) !== 'object') {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
var combine = function combine(a, b, arrayLimit, plainObjects) {
  // If 'a' is already an overflow object, add to it
  if (isOverflow(a)) {
    var newIndex = getMaxIndex(a) + 1;
    a[newIndex] = b;
    setMaxIndex(a, newIndex);
    return a;
  }
  var result = [].concat(a, b);
  if (result.length > arrayLimit) {
    return markOverflow(arrayToObject(result, {
      plainObjects: plainObjects
    }), result.length - 1);
  }
  return result;
};
var maybeMap = function maybeMap(val, fn) {
  if (isArray(val)) {
    var mapped = [];
    for (var i = 0; i < val.length; i += 1) {
      mapped.push(fn(val[i]));
    }
    return mapped;
  }
  return fn(val);
};
module.exports = {
  arrayToObject: arrayToObject,
  assign: assign,
  combine: combine,
  compact: compact,
  decode: decode,
  encode: encode,
  isBuffer: isBuffer,
  isOverflow: isOverflow,
  isRegExp: isRegExp,
  maybeMap: maybeMap,
  merge: merge
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var replace = String.prototype.replace;
var percentTwenties = /%20/g;
var Format = {
  RFC1738: 'RFC1738',
  RFC3986: 'RFC3986'
};
module.exports = {
  'default': Format.RFC3986,
  formatters: {
    RFC1738: function RFC1738(value) {
      return replace.call(value, percentTwenties, '+');
    },
    RFC3986: function RFC3986(value) {
      return String(value);
    }
  },
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(76);
var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var defaults = {
  allowDots: false,
  allowEmptyArrays: false,
  allowPrototypes: false,
  allowSparse: false,
  arrayLimit: 20,
  charset: 'utf-8',
  charsetSentinel: false,
  comma: false,
  decodeDotInKeys: false,
  decoder: utils.decode,
  delimiter: '&',
  depth: 5,
  duplicates: 'combine',
  ignoreQueryPrefix: false,
  interpretNumericEntities: false,
  parameterLimit: 1000,
  parseArrays: true,
  plainObjects: false,
  strictDepth: false,
  strictNullHandling: false,
  throwOnLimitExceeded: false
};
var interpretNumericEntities = function interpretNumericEntities(str) {
  return str.replace(/&#(\d+);/g, function ($0, numberStr) {
    return String.fromCharCode(parseInt(numberStr, 10));
  });
};
var parseArrayValue = function parseArrayValue(val, options, currentArrayLength) {
  if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
    return val.split(',');
  }
  if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
    throw new RangeError('Array limit exceeded. Only ' + options.arrayLimit + ' element' + (options.arrayLimit === 1 ? '' : 's') + ' allowed in an array.');
  }
  return val;
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
  var obj = {
    __proto__: null
  };
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
  cleanStr = cleanStr.replace(/%5B/gi, '[').replace(/%5D/gi, ']');
  var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, options.throwOnLimitExceeded ? limit + 1 : limit);
  if (options.throwOnLimitExceeded && parts.length > limit) {
    throw new RangeError('Parameter limit exceeded. Only ' + limit + ' parameter' + (limit === 1 ? '' : 's') + ' allowed.');
  }
  var skipIndex = -1; // Keep track of where the utf8 sentinel was found
  var i;
  var charset = options.charset;
  if (options.charsetSentinel) {
    for (i = 0; i < parts.length; ++i) {
      if (parts[i].indexOf('utf8=') === 0) {
        if (parts[i] === charsetSentinel) {
          charset = 'utf-8';
        } else if (parts[i] === isoSentinel) {
          charset = 'iso-8859-1';
        }
        skipIndex = i;
        i = parts.length; // The eslint settings do not allow break;
      }
    }
  }
  for (i = 0; i < parts.length; ++i) {
    if (i === skipIndex) {
      continue;
    }
    var part = parts[i];
    var bracketEqualsPos = part.indexOf(']=');
    var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;
    var key;
    var val;
    if (pos === -1) {
      key = options.decoder(part, defaults.decoder, charset, 'key');
      val = options.strictNullHandling ? null : '';
    } else {
      key = options.decoder(part.slice(0, pos), defaults.decoder, charset, 'key');
      if (key !== null) {
        val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options, isArray(obj[key]) ? obj[key].length : 0), function (encodedVal) {
          return options.decoder(encodedVal, defaults.decoder, charset, 'value');
        });
      }
    }
    if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
      val = interpretNumericEntities(String(val));
    }
    if (part.indexOf('[]=') > -1) {
      val = isArray(val) ? [val] : val;
    }
    if (key !== null) {
      var existing = has.call(obj, key);
      if (existing && options.duplicates === 'combine') {
        obj[key] = utils.combine(obj[key], val, options.arrayLimit, options.plainObjects);
      } else if (!existing || options.duplicates === 'last') {
        obj[key] = val;
      }
    }
  }
  return obj;
};
var parseObject = function parseObject(chain, val, options, valuesParsed) {
  var currentArrayLength = 0;
  if (chain.length > 0 && chain[chain.length - 1] === '[]') {
    var parentKey = chain.slice(0, -1).join('');
    currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
  }
  var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];
    if (root === '[]' && options.parseArrays) {
      if (utils.isOverflow(leaf)) {
        // leaf is already an overflow object, preserve it
        obj = leaf;
      } else {
        obj = options.allowEmptyArrays && (leaf === '' || options.strictNullHandling && leaf === null) ? [] : utils.combine([], leaf, options.arrayLimit, options.plainObjects);
      }
    } else {
      obj = options.plainObjects ? {
        __proto__: null
      } : {};
      var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
      var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, '.') : cleanRoot;
      var index = parseInt(decodedRoot, 10);
      if (!options.parseArrays && decodedRoot === '') {
        obj = {
          0: leaf
        };
      } else if (!isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
        obj = [];
        obj[index] = leaf;
      } else if (decodedRoot !== '__proto__') {
        obj[decodedRoot] = leaf;
      }
    }
    leaf = obj;
  }
  return leaf;
};
var splitKeyIntoSegments = function splitKeyIntoSegments(givenKey, options) {
  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;
  if (options.depth <= 0) {
    if (!options.plainObjects && has.call(Object.prototype, key)) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    return [key];
  }
  var brackets = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g;
  var segment = brackets.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key;
  var keys = [];
  if (parent) {
    if (!options.plainObjects && has.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(parent);
  }
  var i = 0;
  while ((segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;
    var segmentContent = segment[1].slice(1, -1);
    if (!options.plainObjects && has.call(Object.prototype, segmentContent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys.push(segment[1]);
  }
  if (segment) {
    if (options.strictDepth === true) {
      throw new RangeError('Input depth exceeded depth option of ' + options.depth + ' and strictDepth is true');
    }
    keys.push('[' + key.slice(segment.index) + ']');
  }
  return keys;
};
var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
  if (!givenKey) {
    return;
  }
  var keys = splitKeyIntoSegments(givenKey, options);
  if (!keys) {
    return;
  }
  return parseObject(keys, val, options, valuesParsed);
};
var normalizeParseOptions = function normalizeParseOptions(opts) {
  if (!opts) {
    return defaults;
  }
  if (typeof opts.allowEmptyArrays !== 'undefined' && typeof opts.allowEmptyArrays !== 'boolean') {
    throw new TypeError('`allowEmptyArrays` option can only be `true` or `false`, when provided');
  }
  if (typeof opts.decodeDotInKeys !== 'undefined' && typeof opts.decodeDotInKeys !== 'boolean') {
    throw new TypeError('`decodeDotInKeys` option can only be `true` or `false`, when provided');
  }
  if (opts.decoder !== null && typeof opts.decoder !== 'undefined' && typeof opts.decoder !== 'function') {
    throw new TypeError('Decoder has to be a function.');
  }
  if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
    throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
  }
  if (typeof opts.throwOnLimitExceeded !== 'undefined' && typeof opts.throwOnLimitExceeded !== 'boolean') {
    throw new TypeError('`throwOnLimitExceeded` option must be a boolean');
  }
  var charset = typeof opts.charset === 'undefined' ? defaults.charset : opts.charset;
  var duplicates = typeof opts.duplicates === 'undefined' ? defaults.duplicates : opts.duplicates;
  if (duplicates !== 'combine' && duplicates !== 'first' && duplicates !== 'last') {
    throw new TypeError('The duplicates option must be either combine, first, or last');
  }
  var allowDots = typeof opts.allowDots === 'undefined' ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
  return {
    allowDots: allowDots,
    allowEmptyArrays: typeof opts.allowEmptyArrays === 'boolean' ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
    allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults.allowPrototypes,
    allowSparse: typeof opts.allowSparse === 'boolean' ? opts.allowSparse : defaults.allowSparse,
    arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults.arrayLimit,
    charset: charset,
    charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
    comma: typeof opts.comma === 'boolean' ? opts.comma : defaults.comma,
    decodeDotInKeys: typeof opts.decodeDotInKeys === 'boolean' ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
    decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults.decoder,
    delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
    // eslint-disable-next-line no-implicit-coercion, no-extra-parens
    depth: typeof opts.depth === 'number' || opts.depth === false ? +opts.depth : defaults.depth,
    duplicates: duplicates,
    ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
    interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
    parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults.parameterLimit,
    parseArrays: opts.parseArrays !== false,
    plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults.plainObjects,
    strictDepth: typeof opts.strictDepth === 'boolean' ? !!opts.strictDepth : defaults.strictDepth,
    strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling,
    throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === 'boolean' ? opts.throwOnLimitExceeded : false
  };
};
module.exports = function (str, opts) {
  var options = normalizeParseOptions(opts);
  if (str === '' || str === null || typeof str === 'undefined') {
    return options.plainObjects ? {
      __proto__: null
    } : {};
  }
  var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
  var obj = options.plainObjects ? {
    __proto__: null
  } : {};

  // Iterate over the keys and setup the new object

  var keys = Object.keys(tempObj);
  for (var i = 0; i < keys.length; ++i) {
    var key = keys[i];
    var newObj = parseKeys(key, tempObj[key], options, typeof str === 'string');
    obj = utils.merge(obj, newObj, options);
  }
  if (options.allowSparse === true) {
    return obj;
  }
  return utils.compact(obj);
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return document.currentScript.getAttribute('src');
  } // Fall back to getting all scripts in the document.

  var scriptElements = document.scripts || [];
  var currentScript = scriptElements[scriptElements.length - 1];
  if (currentScript) {
    return currentScript.getAttribute('src');
  } // Fail as there was no script to use.

  throw new Error('[WDS] Failed to get current script source.');
}
module.exports = getCurrentScriptSource;

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./log": 81
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 80;

/***/ }),
/* 81 */
/***/ (function(module, exports) {

var logLevel = "info";
function dummy() {}
function shouldLog(level) {
  var shouldLog = logLevel === "info" && level === "info" || ["info", "warning"].indexOf(logLevel) >= 0 && level === "warning" || ["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error";
  return shouldLog;
}
function logGroup(logFn) {
  return function (level, msg) {
    if (shouldLog(level)) {
      logFn(msg);
    }
  };
}
module.exports = function (level, msg) {
  if (shouldLog(level)) {
    if (level === "info") {
      console.log(msg);
    } else if (level === "warning") {
      console.warn(msg);
    } else if (level === "error") {
      console.error(msg);
    }
  }
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);
module.exports.groupCollapsed = logGroup(groupCollapsed);
module.exports.groupEnd = logGroup(groupEnd);
module.exports.setLogLevel = function (level) {
  logLevel = level;
};
module.exports.formatError = function (err) {
  var message = err.message;
  var stack = err.stack;
  if (!stack) {
    return message;
  } else if (stack.indexOf(message) < 0) {
    return message + "\n" + stack;
  } else {
    return stack;
  }
};

/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wex_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "component", function() { return _wex_js__WEBPACK_IMPORTED_MODULE_0__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "directive", function() { return _wex_js__WEBPACK_IMPORTED_MODULE_0__["c"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return _wex_js__WEBPACK_IMPORTED_MODULE_0__["d"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "View", function() { return _wex_js__WEBPACK_IMPORTED_MODULE_0__["a"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "useJQuery", function() { return _wex_js__WEBPACK_IMPORTED_MODULE_0__["e"]; });

/* harmony import */ var _shared_state_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(91);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "shareState", function() { return _shared_state_js__WEBPACK_IMPORTED_MODULE_1__["a"]; });

/* harmony import */ var _async_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createAsyncComponent", function() { return _async_js__WEBPACK_IMPORTED_MODULE_2__["a"]; });

/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(96);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createRouter", function() { return _router_js__WEBPACK_IMPORTED_MODULE_3__["a"]; });

/* harmony import */ var _wire__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(97);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "createWire", function() { return _wire__WEBPACK_IMPORTED_MODULE_4__["b"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "$wire", function() { return _wire__WEBPACK_IMPORTED_MODULE_4__["a"]; });







// use in browser
if (typeof jQuery !== 'undefined') {
  Object(_wex_js__WEBPACK_IMPORTED_MODULE_0__[/* useJQuery */ "e"])(jQuery);
}

if (typeof window !== 'undefined') {
  window.$wire = _wire__WEBPACK_IMPORTED_MODULE_4__[/* $wire */ "a"];
}

/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return View; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return directive; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return filter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return useJQuery; });
/* harmony import */ var scopex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);
/* harmony import */ var scopex__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scopex__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ts_fns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(87);
/* harmony import */ var ts_fns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(88);
/* harmony import */ var ts_fns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(86);
/* harmony import */ var ts_fns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(92);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(85);
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(93);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }




var vmId = 0;
var $ = null;
function View() {}
var SYMBOL = {};

// ---------------

var globalComponents = [];
var globalDirectives = [];
var globalFilters = {};

// bigger priority come first
function _push(list, name, compile, affect) {
  var priority = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i];
    if (item[0] === name) {
      list[i] = [name, compile, affect, priority];
      return;
    }
    if (item[3] < priority) {
      list.splice(i - 1, [name, compile, affect, priority]);
      return;
    }
  }
  list.push([name, compile, affect, priority]);
}
function component(name, compile, affect) {
  _push(globalComponents, name, compile, affect);
}
function directive(name, compile, affect, priority) {
  _push(globalDirectives, name, compile, affect, priority);
}
function filter(name, fn) {
  globalFilters[name] = fn;
}

// ----------- compiler ---------------

// clear and revoke effects
function prepare($root) {
  var root = $root[0];
  var records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || [];
  if (!records.length) {
    return;
  }
  records.forEach(function (record) {
    // reset effects
    if (record.revoke) {
      record.revoke();
    }
  });

  // clear
  records.length = 0;
}
function compile($root, components, directives, state, view, _ref) {
  var _ref2 = _slicedToArray(_ref, 3),
    template = _ref2[0],
    scope = _ref2[1],
    isolate = _ref2[2];
  var root = $root[0];
  var records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || [];
  var $element = $("<div />").html(template);
  var _interpolate = function interpolate($element) {
    var scp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scope;
    $element.each(function () {
      var attrs = _toConsumableArray(this.attributes);
      var $this = $(this);
      attrs.forEach(function (_ref3) {
        var name = _ref3.name,
          value = _ref3.value;
        // HTML standard not allow @attr
        if (name.indexOf('@') === 0) {
          return;
        }
        var text = scp.interpolate(value);
        $this.attr(name, text);
      });
      var children = _toConsumableArray(this.childNodes);
      children.forEach(function (child) {
        if (child.nodeName === '#text') {
          child.textContent = scp.interpolate(child.textContent);
        } else if (child.nodeName.indexOf('#') !== 0) {
          _interpolate($(child), scp);
        }
      });
    });
  };
  var instances = root.__jQvmComponentInstances = root.__jQvmComponentInstances || [];
  var createIterator = function createIterator(onCompile, onAffect) {
    return function (index) {
      var el = this;
      var $el = $(el);
      var attrs = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeAttrs */ "c"])(this);
      var name = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeName */ "d"])(this);
      var els = [el];
      var inner = $el.html();
      var slot = function slot(locals) {
        var $root = $('<div />');
        var subScope = locals ? locals instanceof scopex__WEBPACK_IMPORTED_MODULE_0__["ScopeX"] ? scope.$new(locals.data) : scope.$new(locals) : scope;
        var nodes = compile($root, components, directives, state, view, [inner, subScope]);
        affect($root, scope, view);
        return nodes;
      };
      slot.template = inner;
      slot.nodes = _toConsumableArray(el.childNodes);
      var record = {
        affect: onAffect,
        attrs: attrs,
        els: els,
        slot: slot,
        scope: scope
      };
      var useComponent = function useComponent(view) {
        var instance = instances.find(function (item) {
          return item.name === name && item.index === index;
        });
        if (!instance) {
          var _component = view.clone();
          instance = {
            name: name,
            index: index,
            component: _component
          };
          instances.push(instance);
        }
        var _instance = instance,
          component = _instance.component;
        record.component = component;
        record.name = name;
        record.state = state;

        // replace component tag
        if (component.tag !== 'template') {
          var tag = component.tag,
            attributes = component.attributes;
          var $tag = $("<".concat(tag, " />"));
          var attrsText = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* createAttrsText */ "b"])(attrs);
          var $commentBegin = $("<!-- ".concat(name, " ").concat(attrsText, " begin -->"));
          var $commentEnd = $("<!-- ".concat(name, " ").concat(attrsText, " end -->"));
          Object.assign(attrs, attributes, _defineProperty({}, 'data-hoist', name));
          $tag.attr(attrs);
          $el.replaceWith([$commentBegin, $tag, $commentEnd]);
          els.length = 0;
          els.push($commentBegin[0], $tag[0], $commentEnd[0]);
        } else {
          $el.empty(); // clear inner content, which has been recorded into record.slot
        }
      };

      // register a view as component
      if (onCompile instanceof View) {
        useComponent(onCompile);
      } else if (typeof onCompile === 'function') {
        // developers can recompile inside fn
        var boundCompile = compile.bind(null, $root, components, directives, state, view);
        var ctx = {
          scope: scope,
          view: view,
          compile: function compile(temp) {
            var scp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scope;
            return boundCompile([temp, scp]);
          },
          interpolate: _interpolate
        };
        var output = onCompile.call(ctx, $el, attrs, slot);
        if (output && output instanceof View) {
          useComponent(output);
        } else if (!Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "j"])(output) && $el !== output) {
          var newEls = $('<div />').html(output)[0].childNodes;
          $el.replaceWith(newEls);
          els.length = 0;
          els.push.apply(els, _toConsumableArray(newEls));
        }
      }
      records.push(record);
      els.forEach(function (el) {
        return el.__jQvmCompiledRecord = record;
      });
    };
  };

  // directives have higher priority than components

  directives.forEach(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 3),
      name = _ref5[0],
      onCompile = _ref5[1],
      onAffect = _ref5[2];
    var $els = $element.find("[".concat(name, "]"));
    $els.each(function () {
      var el = this;
      var $el = $(el);
      var attrs = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeAttrs */ "c"])(this);
      var els = [el];
      if (typeof onCompile === 'function') {
        // developers can recompile inside fn
        var boundCompile = compile.bind(null, $root, components, directives, state, view);
        var ctx = {
          scope: scope,
          view: view,
          compile: function compile(temp) {
            var scp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scope;
            var isl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : isolate;
            return boundCompile([temp, scp, isl]);
          },
          interpolate: _interpolate
        };
        var output = onCompile.call(ctx, $el, attrs);
        if (!Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isNone */ "j"])(output) && $el !== output) {
          var $newEls = $(output);
          $el.replaceWith($newEls);
          els = _toConsumableArray($newEls);
        }
      }
      if (isolate) {
        $el.removeAttr(name);
      }
      var record = {
        affect: onAffect,
        attrs: attrs,
        els: els,
        scope: scope
      };
      records.push(record);
      els.forEach(function (el) {
        return el.__jQvmCompiledRecord = record;
      });
    });
  });
  components.forEach(function (_ref6) {
    var _ref7 = _slicedToArray(_ref6, 3),
      name = _ref7[0],
      compile = _ref7[1],
      affect = _ref7[2];
    if (name === 'slot') {
      return;
    }
    var $els = $element.find(name);
    $els.each(createIterator(compile, affect));
  });
  _interpolate($element, scope);

  // slot will only render with the host scope
  var slotComponent = components.find(function (item) {
    return item[0] === 'slot';
  });
  if (slotComponent) {
    var _slotComponent = _slicedToArray(slotComponent, 3),
      name = _slotComponent[0],
      _compile = _slotComponent[1],
      _affect = _slotComponent[2];
    var $els = $element.find(name);
    $els.each(createIterator(_compile, _affect));
  }
  var nodes = _toConsumableArray($element[0].childNodes);
  return nodes;
}
function diffAndPatch($root, nodes) {
  // we will not use next to replace current node, so we should transform record info to old node
  var transferRecord = function transferRecord(current, next) {
    var record = next.__jQvmCompiledRecord;
    if (!record) {
      return;
    }
    var els = record.els;
    els.forEach(function (el, i) {
      if (el === next) {
        els[i] = current;
      }
    });
    current.__jQvmCompiledRecord = record;
  };
  var diffAndPatchNode = function diffAndPatchNode($current, $next) {
    var current = $current[0];
    var next = $next[0];
    var currentAttrs = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeAttrs */ "c"])(current);
    var nextAttrs = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeAttrs */ "c"])(next);
    var currentAttrNames = Object.keys(currentAttrs);
    var nextAttrNames = Object.keys(nextAttrs);

    // update/add attrs
    nextAttrNames.forEach(function (name) {
      var currentValue = currentAttrs[name];
      var nextValue = nextAttrs[name];
      if (currentValue !== nextValue) {
        $current.attr(name, nextValue);
      }
    });

    // remove no use attrs
    var diffAttrNames = Object(ts_fns__WEBPACK_IMPORTED_MODULE_2__[/* diffArray */ "b"])(currentAttrNames, nextAttrNames);
    diffAttrNames.forEach(function (name) {
      // keep style and class attributes
      if (name === 'style' || name === 'class' || name === 'w-name') {
        return;
      }
      $current.removeAttr(name);
    });
    transferRecord(current, next);

    // dont diff component inner content
    if (current.__jQvmComponent) {
      if (current.nodeName === next.nodeName && currentAttrs['w-name'] === nextAttrs['w-name']) {
        return;
      }
      if (current.nodeName === next.nodeName && (currentAttrs['id'] || nextAttrs['id']) && currentAttrs['id'] === nextAttrs['id']) {
        return;
      }
      if (current.nodeName === next.nodeName && (currentAttrs['data-id'] || nextAttrs['data-id']) && currentAttrs['data-id'] === nextAttrs['data-id']) {
        return;
      }
      var ignoreAttrs = ['style', 'class', 'w-name'];
      if (current.nodeName === next.nodeName && $current.attr('data-hoist') === $current.attr('data-hoist') && Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isEqual */ "f"])(currentAttrNames.filter(function (item) {
        return !ignoreAttrs.includes(item);
      }), nextAttrNames.filter(function (item) {
        return !ignoreAttrs.includes(item);
      }))) {
        return;
      }
    }
    var nextChildren = _toConsumableArray(next.childNodes);
    diffAndPatchChildren($current, nextChildren);
  };
  var diffAndPatchChildren = function diffAndPatchChildren($parent, nextChildren) {
    var parentNode = $parent[0];

    // append all children at once if current is empty inside
    if (!parentNode.childNodes.length) {
      nextChildren.forEach(function (child) {
        parentNode.appendChild(child);
      });
      return;
    }
    nextChildren.forEach(function (next, i) {
      var $next = $(next);
      var current = parentNode.childNodes[i];
      var $current = $(current);
      var nextId = $next.attr('id');
      var nextDataId = $next.attr('data-id');
      var move = function move($prev) {
        if ($prev.length) {
          var prev = $prev[0];
          // move it
          if (prev !== current) {
            parentNode.insertBefore(prev, current);
            transferRecord(current, next);
          }
          // update the node
          diffAndPatchNode($prev, $next);
        } else {
          parentNode.insertBefore(next, current);
        }
      };

      // current index node not existing, insert the coming node directly
      if (!current) {
        parentNode.appendChild(next);
      }
      // use `jq-id` to unique element
      else if (nextId) {
        var $prev = $parent.find("[id=".concat(nextId, "]"));
        move($prev);
      } else if (nextDataId) {
        var _$prev = $parent.find("[data-id=\"".concat(nextDataId, "\"]"));
        move(_$prev);
      }
      // insert coming child directly
      else if (next.nodeName !== current.nodeName) {
        parentNode.insertBefore(next, current);
      }
      // diff and patch element
      else if (next.nodeName.indexOf('#') !== 0) {
        diffAndPatchNode($current, $next);
      }
      // diff and patch text
      else {
        if (next.textContent !== current.textContent) {
          current.textContent = next.textContent;
        }
      }
    });

    // remove no use elements
    for (var i = parentNode.childNodes.length - 1, start = nextChildren.length; i >= start; i--) {
      var child = parentNode.childNodes[i];
      if (child.__jQvmComponent) {
        child.__jQvmComponent.unmount();
        delete child.__jQvmComponent;
      }
      var all = $(child).find('*');
      all.each(function () {
        if (this.__jQvmComponent) {
          this.__jQvmComponent.unmount();
          delete this.__jQvmComponent;
        }
      });
      parentNode.removeChild(child);
    }
  };
  diffAndPatchChildren($root, nodes);
}
function affect($root, scope, view) {
  var root = $root[0];
  var records = root.__jQvmCompiledRecords = root.__jQvmCompiledRecords || [];
  records.forEach(function (record) {
    var affect = record.affect,
      attrs = record.attrs,
      component = record.component,
      els = record.els,
      localScope = record.scope;
    var finalScope = localScope && localScope !== scope ? localScope : scope;
    if (component) {
      var state = record.state,
        slot = record.slot;
      els.forEach(function (el) {
        if (el.nodeName.indexOf('#') === 0) {
          return;
        }
        var $el = $(el);
        var outside = {};
        Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(attrs, function (exp, attr) {
          if (attr.indexOf(':') === 0) {
            var value = finalScope.parse(exp);
            var key = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* camelCase */ "a"])(attr.substring(1));
            outside[key] = value;
          } else if (attr.indexOf('@') === 0) {
            var event = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* camelCase */ "a"])(attr.substring(1));
            var _parseKey = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* parseKey */ "f"])(exp),
              _parseKey2 = _slicedToArray(_parseKey, 2),
              name = _parseKey2[0],
              params = _parseKey2[1];
            var fn = view.fn(name);
            outside['@' + event] = function () {
              var res = null;
              if (params) {
                var _args = params.map(function (arg) {
                  return finalScope.parse(arg);
                });
                res = fn.call.apply(fn, [view, state].concat(_toConsumableArray(_args)));
              } else {
                res = fn.call(view, state);
              }
              if (Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(res)) {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }
                return res.apply(this, args);
              }
            };
          } else if (attr.indexOf('_') !== 0) {
            var _key2 = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* camelCase */ "a"])(attr);
            outside[_key2] = exp;
          }
        });
        component.update(outside, SYMBOL);
        var slotInner = slot.template.trim();
        component.component('slot', function () {
          var scope = this.scope;
          if (slotInner) {
            var nodes = slot(scope);
            return nodes;
          }
          return '';
        });
        if (!el.__jQvmComponent) {
          el.__jQvmComponent = component;
          component.mount($el);
        } else if (!$el.attr('w-name')) {
          component.mount($el);
        } else if (slotInner) {
          component.update(true);
        }

        // let attrs has the result so that we can use them in effects
        // attrs._attrs = outside
      });

      // remove no use info
      els.forEach(function (el) {
        delete el.__jQvmCompiledRecord;
      });
    }
    if (typeof affect !== 'function') {
      return;
    }
    els.forEach(function (el) {
      var $el = $(el);
      var ctx = {
        $root: $root,
        scope: finalScope,
        view: view,
        component: component
      };
      var revoke = affect.call(ctx, $el, attrs);
      if (typeof revoke === 'function') {
        record.revoke = revoke;
      }
    });
  });
}

// ---------------- main ---------------

function vm() {
  var initState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var template = this;
  var $template = $(template);
  var hash = $template.attr('id') || $template.attr('w-id') || (vmId++, vmId);
  var root = "[w-name=".concat(hash, "]");
  var state = null;
  var scope = null;
  var outside = null;
  var mountTo = null;
  var isMounted = false;
  var isUnmounted = false;
  var getMountNode = function getMountNode() {
    return mountTo ? $(mountTo) : $template.next(root);
  };
  var actions = [];
  var view = new View();

  // -----------

  var components = [].concat(globalComponents);
  var directives = [].concat(globalDirectives);
  var filters = _objectSpread({}, globalFilters);
  var fns = {};
  function component(name, compile, affect) {
    _push(components, name, compile, affect);
    if (compile && compile instanceof View) {
      view.on('$beforeDestroy', function () {
        return compile.destroy();
      });
    }
    return view;
  }
  function directive(name, compile, affect) {
    _push(directives, name, compile, affect);
    return view;
  }
  function filter(name, fn) {
    filters[name] = fn;
    return view;
  }

  // ------------

  var latestHash = null;
  var nextTick = Object(ts_fns__WEBPACK_IMPORTED_MODULE_4__[/* throttle */ "a"])(function (e) {
    if (!state || !latestHash) {
      return;
    }
    var currentHash = Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* getObjectHash */ "d"])(state);
    if (latestHash !== currentHash) {
      var needToUpdate = e ? change(e) : true;
      if (needToUpdate) {
        render(true);
      }
    }
    latestHash = currentHash;
  }, 16);
  var currTick = function currTick() {
    latestHash = Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* getObjectHash */ "d"])(state);
  };

  // -------------

  var assignOutsideState = function assignOutsideState(state, outsideState, init) {
    var next = Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* filter */ "c"])(outsideState, function (value, key) {
      if (!state) {
        return false;
      }
      if (!(key in state)) {
        return false;
      }
      if (init) {
        return true;
      }
      if (outside && Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isShallowEqual */ "m"])(outside[key], value)) {
        return false;
      }
      return true;
    });
    Object.assign(state, next);
  };
  function init(initState) {
    var next = Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(initState) ? initState.call(view) : initState;
    if (!next || _typeof(next) !== 'object') {
      throw new Error('initState should must be an object');
    }
    if (outside) {
      assignOutsideState(next, outside, true);
    }
    state = Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* createProxy */ "a"])(next, {
      dispatch: nextTick,
      enumerable: function enumerable() {
        return true;
      }
    });
    scope = new scopex__WEBPACK_IMPORTED_MODULE_0__["ScopeX"](state, {
      filters: filters
    });
    currTick();

    // setupSpecialEvents should be invoked here
    // because these events should be registered before $init triggered
    setupSpecialEvents();
    view.emit('$init');
  }
  function render(isUpdating) {
    if (isUpdating && !isMounted) {
      return;
    }
    if (!shouldUpdate()) {
      return;
    }
    var $root = getMountNode();
    prepare($root);
    var nodes = compile($root, components, directives, state, view, [$template.html(), scope]);
    if (isUpdating) {
      diffAndPatch($root, nodes);
    } else {
      $root.html(nodes);
    }
    affect($root, scope, view);
    var attrs = $template.attr('attrs');
    if (attrs) {
      var props = scope.parse(attrs);
      Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(props, function (value, key) {
        if (key === 'class') {
          var items = value.split(' ');
          items.forEach(function (item) {
            return $root.addClass(item);
          });
        } else if (key === 'style') {
          if (Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(value)) {
            $root.css(value);
          } else if (Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "n"])(value)) {
            var style = $root.attr('style') || '';
            var rules = style.split(';').concat(value.split(';')).filter(function (item) {
              return !!item;
            });
            var stylesheet = Object(ts_fns__WEBPACK_IMPORTED_MODULE_2__[/* uniqueArray */ "d"])(rules).join(';');
            $root.attr('style', stylesheet);
          }
        } else {
          $root.attr(key, value);
        }
      });
    }
    $template.trigger('$render');
  }
  function change(e) {
    var flag = true;
    var prevent = function prevent() {
      return flag = false;
    };
    $template.trigger('$change', [state, e, prevent]);
    if (flag) {
      _store__WEBPACK_IMPORTED_MODULE_6__[/* VMLocalStorage */ "a"].reloadJqvmLocalStorage(state, '$change');
    }
    return flag;
  }
  function shouldUpdate() {
    var flag = true;
    var prevent = function prevent() {
      return flag = false;
    };
    $template.trigger('$update', [state, prevent]);
    return flag;
  }
  function mount(el) {
    if (isMounted) {
      if (el) {
        if (el === mountTo) {
          return view;
        }

        // when change a new root to mount, unmount the original one
        view.unmount();
      } else {
        return view;
      }
    }
    if ($template.next(root).length) {
      return view;
    }
    if (!isUnmounted) {
      init(initState);
    }
    var $root = null;
    mountTo = el || null; // cache mount node

    if (el) {
      $root = $(el);
      $root.attr('w-name', hash);
    }
    // like $('<template>aaa</template>').vm(...)
    else if (!$(document).find($template).length) {
      throw new Error('el should must be passed by view.mount');
    } else {
      $root = $('<div />', {
        'w-name': hash
      });
      $template.after($root);
    }
    render();
    _store__WEBPACK_IMPORTED_MODULE_6__[/* VMLocalStorage */ "a"].reloadJqvmLocalStorage(state, '$mount');
    $template.trigger('$mount', [state]);
    isMounted = true;
    isUnmounted = false;
    return view;
  }
  function unmount() {
    if (!isMounted) {
      return view;
    }
    var $root = getMountNode();
    if (!$root.length) {
      return;
    }
    $template.trigger('$unmount');
    if (mountTo) {
      $root.html('');
      $root.removeAttr('w-name');
    } else {
      $root.remove();
    }
    mountTo = null;
    isMounted = false;
    isUnmounted = true;
    return view;
  }
  function destroy() {
    $template.trigger('$beforeDestroy');
    var $root = getMountNode();
    unmount();
    state = null;
    scope = null;
    actions.length = 0;
    var root = $root[0];
    delete root.__jQvmComponentInstances;
    delete root.__jQvmCompiledRecords;
    $template.trigger('$destroy');
  }
  function update(nextState, type) {
    if (type === SYMBOL) {
      if (state) {
        assignOutsideState(state, nextState);
      }
      outside = nextState;
      return view;
    }

    // force update
    if (nextState === true) {
      if (isMounted) {
        render(true);
      }
      return view;
    }

    // when nextState passed, assign to state will trigger rerender
    if (state && nextState) {
      if (Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(nextState)) {
        var res = nextState(state);
        if (Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(res)) {
          Object.assign(state, res);
        } else if (isMounted) {
          nextTick();
        }
        return view;
      } else if (Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(nextState)) {
        Object.assign(state, nextState);
        return view;
      }
    }

    // if not passed nextState, it means to check manually
    if (isMounted && nextState) {
      nextTick();
    }
    return view;
  }
  function bind(args, once) {
    var info = _toConsumableArray(args);
    var fn = info.pop();
    var _info = _slicedToArray(info, 2),
      event = _info[0],
      selector = _info[1];
    var handle = function handle(e) {
      var event = e.handleObj.origType;
      // stop broadcast the event
      if (event[0] === '$') {
        e.stopPropagation();
        if (e.target !== e.currentTarget) {
          return;
        }
      }
      var res = null;
      for (var _len2 = arguments.length, eventArgs = new Array(_len2 > 1 ? _len2 - 1 : 0), _key3 = 1; _key3 < _len2; _key3++) {
        eventArgs[_key3 - 1] = arguments[_key3];
      }
      if (event[0] === '$') {
        fn.call.apply(fn, [view, state].concat(eventArgs));
      } else {
        var callback = fn.call(view, state);
        if (Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(callback)) {
          res = callback.call.apply(callback, [this, e].concat(eventArgs));
        }
      }
      if (once) {
        unbind(args);
      }
      return res;
    };
    var item = {
      once: once,
      event: event,
      selector: selector,
      fn: fn,
      handle: handle
    };
    actions.push(item);

    // events will be bound when $mount by `setup`
    // developers may invoke this.on(...) after view mounted, at this time, the event callback should be bound immediately
    if (isMounted) {
      var $root = getMountNode();
      var type = once ? 'one' : 'on';
      if (event[0] === '$') {
        $template[type](event, handle);
      } else {
        var _info2 = [event, selector].filter(Boolean);
        $root[type].apply($root, _toConsumableArray(_info2).concat([handle]));
      }
    }
  }
  function unbind(args) {
    var info = _toConsumableArray(args);
    var fn = info.pop();
    var _info3 = _slicedToArray(info, 2),
      event = _info3[0],
      selector = _info3[1];
    var $root = getMountNode();
    actions.forEach(function (item, i) {
      if (event === item.event && selector === item.selector && fn === item.fn) {
        var _event = item.event,
          _selector = item.selector,
          handle = item.handle;
        var _args2 = [_event, _selector, handle].filter(Boolean);
        if (_event[0] === '$') {
          $template.off.apply($template, _toConsumableArray(_args2));
        } else {
          $root.off.apply($root, _toConsumableArray(_args2));
        }
        actions.splice(i, 1);
      }
    });
  }
  function emit(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key4 = 1; _key4 < _len3; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    // trigger those passed to components, only works for components
    if (outside && Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(outside['@' + event])) {
      var _fn = outside['@' + event];
      _fn.apply(void 0, args);
    }

    // only works for events begin with $
    if (event[0] !== '$') {
      return;
    }
    // trigger those bind to view root
    actions.forEach(function (item) {
      if (item.event === event) {
        $template.trigger.apply($template, [event].concat(args));
      }
    });
  }
  function setupSpecialEvents() {
    actions.forEach(function (item) {
      var event = item.event,
        handle = item.handle;
      if (['$init', '$destroy', '$beforeDestroy', '$mount'].indexOf(event) === -1) {
        return;
      }
      $template.one(event, handle);
    });
  }
  function setup() {
    $template.on('$mount', function () {
      var $root = getMountNode();
      actions.forEach(function (item) {
        var once = item.once,
          event = item.event,
          selector = item.selector,
          handle = item.handle;
        if (['$init', '$destroy', '$beforeDestroy', '$mount', '$clone'].indexOf(event) > -1) {
          return;
        }
        var type = once ? 'one' : 'on';
        if (event[0] === '$') {
          $template[type](event, handle);
        } else {
          var info = [event, selector].filter(Boolean);
          $root[type].apply($root, _toConsumableArray(info).concat([handle]));
        }
      });
    });
    $template.on('$unmount', function () {
      var $root = getMountNode();
      actions.forEach(function (item) {
        var event = item.event,
          selector = item.selector,
          action = item.action;
        if (event[0] === '$') {
          return;
        }
        var info = [event, selector].filter(Boolean);
        $root.off.apply($root, _toConsumableArray(info).concat([action]));
      });
    });
  }
  function find(selector) {
    var $root = getMountNode();
    return $root.find(selector);
  }
  function fn(name, action) {
    if (!action) {
      return fns[name];
    } else {
      fns[name] = action;
    }
    return view;
  }
  function clone() {
    var newView = vm.call(template, initState);
    Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(fns, function (action, name) {
      newView.fn(name, action);
    });
    Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(actions, function (item) {
      var type = item.type,
        event = item.event,
        selector = item.selector,
        fn = item.fn;
      var info = [event, selector].filter(Boolean);
      var m = type === 'one' ? 'once' : 'on';
      newView[m].apply(newView, _toConsumableArray(info).concat([fn]));
    });
    Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(components, function (item) {
      if (globalComponents.includes(item)) {
        return;
      }
      newView.component.apply(newView, _toConsumableArray(item));
    });
    Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(directives, function (item) {
      if (globalDirectives.includes(item)) {
        return;
      }
      newView.directive.apply(newView, _toConsumableArray(item));
    });
    Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(filters, function (fn, name) {
      newView.filter(name, fn);
    });

    // clone action
    actions.forEach(function (item) {
      var event = item.event,
        fn = item.fn;
      if (event !== '$clone') {
        return;
      }
      fn.call(view, state, newView);
    });
    return newView;
  }
  function plugin(fn) {
    var lifecycle = fn.call({
      view: view,
      scope: scope
    });
    if (lifecycle) {
      var events = Object.keys(lifecycle);
      events.forEach(function (event) {
        view.on(event, lifecycle[event]);
      });
    }
    return view;
  }
  Object.assign(view, {
    once: function once() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key5 = 0; _key5 < _len4; _key5++) {
        args[_key5] = arguments[_key5];
      }
      bind(args, true);
      return view;
    },
    on: function on() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key6 = 0; _key6 < _len5; _key6++) {
        args[_key6] = arguments[_key6];
      }
      bind(args);
      return view;
    },
    off: function off() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key7 = 0; _key7 < _len6; _key7++) {
        args[_key7] = arguments[_key7];
      }
      unbind(args);
      return view;
    },
    emit: emit,
    mount: mount,
    unmount: unmount,
    destroy: destroy,
    update: update,
    find: find,
    component: component,
    directive: directive,
    filter: filter,
    plugin: plugin,
    fn: fn,
    clone: clone
  });
  var tempEl = $template[0];
  var tag = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeName */ "d"])(tempEl);
  var attributes = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeAttrs */ "c"])(tempEl);
  Object.defineProperties(view, {
    tag: {
      value: tag
    },
    attributes: {
      value: attributes
    }
  });
  setup();
  return view;
}

// register inside directives

directive('w-for', function ($el, attrs) {
  var attr = attrs['w-for'];
  if (!/^[a-z][a-zA-Z0-9_$]*(,[a-z][a-zA-Z0-9_$]*){0,1} in [a-z][a-zA-Z0-9_$]+( traceby [a-z][a-zA-Z0-9_$.]*)?/.test(attr)) {
    throw new Error('w-for should match formatter `value,key in data traceby id`!');
  }
  var el = $el[0];
  var nodeName = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeName */ "d"])(el);
  var _attr$split = attr.split(' '),
    _attr$split2 = _slicedToArray(_attr$split, 5),
    kv = _attr$split2[0],
    dataKey = _attr$split2[2],
    traceBy = _attr$split2[4];
  var _kv$split = kv.split(','),
    _kv$split2 = _slicedToArray(_kv$split, 2),
    valueName = _kv$split2[0],
    keyName = _kv$split2[1];
  var parentScope = this.scope,
    compile = this.compile;
  var data = parentScope.parse(dataKey);

  // make it not be able to compile again
  $el.removeAttr('w-for');
  if (traceBy) {
    $el.attr('data-id', "{{".concat(traceBy, "}}")); // modify the template, this will be compiled
  }
  var $els = [];
  var temp = el.outerHTML;
  Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(data, function (value, key) {
    var newScope = _defineProperty({}, valueName, value);
    if (keyName) {
      newScope[keyName] = key;
    }
    var scope = parentScope.$new(newScope);
    var nodes = compile(temp, scope, true);
    $els.push.apply($els, _toConsumableArray(nodes));
  });
  var $commentBegin = $("<!-- ".concat(nodeName, " w-for=\"").concat(attr, "\" begin -->"));
  var $commentEnd = $("<!-- ".concat(nodeName, " w-for=\"").concat(attr, "\" end -->"));
  $el.replaceWith([$commentBegin].concat($els, [$commentEnd]));
});
directive('w-if', function ($el, attrs) {
  var attr = attrs['w-if'];
  var value = this.scope.parse(attr);
  return value ? $el : "<!-- ".concat(Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getNodeName */ "d"])($el[0]), " w-if=\"").concat(attr, "\" (hidden) -->");
});
directive('w-id', function ($el, attrs) {
  var attr = attrs['w-id'];
  var value = this.scope.parse(attr);
  $el.attr('id', value);
});
directive('w-class', function ($el, attrs) {
  var attr = attrs['w-class'];
  var obj = this.scope.parse(attr);
  Object(ts_fns__WEBPACK_IMPORTED_MODULE_3__[/* each */ "b"])(obj, function (value, key) {
    if (value) {
      $el.addClass(key);
    }
  });
});
directive('w-value', null, function ($el, attrs) {
  var attr = attrs['w-value'];
  var value = this.scope.parse(attr);
  $el.val(value);
});
directive('w-disabled', null, function ($el, attrs) {
  var attr = attrs['w-disabled'];
  var value = this.scope.parse(attr);
  $el.prop('disabled', !!value);
});
directive('w-checked', null, function ($el, attrs) {
  var attr = attrs['w-checked'];
  var value = this.scope.parse(attr);
  $el.prop('checked', !!value);
});
directive('w-selected', null, function ($el, attrs) {
  var attr = attrs['w-selected'];
  var value = this.scope.parse(attr);
  $el.prop('selected', !!value);
});
directive('w-bind', null, function ($el, attrs) {
  var _this = this;
  var attr = attrs['w-bind'];
  var value = this.scope.parse(attr);
  var event = $el.is('[type=checkbox],[type=radio],[type=color],[type=date],[type=datetime-local],[type=week],[type=file],select') ? 'change' : 'input';
  var checkbox = $el.is('[type=checkbox]');
  var radio = $el.is('[type=radio]');
  if (checkbox) {
    $el.prop('checked', !!value);
  } else if (radio) {
    $el.prop('checked', value === $el.val());
  } else {
    $el.val(value);
  }
  var callback = function callback(e) {
    var value = checkbox ? $el.prop('checked') : e.target.value;
    _this.scope.assign(attr, value);
  };
  $el.on(event, callback);
  return function () {
    return $el.off(event, callback);
  };
});
directive('w-src', null, function ($el, attrs) {
  var attr = attrs['w-src'];
  var value = this.scope.parse(attr);
  $el.attr('src', value);
});
directive('w-on', null, function ($el, attrs) {
  var attr = attrs['w-on'];
  var _attr$split3 = attr.split(':'),
    _attr$split4 = _slicedToArray(_attr$split3, 2),
    event = _attr$split4[0],
    method = _attr$split4[1];
  var _parseKey3 = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* parseKey */ "f"])(method),
    _parseKey4 = _slicedToArray(_parseKey3, 2),
    name = _parseKey4[0],
    params = _parseKey4[1];
  var view = this.view,
    $root = this.$root,
    scope = this.scope;
  var fn = view.fn(name);
  if (!fn) {
    return;
  }
  var f = fn;
  if (params) {
    f = function f(state) {
      var args = params.map(function (arg) {
        return scope.parse(arg);
      });
      return fn.call.apply(fn, [this, state].concat(_toConsumableArray(args)));
    };
  }
  var path = Object(_utils_js__WEBPACK_IMPORTED_MODULE_5__[/* getPath */ "e"])($el, $root);
  if (!path) {
    return;
  }
  view.on(event, path, f);
  return function () {
    return view.off(event, path, f);
  };
});
directive('w-transition', null, function ($el, attrs) {
  var raw = attrs['w-transition'];

  // дефолт
  var transition = raw || 'opacity 0.25s ease';

  // нормализуем (если передали "ease 0.3s")
  var hasProp = /(opacity|all|transform)/.test(transition);
  var finalTransition = hasProp ? transition : "opacity ".concat(transition);

  // применяем transition
  $el.css({
    transition: finalTransition,
    opacity: 0
  });

  // 👉 ENTER (появление)
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      $el.css('opacity', 1);
    });
  });

  // 👉 LEAVE (исчезновение)
  var el = $el[0];
  var originalRemove = el.remove;
  el.remove = function () {
    // запускаем fade-out
    $el.css('opacity', 0);
    var duration = getComputedStyle(el).transitionDuration;
    var ms = duration.includes('ms') ? parseFloat(duration) : parseFloat(duration) * 1000;
    setTimeout(function () {
      originalRemove.call(el);
    }, ms || 250);
  };

  // cleanup
  return function () {
    el.remove = originalRemove;
  };
});
component('w-static', function () {
  return $('<template><slot></slot></template>').vm().on('$update', function () {
    return function (e, state, prevent) {
      prevent();
    };
  });
});

// --------------------------------

function useJQuery(jQuery) {
  $ = jQuery;
  $.fn.vm = vm;
  $.fn.state = function () {
    return this.vm.apply(this, arguments);
  };
  return $;
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
;
(function (fn) {
  var ScopeX = fn();
  // commonjs
  if (true) {
    exports["default"] = ScopeX;
    exports.ScopeX = ScopeX;
    exports.createScope = ScopeX.createScope;
    exports.__esModule = true;
  }
  // in browser
  else {}
})(function () {
  // fork from https://github.com/peerigon/angular-expressions/blob/master/lib/parse.js

  /* remove eslint errors to see if there is something really wrong */
  /*eslint quotes: [0]*/
  /*eslint indent: [0]*/
  /*eslint vars-on-top: [0]*/
  /*eslint yoda: 0*/
  /*eslint curly: 0*/
  /*eslint no-implicit-coercion: 0*/
  /*eslint newline-after-var: 0*/
  /*eslint space-before-function-paren: 0*/
  /*eslint block-spacing: 0*/
  /*eslint brace-style: 0*/
  /*eslint complexity: 0*/
  /*eslint one-var: 0*/
  /*eslint eqeqeq: 0*/
  /*eslint object-curly-spacing: 0*/
  /*eslint quote-props: 0*/
  /*eslint key-spacing: 0*/
  /*eslint valid-jsdoc: 0*/
  /*eslint func-style: 0*/
  /*eslint no-nested-ternary: 0*/
  /*eslint operator-linebreak: 0*/
  /*eslint no-multi-spaces: 0*/
  /*eslint no-constant-condition: 0*/
  /*eslint comma-spacing: 0*/
  /*eslint no-else-return: 0*/
  /*eslint no-warning-comments: 0*/
  /*eslint default-case: 0*/
  /*eslint consistent-return: 0*/
  /*eslint no-undefined: 0*/
  /*eslint no-new-func: 0*/
  /*eslint max-nested-callbacks: 0*/
  /*eslint padded-blocks: 0*/
  /*eslint no-self-compare: 0*/
  /*eslint no-multiple-empty-lines: 0*/
  /*eslint no-new: 0*/
  /*eslint no-unused-vars: 0*/

  "use strict";

  var window = {
    document: {}
  };

  ////////////////////////////////////

  /**
   * @ngdoc module
   * @name ng
   * @module ng
   * @installation
   * @description
   *
   * # ng (core module)
   * The ng module is loaded by default when an AngularJS application is started. The module itself
   * contains the essential components for an AngularJS application to function. The table below
   * lists a high level breakdown of each of the services/factories, filters, directives and testing
   * components available within this core module.
   *
   * <div doc-module-components="ng"></div>
   */

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var lowercase = function lowercase(string) {
    return isString(string) ? string.toLowerCase() : string;
  };

  /**
   * @ngdoc function
   * @name angular.isArray
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Array`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Array`.
   */
  var isArray = Array.isArray;
  var ngAttrPrefixes = ["ng-", "data-ng-", "ng:", "x-ng-"];
  var manualLowercase = function manualLowercase(s) {
    /* eslint-disable no-bitwise */
    return isString(s) ? s.replace(/[A-Z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) | 32);
    }) : s;
    /* eslint-enable */
  };
  var manualUppercase = function manualUppercase(s) {
    /* eslint-disable no-bitwise */
    return isString(s) ? s.replace(/[a-z]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) & ~32);
    }) : s;
    /* eslint-enable */
  };

  // String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
  // locale, for this reason we need to detect this case and redefine lowercase/uppercase methods
  // with correct but slower alternatives. See https://github.com/angular/angular.js/issues/11387
  if ("i" !== "I".toLowerCase()) {
    lowercase = manualLowercase;
    uppercase = manualUppercase;
  }
  var jqLite,
    // delay binding since jQuery could be loaded after us.
    jQuery,
    // delay binding
    toString = Object.prototype.toString,
    getPrototypeOf = Object.getPrototypeOf,
    ngMinErr = minErr("ng"),
    /** @name angular */
    angular = window.angular || (window.angular = {}),
    uid = 0;

  /**
   * @private
   * @param {*} obj
   * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
   *                   String ...)
   */
  function isArrayLike(obj) {
    // `null`, `undefined` and `window` are not array-like
    if (obj == null || isWindow(obj)) return false;

    // arrays, strings and jQuery/jqLite objects are array like
    // * jqLite is either the jQuery or jqLite constructor function
    // * we have to check the existence of jqLite first as this method is called
    //   via the forEach method when constructing the jqLite object in the first place
    if (isArray(obj) || isString(obj) || jqLite && obj instanceof jqLite) return true;

    // Support: iOS 8.2 (not reproducible in simulator)
    // "length" in obj used to prevent JIT error (gh-11508)
    var length = "length" in Object(obj) && obj.length;

    // NodeList objects (with `item` method) and
    // other objects with suitable length characteristics are array-like
    return isNumber(length) && (length >= 0 && (length - 1 in obj || obj instanceof Array) || typeof obj.item === "function");
  }

  /**
   * @ngdoc function
   * @name angular.forEach
   * @module ng
   * @kind function
   *
   * @description
   * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
   * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
   * is the value of an object property or an array element, `key` is the object property key or
   * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
   *
   * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
   * using the `hasOwnProperty` method.
   *
   * Unlike ES262's
   * [Array.prototype.forEach](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18),
   * providing 'undefined' or 'null' values for `obj` will not throw a TypeError, but rather just
   * return the value provided.
   *
     ```js
       var values = {name: 'misko', gender: 'male'};
       var log = [];
       angular.forEach(values, function(value, key) {
         this.push(key + ': ' + value);
       }, log);
       expect(log).toEqual(['name: misko', 'gender: male']);
     ```
   *
   * @param {Object|Array} obj Object to iterate over.
   * @param {Function} iterator Iterator function.
   * @param {Object=} context Object to become context (`this`) for the iterator function.
   * @returns {Object|Array} Reference to `obj`.
   */
  function forEach(obj, iterator, context) {
    var key, length;
    if (obj) {
      if (isFunction(obj)) {
        for (key in obj) {
          if (key !== "prototype" && key !== "length" && key !== "name" && obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (isArray(obj) || isArrayLike(obj)) {
        var isPrimitive = _typeof(obj) !== "object";
        for (key = 0, length = obj.length; key < length; key++) {
          if (isPrimitive || key in obj) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
      } else if (isBlankObject(obj)) {
        // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
        // eslint-disable-next-line guard-for-in
        for (key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      } else if (typeof obj.hasOwnProperty === "function") {
        // Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      } else {
        // Slow path for objects which do not have a method `hasOwnProperty`
        for (key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            iterator.call(context, obj[key], key, obj);
          }
        }
      }
    }
    return obj;
  }

  /**
   * Set or clear the hashkey for an object.
   * @param obj object
   * @param h the hashkey (!truthy to delete the hashkey)
   */
  function setHashKey(obj, h) {
    if (h) {
      obj.$$hashKey = h;
    } else {
      delete obj.$$hashKey;
    }
  }

  /**
   * @ngdoc function
   * @name angular.noop
   * @module ng
   * @kind function
   *
   * @description
   * A function that performs no operations. This function can be useful when writing code in the
   * functional style.
     ```js
       function foo(callback) {
         var result = calculateResult();
         (callback || angular.noop)(result);
       }
     ```
   */
  function noop() {}
  noop.$inject = [];

  /**
   * @ngdoc function
   * @name angular.isUndefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is undefined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is undefined.
   */
  function isUndefined(value) {
    return typeof value === "undefined";
  }

  /**
   * @ngdoc function
   * @name angular.isDefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is defined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is defined.
   */
  function isDefined(value) {
    return typeof value !== "undefined";
  }

  /**
   * @ngdoc function
   * @name angular.isObject
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
   * considered to be objects. Note that JavaScript arrays are objects.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Object` but not `null`.
   */
  function isObject(value) {
    // http://jsperf.com/isobject4
    return value !== null && _typeof(value) === "object";
  }

  /**
   * Determine if a value is an object with a null prototype
   *
   * @returns {boolean} True if `value` is an `Object` with a null prototype
   */
  function isBlankObject(value) {
    return value !== null && _typeof(value) === "object" && !getPrototypeOf(value);
  }

  /**
   * @ngdoc function
   * @name angular.isString
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `String`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `String`.
   */
  function isString(value) {
    return typeof value === "string";
  }

  /**
   * @ngdoc function
   * @name angular.isNumber
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Number`.
   *
   * This includes the "special" numbers `NaN`, `+Infinity` and `-Infinity`.
   *
   * If you wish to exclude these then you can use the native
   * [`isFinite'](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)
   * method.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Number`.
   */
  function isNumber(value) {
    return typeof value === "number";
  }

  /**
   * @ngdoc function
   * @name angular.isFunction
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */
  function isFunction(value) {
    return typeof value === "function";
  }

  /**
   * Checks if `obj` is a window object.
   *
   * @private
   * @param {*} obj Object to check
   * @returns {boolean} True if `obj` is a window obj.
   */
  function isWindow(obj) {
    return obj && obj.window === obj;
  }
  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }
  var TYPED_ARRAY_REGEXP = /^\[object (?:Uint8|Uint8Clamped|Uint16|Uint32|Int8|Int16|Int32|Float32|Float64)Array\]$/;
  function isTypedArray(value) {
    return value && isNumber(value.length) && TYPED_ARRAY_REGEXP.test(toString.call(value));
  }
  function isArrayBuffer(obj) {
    return toString.call(obj) === "[object ArrayBuffer]";
  }

  /**
   * @ngdoc function
   * @name angular.copy
   * @module ng
   * @kind function
   *
   * @description
   * Creates a deep copy of `source`, which should be an object or an array.
   *
   * * If no destination is supplied, a copy of the object or array is created.
   * * If a destination is provided, all of its elements (for arrays) or properties (for objects)
   *   are deleted and then all elements/properties from the source are copied to it.
   * * If `source` is not an object or array (inc. `null` and `undefined`), `source` is returned.
   * * If `source` is identical to `destination` an exception will be thrown.
   *
   * <br />
   * <div class="alert alert-warning">
   *   Only enumerable properties are taken into account. Non-enumerable properties (both on `source`
   *   and on `destination`) will be ignored.
   * </div>
   *
   * @param {*} source The source that will be used to make a copy.
   *                   Can be any type, including primitives, `null`, and `undefined`.
   * @param {(Object|Array)=} destination Destination into which the source is copied. If
   *     provided, must be of the same type as `source`.
   * @returns {*} The copy or updated `destination`, if `destination` was specified.
   *
   * @example
    <example module="copyExample" name="angular-copy">
      <file name="index.html">
        <div ng-controller="ExampleController">
          <form novalidate class="simple-form">
            <label>Name: <input type="text" ng-model="user.name" /></label><br />
            <label>Age:  <input type="number" ng-model="user.age" /></label><br />
            Gender: <label><input type="radio" ng-model="user.gender" value="male" />male</label>
                    <label><input type="radio" ng-model="user.gender" value="female" />female</label><br />
            <button ng-click="reset()">RESET</button>
            <button ng-click="update(user)">SAVE</button>
          </form>
          <pre>form = {{user | json}}</pre>
          <pre>master = {{master | json}}</pre>
        </div>
      </file>
      <file name="script.js">
        // Module: copyExample
        angular.
          module('copyExample', []).
          controller('ExampleController', ['$scope', function($scope) {
            $scope.master = {};
  
            $scope.reset = function() {
              // Example with 1 argument
              $scope.user = angular.copy($scope.master);
            };
  
            $scope.update = function(user) {
              // Example with 2 arguments
              angular.copy(user, $scope.master);
            };
  
            $scope.reset();
          }]);
      </file>
    </example>
   */
  function copy(source, destination) {
    var stackSource = [];
    var stackDest = [];
    if (destination) {
      if (isTypedArray(destination) || isArrayBuffer(destination)) {
        throw ngMinErr("cpta", "Can't copy! TypedArray destination cannot be mutated.");
      }
      if (source === destination) {
        throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
      }

      // Empty the destination object
      if (isArray(destination)) {
        destination.length = 0;
      } else {
        forEach(destination, function (value, key) {
          if (key !== "$$hashKey") {
            delete destination[key];
          }
        });
      }
      stackSource.push(source);
      stackDest.push(destination);
      return copyRecurse(source, destination);
    }
    return copyElement(source);
    function copyRecurse(source, destination) {
      var h = destination.$$hashKey;
      var key;
      if (isArray(source)) {
        for (var i = 0, ii = source.length; i < ii; i++) {
          destination.push(copyElement(source[i]));
        }
      } else if (isBlankObject(source)) {
        // createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
        // eslint-disable-next-line guard-for-in
        for (key in source) {
          destination[key] = copyElement(source[key]);
        }
      } else if (source && typeof source.hasOwnProperty === "function") {
        // Slow path, which must rely on hasOwnProperty
        for (key in source) {
          if (source.hasOwnProperty(key)) {
            destination[key] = copyElement(source[key]);
          }
        }
      } else {
        // Slowest path --- hasOwnProperty can't be called as a method
        for (key in source) {
          if (hasOwnProperty.call(source, key)) {
            destination[key] = copyElement(source[key]);
          }
        }
      }
      setHashKey(destination, h);
      return destination;
    }
    function copyElement(source) {
      // Simple values
      if (!isObject(source)) {
        return source;
      }

      // Already copied values
      var index = stackSource.indexOf(source);
      if (index !== -1) {
        return stackDest[index];
      }
      if (isWindow(source) || isScope(source)) {
        throw ngMinErr("cpws", "Can't copy! Making copies of Window or Scope instances is not supported.");
      }
      var needsRecurse = false;
      var destination = copyType(source);
      if (destination === undefined) {
        destination = isArray(source) ? [] : Object.create(getPrototypeOf(source));
        needsRecurse = true;
      }
      stackSource.push(source);
      stackDest.push(destination);
      return needsRecurse ? copyRecurse(source, destination) : destination;
    }
    function copyType(source) {
      switch (toString.call(source)) {
        case "[object Int8Array]":
        case "[object Int16Array]":
        case "[object Int32Array]":
        case "[object Float32Array]":
        case "[object Float64Array]":
        case "[object Uint8Array]":
        case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":
        case "[object Uint32Array]":
          return new source.constructor(copyElement(source.buffer), source.byteOffset, source.length);
        case "[object ArrayBuffer]":
          // Support: IE10
          if (!source.slice) {
            // If we're in this case we know the environment supports ArrayBuffer
            /* eslint-disable no-undef */
            var copied = new ArrayBuffer(source.byteLength);
            new Uint8Array(copied).set(new Uint8Array(source));
            /* eslint-enable */
            return copied;
          }
          return source.slice(0);
        case "[object Boolean]":
        case "[object Number]":
        case "[object String]":
        case "[object Date]":
          return new source.constructor(source.valueOf());
        case "[object RegExp]":
          var re = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
          re.lastIndex = source.lastIndex;
          return re;
        case "[object Blob]":
          return new source.constructor([source], {
            type: source.type
          });
      }
      if (isFunction(source.cloneNode)) {
        return source.cloneNode(true);
      }
    }
  }

  /**
   * @ngdoc directive
   * @module ng
   * @name ngJq
   *
   * @element ANY
   * @param {string=} ngJq the name of the library available under `window`
   * to be used for angular.element
   * @description
   * Use this directive to force the angular.element library.  This should be
   * used to force either jqLite by leaving ng-jq blank or setting the name of
   * the jquery variable under window (eg. jQuery).
   *
   * Since angular looks for this directive when it is loaded (doesn't wait for the
   * DOMContentLoaded event), it must be placed on an element that comes before the script
   * which loads angular. Also, only the first instance of `ng-jq` will be used and all
   * others ignored.
   *
   * @example
   * This example shows how to force jqLite using the `ngJq` directive to the `html` tag.
   ```html
   <!doctype html>
   <html ng-app ng-jq>
   ...
   ...
   </html>
   ```
   * @example
   * This example shows how to use a jQuery based library of a different name.
   * The library name must be available at the top most 'window'.
   ```html
   <!doctype html>
   <html ng-app ng-jq="jQueryLib">
   ...
   ...
   </html>
   ```
   */
  var _jq = function jq() {
    if (isDefined(_jq.name_)) return _jq.name_;
    var el;
    var i,
      ii = ngAttrPrefixes.length,
      prefix,
      name;
    for (i = 0; i < ii; ++i) {
      prefix = ngAttrPrefixes[i];
      el = window.document.querySelector("[" + prefix.replace(":", "\\:") + "jq]");
      if (el) {
        name = el.getAttribute(prefix + "jq");
        break;
      }
    }
    return _jq.name_ = name;
  };
  function toJsonReplacer(key, value) {
    var val = value;
    if (typeof key === "string" && key.charAt(0) === "$" && key.charAt(1) === "$") {
      val = undefined;
    } else if (isWindow(value)) {
      val = "$WINDOW";
    } else if (value && window.document === value) {
      val = "$DOCUMENT";
    } else if (isScope(value)) {
      val = "$SCOPE";
    }
    return val;
  }

  /////////////////////////////////////////////////

  /**
   * Creates a new object without a prototype. This object is useful for lookup without having to
   * guard against prototypically inherited properties via hasOwnProperty.
   *
   * Related micro-benchmarks:
   * - http://jsperf.com/object-create2
   * - http://jsperf.com/proto-map-lookup/2
   * - http://jsperf.com/for-in-vs-object-keys2
   *
   * @returns {Object}
   */
  function createMap() {
    return Object.create(null);
  }

  /* global toDebugString: true */

  function serializeObject(obj) {
    var seen = [];
    return JSON.stringify(obj, function (key, val) {
      val = toJsonReplacer(key, val);
      if (isObject(val)) {
        if (seen.indexOf(val) >= 0) return "...";
        seen.push(val);
      }
      return val;
    });
  }
  function toDebugString(obj) {
    if (typeof obj === "function") {
      return obj.toString().replace(/ \{[\s\S]*$/, "");
    } else if (isUndefined(obj)) {
      return "undefined";
    } else if (typeof obj !== "string") {
      return serializeObject(obj);
    }
    return obj;
  }

  /**
   * @description
   *
   * This object provides a utility for producing rich Error messages within
   * Angular. It can be called as follows:
   *
   * var exampleMinErr = minErr('example');
   * throw exampleMinErr('one', 'This {0} is {1}', foo, bar);
   *
   * The above creates an instance of minErr in the example namespace. The
   * resulting error will have a namespaced error code of example.one.  The
   * resulting error will replace {0} with the value of foo, and {1} with the
   * value of bar. The object is not restricted in the number of arguments it can
   * take.
   *
   * If fewer arguments are specified than necessary for interpolation, the extra
   * interpolation markers will be preserved in the final string.
   *
   * Since data will be parsed statically during a build step, some restrictions
   * are applied with respect to how minErr instances are created and called.
   * Instances should have names of the form namespaceMinErr for a minErr created
   * using minErr('namespace') . Error codes, namespaces and template strings
   * should all be static strings, not variables or general expressions.
   *
   * @param {string} module The namespace to use for the new minErr instance.
   * @param {function} ErrorConstructor Custom error constructor to be instantiated when returning
   *   error from returned function, for cases when a particular type of error is useful.
   * @returns {function(code:string, template:string, ...templateArgs): Error} minErr instance
   */

  function minErr(module, ErrorConstructor) {
    ErrorConstructor = ErrorConstructor || Error;
    return function () {
      var SKIP_INDEXES = 2;
      var templateArgs = arguments,
        code = templateArgs[0],
        message = "[" + (module ? module + ":" : "") + code + "] ",
        template = templateArgs[1],
        paramPrefix,
        i;
      message += template.replace(/\{\d+\}/g, function (match) {
        var index = +match.slice(1, -1),
          shiftedIndex = index + SKIP_INDEXES;
        if (shiftedIndex < templateArgs.length) {
          return toDebugString(templateArgs[shiftedIndex]);
        }
        return match;
      });
      message += '\nhttp://errors.angularjs.org/1.6.9/' + (module ? module + "/" : "") + code;
      for (i = SKIP_INDEXES, paramPrefix = "?"; i < templateArgs.length; i++, paramPrefix = "&") {
        message += paramPrefix + "p" + (i - SKIP_INDEXES) + "=" + encodeURIComponent(toDebugString(templateArgs[i]));
      }
      return new ErrorConstructor(message);
    };
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *     Any commits to this file should be reviewed with security in mind.  *
   *   Changes to this file can potentially create security vulnerabilities. *
   *          An approval from 2 Core members with history of modifying      *
   *                         this file is required.                          *
   *                                                                         *
   *  Does the change somehow allow for arbitrary javascript to be executed? *
   *    Or allows for someone to change the prototype of built-in objects?   *
   *     Or gives undesired access to variables likes document or window?    *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  var $parseMinErr = minErr("$parse");

  // Sandboxing Angular Expressions
  // ------------------------------
  // Angular expressions are no longer sandboxed. So it is now even easier to access arbitrary JS code by
  // various means such as obtaining a reference to native JS functions like the Function constructor.
  //
  // As an example, consider the following Angular expression:
  //
  //   {}.toString.constructor('alert("evil JS code")')
  //
  // It is important to realize that if you create an expression from a string that contains user provided
  // content then it is possible that your application contains a security vulnerability to an XSS style attack.
  //
  // See https://docs.angularjs.org/guide/security

  function getStringValue(name) {
    // Property names must be strings. This means that non-string objects cannot be used
    // as keys in an object. Any non-string object, including a number, is typecasted
    // into a string via the toString method.
    // -- MDN, https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Property_accessors#Property_names
    //
    // So, to ensure that we are checking the same `name` that JavaScript would use, we cast it
    // to a string. It's not always possible. If `name` is an object and its `toString` method is
    // 'broken' (doesn't return a string, isn't a function, etc.), an error will be thrown:
    //
    // TypeError: Cannot convert object to primitive value
    //
    // For performance reasons, we don't catch this error here and allow it to propagate up the call
    // stack. Note that you'll get the same error in JavaScript if you try to access a property using
    // such a 'broken' object as a key.
    return name + "";
  }
  var OPERATORS = createMap();
  forEach("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function (operator) {
    OPERATORS[operator] = true;
  });
  var ESCAPE = {
    n: "\n",
    f: "\f",
    r: "\r",
    t: "\t",
    v: "\v",
    "'": "'",
    '"': '"'
  };

  /////////////////////////////////////////

  /**
   * @constructor
   */
  function Lexer(options) {
    this.options = options;
  }
  ;
  Lexer.prototype = {
    constructor: Lexer,
    lex: function lex(text) {
      this.text = text;
      this.index = 0;
      this.tokens = [];
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        if (ch === '"' || ch === "'") {
          this.readString(ch);
        } else if (this.isNumber(ch) || ch === "." && this.isNumber(this.peek())) {
          this.readNumber();
        } else if (this.isIdentifierStart(this.peekMultichar())) {
          this.readIdent();
        } else if (this.is(ch, "(){}[].,;:?")) {
          this.tokens.push({
            index: this.index,
            text: ch
          });
          this.index++;
        } else if (this.isWhitespace(ch)) {
          this.index++;
        } else {
          var ch2 = ch + this.peek();
          var ch3 = ch2 + this.peek(2);
          var op1 = OPERATORS[ch];
          var op2 = OPERATORS[ch2];
          var op3 = OPERATORS[ch3];
          if (op1 || op2 || op3) {
            var token = op3 ? ch3 : op2 ? ch2 : ch;
            this.tokens.push({
              index: this.index,
              text: token,
              operator: true
            });
            this.index += token.length;
          } else {
            this.throwError("Unexpected next character ", this.index, this.index + 1);
          }
        }
      }
      return this.tokens;
    },
    is: function is(ch, chars) {
      return chars.indexOf(ch) !== -1;
    },
    peek: function peek(i) {
      var num = i || 1;
      return this.index + num < this.text.length ? this.text.charAt(this.index + num) : false;
    },
    isNumber: function isNumber(ch) {
      return "0" <= ch && ch <= "9" && typeof ch === "string";
    },
    isWhitespace: function isWhitespace(ch) {
      // IE treats non-breaking space as \u00A0
      return ch === " " || ch === "\r" || ch === "\t" || ch === "\n" || ch === "\v" || ch === "\xA0";
    },
    isIdentifierStart: function isIdentifierStart(ch) {
      return this.options.isIdentifierStart ? this.options.isIdentifierStart(ch, this.codePointAt(ch)) : this.isValidIdentifierStart(ch);
    },
    isValidIdentifierStart: function isValidIdentifierStart(ch) {
      return "a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || ch === "$";
    },
    isIdentifierContinue: function isIdentifierContinue(ch) {
      return this.options.isIdentifierContinue ? this.options.isIdentifierContinue(ch, this.codePointAt(ch)) : this.isValidIdentifierContinue(ch);
    },
    isValidIdentifierContinue: function isValidIdentifierContinue(ch, cp) {
      return this.isValidIdentifierStart(ch, cp) || this.isNumber(ch);
    },
    codePointAt: function codePointAt(ch) {
      if (ch.length === 1) return ch.charCodeAt(0);
      // eslint-disable-next-line no-bitwise
      return (ch.charCodeAt(0) << 10) + ch.charCodeAt(1) - 0x35fdc00;
    },
    peekMultichar: function peekMultichar() {
      var ch = this.text.charAt(this.index);
      var peek = this.peek();
      if (!peek) {
        return ch;
      }
      var cp1 = ch.charCodeAt(0);
      var cp2 = peek.charCodeAt(0);
      if (cp1 >= 0xd800 && cp1 <= 0xdbff && cp2 >= 0xdc00 && cp2 <= 0xdfff) {
        return ch + peek;
      }
      return ch;
    },
    isExpOperator: function isExpOperator(ch) {
      return ch === "-" || ch === "+" || this.isNumber(ch);
    },
    throwError: function throwError(error, start, end) {
      end = end || this.index;
      var colStr = isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end;
      throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
    },
    readNumber: function readNumber() {
      var number = "";
      var start = this.index;
      while (this.index < this.text.length) {
        var ch = lowercase(this.text.charAt(this.index));
        if (ch === "." || this.isNumber(ch)) {
          number += ch;
        } else {
          var peekCh = this.peek();
          if (ch === "e" && this.isExpOperator(peekCh)) {
            number += ch;
          } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) === "e") {
            number += ch;
          } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) === "e") {
            this.throwError("Invalid exponent");
          } else {
            break;
          }
        }
        this.index++;
      }
      this.tokens.push({
        index: start,
        text: number,
        constant: true,
        value: Number(number)
      });
    },
    readIdent: function readIdent() {
      var start = this.index;
      this.index += this.peekMultichar().length;
      while (this.index < this.text.length) {
        var ch = this.peekMultichar();
        if (!this.isIdentifierContinue(ch)) {
          break;
        }
        this.index += ch.length;
      }
      this.tokens.push({
        index: start,
        text: this.text.slice(start, this.index),
        identifier: true
      });
    },
    readString: function readString(quote) {
      var start = this.index;
      this.index++;
      var string = "";
      var rawString = quote;
      var escape = false;
      while (this.index < this.text.length) {
        var ch = this.text.charAt(this.index);
        rawString += ch;
        if (escape) {
          if (ch === "u") {
            var hex = this.text.substring(this.index + 1, this.index + 5);
            if (!hex.match(/[\da-f]{4}/i)) {
              this.throwError("Invalid unicode escape [\\u" + hex + "]");
            }
            this.index += 4;
            string += String.fromCharCode(parseInt(hex, 16));
          } else {
            var rep = ESCAPE[ch];
            string = string + (rep || ch);
          }
          escape = false;
        } else if (ch === "\\") {
          escape = true;
        } else if (ch === quote) {
          this.index++;
          this.tokens.push({
            index: start,
            text: rawString,
            constant: true,
            value: string
          });
          return;
        } else {
          string += ch;
        }
        this.index++;
      }
      this.throwError("Unterminated quote", start);
    }
  };
  function AST(lexer, options) {
    this.lexer = lexer;
    this.options = options;
  }
  ;
  AST.Program = "Program";
  AST.ExpressionStatement = "ExpressionStatement";
  AST.AssignmentExpression = "AssignmentExpression";
  AST.ConditionalExpression = "ConditionalExpression";
  AST.LogicalExpression = "LogicalExpression";
  AST.BinaryExpression = "BinaryExpression";
  AST.UnaryExpression = "UnaryExpression";
  AST.CallExpression = "CallExpression";
  AST.MemberExpression = "MemberExpression";
  AST.Identifier = "Identifier";
  AST.Literal = "Literal";
  AST.ArrayExpression = "ArrayExpression";
  AST.Property = "Property";
  AST.ObjectExpression = "ObjectExpression";
  AST.ThisExpression = "ThisExpression";
  AST.LocalsExpression = "LocalsExpression";

  // Internal use only
  AST.NGValueParameter = "NGValueParameter";
  AST.prototype = {
    ast: function ast(text) {
      this.text = text;
      this.tokens = this.lexer.lex(text);
      var value = this.program();
      if (this.tokens.length !== 0) {
        this.throwError("is an unexpected token", this.tokens[0]);
      }
      return value;
    },
    program: function program() {
      var body = [];
      while (true) {
        if (this.tokens.length > 0 && !this.peek("}", ")", ";", "]")) body.push(this.expressionStatement());
        if (!this.expect(";")) {
          return {
            type: AST.Program,
            body: body
          };
        }
      }
    },
    expressionStatement: function expressionStatement() {
      return {
        type: AST.ExpressionStatement,
        expression: this.filterChain()
      };
    },
    filterChain: function filterChain() {
      var left = this.expression();
      while (this.expect("|")) {
        left = this.filter(left);
      }
      return left;
    },
    expression: function expression() {
      return this.assignment();
    },
    assignment: function assignment() {
      var result = this.ternary();
      if (this.expect("=")) {
        if (!isAssignable(result)) {
          throw $parseMinErr("lval", "Trying to assign a value to a non l-value");
        }
        result = {
          type: AST.AssignmentExpression,
          left: result,
          right: this.assignment(),
          operator: "="
        };
      }
      return result;
    },
    ternary: function ternary() {
      var test = this.logicalOR();
      var alternate;
      var consequent;
      if (this.expect("?")) {
        alternate = this.expression();
        if (this.consume(":")) {
          consequent = this.expression();
          return {
            type: AST.ConditionalExpression,
            test: test,
            alternate: alternate,
            consequent: consequent
          };
        }
      }
      return test;
    },
    logicalOR: function logicalOR() {
      var left = this.logicalAND();
      while (this.expect("||")) {
        left = {
          type: AST.LogicalExpression,
          operator: "||",
          left: left,
          right: this.logicalAND()
        };
      }
      return left;
    },
    logicalAND: function logicalAND() {
      var left = this.equality();
      while (this.expect("&&")) {
        left = {
          type: AST.LogicalExpression,
          operator: "&&",
          left: left,
          right: this.equality()
        };
      }
      return left;
    },
    equality: function equality() {
      var left = this.relational();
      var token;
      while (token = this.expect("==", "!=", "===", "!==")) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.relational()
        };
      }
      return left;
    },
    relational: function relational() {
      var left = this.additive();
      var token;
      while (token = this.expect("<", ">", "<=", ">=")) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.additive()
        };
      }
      return left;
    },
    additive: function additive() {
      var left = this.multiplicative();
      var token;
      while (token = this.expect("+", "-")) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.multiplicative()
        };
      }
      return left;
    },
    multiplicative: function multiplicative() {
      var left = this.unary();
      var token;
      while (token = this.expect("*", "/", "%")) {
        left = {
          type: AST.BinaryExpression,
          operator: token.text,
          left: left,
          right: this.unary()
        };
      }
      return left;
    },
    unary: function unary() {
      var token;
      if (token = this.expect("+", "-", "!")) {
        return {
          type: AST.UnaryExpression,
          operator: token.text,
          prefix: true,
          argument: this.unary()
        };
      } else {
        return this.primary();
      }
    },
    primary: function primary() {
      var primary;
      if (this.expect("(")) {
        primary = this.filterChain();
        this.consume(")");
      } else if (this.expect("[")) {
        primary = this.arrayDeclaration();
      } else if (this.expect("{")) {
        primary = this.object();
      } else if (this.selfReferential.hasOwnProperty(this.peek().text)) {
        primary = copy(this.selfReferential[this.consume().text]);
      } else if (this.options.literals.hasOwnProperty(this.peek().text)) {
        primary = {
          type: AST.Literal,
          value: this.options.literals[this.consume().text]
        };
      } else if (this.peek().identifier) {
        primary = this.identifier();
      } else if (this.peek().constant) {
        primary = this.constant();
      } else {
        this.throwError("not a primary expression", this.peek());
      }
      var next;
      while (next = this.expect("(", "[", ".")) {
        if (next.text === "(") {
          primary = {
            type: AST.CallExpression,
            callee: primary,
            arguments: this.parseArguments()
          };
          this.consume(")");
        } else if (next.text === "[") {
          primary = {
            type: AST.MemberExpression,
            object: primary,
            property: this.expression(),
            computed: true
          };
          this.consume("]");
        } else if (next.text === ".") {
          primary = {
            type: AST.MemberExpression,
            object: primary,
            property: this.identifier(),
            computed: false
          };
        } else {
          this.throwError("IMPOSSIBLE");
        }
      }
      return primary;
    },
    filter: function filter(baseExpression) {
      var args = [baseExpression];
      var result = {
        type: AST.CallExpression,
        callee: this.identifier(),
        arguments: args,
        filter: true
      };
      while (this.expect(":")) {
        args.push(this.expression());
      }
      return result;
    },
    parseArguments: function parseArguments() {
      var args = [];
      if (this.peekToken().text !== ")") {
        do {
          args.push(this.filterChain());
        } while (this.expect(","));
      }
      return args;
    },
    identifier: function identifier() {
      var token = this.consume();
      if (!token.identifier) {
        this.throwError("is not a valid identifier", token);
      }
      return {
        type: AST.Identifier,
        name: token.text
      };
    },
    constant: function constant() {
      // TODO check that it is a constant
      return {
        type: AST.Literal,
        value: this.consume().value
      };
    },
    arrayDeclaration: function arrayDeclaration() {
      var elements = [];
      if (this.peekToken().text !== "]") {
        do {
          if (this.peek("]")) {
            // Support trailing commas per ES5.1.
            break;
          }
          elements.push(this.expression());
        } while (this.expect(","));
      }
      this.consume("]");
      return {
        type: AST.ArrayExpression,
        elements: elements
      };
    },
    object: function object() {
      var properties = [],
        property;
      if (this.peekToken().text !== "}") {
        do {
          if (this.peek("}")) {
            // Support trailing commas per ES5.1.
            break;
          }
          property = {
            type: AST.Property,
            kind: "init"
          };
          if (this.peek().constant) {
            property.key = this.constant();
            property.computed = false;
            this.consume(":");
            property.value = this.expression();
          } else if (this.peek().identifier) {
            property.key = this.identifier();
            property.computed = false;
            if (this.peek(":")) {
              this.consume(":");
              property.value = this.expression();
            } else {
              property.value = property.key;
            }
          } else if (this.peek("[")) {
            this.consume("[");
            property.key = this.expression();
            this.consume("]");
            property.computed = true;
            this.consume(":");
            property.value = this.expression();
          } else {
            this.throwError("invalid key", this.peek());
          }
          properties.push(property);
        } while (this.expect(","));
      }
      this.consume("}");
      return {
        type: AST.ObjectExpression,
        properties: properties
      };
    },
    throwError: function throwError(msg, token) {
      throw $parseMinErr("syntax", "Syntax Error: Token '{0}' {1} at column {2} of the expression [{3}] starting at [{4}].", token.text, msg, token.index + 1, this.text, this.text.substring(token.index));
    },
    consume: function consume(e1) {
      if (this.tokens.length === 0) {
        throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
      }
      var token = this.expect(e1);
      if (!token) {
        this.throwError("is unexpected, expecting [" + e1 + "]", this.peek());
      }
      return token;
    },
    peekToken: function peekToken() {
      if (this.tokens.length === 0) {
        throw $parseMinErr("ueoe", "Unexpected end of expression: {0}", this.text);
      }
      return this.tokens[0];
    },
    peek: function peek(e1, e2, e3, e4) {
      return this.peekAhead(0, e1, e2, e3, e4);
    },
    peekAhead: function peekAhead(i, e1, e2, e3, e4) {
      if (this.tokens.length > i) {
        var token = this.tokens[i];
        var t = token.text;
        if (t === e1 || t === e2 || t === e3 || t === e4 || !e1 && !e2 && !e3 && !e4) {
          return token;
        }
      }
      return false;
    },
    expect: function expect(e1, e2, e3, e4) {
      var token = this.peek(e1, e2, e3, e4);
      if (token) {
        this.tokens.shift();
        return token;
      }
      return false;
    },
    selfReferential: {
      "this": {
        type: AST.ThisExpression
      },
      $locals: {
        type: AST.LocalsExpression
      }
    }
  };
  function ifDefined(v, d) {
    return typeof v !== "undefined" ? v : d;
  }
  function plusFn(l, r) {
    if (typeof l === "undefined") return r;
    if (typeof r === "undefined") return l;
    return l + r;
  }
  function isStateless($filter, filterName) {
    var fn = $filter(filterName);
    return !fn.$stateful;
  }
  function findConstantAndWatchExpressions(ast, $filter) {
    var allConstants;
    var argsToWatch;
    var isStatelessFilter;
    switch (ast.type) {
      case AST.Program:
        allConstants = true;
        forEach(ast.body, function (expr) {
          findConstantAndWatchExpressions(expr.expression, $filter);
          allConstants = allConstants && expr.expression.constant;
        });
        ast.constant = allConstants;
        break;
      case AST.Literal:
        ast.constant = true;
        ast.toWatch = [];
        break;
      case AST.UnaryExpression:
        findConstantAndWatchExpressions(ast.argument, $filter);
        ast.constant = ast.argument.constant;
        ast.toWatch = ast.argument.toWatch;
        break;
      case AST.BinaryExpression:
        findConstantAndWatchExpressions(ast.left, $filter);
        findConstantAndWatchExpressions(ast.right, $filter);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = ast.left.toWatch.concat(ast.right.toWatch);
        break;
      case AST.LogicalExpression:
        findConstantAndWatchExpressions(ast.left, $filter);
        findConstantAndWatchExpressions(ast.right, $filter);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = ast.constant ? [] : [ast];
        break;
      case AST.ConditionalExpression:
        findConstantAndWatchExpressions(ast.test, $filter);
        findConstantAndWatchExpressions(ast.alternate, $filter);
        findConstantAndWatchExpressions(ast.consequent, $filter);
        ast.constant = ast.test.constant && ast.alternate.constant && ast.consequent.constant;
        ast.toWatch = ast.constant ? [] : [ast];
        break;
      case AST.Identifier:
        ast.constant = false;
        ast.toWatch = [ast];
        break;
      case AST.MemberExpression:
        findConstantAndWatchExpressions(ast.object, $filter);
        if (ast.computed) {
          findConstantAndWatchExpressions(ast.property, $filter);
        }
        ast.constant = ast.object.constant && (!ast.computed || ast.property.constant);
        ast.toWatch = [ast];
        break;
      case AST.CallExpression:
        isStatelessFilter = ast.filter ? isStateless($filter, ast.callee.name) : false;
        allConstants = isStatelessFilter;
        argsToWatch = [];
        forEach(ast.arguments, function (expr) {
          findConstantAndWatchExpressions(expr, $filter);
          allConstants = allConstants && expr.constant;
          if (!expr.constant) {
            argsToWatch.push.apply(argsToWatch, expr.toWatch);
          }
        });
        ast.constant = allConstants;
        ast.toWatch = isStatelessFilter ? argsToWatch : [ast];
        break;
      case AST.AssignmentExpression:
        findConstantAndWatchExpressions(ast.left, $filter);
        findConstantAndWatchExpressions(ast.right, $filter);
        ast.constant = ast.left.constant && ast.right.constant;
        ast.toWatch = [ast];
        break;
      case AST.ArrayExpression:
        allConstants = true;
        argsToWatch = [];
        forEach(ast.elements, function (expr) {
          findConstantAndWatchExpressions(expr, $filter);
          allConstants = allConstants && expr.constant;
          if (!expr.constant) {
            argsToWatch.push.apply(argsToWatch, expr.toWatch);
          }
        });
        ast.constant = allConstants;
        ast.toWatch = argsToWatch;
        break;
      case AST.ObjectExpression:
        allConstants = true;
        argsToWatch = [];
        forEach(ast.properties, function (property) {
          findConstantAndWatchExpressions(property.value, $filter);
          allConstants = allConstants && property.value.constant && !property.computed;
          if (!property.value.constant) {
            argsToWatch.push.apply(argsToWatch, property.value.toWatch);
          }
        });
        ast.constant = allConstants;
        ast.toWatch = argsToWatch;
        break;
      case AST.ThisExpression:
        ast.constant = false;
        ast.toWatch = [];
        break;
      case AST.LocalsExpression:
        ast.constant = false;
        ast.toWatch = [];
        break;
    }
  }
  function getInputs(body) {
    if (body.length !== 1) return;
    var lastExpression = body[0].expression;
    var candidate = lastExpression.toWatch;
    if (candidate.length !== 1) return candidate;
    return candidate[0] !== lastExpression ? candidate : undefined;
  }
  function isAssignable(ast) {
    return ast.type === AST.Identifier || ast.type === AST.MemberExpression;
  }
  function assignableAST(ast) {
    if (ast.body.length === 1 && isAssignable(ast.body[0].expression)) {
      return {
        type: AST.AssignmentExpression,
        left: ast.body[0].expression,
        right: {
          type: AST.NGValueParameter
        },
        operator: "="
      };
    }
  }
  function isLiteral(ast) {
    return ast.body.length === 0 || ast.body.length === 1 && (ast.body[0].expression.type === AST.Literal || ast.body[0].expression.type === AST.ArrayExpression || ast.body[0].expression.type === AST.ObjectExpression);
  }
  function isConstant(ast) {
    return ast.constant;
  }
  function ASTCompiler(astBuilder, $filter) {
    this.astBuilder = astBuilder;
    this.$filter = $filter;
  }
  ASTCompiler.prototype = {
    compile: function compile(expression) {
      var self = this;
      var ast = this.astBuilder.ast(expression);
      this.state = {
        nextId: 0,
        filters: {},
        fn: {
          vars: [],
          body: [],
          own: {}
        },
        assign: {
          vars: [],
          body: [],
          own: {}
        },
        inputs: []
      };
      findConstantAndWatchExpressions(ast, self.$filter);
      var extra = "";
      var assignable;
      this.stage = "assign";
      if (assignable = assignableAST(ast)) {
        this.state.computing = "assign";
        var result = this.nextId();
        this.recurse(assignable, result);
        this.return_(result);
        extra = "fn.assign=" + this.generateFunction("assign", "s,v,l");
      }
      var toWatch = getInputs(ast.body);
      self.stage = "inputs";
      forEach(toWatch, function (watch, key) {
        var fnKey = "fn" + key;
        self.state[fnKey] = {
          vars: [],
          body: [],
          own: {}
        };
        self.state.computing = fnKey;
        var intoId = self.nextId();
        self.recurse(watch, intoId);
        self.return_(intoId);
        self.state.inputs.push(fnKey);
        watch.watchId = key;
      });
      this.state.computing = "fn";
      this.stage = "main";
      this.recurse(ast);
      var fnString =
      // The build and minification steps remove the string "use strict" from the code, but this is done using a regex.
      // This is a workaround for this until we do a better job at only removing the prefix only when we should.
      '"' + this.USE + " " + this.STRICT + '";\n' + this.filterPrefix() + "var fn=" + this.generateFunction("fn", "s,l,a,i") + extra + this.watchFns() + "return fn;";
      // eslint-disable-next-line no-new-func
      var fn = new Function("$filter", "getStringValue", "ifDefined", "plus", fnString)(this.$filter, getStringValue, ifDefined, plusFn);
      this.state = this.stage = undefined;
      fn.ast = ast;
      fn.literal = isLiteral(ast);
      fn.constant = isConstant(ast);
      return fn;
    },
    USE: "use",
    STRICT: "strict",
    watchFns: function watchFns() {
      var result = [];
      var fns = this.state.inputs;
      var self = this;
      forEach(fns, function (name) {
        result.push("var " + name + "=" + self.generateFunction(name, "s"));
      });
      if (fns.length) {
        result.push("fn.inputs=[" + fns.join(",") + "];");
      }
      return result.join("");
    },
    generateFunction: function generateFunction(name, params) {
      return "function(" + params + "){" + this.varsPrefix(name) + this.body(name) + "};";
    },
    filterPrefix: function filterPrefix() {
      var parts = [];
      var self = this;
      forEach(this.state.filters, function (id, filter) {
        parts.push(id + "=$filter(" + self.escape(filter) + ")");
      });
      if (parts.length) return "var " + parts.join(",") + ";";
      return "";
    },
    varsPrefix: function varsPrefix(section) {
      return this.state[section].vars.length ? "var " + this.state[section].vars.join(",") + ";" : "";
    },
    body: function body(section) {
      return this.state[section].body.join("");
    },
    recurse: function recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
      var left,
        right,
        self = this,
        args,
        expression,
        computed;
      recursionFn = recursionFn || noop;
      if (!skipWatchIdCheck && isDefined(ast.watchId)) {
        intoId = intoId || this.nextId();
        this.if_("i", this.lazyAssign(intoId, this.unsafeComputedMember("i", ast.watchId)), this.lazyRecurse(ast, intoId, nameId, recursionFn, create, true));
        return;
      }
      switch (ast.type) {
        case AST.Program:
          forEach(ast.body, function (expression, pos) {
            self.recurse(expression.expression, undefined, undefined, function (expr) {
              right = expr;
            });
            if (pos !== ast.body.length - 1) {
              self.current().body.push(right, ";");
            } else {
              self.return_(right);
            }
          });
          break;
        case AST.Literal:
          expression = this.escape(ast.value);
          this.assign(intoId, expression);
          recursionFn(intoId || expression);
          break;
        case AST.UnaryExpression:
          this.recurse(ast.argument, undefined, undefined, function (expr) {
            right = expr;
          });
          expression = ast.operator + "(" + this.ifDefined(right, 0) + ")";
          this.assign(intoId, expression);
          recursionFn(expression);
          break;
        case AST.BinaryExpression:
          this.recurse(ast.left, undefined, undefined, function (expr) {
            left = expr;
          });
          this.recurse(ast.right, undefined, undefined, function (expr) {
            right = expr;
          });
          if (ast.operator === "+") {
            expression = this.plus(left, right);
          } else if (ast.operator === "-") {
            expression = this.ifDefined(left, 0) + ast.operator + this.ifDefined(right, 0);
          } else {
            expression = "(" + left + ")" + ast.operator + "(" + right + ")";
          }
          this.assign(intoId, expression);
          recursionFn(expression);
          break;
        case AST.LogicalExpression:
          intoId = intoId || this.nextId();
          self.recurse(ast.left, intoId);
          self.if_(ast.operator === "&&" ? intoId : self.not(intoId), self.lazyRecurse(ast.right, intoId));
          recursionFn(intoId);
          break;
        case AST.ConditionalExpression:
          intoId = intoId || this.nextId();
          self.recurse(ast.test, intoId);
          self.if_(intoId, self.lazyRecurse(ast.alternate, intoId), self.lazyRecurse(ast.consequent, intoId));
          recursionFn(intoId);
          break;
        case AST.Identifier:
          intoId = intoId || this.nextId();
          if (nameId) {
            nameId.context = self.stage === "inputs" ? "s" : this.assign(this.nextId(), this.getHasOwnProperty("l", ast.name) + "?l:s");
            nameId.computed = false;
            nameId.name = ast.name;
          }
          self.if_(self.stage === "inputs" || self.not(self.getHasOwnProperty("l", ast.name)), function () {
            self.if_(self.stage === "inputs" || self.and_("s", self.or_(self.isNull(self.nonComputedMember("s", ast.name)), self.has_("s", ast.name))), function () {
              if (create && create !== 1) {
                self.if_(self.isNull(self.nonComputedMember("s", ast.name)), self.lazyAssign(self.nonComputedMember("s", ast.name), "{}"));
              }
              self.assign(intoId, self.nonComputedMember("s", ast.name));
            });
          }, intoId && self.lazyAssign(intoId, self.nonComputedMember("l", ast.name)));
          recursionFn(intoId);
          break;
        case AST.MemberExpression:
          left = nameId && (nameId.context = this.nextId()) || this.nextId();
          intoId = intoId || this.nextId();
          self.recurse(ast.object, left, undefined, function () {
            var member = null;
            var inAssignment = self.current().inAssignment;
            if (ast.computed) {
              right = self.nextId();
              if (inAssignment || self.state.computing === "assign") {
                member = self.unsafeComputedMember(left, right);
              } else {
                member = self.computedMember(left, right);
              }
            } else {
              if (inAssignment || self.state.computing === "assign") {
                member = self.unsafeNonComputedMember(left, ast.property.name);
              } else {
                member = self.nonComputedMember(left, ast.property.name);
              }
              right = ast.property.name;
            }
            if (ast.computed) {
              if (ast.property.type === AST.Literal) {
                self.recurse(ast.property, right);
              }
            }
            self.if_(self.and_(self.notNull(left), self.or_(self.isNull(member), self.has_(left, right, ast.computed))), function () {
              if (ast.computed) {
                if (ast.property.type !== AST.Literal) {
                  self.recurse(ast.property, right);
                }
                if (create && create !== 1) {
                  self.if_(self.not(member), self.lazyAssign(member, "{}"));
                }
                self.assign(intoId, member);
                if (nameId) {
                  nameId.computed = true;
                  nameId.name = right;
                }
              } else {
                if (create && create !== 1) {
                  self.if_(self.isNull(member), self.lazyAssign(member, "{}"));
                }
                self.assign(intoId, member);
                if (nameId) {
                  nameId.computed = false;
                  nameId.name = ast.property.name;
                }
              }
            }, function () {
              self.assign(intoId, "undefined");
            });
            recursionFn(intoId);
          }, !!create);
          break;
        case AST.CallExpression:
          intoId = intoId || this.nextId();
          if (ast.filter) {
            right = self.filter(ast.callee.name);
            args = [];
            forEach(ast.arguments, function (expr) {
              var argument = self.nextId();
              self.recurse(expr, argument);
              args.push(argument);
            });
            expression = right + ".call(" + right + "," + args.join(",") + ")";
            self.assign(intoId, expression);
            recursionFn(intoId);
          } else {
            right = self.nextId();
            left = {};
            args = [];
            self.recurse(ast.callee, right, left, function () {
              self.if_(self.notNull(right), function () {
                forEach(ast.arguments, function (expr) {
                  self.recurse(expr, ast.constant ? undefined : self.nextId(), undefined, function (argument) {
                    args.push(argument);
                  });
                });
                if (left.name) {
                  var x = self.member(left.context, left.name, left.computed);
                  expression = "(" + x + " === null ? null : " + self.unsafeMember(left.context, left.name, left.computed) + ".call(" + [left.context].concat(args).join(",") + "))";
                } else {
                  expression = right + "(" + args.join(",") + ")";
                }
                self.assign(intoId, expression);
              }, function () {
                self.assign(intoId, "undefined");
              });
              recursionFn(intoId);
            });
          }
          break;
        case AST.AssignmentExpression:
          right = this.nextId();
          left = {};
          self.current().inAssignment = true;
          this.recurse(ast.left, undefined, left, function () {
            self.if_(self.and_(self.notNull(left.context), self.or_(self.has_(left.context, left.name), self.isNull(self.member(left.context, left.name, left.computed)))), function () {
              self.recurse(ast.right, right);
              expression = self.member(left.context, left.name, left.computed) + ast.operator + right;
              self.assign(intoId, expression);
              recursionFn(intoId || expression);
            });
            self.current().inAssignment = false;
            self.recurse(ast.right, right);
            self.current().inAssignment = true;
          }, 1);
          self.current().inAssignment = false;
          break;
        case AST.ArrayExpression:
          args = [];
          forEach(ast.elements, function (expr) {
            self.recurse(expr, ast.constant ? undefined : self.nextId(), undefined, function (argument) {
              args.push(argument);
            });
          });
          expression = "[" + args.join(",") + "]";
          this.assign(intoId, expression);
          recursionFn(intoId || expression);
          break;
        case AST.ObjectExpression:
          args = [];
          computed = false;
          forEach(ast.properties, function (property) {
            if (property.computed) {
              computed = true;
            }
          });
          if (computed) {
            intoId = intoId || this.nextId();
            this.assign(intoId, "{}");
            forEach(ast.properties, function (property) {
              if (property.computed) {
                left = self.nextId();
                self.recurse(property.key, left);
              } else {
                left = property.key.type === AST.Identifier ? property.key.name : "" + property.key.value;
              }
              right = self.nextId();
              self.recurse(property.value, right);
              self.assign(self.unsafeMember(intoId, left, property.computed), right);
            });
          } else {
            forEach(ast.properties, function (property) {
              self.recurse(property.value, ast.constant ? undefined : self.nextId(), undefined, function (expr) {
                args.push(self.escape(property.key.type === AST.Identifier ? property.key.name : "" + property.key.value) + ":" + expr);
              });
            });
            expression = "{" + args.join(",") + "}";
            this.assign(intoId, expression);
          }
          recursionFn(intoId || expression);
          break;
        case AST.ThisExpression:
          this.assign(intoId, "s");
          recursionFn(intoId || "s");
          break;
        case AST.LocalsExpression:
          this.assign(intoId, "l");
          recursionFn(intoId || "l");
          break;
        case AST.NGValueParameter:
          this.assign(intoId, "v");
          recursionFn(intoId || "v");
          break;
      }
    },
    getHasOwnProperty: function getHasOwnProperty(element, property) {
      var key = element + "." + property;
      var own = this.current().own;
      if (!own.hasOwnProperty(key)) {
        own[key] = this.nextId(false, element + "&&(" + this.escape(property) + " in " + element + ")");
      }
      return own[key];
    },
    assign: function assign(id, value) {
      if (!id) return;
      this.current().body.push(id, "=", value, ";");
      return id;
    },
    filter: function filter(filterName) {
      if (!this.state.filters.hasOwnProperty(filterName)) {
        this.state.filters[filterName] = this.nextId(true);
      }
      return this.state.filters[filterName];
    },
    ifDefined: function ifDefined(id, defaultValue) {
      return "ifDefined(" + id + "," + this.escape(defaultValue) + ")";
    },
    plus: function plus(left, right) {
      return "plus(" + left + "," + right + ")";
    },
    return_: function return_(id) {
      this.current().body.push("return ", id, ";");
    },
    if_: function if_(test, alternate, consequent) {
      if (test === true) {
        alternate();
      } else {
        var body = this.current().body;
        body.push("if(", test, "){");
        alternate();
        body.push("}");
        if (consequent) {
          body.push("else{");
          consequent();
          body.push("}");
        }
      }
    },
    or_: function or_(expr1, expr2) {
      return "(" + expr1 + ") || (" + expr2 + ")";
    },
    // hasOwnProperty_: function (obj, prop, computed) {
    //   if (computed) {
    //     return "(Object.prototype.hasOwnProperty.call(" + obj + "," + prop + "))";
    //   } else {
    //     return (
    //       "(Object.prototype.hasOwnProperty.call(" + obj + ",'" + prop + "'))"
    //     );
    //   }
    // },
    hasProperty_: function hasProperty_(obj, prop, computed) {
      if (computed) {
        return "(" + prop + " in " + obj + ")";
      } else {
        return "('" + prop + "' in " + obj + ")";
      }
    },
    has_: function has_(obj, prop, computed) {
      // return this.hasOwnProperty_(obj, prop, computed)

      // here is what I changed in fork
      // in original library, the pareser can only parse properties which is own properties, this make it impossible to read from prototype
      // so I changed it
      return this.hasProperty_(obj, prop, computed);
    },
    and_: function and_(expr1, expr2) {
      return "(" + expr1 + ") && (" + expr2 + ")";
    },
    not: function not(expression) {
      return "!(" + expression + ")";
    },
    isNull: function isNull(expression) {
      return expression + "==null";
    },
    notNull: function notNull(expression) {
      return expression + "!=null";
    },
    nonComputedMember: function nonComputedMember(left, right) {
      var SAFE_IDENTIFIER = /^[$_a-zA-Z][$_a-zA-Z0-9]*$/;
      var UNSAFE_CHARACTERS = /[^$_a-zA-Z0-9]/g;
      var expr = "";
      if (SAFE_IDENTIFIER.test(right)) {
        expr = left + "." + right;
      } else {
        right = right.replace(UNSAFE_CHARACTERS, this.stringEscapeFn);
        expr = left + '["' + right + '"]';
      }
      return expr;
    },
    unsafeComputedMember: function unsafeComputedMember(left, right) {
      return left + "[" + right + "]";
    },
    unsafeNonComputedMember: function unsafeNonComputedMember(left, right) {
      return this.nonComputedMember(left, right);
    },
    computedMember: function computedMember(left, right) {
      if (this.state.computing === "assign") {
        return this.unsafeComputedMember(left, right);
      }
      // return left + "[" + right + "]";
      return "(" + left + ".hasOwnProperty(" + right + ") ? " + left + "[" + right + "] : null)";
    },
    unsafeMember: function unsafeMember(left, right, computed) {
      if (computed) return this.unsafeComputedMember(left, right);
      return this.unsafeNonComputedMember(left, right);
    },
    member: function member(left, right, computed) {
      if (computed) return this.computedMember(left, right);
      return this.nonComputedMember(left, right);
    },
    getStringValue: function getStringValue(item) {
      this.assign(item, "getStringValue(" + item + ")");
    },
    lazyRecurse: function lazyRecurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck) {
      var self = this;
      return function () {
        self.recurse(ast, intoId, nameId, recursionFn, create, skipWatchIdCheck);
      };
    },
    lazyAssign: function lazyAssign(id, value) {
      var self = this;
      return function () {
        self.assign(id, value);
      };
    },
    stringEscapeRegex: /[^ a-zA-Z0-9]/g,
    stringEscapeFn: function stringEscapeFn(c) {
      return "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);
    },
    escape: function escape(value) {
      if (isString(value)) return "'" + value.replace(this.stringEscapeRegex, this.stringEscapeFn) + "'";
      if (isNumber(value)) return value.toString();
      if (value === true) return "true";
      if (value === false) return "false";
      if (value === null) return "null";
      if (typeof value === "undefined") return "undefined";
      throw $parseMinErr("esc", "IMPOSSIBLE");
    },
    nextId: function nextId(skip, init) {
      var id = "v" + this.state.nextId++;
      if (!skip) {
        this.current().vars.push(id + (init ? "=" + init : ""));
      }
      return id;
    },
    current: function current() {
      return this.state[this.state.computing];
    }
  };

  /**
   * @constructor
   */
  function Parser(lexer, $filter, options) {
    this.lexer = lexer;
    this.$filter = $filter;
    this.options = options;
    this.ast = new AST(lexer, options);
    this.astCompiler = new ASTCompiler(this.ast, $filter);
  }
  ;
  Parser.prototype = {
    constructor: Parser,
    parse: function parse(text) {
      return this.astCompiler.compile(text);
    }
  };

  ///////////////////////////////////

  /**
   * @ngdoc service
   * @name $parse
   * @kind function
   *
   * @description
   *
   * Converts Angular {@link guide/expression expression} into a function.
   *
   * ```js
   *   var getter = $parse('user.name');
   *   var setter = getter.assign;
   *   var context = {user:{name:'angular'}};
   *   var locals = {user:{name:'local'}};
   *
   *   expect(getter(context)).toEqual('angular');
   *   setter(context, 'newValue');
   *   expect(context.user.name).toEqual('newValue');
   *   expect(getter(context, locals)).toEqual('local');
   * ```
   *
   *
   * @param {string} expression String expression to compile.
   * @returns {function(context, locals)} a function which represents the compiled expression:
   *
   *    * `context` – `{object}` – an object against which any expressions embedded in the strings
   *      are evaluated against (typically a scope object).
   *    * `locals` – `{object=}` – local variables context object, useful for overriding values in
   *      `context`.
   *
   *    The returned function also has the following properties:
   *      * `literal` – `{boolean}` – whether the expression's top-level node is a JavaScript
   *        literal.
   *      * `constant` – `{boolean}` – whether the expression is made entirely of JavaScript
   *        constant literals.
   *      * `assign` – `{?function(context, value)}` – if the expression is assignable, this will be
   *        set to a function to change its value on the given context.
   *
   */

  /**
   *
   * @param {object} data
   * @param {object} options
   */
  function ScopeX(data, options) {
    var parserOptions = {
      expensiveChecks: true,
      literals: {
        "true": true,
        "false": false,
        "null": null,
        /*eslint no-undefined: 0*/
        undefined: undefined
        /* eslint: no-undefined: 1  */
      }
    };
    var filters = options && options.filters ? assign({}, options.filters) : {};
    var lexer = new Lexer({});
    var parser = new Parser(lexer, function getFilter(name) {
      return filters[name];
    }, parserOptions);
    var caches = {};

    /**
     * Compiles src and returns a function that executes src on a target object.
     * The compiled function is cached under caches[src] to speed up further calls.
     *
     * @param {string} src
     * @returns {function}
     */
    function compile(src) {
      var cached;
      if (typeof src !== 'string') {
        throw new TypeError('ScopeX need a string, but saw ' + _typeof(src));
      }
      cached = caches[src];
      if (!cached) {
        cached = caches[src] = parser.parse(src);
      }
      return cached;
    }
    this.options = options;
    this.filters = filters;
    this.compile = compile;
    this.data = data ? data : {};
  }
  ScopeX.prototype.filter = function (name, fn) {
    this.filters[name] = fn;
  };
  ScopeX.prototype.parse = function (str) {
    return this.compile(str)(this.data);
  };
  ScopeX.prototype.assign = function (key, value) {
    var ev = this.compile(key);
    ev.assign(this.data, value);
  };
  ScopeX.prototype.interpolate = function (str) {
    var reg = new RegExp('\{\{(.*?)\}\}(?!\})', 'g');
    var matches = str.match(reg);

    // if there is no mustache, return the original string
    if (!matches) {
      return str;
    }
    var $this = this;
    // create a convert function
    function convert(content) {
      var exp = content.trim().slice(2, -2);
      var res = $this.parse(exp);
      return res;
    }
    str = str.replace(reg, convert);
    return str;
  };
  ScopeX.prototype.$new = function (locals) {
    locals = locals || {};
    var data = isAbsObject(locals) ? setPrototypeOf(locals, this.data) : assign({}, locals);
    var scopex = new ScopeX(data, this.options);
    assign(scopex.filters, this.filters);
    return scopex;
  };
  function isAbsObject(value) {
    return value && _typeof(value) === 'object' && value.constructor === Object;
  }
  function hasOwnKey(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  function assign(a, b) {
    for (var i in b) {
      if (hasOwnKey(b, i)) {
        a[i] = b[i];
      }
    }
    return a;
  }
  function setPrototypeOf(obj, proto) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(obj, proto);
    } else {
      obj.__proto__ = proto;
    }
    return obj;
  }
  function uniqueArray(items) {
    return items.reduce(function (res, key) {
      if (res.indexOf(key) > -1) {
        return res;
      }
      res.push(key);
      return res;
    }, []);
  }
  ScopeX.createScope = createScope;

  /**
   * @param {object} scopeVars
   * @param {object[]|string[]} chain
   * @returns new ScopeX()
   */
  function createScope(scopeVars, options) {
    options = options || {};
    var chain = options.chain;
    var opts = assign({}, options);
    delete opts.chain;
    function ensureValue(value, target) {
      if (value && typeof value === 'function') {
        return value.bind(target);
      }
      return value;
    }
    var data = null;
    var deps = [];
    var collecting = false;
    function inheritFrom(child, parent) {
      return new Proxy({}, {
        get: function get(_, key) {
          var keyInChild = key in child;
          var keyInParent = key in parent;
          if (collecting && (keyInChild || keyInParent)) {
            deps.push(key);
          }
          if (keyInChild) {
            return ensureValue(child[key], child);
          }
          if (keyInParent) {
            return ensureValue(parent[key], parent);
          }
        },
        set: function set(_, key, value) {
          if (key in child) {
            child[key] = value;
          } else if (key in parent) {
            parent[key] = value;
          } else {
            child[key] = value;
          }
          return true;
        },
        deleteProperty: function deleteProperty() {
          return false;
        },
        has: function has(_, key) {
          if (key in child) {
            return true;
          }
          if (key in parent) {
            return true;
          }
          return false;
        },
        ownKeys: function ownKeys() {
          var keys = [];
          for (var key in child) {
            keys.push(key);
          }
          for (key in parent) {
            if (keys.indexOf(key) > -1) {
              continue;
            }
            keys.push(key);
          }
          return keys;
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor() {
          return {
            enumerable: true,
            configurable: true
          };
        }
      });
    }
    if (chain) {
      data = new Proxy({}, {
        get: function get(_, key) {
          for (var i = 0, len = chain.length; i < len; i++) {
            var item = chain[i];
            var isObj = _typeof(item) === 'object';
            var attr = isObj ? item.key : item;
            var env = scopeVars[attr];
            if (!env) {
              continue;
            }
            var vars = isObj && item.getter ? item.getter(env) : env;
            if (key in vars) {
              if (collecting) {
                deps.push(key);
              }
              var value = ensureValue(vars[key], vars);
              return value;
            }
          }
        },
        set: function set(_, key, value) {
          var bottom;
          for (var i = 0, len = chain.length; i < len; i++) {
            var item = chain[i];
            var isObj = _typeof(item) === 'object';
            var attr = isObj ? item.key : item;
            var env = scopeVars[attr];
            if (!env) {
              continue;
            }
            var vars = isObj && item.getter ? item.getter(env) : env;
            if (!bottom) {
              bottom = vars;
            }
            if (key in vars) {
              if (isObj && item.setter) {
                item.setter(key, value, vars, env);
              } else {
                vars[key] = value;
              }
              return true;
            }
          }
          if (bottom) {
            bottom[key] = value;
          }
          return true;
        },
        deleteProperty: function deleteProperty() {
          return false;
        },
        has: function has(_, key) {
          for (var i = 0, len = chain.length; i < len; i++) {
            var item = chain[i];
            var isObj = _typeof(item) === 'object';
            var attr = isObj ? item.key : item;
            var env = scopeVars[attr];
            if (!env) {
              continue;
            }
            var vars = isObj && item.getter ? item.getter(env) : env;
            if (key in vars) {
              return true;
            }
          }
          return false;
        },
        ownKeys: function ownKeys() {
          var keys = [];
          for (var i = 0, len = chain.length; i < len; i++) {
            var item = chain[i];
            var isObj = _typeof(item) === 'object';
            var attr = isObj ? item.key : item;
            var env = scopeVars[attr];
            if (!env) {
              continue;
            }
            var vars = isObj && item.getter ? item.getter(env) : env;
            for (var key in vars) {
              keys.push(key);
            }
          }
          var fkeys = uniqueArray(keys);
          return fkeys;
        },
        getOwnPropertyDescriptor: function getOwnPropertyDescriptor() {
          return {
            enumerable: true,
            configurable: true
          };
        }
      });
    } else {
      data = inheritFrom({}, scopeVars);
    }
    var scope = new ScopeX(data, opts);
    if (chain) {
      scope.vars = scopeVars;
      Object.defineProperty(scope, '$new', {
        value: function value(locals) {
          var sub = setPrototypeOf(locals, scopeVars);
          return createScope(sub, options);
        }
      });
    } else {
      Object.defineProperty(scope, '$new', {
        value: function value(locals) {
          var sub = inheritFrom(locals, data);
          return createScope(sub, options);
        }
      });
    }
    var parse = scope.parse.bind(scope);
    Object.defineProperty(scope, 'parse', {
      value: function value(exp, fn) {
        if (fn) {
          collecting = true;
        }
        var res = parse(exp);
        if (fn) {
          fn(uniqueArray(deps));
          deps.length = 0;
          collecting = false;
        }
        return res;
      }
    });
    return scope;
  }
  return ScopeX;
});

/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getOuterHTML */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return getNodeAttrs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createAttrsText; });
/* unused harmony export tryParseJSON */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return getPath; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return camelCase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return parseKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getNodeName; });
/* harmony import */ var ts_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86);
/* harmony import */ var ts_fns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(87);
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }

function getOuterHTML(el) {
  var nodeName = el.nodeName.toLowerCase();
  var attrs = _toConsumableArray(el.attributes).map(function (a) {
    if (a.value === '') {
      return a.name;
    } else if (a.value.indexOf('"') > -1) {
      return "".concat(a.name, "='").concat(a.value, "'");
    } else {
      return "".concat(a.name, "=\"").concat(a.value, "\"");
    }
  }).join(' ');
  var str = "<".concat(nodeName, " ").concat(attrs, "></").concat(nodeName, ">");
  return str;
}
function getNodeAttrs(el) {
  var attributes = el.attributes || [];
  var oAttrs = _toConsumableArray(attributes);
  var attrs = {};
  oAttrs.forEach(function (node) {
    var name = node.name,
      value = node.value;
    attrs[name] = value;
  });
  return attrs;
}
function createAttrsText(attrs) {
  var attrsTexts = [];
  Object(ts_fns__WEBPACK_IMPORTED_MODULE_0__[/* each */ "b"])(attrs, function (value, key) {
    attrsTexts.push("".concat(key, "=\"").concat(value, "\""));
  });
  var attrsText = attrsTexts.join(' ');
  return attrsText;
}
function tryParseJSON(v, callback) {
  try {
    var value = JSON.parse(v);
    return value;
  } catch (e) {
    return callback(v);
  }
}
function getPath($element, $root) {
  var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var $parent = $element.parent();
  if (!$parent.length) {
    return null;
  }
  var findIndex = function findIndex($parent, $child) {
    var children = $parent[0].childNodes;
    var child = $child[0];
    var index = 0;
    for (var i = 0, len = children.length; i < len; i++) {
      var item = children[i];
      if (item.nodeName === child.nodeName) {
        index++;
      }
      if (item === child) {
        return index;
      }
    }
  };
  var index = findIndex($parent, $element);
  var name = $element[0].nodeName.toLowerCase();
  var path = ["".concat(name, ":nth-of-type(").concat(index, ")")];
  var level = 0;
  while ($parent[0] !== $root[0]) {
    var _$element = $parent;
    $parent = $parent.parent();
    if (!$parent.length) {
      return null;
    }
    var _index = findIndex($parent, _$element);
    var _name = _$element[0].nodeName.toLowerCase();
    path.unshift("".concat(_name, ":nth-of-type(").concat(_index, ")"));
    level++;
    if (level > 20) {
      throw new Error('Cant get $element path in given $root.');
    }
  }
  var items = [].concat(prefix).concat(path);
  return '>' + items.join('>');
}
function camelCase(str) {
  var items = str.split(/\W|_/).filter(function (item) {
    return !!item;
  });
  var texts = items.map(function (item, i) {
    if (i === 0) {
      return item;
    }
    return item.replace(item[0], item[0].toUpperCase());
  });
  return texts.join('');
}
function parseKey(str) {
  var matched = str.match(/([a-zA-Z0-9_$]+)(\((.*?)\))?/);
  var _matched = _slicedToArray(matched, 4),
    name = _matched[1],
    _params = _matched[3];
  var params = Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* isString */ "n"])(_params) ? _params.split(',').map(function (item) {
    return item.trim();
  }).filter(function (item) {
    return !!item;
  }) : void 0;
  return [name, params];
}
function getNodeName(node) {
  return node.nodeName.toLowerCase();
}

/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export clone */
/* unused harmony export extend */
/* unused harmony export merge */
/* unused harmony export stringify */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return getObjectHash; });
/* unused harmony export define */
/* unused harmony export flat */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return each; });
/* unused harmony export map */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return filter; });
/* unused harmony export iterate */
/* unused harmony export find */
/* unused harmony export extract */
/* unused harmony export freeze */
/* unused harmony export createReactive */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createProxy; });
/* unused harmony export isProxy */
/* unused harmony export refineProxy */
/* unused harmony export getSymbolContent */
/* unused harmony export toEntries */
/* unused harmony export fromEntries */
/* harmony import */ var _string_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(89);
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(87);
/* harmony import */ var _syntax_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(90);
function _toArray(r) { return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest(); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }




/**
 * @param {any} obj
 */
function clone(obj) {
  var parents = [];
  var _clone = function clone(origin) {
    if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(origin) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(origin)) {
      return origin;
    }
    var result = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(origin) ? [] : {};
    var keys = Object.keys(origin);
    parents.push({
      origin: origin,
      result: result
    });
    var _loop = function _loop() {
      var key = keys[i];
      var value = origin[key];
      var referer = parents.find(function (item) {
        return item.origin === value;
      });
      if (referer) {
        result[key] = referer.result;
      } else {
        result[key] = _clone(value);
      }
    };
    for (var i = 0, len = keys.length; i < len; i++) {
      _loop();
    }
    return result;
  };
  var result = _clone(obj);
  return result;
}

/**
 * Deep extend an object
 * @param {object} obj1
 * @param {object} obj2
 * @param {0|1|2} [mixArr] 0: extend array as object, 1: push into array, 2: replace all items
 * @returns {object}
 */
function extend(obj1, obj2) {
  var mixArr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var exists = [];
  var _extend = function extend(obj1, obj2) {
    each(obj2, function (value, key) {
      var originalValue = obj1[key];

      // check whether extended
      var exist = exists.find(function (item) {
        return item.e === value;
      });
      if (exist) {
        if (originalValue === exist.o) {
          return;
        }
        if (!originalValue || _typeof(originalValue) !== 'object') {
          obj1[key] = exist.o;
          return;
        }
      }
      if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(originalValue)) {
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(value) || Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(value)) {
          _extend(originalValue, value, mixArr);
        } else {
          obj1[key] = value;
        }
      } else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(originalValue)) {
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(value)) {
          if (mixArr === 0 || mixArr === 1) {
            _extend(originalValue, value, mixArr);
          } else if (mixArr === 2) {
            originalValue.length = 0;
            _extend(originalValue, value, mixArr);
          } else {
            obj1[key] = value;
          }
        } else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(value)) {
          if (mixArr === 0) {
            _extend(originalValue, value, mixArr);
          } else if (mixArr === 1) {
            originalValue.push.apply(originalValue, _toConsumableArray(value));
          } else if (mixArr === 2) {
            originalValue.length = 0;
            originalValue.push.apply(originalValue, _toConsumableArray(value));
          } else {
            obj1[key] = value;
          }
        } else {
          obj1[key] = value;
        }
      } else {
        obj1[key] = value;
      }
    });

    // record this pair
    exists.push({
      o: obj1,
      // original
      e: obj2 // extend by this
    });
    return obj1;
  };
  return _extend(obj1, obj2);
}

/**
 * @param {object} obj1
 * @param {object} obj2
 * @param {boolean} [concatArray]
 * @returns {object}
 */
function merge(obj1, obj2) {
  var concatArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  obj1 = clone(obj1);
  if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj2) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(obj2)) {
    return Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj1) && Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(obj1) ? obj1 : null;
  }
  obj2 = clone(obj2);
  if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj1) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(obj1)) {
    return Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj2) && Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(obj2) ? obj2 : null;
  }
  var exists = [];
  var _merge = function merge(obj1, obj2) {
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj1)) {
      if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj2) && concatArray) {
        return [].concat(_toConsumableArray(obj1), _toConsumableArray(obj2));
      }
    }
    var result = obj1;
    var keys = Object.keys(obj2);
    keys.forEach(function (key) {
      var oldValue = obj1[key];
      var newValue = obj2[key];
      if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(newValue) || Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(newValue)) {
        var index = exists.indexOf(newValue);
        if (index === -1) {
          exists.push(newValue);
        } else if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(oldValue) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(oldValue)) {
          result[key] = newValue;
          return;
        }
      }
      if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(newValue) || Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(newValue)) {
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(oldValue) || Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(oldValue)) {
          result[key] = _merge(oldValue, newValue);
        } else {
          result[key] = newValue;
        }
      } else {
        result[key] = newValue;
      }
    });
    return result;
  };
  return _merge(obj1, obj2);
}

/**
 * @param {object} obj
 * @returns {string}
 */
function stringify(obj) {
  var exists = [obj];
  var used = [];
  var _stringifyObjectByKeys = function stringifyObjectByKeys(obj) {
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj)) {
      var items = obj.map(function (item) {
        if (item && _typeof(item) === 'object') {
          return _stringifyObjectByKeys(item);
        } else {
          return JSON.stringify(item);
        }
      });
      var _str = '[' + items.join(',') + ']';
      return _str;
    }
    var str = '{';
    var keys = Object.keys(obj);
    var total = keys.length;
    keys.sort();
    keys.forEach(function (key, i) {
      var value = obj[key];
      str += key + ':';
      if (value && _typeof(value) === 'object') {
        var index = exists.indexOf(value);
        if (index > -1) {
          str += '#' + index;
          used.push(index);
        } else {
          exists.push(value);
          var num = exists.length - 1;
          str += '#' + num + _stringifyObjectByKeys(value);
        }
      } else {
        str += JSON.stringify(value);
      }
      if (i < total - 1) {
        str += ',';
      }
    });
    str += '}';
    return str;
  };
  var str = _stringifyObjectByKeys(obj);
  exists.forEach(function (item, i) {
    if (!used.includes(i)) {
      str = str.replace(new RegExp(":#".concat(i), 'g'), ':');
    }
  });
  if (used.includes(0)) {
    str = '#0' + str;
  }
  return str;
}

/**
 * @param {object} obj
 * @returns {string}
 */
function getObjectHash(obj) {
  if (_typeof(obj) !== 'object') {
    return;
  }
  var str = stringify(obj);
  var hash = Object(_string_js__WEBPACK_IMPORTED_MODULE_0__[/* getStringHash */ "a"])(str);
  return hash;
}

/**
 * @param {object} obj
 * @param {string} key
 * @param {object|function} value
 * @returns {object}
 */
function define(obj, key, value) {
  if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(value)) {
    return Object.defineProperty(obj, key, {
      get: value
    });
  } else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(value)) {
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* hasOwnKey */ "a"])(value, 'enumerable') || Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* hasOwnKey */ "a"])(value, 'configurable')) {
      return Object.defineProperty(obj, key, value);
    } else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(value.set) && Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(value.get)) {
      return Object.defineProperty(obj, key, value);
    } else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* hasOwnKey */ "a"])(value, 'value')) {
      return Object.defineProperty(obj, key, value);
    } else {
      return Object.defineProperty(obj, key, {
        value: value
      });
    }
  } else {
    return Object.defineProperty(obj, key, {
      value: value
    });
  }
}

/**
 * @param {object|array} obj
 * @param {function} [determine]
 * @returns {object}
 */
function flat(obj, determine) {
  var _flat = function flat(input) {
    var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(input)) {
      input.forEach(function (item, i) {
        return _flat(item, "".concat(path, "[").concat(i, "]"), result);
      });
      return result;
    } else if (input && _typeof(input) === 'object' && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFile */ "g"])(input) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isDate */ "e"])(input)) {
      if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(determine) && !determine(input)) {
        result[path] = input;
        return result;
      }
      each(input, function (value, key) {
        _flat(value, !path ? key : "".concat(path, "[").concat(key, "]"), result);
      });
      return result;
    } else {
      result[path] = input;
      return result;
    }
  };
  return _flat(obj);
}

/**
 * @param {object|array} obj
 * @param {function} fn
 * @param {boolean} descriptor
 * @returns {object|array}
 */
function each(obj, fn, descriptor) {
  var withDescriptor = function withDescriptor() {
    var descriptors = Object.getOwnPropertyDescriptors(obj);
    var keys = Object.keys(descriptors);
    keys.forEach(function (key) {
      var descriptor = descriptors[key];
      var get = descriptor.get,
        set = descriptor.set,
        enumerable = descriptor.enumerable,
        configurable = descriptor.configurable,
        writable = descriptor.writable;
      if (enumerable || get || set || configurable && writable) {
        fn(descriptor, key, obj);
      }
    });
  };
  var withIterator = function withIterator() {
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj)) {
      obj.forEach(fn);
    } else {
      var keys = Object.keys(obj);
      keys.forEach(function (key) {
        var value = obj[key];
        fn(value, key, obj);
      });
    }
  };
  return descriptor ? withDescriptor() : withIterator();
}

/**
 * @param {object|array} obj
 * @param {function} fn
 * @returns {object}
 */
function map(obj, fn) {
  if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj)) {
    return obj.map(fn);
  } else {
    var result = {};
    each(obj, function (value, key) {
      result[key] = fn(value, key, obj);
    });
    return result;
  }
}

/**
 * @param {object|array} obj
 * @param {function} fn
 * @returns {object}
 */
function filter(obj, fn) {
  if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj)) {
    return obj.filter(fn);
  } else {
    var result = {};
    each(obj, function (value, key) {
      var bool = fn(value, key, obj);
      if (!bool) {
        return;
      }
      result[key] = value;
    });
    return result;
  }
}

/**
 * @param {object|array} obj
 * @param {function} fn
 */
function iterate(obj, fn) {
  if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(obj)) {
    for (var i = 0, len = obj.length; i < len; i++) {
      var item = obj[i];
      var res = fn(item, i, obj);
      if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isUndefined */ "p"])(res)) {
        return res;
      }
    }
  } else {
    var keys = Object.keys(obj);
    for (var _i = 0, _len = keys.length; _i < _len; _i++) {
      var _key = keys[_i];
      var value = obj[_key];
      var _res = fn(value, _key, obj);
      if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isUndefined */ "p"])(_res)) {
        return _res;
      }
    }
  }
}

/**
 * @param {object|array} obj
 * @param {function} fn
 */
function find(obj, fn) {
  return iterate(obj, function (value, key) {
    var res = fn(value, key, obj);
    if (res) {
      return value;
    }
  });
}

/**
 * @param {object} obj
 * @param {array} keys
 * @returns {object}
 */
function extract(obj, keys) {
  var results = {};
  keys.forEach(function (key) {
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* hasOwnKey */ "a"])(obj, key)) {
      results[key] = obj[key];
    }
  });
  return results;
}

/**
 * deep freeze
 * @param {object} o
 * @returns {object}
 */
function freeze(o) {
  if (!Object.freeze) {
    return o;
  }
  Object.freeze(o);
  Object.getOwnPropertyNames(o).forEach(function (prop) {
    var v = o[prop];
    if (Object.prototype.hasOwnProperty.call(o, prop) && v !== null && (_typeof(v) === 'object' || typeof v === 'function') && !Object.isFrozen(v)) {
      freeze(v);
    }
  });
  return o;
}

/**
 * create a reactive object.
 * it will change your original data
 * @param {object|array} origin
 * @param {object} options
 * @param {function} options.get to modify output value of each node, receive (keyPath, reactiveValue), reactiveValue is a reactive object/array as if, keyPath is an array which catains keys in path
 * @param {function} options.set to modify input value of each node, receive (keyPath, nextValue), nextValue is the given passed value, the return value will be transformed to be reactive object/array as if
 * @param {function} options.dispatch to notify change with keyPath, receive (keypath, next, prev), it will be called after value is set into
 * @param {function} options.writable whether be able to change value, return false to disable writable, default is true
 * @param {function} options.disable return true to disable create nest reactive on this node
 * @returns {object|array}
 * @example
 * const some = {
 *   body: {
 *     hand: true,
 *     foot: true,
 *   },
 * }
 * const a = createReactive(some, {
 *   get(keyPath, value) {
 *     if (keyPath.join('.') === 'body.hand') {
 *       return value.toString()
 *     }
 *     else {
 *       return value
 *     }
 *   },
 *   set(keyPath, value) {},
 *   dispatch({
 *     keyPath,
 *     value, // receive value
 *     input, // getter output
 *     next, // created reactive
 *     prev, // current reactive
 *   }, force) {},
 * })
 *
 * a !== some // reactive object !== object
 * a.body !== some.body // reactive object !== object
 * a.body.hand !== some.body.hand // true !== 'true'
 * a.body.foot == some.body.foot // true == true
 *
 * a.body.hand = false // now a.body.hand is 'false', a string
 * some.body.hand === false // original data changed
 */
function createReactive(origin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _get = options.get,
    set = options.set,
    del = options.del,
    dispatch = options.dispatch,
    writable = options.writable,
    disable = options.disable,
    receive = options.receive;
  var create = function create(origin) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(origin) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(origin)) {
      return origin;
    }
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(disable) && disable(parents, origin)) {
      return origin;
    }
    var output = null;
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(origin)) {
      output = createObject(origin, parents);
    } else {
      output = createArray(origin, parents);
    }
    return output;
  };
  var createObject = function createObject(origin) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var media = {};
    var reactive = {};
    var setValue = function setValue(key, value, trigger) {
      var keyPath = [].concat(_toConsumableArray(parents), [key]);
      if (Object.isFrozen(origin)) {
        var _active = create(value, keyPath);
        return _active;
      }
      var prev = origin[key];
      var invalid = media[key];
      var input = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(set) ? set(keyPath, value) : value;
      var active;
      var next;
      if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inObject */ "c"])(key, media) && (value === prev || value === invalid || input === prev || input === invalid)) {
        // origin property is changed any where else
        if ((_typeof(prev) !== 'object' || prev === null) && prev !== invalid) {
          next = prev;
          active = prev;
        } else if (invalid && _typeof(invalid) === 'object' && invalid.$$_ORIGIN !== prev) {
          next = prev;
          active = create(prev, keyPath);
        } else {
          next = prev;
          active = invalid;
        }
      } else {
        next = input;
        active = create(next, keyPath);
      }
      origin[key] = next;
      media[key] = active;
      if (trigger && Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
        dispatch({
          keyPath: keyPath,
          value: value,
          next: next,
          active: active,
          prev: prev,
          invalid: invalid
        });
      }
      return active;
    };
    var delValue = function delValue(key, trigger) {
      var keyPath = [].concat(_toConsumableArray(parents), [key]);
      var prev = origin[key];
      var invalid = media[key];
      if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(del)) {
        del(keyPath);
      }
      delete reactive[key];
      delete media[key];
      delete origin[key];
      if (trigger && Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
        var none = void 0;
        dispatch({
          keyPath: keyPath,
          value: none,
          next: none,
          active: none,
          prev: prev,
          invalid: invalid
        }, Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isUndefined */ "p"])(prev));
      }
    };
    var put = function put(key, value, trigger) {
      var keyPath = [].concat(_toConsumableArray(parents), [key]);
      Object.defineProperty(reactive, key, {
        get: function get() {
          var active = media[key];
          var output = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(_get) ? _get(keyPath, active) : active;
          return output;
        },
        set: function set(value) {
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
            receive(keyPath, value);
          }
          if (Object.isFrozen(origin)) {
            return media[key];
          }
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(keyPath, value)) {
            return media[key];
          }
          var descriptor = Object.getOwnPropertyDescriptor(media, key);
          if (descriptor) {
            if (!('value' in descriptor)) {
              if ('set' in descriptor) {
                origin[key] = value;
              }
              return value;
            }
            if (!descriptor.writable) {
              return descriptor.value;
            }
          }
          var active = setValue(key, value, true);
          return active;
        },
        enumerable: true,
        configurable: true
      });

      // initialize the current value at the first time
      var active = setValue(key, value, trigger);
      return active;
    };
    each(origin, function (descriptor, key) {
      if ('value' in descriptor) {
        var value = descriptor.value;
        put(key, value);
      } else {
        Object.defineProperty(media, key, descriptor);
      }
    }, true);
    Object.defineProperties(reactive, {
      $get: {
        value: function value(key) {
          return reactive[key];
        }
      },
      $set: {
        value: function value(key, _value) {
          var keyPath = [].concat(_toConsumableArray(parents), [key]);
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
            receive(keyPath, _value);
          }
          if (Object.isFrozen(origin)) {
            return media[key];
          }
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(keyPath)) {
            return media[key];
          }
          var descriptor = Object.getOwnPropertyDescriptor(media, key);
          if (descriptor) {
            if (!('value' in descriptor)) {
              if ('set' in descriptor) {
                origin[key] = _value;
              }
              return _value;
            }
            if (!descriptor.writable) {
              return descriptor.value;
            }
          }
          var active = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inObject */ "c"])(key, reactive) ? setValue(key, _value, true) : put(key, _value, true);
          return active;
        }
      },
      $del: {
        value: function value(key) {
          var keyPath = [].concat(_toConsumableArray(parents), [key]);
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
            receive(keyPath);
          }
          if (Object.isFrozen(origin)) {
            return false;
          }
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(keyPath)) {
            return false;
          }
          var descriptor = Object.getOwnPropertyDescriptor(media, key);
          if (!descriptor) {
            return false;
          }
          if (!descriptor.configurable) {
            return false;
          }
          delValue(key, true);
          return true;
        }
      },
      $$_ORIGIN: {
        get: function get() {
          return origin;
        }
      }
    });
    return reactive;
  };
  var createArray = function createArray(origin) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var media = [];
    var reactive = [];
    var setValue = function setValue(i, value, trigger) {
      var keyPath = [].concat(_toConsumableArray(parents), [i]);
      if (Object.isFrozen(origin)) {
        var _active2 = create(value, keyPath);
        return _active2;
      }
      var prev = origin[i];
      var invalid = media[i];
      var input = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(set) ? set(keyPath, value) : value;
      var active;
      var next;
      if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inObject */ "c"])(i, media) && (value === prev || value === invalid || input === prev || input === invalid)) {
        // origin property is changed any where else
        if ((_typeof(prev) !== 'object' || prev === null) && prev !== invalid) {
          next = prev;
          active = prev;
        } else if (invalid && _typeof(invalid) === 'object' && invalid.$$_ORIGIN !== prev) {
          next = prev;
          active = create(prev, keyPath);
        } else {
          next = prev;
          active = invalid;
        }
      } else {
        next = input;
        active = create(next, keyPath);
      }
      origin[i] = next;
      media[i] = active;
      if (trigger && Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
        dispatch({
          keyPath: keyPath,
          value: value,
          next: next,
          active: active,
          prev: prev,
          invalid: invalid
        });
      }
      return active;
    };

    // fill items into output array
    // start and end, where to start and end
    // items, original data to use
    var shuffle = function shuffle(start, end) {
      var _loop2 = function _loop2(i) {
        var keyPath = [].concat(_toConsumableArray(parents), [i]);
        Object.defineProperty(reactive, i, {
          get: function get() {
            var active = media[i];
            var output = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(_get) ? _get(keyPath, active) : active;
            return output;
          },
          set: function set(value) {
            if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(keyPath, value)) {
              return media[i];
            }
            var descriptor = Object.getOwnPropertyDescriptor(media, i);
            if (descriptor) {
              if (!('value' in descriptor)) {
                if ('set' in descriptor) {
                  origin[i] = value;
                }
                return value;
              }
              if (!descriptor.writable) {
                return descriptor.value;
              }
            }
            var active = setValue(i, value, true);
            return active;
          },
          enumerable: true,
          configurable: true
        });

        // initialize
        setValue(i, origin[i]);
      };
      for (var i = start; i <= end; i++) {
        _loop2(i);
      }

      // make sure the no use items are removed
      if (media.length > origin.length) {
        media.length = origin.length;
      }
      if (reactive.length > media.length) {
        reactive.length = media.length;
      }
    };

    // change array prototype methods
    var modify = function modify(fn) {
      return {
        value: function value() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          var nonAs = function nonAs() {
            if (fn === 'push' || fn === 'unshift') {
              return media.length;
            } else if (fn === 'splice') {
              return [];
            } else if (fn === 'shift') {
              return media[0];
            } else if (fn === 'pop') {
              return media[media.length - 1];
            } else if (fn === 'insert' || fn === 'remove') {
              return -1;
            } else {
              return media;
            }
          };
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
            receive(parents, origin, fn, args);
          }
          if (Object.isFrozen(origin)) {
            return nonAs();
          }
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(parents, origin)) {
            return nonAs();
          }

          // a hook to modify args for array push, shift inputs
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inObject */ "c"])(fn, options) && Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(options[fn])) {
            var res = options[fn](parents, args);
            // when return false, it means don't change the value
            if (res === false) {
              return nonAs();
            }
            // when return array, use it as new args
            if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(res)) {
              args = res;
            }
            // when return object, switch to another method
            else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(res)) {
              var to = res.to,
                newArgs = res.args;
              fn = to;
              args = newArgs;
            }
          }
          var output = null;

          // deal with original data
          var operate = function operate() {
            var before = origin.length;
            output = Array.prototype[fn].apply(origin, args);
            var after = origin.length;
            return [after, before];
          };
          if (fn === 'push') {
            var _operate = operate(),
              _operate2 = _slicedToArray(_operate, 2),
              after = _operate2[0],
              before = _operate2[1];
            output = after;
            media.length = after;
            reactive.length = after;
            shuffle(before - 1, after - 1);
          } else if (fn === 'unshift') {
            var _operate3 = operate(),
              _operate4 = _slicedToArray(_operate3, 1),
              _after = _operate4[0];
            output = _after;
            media.length = _after;
            reactive.length = _after;
            shuffle(0, _after - 1);
          } else if (fn === 'splice') {
            var _operate5 = operate(),
              _operate6 = _slicedToArray(_operate5, 1),
              _after2 = _operate6[0];
            var _args = args,
              _args2 = _toArray(_args),
              start = _args2[0],
              len = _args2[1],
              items = _arrayLikeToArray(_args2).slice(2);
            output = media.slice(start, start + len);
            media.length = _after2;
            reactive.length = _after2;
            if (!items.length) {
              shuffle(start, _after2 - 1);
            } else if (len === items.length) {
              shuffle(start, start + len - 1);
            } else {
              shuffle(start, _after2 - 1);
            }
          } else if (fn === 'shift') {
            var _operate7 = operate(),
              _operate8 = _slicedToArray(_operate7, 1),
              _after3 = _operate8[0];
            output = media[0];
            media.length = _after3;
            reactive.length = _after3;
            shuffle(0, _after3 - 1);
          } else if (fn === 'pop') {
            var _operate9 = operate(),
              _operate0 = _slicedToArray(_operate9, 1),
              _after4 = _operate0[0];
            output = media[media.length - 1];
            media.length = _after4;
            reactive.length = _after4;
          } else if (fn === 'fill') {
            var _operate1 = operate(),
              _operate10 = _slicedToArray(_operate1, 2),
              _before = _operate10[1];
            var _args3 = args,
              _args4 = _slicedToArray(_args3, 3),
              _args4$ = _args4[1],
              _start = _args4$ === void 0 ? 0 : _args4$,
              _args4$2 = _args4[2],
              end = _args4$2 === void 0 ? _before : _args4$2;
            output = media;
            shuffle(_start, end - 1);
          } else if (fn === 'insert') {
            if (args.length < 1) {
              return -1;
            } else if (args.length < 2) {
              var _args5 = args,
                _args6 = _slicedToArray(_args5, 1),
                item = _args6[0];
              output = origin.length;
              Array.prototype.push.call(origin, item);
              shuffle(output, output);
            } else {
              var _args7 = args,
                _args8 = _slicedToArray(_args7, 2),
                _item = _args8[0],
                _before2 = _args8[1];
              var beforeIndex = Object(_syntax_js__WEBPACK_IMPORTED_MODULE_2__[/* decideby */ "a"])(function () {
                var mediaIndex = media.indexOf(_before2);
                if (mediaIndex > -1) {
                  return mediaIndex;
                }
                var originIndex = origin.indexOf(_before2);
                return originIndex;
              });
              if (beforeIndex < 0) {
                return -1;
              }
              Array.prototype.splice.call(origin, beforeIndex, 0, _item);
              shuffle(beforeIndex, origin.length - 1);
              output = beforeIndex;
            }
          } else if (fn === 'remove') {
            if (args.length < 1) {
              return -1;
            } else {
              var _args9 = args,
                _args0 = _slicedToArray(_args9, 1),
                _item2 = _args0[0];
              var index = Object(_syntax_js__WEBPACK_IMPORTED_MODULE_2__[/* decideby */ "a"])(function () {
                var mediaIndex = media.indexOf(_item2);
                if (mediaIndex > -1) {
                  return mediaIndex;
                }
                var originIndex = origin.indexOf(_item2);
                return originIndex;
              });
              if (index < 0) {
                return index;
              }
              Array.prototype.splice.call(origin, index, 1);
              Array.prototype.splice.call(media, index, 1);
              shuffle(index, origin.length - 1);
              output = index;
            }
          } else {
            operate();
            output = media;
          }
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
            dispatch({
              keyPath: parents,
              value: origin,
              next: origin,
              active: reactive,
              prev: origin,
              invalid: reactive,
              fn: fn,
              result: output
            }, true);
          }
          return output;
        }
      };
    };
    Object.defineProperties(reactive, {
      push: modify('push'),
      unshift: modify('unshift'),
      splice: modify('splice'),
      pop: modify('pop'),
      shift: modify('shift'),
      sort: modify('sort'),
      reverse: modify('reverse'),
      fill: modify('fill'),
      insert: modify('insert'),
      remove: modify('remove'),
      $$_ORIGIN: {
        get: function get() {
          return origin;
        }
      }
    });
    shuffle(0, origin.length - 1);
    return reactive;
  };
  var output = create(origin);
  return output;
}
var ProxySymbol = Symbol('Proxy');
/**
 * create a proxy object.
 * it will change your original data
 * @param {object|array} origin
 * @param {object} options
 * @param {function} options.get to modify output value of each node, receive (keyPath, proxiedValue), proxiedValue is a reactive object/array as if, keyPath is an array which catains keys in path
 * @param {function} options.set to modify input value of each node, receive (keyPath, nextValue), nextValue is the given passed value, the return value will be transformed to be reactive object/array as if
 * @param {function} options.dispatch to notify change with keyPath, receive (keypath, next, prev), it will be called after value is set into
 * @param {function} options.writable whether be able to change value, return false to disable writable, default is true
 * @returns {Proxy}
 * @example
 * const some = {
 *   body: {
 *     hand: true,
 *     foot: true,
 *   },
 * }
 * const a = createProxy(some, {
 *   get(keyPath, value) {
 *     if (keyPath.join('.') === 'body.hand') {
 *       return value.toString()
 *     }
 *     else {
 *       return value
 *     }
 *   },
 *   set(keyPath, value) {},
 *   dispatch(keyPath, next, current) {},
 * })
 *
 * a !== some // proxy object !== object
 * a.body !== some.body // proxy object !== object
 * a.body.hand !== some.body.hand // true !== 'true'
 * a.body.foot == some.body.foot // true == true
 *
 * a.body.hand = false // now a.body.hand is 'false', a string
 * some.body.hand === false // some.body.hand changes to false
 */
function createProxy(origin) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _get2 = options.get,
    _set = options.set,
    del = options.del,
    dispatch = options.dispatch,
    writable = options.writable,
    disable = options.disable,
    receive = options.receive,
    extensible = options.extensible,
    enumerable = options.enumerable;
  var create = function create(origin) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(origin) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(origin)) {
      return origin;
    }
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(disable) && disable(parents, origin)) {
      return origin;
    }
    var output = null;
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(origin)) {
      output = createObject(origin, parents);
    } else {
      output = createArray(origin, parents);
    }
    return output;
  };
  var createObject = function createObject(origin) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var media = {};
    var proxy = new Proxy(media, {
      get: function get(target, key, receiver) {
        // get original property value
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key) && key === ProxySymbol) {
          return origin;
        }

        // primitive property
        // such as 'a' + obj, and obj[Symbol.toPrimitive](hint) defined
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key) && getSymbolContent(key).indexOf('Symbol.') === 0) {
          return Reflect.get(target, key, receiver);
        }
        var active = Reflect.get(target, key, receiver);

        // here should be noticed
        // a Symbol key will not to into `get` option function
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(_get2) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key)) {
          var keyPath = [].concat(_toConsumableArray(parents), [key]);
          var _output = _get2(keyPath, active);
          return _output;
        } else {
          return active;
        }
      },
      set: function set(target, key, value, receiver) {
        var keyPath = [].concat(_toConsumableArray(parents), [key]);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
          receive(keyPath, value);
        }
        if (Object.isFrozen(origin)) {
          return true;
        }
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(keyPath, value)) {
          return true;
        }
        var descriptor = Object.getOwnPropertyDescriptor(media, key);
        if (descriptor) {
          if (!('value' in descriptor)) {
            if ('set' in descriptor) {
              origin[key] = value;
            }
            return true;
          }
          if (!descriptor.writable) {
            return true;
          }
        }
        var prev = origin[key];
        var invalid = media[key];
        var input = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(_set) ? _set(keyPath, value) : value;
        var active;
        var next;
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inObject */ "c"])(key, media) && (value === prev || value === invalid || input === prev || input === invalid)) {
          next = prev;
          active = invalid;
        } else {
          next = input;
          active = create(next, keyPath);
        }
        origin[key] = next;
        Reflect.set(target, key, active, receiver);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
          dispatch({
            keyPath: keyPath,
            value: value,
            next: next,
            active: active,
            prev: prev,
            invalid: invalid
          });
        }
        return true;
      },
      deleteProperty: function deleteProperty(target, key) {
        var keyPath = [].concat(_toConsumableArray(parents), [key]);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
          receive(keyPath);
        }
        if (Object.isFrozen(origin)) {
          return true;
        }
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(keyPath)) {
          return true;
        }
        var descriptor = Object.getOwnPropertyDescriptor(media, key);
        if (!descriptor) {
          return true;
        }
        if (!descriptor.configurable) {
          return true;
        }
        var prev = origin[key];
        var invalid = media[key];
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(del) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key)) {
          del(keyPath);
        }
        delete origin[key];
        Reflect.deleteProperty(target, key);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
          var none = undefined;
          dispatch({
            keyPath: keyPath,
            value: none,
            next: none,
            active: none,
            prev: prev,
            invalid: invalid
          }, !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isUndefined */ "p"])(prev));
        }
        return true;
      },
      has: function has(target, key) {
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(enumerable)) {
          var keyPath = [].concat(_toConsumableArray(parents), [key]);
          return enumerable(keyPath);
        }
        return key in target;
      },
      isExtensible: function isExtensible() {
        var keyPath = _toConsumableArray(parents);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(extensible)) {
          return extensible(keyPath);
        }
        return true;
      }
    });
    each(origin, function (descriptor, key) {
      if ('value' in descriptor) {
        var value = descriptor.value;
        var keyPath = [].concat(_toConsumableArray(parents), [key]);
        if (Object.isFrozen(origin)) {
          media[key] = create(value, keyPath);
        } else {
          var needRewrite = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(_set) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key);
          var next = needRewrite ? _set(keyPath, value) : value;
          if (needRewrite) {
            origin[key] = next;
          }
          media[key] = create(next, keyPath);
        }
      } else {
        Object.defineProperty(media, key, descriptor);
      }
    }, true);
    return proxy;
  };
  var createArray = function createArray(origin) {
    var parents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var media = [];
    var proxy = new Proxy(media, {
      get: function get(target, key, receiver) {
        // get original property value
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key) && key === ProxySymbol) {
          return origin;
        }

        // primitive property
        // such as 'a' + obj, and obj[Symbol.toPrimitive](hint) defined
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key) && getSymbolContent(key).indexOf('Symbol.') === 0) {
          return Reflect.get(target, key, receiver);
        }

        // array primitive operation
        var methods = [
        // the following 3 lines will change the array's length
        // the following 1 line will return the new length
        'push', 'unshift',
        // the following 1 line will return the spliced items array
        'splice',
        // the following 1 line will return the removed item value
        'shift', 'pop',
        // the following 1 line will return the changed original array
        'sort', 'reverse', 'fill',
        // provided method
        'insert', 'remove'];
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inArray */ "b"])(key, methods)) {
          return function () {
            for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }
            var nonAs = function nonAs() {
              if (key === 'push' || key === 'unshift') {
                return origin.length;
              } else if (key === 'splice') {
                return [];
              } else if (key === 'shift') {
                return media[0];
              } else if (key === 'pop') {
                return media[origin.length - 1];
              } else if (key === 'insert') {
                return -1;
              } else {
                return media;
              }
            };
            if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
              receive(parents, origin, key, args);
            }
            if (Object.isFrozen(origin)) {
              return nonAs();
            }
            if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(parents, origin)) {
              return nonAs();
            }

            // a hook to modify args for array push, shift inputs
            if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inObject */ "c"])(key, options) && Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(options[key])) {
              var res = options[key](parents, args);
              // when return false, it means don't change the value
              if (res === false) {
                return nonAs();
              }
              // when return array, use it as new args
              if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "d"])(res)) {
                args = res;
              }
              // when return object, switch to another method
              else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isObject */ "l"])(res)) {
                var to = res.to,
                  newArgs = res.args;
                key = to;
                args = newArgs;
              }
            }
            var max = origin.length;
            var output = null;

            // create sub children
            if (key === 'push') {
              // change original data
              Array.prototype[key].apply(origin, args);
              var medias = args.map(function (item, i) {
                var index = max + i;
                return create(item, [].concat(_toConsumableArray(parents), [index]));
              });
              output = Array.prototype.push.apply(media, medias);
            } else if (key === 'splice') {
              // change original data
              Array.prototype[key].apply(origin, args);
              var _args1 = args,
                _args10 = _toArray(_args1),
                start = _args10[0],
                len = _args10[1],
                items = _arrayLikeToArray(_args10).slice(2);
              if (!items.length) {
                output = Array.prototype.splice.call(media, start, len);
              } else if (len === items.length) {
                var _medias = items.map(function (item, i) {
                  var index = start + i;
                  return create(item, [].concat(_toConsumableArray(parents), [index]));
                });
                var params = [start, len].concat(_toConsumableArray(_medias));
                output = Array.prototype.splice.apply(media, params);
              }
              // the ones which are right in media will be changed
              else {
                output = media.slice(start, start + len);
                var _items = origin.slice(start);
                var _medias2 = _items.map(function (item, i) {
                  var index = start + i;
                  return create(item, [].concat(_toConsumableArray(parents), [index]));
                });
                var _params = [start, origin.length].concat(_toConsumableArray(_medias2));
                Array.prototype.splice.apply(media, _params);
              }
            } else if (key === 'fill') {
              // change original data
              Array.prototype[key].apply(origin, args);
              var _args11 = args,
                _args12 = _slicedToArray(_args11, 3),
                item = _args12[0],
                _args12$ = _args12[1],
                _start2 = _args12$ === void 0 ? 0 : _args12$,
                _args12$2 = _args12[2],
                end = _args12$2 === void 0 ? max : _args12$2;
              var _items2 = [];
              for (var i = _start2; i < end; i++) {
                _items2.push(create(item, [].concat(_toConsumableArray(parents), [i])));
              }
              var _params2 = [_start2, end - _start2, _items2];
              Array.prototype.splice.apply(media, _params2);
              output = media;
            } else if (key === 'insert') {
              if (args.length < 1) {
                return -1;
              } else if (args.length < 2) {
                var _args13 = args,
                  _args14 = _slicedToArray(_args13, 1),
                  _item3 = _args14[0];
                output = origin.length;
                Array.prototype.push.call(origin, _item3);
                Array.prototype.push.call(media, _item3);
              } else {
                var _args15 = args,
                  _args16 = _slicedToArray(_args15, 2),
                  _item4 = _args16[0],
                  before = _args16[1];
                var beforeIndex = Object(_syntax_js__WEBPACK_IMPORTED_MODULE_2__[/* decideby */ "a"])(function () {
                  var mediaIndex = media.indexOf(before);
                  if (mediaIndex > -1) {
                    return mediaIndex;
                  }
                  var originIndex = origin.indexOf(before);
                  return originIndex;
                });
                if (beforeIndex < 0) {
                  return -1;
                }
                Array.prototype.splice.call(origin, beforeIndex, 0, _item4);
                Array.prototype.splice.call(media, beforeIndex, 0, _item4);
                output = beforeIndex;
              }
            } else if (key === 'remove') {
              var _args17 = args,
                _args18 = _slicedToArray(_args17, 1),
                _item5 = _args18[0];
              var index = Object(_syntax_js__WEBPACK_IMPORTED_MODULE_2__[/* decideby */ "a"])(function () {
                var mediaIndex = media.indexOf(_item5);
                if (mediaIndex > -1) {
                  return mediaIndex;
                }
                var originIndex = origin.indexOf(_item5);
                return originIndex;
              });
              if (index < 0) {
                return index;
              }
              Array.prototype.splice.call(origin, index, 1);
              Array.prototype.splice.call(media, index, 1);
              output = index;
            } else {
              // change original data
              Array.prototype[key].apply(origin, args);
              output = Array.prototype[key].apply(media, args);
            }
            if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
              dispatch({
                keyPath: parents,
                value: origin,
                next: origin,
                active: proxy,
                prev: origin,
                invalid: proxy,
                fn: key,
                result: output
              }, true);
            }
            return output;
          };
        }
        var keyPath = [].concat(_toConsumableArray(parents), [key]);
        var active = Reflect.get(target, key, receiver);

        // here should be noticed
        // a Symbol key will not to into `get` option function
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(_get2) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key)) {
          var _output2 = _get2(keyPath, active);
          return _output2;
        } else {
          return active;
        }
      },
      set: function set(target, key, value, receiver) {
        var keyPath = [].concat(_toConsumableArray(parents), [key]);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
          receive(keyPath, value);
        }
        if (Object.isFrozen(origin)) {
          return true;
        }
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(keyPath, value)) {
          return true;
        }
        var descriptor = Object.getOwnPropertyDescriptor(media, key);
        if (descriptor) {
          if (!('value' in descriptor)) {
            if ('set' in descriptor) {
              origin[key] = value;
            }
            return true;
          }
          if (!descriptor.writable) {
            return true;
          }
        }

        // operate like media.length = 0
        if (key === 'length') {
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(parents, origin)) {
            return true;
          }
          origin.length = value;
          media.length = value;
          if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
            dispatch({
              keyPath: parents,
              value: origin,
              next: origin,
              prev: origin,
              active: proxy
            }, true);
          }
          return true;
        }
        var prev = origin[key];
        var invalid = media[key];
        var input = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(_set) ? _set(keyPath, value) : value;
        var active;
        var next;
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inObject */ "c"])(key, media) && (value === prev || value === invalid || input === prev || input === invalid)) {
          next = prev;
          active = invalid;
        } else {
          next = input;
          active = create(next, keyPath);
        }
        origin[key] = next;
        Reflect.set(target, key, active, receiver);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
          dispatch({
            keyPath: keyPath,
            value: value,
            next: next,
            active: active,
            prev: prev,
            invalid: invalid
          });
        }
        return true;
      },
      deleteProperty: function deleteProperty(target, key) {
        var keyPath = [].concat(_toConsumableArray(parents), [key]);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(receive)) {
          receive(keyPath);
        }
        if (Object.isFrozen(origin)) {
          return true;
        }
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(writable) && !writable(keyPath)) {
          return true;
        }
        var descriptor = Object.getOwnPropertyDescriptor(media, key);
        if (!descriptor) {
          return true;
        }
        if (!descriptor.configurable) {
          return true;
        }
        var prev = origin[key];
        var invalid = media[key];
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(del) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(key)) {
          del(keyPath);
        }
        delete origin[key];
        Reflect.deleteProperty(target, key);
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(dispatch)) {
          var none = undefined;
          dispatch({
            keyPath: keyPath,
            value: none,
            next: none,
            active: none,
            prev: prev,
            invalid: invalid
          }, !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isUndefined */ "p"])(prev));
        }
        return true;
      },
      has: function has(target, key) {
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* inArray */ "b"])(key, ['remove', 'insert'])) {
          return true;
        }
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(enumerable)) {
          var keyPath = [].concat(_toConsumableArray(parents), [key]);
          return enumerable(keyPath);
        }
        return key in target;
      },
      isExtensible: function isExtensible() {
        if (Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(extensible)) {
          var keyPath = _toConsumableArray(parents);
          return extensible(keyPath);
        }
        return true;
      }
    });
    each(origin, function (descriptor, i) {
      if ('value' in descriptor) {
        var value = descriptor.value;
        var keyPath = [].concat(_toConsumableArray(parents), [i]);
        if (Object.isFrozen(origin)) {
          media[i] = create(value, keyPath);
        } else {
          var needRewrite = Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isFunction */ "h"])(_set) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_1__[/* isSymbol */ "o"])(i);
          var next = needRewrite ? _set(keyPath, value) : value;
          if (needRewrite) {
            origin[i] = next;
          }
          media[i] = create(next, keyPath);
        }
      } else {
        Object.defineProperty(media, key, descriptor);
      }
    }, true);
    return proxy;
  };
  var output = create(origin);
  return output;
}

/**
 * determine whether an object is a Proxy
 * @param {any} value
 * @returns {boolean}
 */
function isProxy(value) {
  return !!(value && value[ProxySymbol]);
}

/**
 * refine the original value from a Proxy
 * @param {object} obj
 * @returns {any}
 */
function refineProxy(obj) {
  return obj ? obj[ProxySymbol] : void 0;
}

/**
 * get the string of a symbol
 * @param {symbol} symb
 * @returns {string}
 */
function getSymbolContent(symb) {
  if (symb.description) {
    return symb.description;
  }
  var str = symb.toString();
  return str.substring(7, str.length - 1);
}

/**
 * convert an object to an entry array
 * @param {object} obj
 * @returns {array[]}
 */
function toEntries(obj) {
  var keys = Object.keys(obj);
  return keys.map(function (key) {
    return [key, obj[key]];
  });
}

/**
 * conver an entry/key-value array to an object
 * @param {array[] | object[]} entries
 * @param {boolean} kv
 * @returns {object}
 */
function fromEntries(entries) {
  var kv = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var obj = {};
  entries.forEach(function (item) {
    if (kv) {
      var _key4 = item.key,
        value = item.value;
      obj[_key4] = value;
    } else {
      var _item6 = _slicedToArray(item, 2),
        _key5 = _item6[0],
        _value2 = _item6[1];
      obj[_key5] = _value2;
    }
  });
  return obj;
}

/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return isUndefined; });
/* unused harmony export isNull */
/* unused harmony export isNullish */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return isNone; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return isObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return isDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return isNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return isNaN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return isSymbol; });
/* unused harmony export isFinite */
/* unused harmony export isInfinite */
/* unused harmony export isBoolean */
/* unused harmony export isNumeric */
/* unused harmony export isBlob */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return isFile; });
/* unused harmony export isFormData */
/* unused harmony export isEmpty */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return isFunction; });
/* unused harmony export isConstructor */
/* unused harmony export isTruthy */
/* unused harmony export isFalsy */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return isEqual; });
/* unused harmony export isLt */
/* unused harmony export isLte */
/* unused harmony export isGt */
/* unused harmony export isGte */
/* unused harmony export isPromise */
/* unused harmony export isInstanceOf */
/* unused harmony export isInheritedOf */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return inObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return hasOwnKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return inArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return isShallowEqual; });
/* unused harmony export isOneInArray */
/* unused harmony export isAllInArray */
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }


/**
 * @param {any} value
 * @returns {boolean}
 */
function isUndefined(value) {
  return typeof value === 'undefined';
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isNull(value) {
  return value === null;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isNullish(value) {
  return isUndefined(value) || isNull(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isNone(value) {
  return isNullish(value) || isNaN(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isArray(value) {
  return Array.isArray(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isObject(value) {
  return value && _typeof(value) === 'object' && value.constructor === Object;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isDate(value) {
  return isInstanceOf(value, Date);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isString(value) {
  return typeof value === 'string';
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isNaN(value) {
  return typeof value === 'number' && Number.isNaN(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isSymbol(value) {
  return _typeof(value) === 'symbol';
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isFinite(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isInfinite(value) {
  return typeof value === 'number' && !Number.isNaN(value) && !Number.isFinite(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isBoolean(value) {
  return value === true || value === false;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isNumeric(value) {
  return isString(value) && /^\-{0,1}[0-9]+\.{0,1}([0-9]+){0,1}$/.test(value);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isBlob(value) {
  return isInstanceOf(value, Blob) || value && typeof value.size === 'number' && typeof value.type === 'string';
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isFile(value) {
  return isInstanceOf(value, File) || isBlob(value) && (_typeof(value.lastModifiedDate) === 'object' || typeof value.lastModified === 'number') && typeof value.name === 'string';
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isFormData(value) {
  return isInstanceOf(value, FormData);
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isEmpty(value) {
  if (isNone(value) || value === '' || isNaN(value)) {
    return true;
  } else if (isArray(value)) {
    return value.length === 0;
  } else if (isObject(value)) {
    return Object.getOwnPropertyNames(value).length === 0;
  } else {
    return false;
  }
}

/**
 * @param {any} value
 * @param {boolean} [isStrict] where Constructor is to return false
 * @returns {boolean}
 */
function isFunction(value, isStrict) {
  if (typeof value !== 'function') {
    return false;
  }
  return isStrict ? !isConstructor(value, 2) : true;
}

/**
 * judge whether a value is a Constructor
 * @param {any} f
 * @param {number} [strict] strict level
 * - 4: should must be one of native code, native class
 * - 3: can be babel transformed class
 * - 2: can be some function whose prototype has more than one properties
 * - 1: can be some function which has this inside
 * - 0: can be some function which has prototype
 * @returns {boolean}
 */
function isConstructor(f, strict) {
  if (typeof f !== 'function') {
    return false;
  }
  if (f === Symbol) {
    return false;
  }

  // bond function && arrow function
  if (!f.prototype) {
    return false;
  }
  var entire = f + '';
  var fnBody = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}")).trim();

  // native class definition
  var isNativeClass = entire.indexOf('class ') === 0;
  // std lib: String, Number...
  var isNativeSTD = fnBody === "[native code]";
  var level4 = isNativeClass || isNativeSTD;
  if (strict >= 4) {
    return level4;
  }
  var topCtx = fnBody.replace(/function.*?\{.*?\}/gm, '').replace(/return/gm, '').replace(/\n+/gm, ';').replace(/\s+/gm, '').replace(/;;/gm, ';');
  // babel transformed class, begin with '_classCallCheck(this,', may by minified by compile tool
  var isBabelTransformedClass = /^_classCallCheck\(this,/.test(topCtx);
  // @babel/plugin-transform-runtime '(0, _classCallCheck2["default"])(this,'
  var isBabelRuntimeTransformedClass = /^\(.*?_classCallCheck.*?\)\(this,/.test(topCtx);
  // webpack minified
  var isBabelTransformedMinifiedClass = /^[0-9a-zA-Z_;!?:]*?\(this,/.test(topCtx);
  var level3 = level4 || isBabelTransformedClass || isBabelRuntimeTransformedClass || isBabelTransformedMinifiedClass;
  if (strict == 3) {
    return level3;
  }

  // there are some properties on f.prototype
  var protos = Object.getOwnPropertyDescriptors(f.prototype);
  var keys = Object.keys(protos).filter(function (item) {
    return item !== 'constructor';
  });
  var hasProtos = !!keys.length;
  var level2 = level3 || hasProtos;
  if (strict == 2) {
    return level2;
  }

  // function() { this.name = 'xx' }
  var hasThisInside = topCtx.indexOf('this.') === 0 || topCtx.indexOf(';this.') > -1 || topCtx.indexOf('=this;') > -1;
  var level1 = level2 || hasThisInside;
  if (strict == 1) {
    return level1;
  }
  return true;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isTruthy(value) {
  return !!value;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isFalsy(value) {
  return !value;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isEqual(val1, val2) {
  var equal = function equal(obj1, obj2) {
    var keys1 = Object.getOwnPropertyNames(obj1);
    var keys2 = Object.getOwnPropertyNames(obj2);
    var keys = Object(_array_js__WEBPACK_IMPORTED_MODULE_0__[/* unionArray */ "c"])(keys1, keys2);
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      if (!inArray(key, keys1)) {
        return false;
      }
      if (!inArray(key, keys2)) {
        return false;
      }
      var value1 = obj1[key];
      var value2 = obj2[key];
      if (!isEqual(value1, value2)) {
        return false;
      }
    }
    return true;
  };
  if (isObject(val1) && isObject(val2)) {
    return equal(val1, val2);
  } else if (isArray(val1) && isArray(val2)) {
    return equal(val1, val2);
  } else {
    return val1 === val2;
  }
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
function isLt(a, b) {
  return a < b;
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
function isLte(a, b) {
  return a <= b;
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
function isGt(a, b) {
  return a > b;
}

/**
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
function isGte(a, b) {
  return a >= b;
}

/**
 * @param {any} value
 * @returns {boolean}
 */
function isPromise(value) {
  return isInstanceOf(value, Promise) || value && (_typeof(value) === 'object' || typeof value === 'function') && typeof value.then === 'function';
}

/**
 * @param {any} value
 * @param {any} Constructor
 * @param {boolean} [isStrict]
 * @returns {boolean}
 */
function isInstanceOf(value, Constructor, isStrict) {
  if (!value || _typeof(value) !== 'object') {
    return false;
  }
  if (isStrict) {
    return value.constructor === Constructor;
  } else {
    return value instanceof Constructor;
  }
}

/**
 * @param {any} SubConstructor
 * @param {any} Constructor
 * @param {boolean} [isStrict]
 * @returns {boolean}
 */
function isInheritedOf(SubConstructor, Constructor, isStrict) {
  if (typeof SubConstructor !== 'function') {
    return false;
  }
  var ins = SubConstructor.prototype;
  if (!ins) {
    return false;
  }
  return isInstanceOf(ins, Constructor, isStrict);
}

/**
 * check wether a property is the given object's own property,
 * it will check:
 * - only string properties (except symbol properties, different from hasOwnKey),
 * - only enumerable properties;
 * @param {string} key
 * @param {object} obj
 * @param {boolean} [own] use hasOwnKey to check
 * @returns {boolean}
 */
function inObject(key, obj, own) {
  if (!obj || _typeof(obj) !== 'object') {
    return false;
  }
  if (own) {
    return hasOwnKey(obj, key);
  }
  return _typeof(key) !== 'symbol' && Object.prototype.propertyIsEnumerable.call(obj, key);
}

/**
 * check wether a property is the given object's own property,
 * as default, it will check:
 * - both string and symbol properties (different from inObject),
 * - both enumerable and non-enumerable properties;
 * @param {object|array} obj
 * @param {string} key
 * @param {boolean} [enumerable]
 * @returns {boolean}
 */
function hasOwnKey(obj, key) {
  if (!obj || _typeof(obj) !== 'object') {
    return false;
  }
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * @param {any} item
 * @param {array} arr
 * @returns {boolean}
 */
function inArray(item, arr) {
  return isArray(arr) && arr.includes(item);
}

/**
 * @param {object} objA
 * @param {object} objB
 * @param {number} deepth how many deepth to check
 */
function isShallowEqual(objA, objB, deepth) {
  if (objA === objB) {
    return true;
  }

  // not object. number, string, boolean, null
  if (!(_typeof(objA) === 'object' && objA !== null) || !(_typeof(objB) === 'object' && objB !== null)) {
    return false;
  }

  // object vs. array
  if ([objA, objB].filter(function (item) {
    return isArray(item);
  }).length === 1) {
    return false;
  }
  var keysA = Object.keys(objA).sort();
  var keysB = Object.keys(objB).sort();
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (var i = 0; i < keysA.length; i++) {
    var keyA = keysA[i];
    var keyB = keysB[i];
    if (keyA !== keyB) {
      return false;
    }
    var key = keyA;
    if (objA[key] !== objB[key]) {
      if (deepth && _typeof(objA[key]) === 'object' && _typeof(objB[key]) === 'object') {
        if (!isShallowEqual(objA[key], objB[key], deepth - 1)) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  return true;
}
function isOneInArray(items, arr) {
  return arr.some(function (one) {
    return items.includes(one);
  });
}
function isAllInArray(items, arr) {
  return !arr.some(function (one) {
    return !items.includes(one);
  });
}

/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return unionArray; });
/* unused harmony export interArray */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return diffArray; });
/* unused harmony export compArray */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return uniqueArray; });
/* unused harmony export sortArray */
/* unused harmony export toArray */
/* unused harmony export flatArray */
/* unused harmony export groupArray */
/* unused harmony export splitArray */
/* unused harmony export joinArray */
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87);
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }


/**
 * @template T
 * @param {T} value
 * @param {number} [count]
 * @returns {T[]}
 */
function createArray(value) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return [].fill.call(new Array(count), value);
}

/**
 * @param {array} a
 * @param {array} b
 * @returns {array}
 */
function unionArray(a, b) {
  return a.concat(b.filter(function (v) {
    return !Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* inArray */ "b"])(v, a);
  }));
}

/**
 * @param {array} a
 * @param {array} b
 * @returns {array}
 */
function interArray(a, b) {
  return a.filter(function (v) {
    return b.includes(v);
  });
}

/**
 * @param {array} a
 * @param {array} b
 * @returns {array}
 */
function diffArray(a, b) {
  return a.filter(function (v) {
    return !b.includes(v);
  });
}

/**
 * @param {array} a
 * @param {array} b
 * @returns {array}
 */
function compArray(a, b) {
  var diffa = diffArray(a, b);
  var diffb = diffArray(b, a);
  return diffa.concat(diffb);
}

/**
 * @param {array} arr
 * @param {string} [prop] unique by which property
 * @returns {array}
 */
function uniqueArray(arr, prop) {
  var exists = [];
  return arr.filter(function (item) {
    if (prop) {
      var value = item[prop];
      if (exists.includes(value)) {
        return false;
      } else {
        exists.push(value);
        return true;
      }
    } else {
      if (exists.includes(item)) {
        return false;
      } else {
        exists.push(item);
        return true;
      }
    }
  });
}

/**
 * @param {array} items
 * @param {string} [by] which property sort by
 * @param {boolean} [decs]
 * @returns {array}
 */
function sortArray(items, by) {
  var decs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var res = [].concat(items);
  res.sort(function (a, b) {
    var oa = by ? a[by] : a;
    var ob = by ? b[by] : b;
    oa = !Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isNaN */ "i"])(+oa) ? +oa : Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "n"])(oa) ? oa : 10;
    ob = !Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isNaN */ "i"])(+ob) ? +ob : Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "n"])(ob) ? ob : 10;
    if (oa < ob) {
      return decs ? 1 : -1;
    }
    if (oa === ob) {
      return 0;
    }
    if (oa > ob) {
      return decs ? -1 : 1;
    }
  });
  return res;
}

/**
 * @param {any} arr
 * @returns {array}
 */
function toArray(arr) {
  return Array.from(arr);
}

/**
 * @param {any[][]} arr
 * @returns {any[]}
 */
function flatArray(arr) {
  var res = [];
  arr.forEach(function (item) {
    var items = Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(item) ? item : [item];
    res.push.apply(res, _toConsumableArray(items));
  });
  return res;
}

/**
 * slice an array into [count] sub-array
 * @param {array} arr
 * @param {number} count
 * @returns {array[]}
 */
function groupArray(arr, count) {
  var results = [];
  arr.forEach(function (item, i) {
    var index = parseInt(i / count);
    results[index] = results[index] || [];
    results[index].push(item);
  });
  return results;
}

/**
 * split an array to sevral
 * @param {array} arr
 * @param {*|function} split
 * @returns {array[]}
 * @ts_declare function splitArray(arr: any[], split: any | ((item: any, i: number) => boolean)): any[]
 */
function splitArray(arr, split) {
  var results = [];
  var temp = [];
  arr.forEach(function (item, i) {
    if (split === item || Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isFunction */ "h"])(split) && split(item, i)) {
      results.push(temp);
      temp = [];
    } else {
      temp.push(item);
      if (i === arr.length - 1) {
        results.push(temp);
      }
    }
  });
  return results;
}

/**
 * @param {any[][]} arr
 * @param {any} join
 * @returns {any[]}
 */
function joinArray(arr, join) {
  var results = [];
  arr.forEach(function (items) {
    results.push.apply(results, _toConsumableArray(items).concat([join]));
  });
  return results;
}

/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getAllChars */
/* unused harmony export formatString */
/* unused harmony export padLeft */
/* unused harmony export padRight */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getStringHash; });
/* unused harmony export createRandomString */
/* unused harmony export interpolate */
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


// the order could never be changed, becuase we use it for number convertion
function getAllChars() {
  return '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
}

/**
 * @param {string} input
 * @param {string} separator
 * @param {array} segments
 * @param {boolean} alignright
 * @returns {string}
 */
function formatString(input, separator, segments, alignright) {
  if (typeof input !== 'string' || !input) {
    return '';
  }
  if (typeof separator !== 'string' || !separator) {
    return input;
  }
  if (!segments) {
    return input;
  }
  var letters = input.split('');
  if (alignright) {
    letters.reverse();
  }
  var points = Array.isArray(segments) ? [].concat(segments) : [segments];
  var result = [];
  var count = points[0];
  for (var i = 0, len = letters.length; i < len; i++) {
    if (typeof segments === 'number') {
      if (i > 0 && i % count === 0) {
        result.push(separator);
      }
    } else if (Array.isArray(segments) && points.length) {
      if (i > 0 && i % count === 0) {
        result.push(separator);
        points.shift();
        count += points.length ? points[0] : 0;
      }
    }
    var _char = letters[i];
    result.push(_char);
  }
  if (alignright) {
    result.reverse();
  }
  var output = result.join('');
  return output;
}

/**
 * @param {string} str
 * @param {number} len
 * @param {boolean} pad
 * @returns {string}
 */
function padLeft(str, len, pad) {
  if (str.length >= len) {
    return str;
  }
  var diff = len - str.length;
  var letters = Object(_array_js__WEBPACK_IMPORTED_MODULE_0__[/* createArray */ "a"])(pad, diff);
  return letters.join('') + str;
}

/**
 * @param {string} str
 * @param {number} len
 * @param {boolean} pad
 * @returns {string}
 */
function padRight(str, len, pad) {
  if (str.length >= len) {
    return str;
  }
  var diff = len - str.length;
  var letters = Object(_array_js__WEBPACK_IMPORTED_MODULE_0__[/* createArray */ "a"])(pad, diff);
  return str + letters.join('');
}

/**
 * @param {string} str
 * @returns {string}
 */
function getStringHash(str) {
  var hash = 5381;
  var i = str.length;
  while (i) {
    hash = hash * 33 ^ str.charCodeAt(--i);
  }
  return hash >>> 0;
}

/**
 * @param {number} len
 * @returns {string}
 */
function createRandomString() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  var CHARS = getAllChars();
  var text = '';
  for (var i = 0; i < len; i++) {
    text += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return text;
}

// https://github.com/gillesruppert/node-interpolate/blob/master/lib/interpolate.js
/**
 * @param {string} template
 * @param {object} data
 * @param {object} [opts]
 * @returns {string}
 */
function interpolate(template, data, opts) {
  var regex,
    lDel,
    rDel,
    delLen,
    lDelLen,
    delimiter,
    // For escaping strings to go in regex
    regexEscape = /([$\^\\\/()|?+*\[\]{}.\-])/g;
  opts = opts || {};
  delimiter = opts.delimiter || '{}';
  delLen = delimiter.length;
  lDelLen = Math.ceil(delLen / 2);
  // escape delimiters for regex
  lDel = delimiter.substr(0, lDelLen).replace(regexEscape, "\\$1");
  rDel = delimiter.substr(lDelLen, delLen).replace(regexEscape, "\\$1") || lDel;

  // construct the new regex
  regex = new RegExp(lDel + "[^" + lDel + rDel + "]+" + rDel, "g");
  return template.replace(regex, function (placeholder) {
    var key = placeholder.slice(lDelLen, -lDelLen),
      keyParts = key.split("."),
      val,
      i = 0,
      len = keyParts.length;
    if (key in data) {
      // need to be backwards compatible with "flattened" data.
      val = data[key];
    } else {
      // look up the chain
      val = data;
      for (; i < len; i++) {
        if (keyParts[i] in val) {
          val = val[keyParts[i]];
        } else {
          return placeholder;
        }
      }
    }
    return val;
  });
}

/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return decideby; });
/* unused harmony export caseby */
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/**
 * get value by using a function
 * @param {function} decide
 * @param {...any} args
 */
function decideby(decide) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return decide.apply(void 0, args);
}

/**
 * get value by different conditions
 * @param {Array<Function,Function>} entries [[condition, getter]]
 */
function caseby(entries) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  var _iterator = _createForOfIteratorHelper(entries),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
        cond = _step$value[0],
        get = _step$value[1];
      if (cond.apply(void 0, args)) {
        return get.apply(void 0, args);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}

/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return shareState; });
/* harmony import */ var ts_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87);
/* harmony import */ var ts_fns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(94);


/**
 *
 * @param {object} initState
 * @param {object} options
 * @param {function} options.onChange invoke when state change
 * @param {function} options.drive drive the state to be changed, i.e. (update) => { setInterval(() => update(state => state.age ++, 1000)) }
 * @returns
 */
function shareState(initState, options) {
  var views = [];
  return function () {
    var view = this;
    if (views.indexOf(view) === -1) {
      views.push(view);
    }
    view.on('$change', function () {
      return function (e, _ref) {
        var keyPath = _ref.keyPath,
          value = _ref.value;
        views.forEach(function (item) {
          if (item === view) {
            if (options && Object(ts_fns__WEBPACK_IMPORTED_MODULE_0__[/* isFunction */ "h"])(options.onChange)) {
              options.onChange(keyPath, value);
            }
            return;
          }
          item.update(function (state) {
            Object(ts_fns__WEBPACK_IMPORTED_MODULE_1__[/* assign */ "a"])(state, keyPath, value);
          });
        });
      };
    });
    view.on('$destroy', function () {
      views.forEach(function (item, i) {
        if (item === view) {
          views.splice(i, 1);
        }
      });
    });
    if (options && Object(ts_fns__WEBPACK_IMPORTED_MODULE_0__[/* isFunction */ "h"])(options.drive)) {
      options.drive(function (arg) {
        return view.update(arg);
      });
    }
    return initState;
  };
}

/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export debounce */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return throttle; });
/**
 * 创建防抖函数
 * @param {function} fn
 * @param {number} wait
 * @param {boolean} [immediate] 是否立即执行函数
 * @returns {function}
 */
function debounce(fn, wait, immediate) {
  var timeout = null;
  return function () {
    var _this = this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var callNow = immediate && !timeout;
    var next = function next() {
      timeout = null;
      if (!immediate) {
        fn.apply(_this, args);
      }
    };
    clearTimeout(timeout);
    timeout = setTimeout(next, wait);
    if (callNow) {
      fn.apply(this, args);
    }
  };
}

/**
 * 创建节流函数
 * @param {function} fn
 * @param {number} wait
 * @param {boolean} [immediate] 是否立即执行
 * @returns {function}
 */
function throttle(fn, wait, immediate) {
  var timeout = null;
  var lastTime = 0;
  return function () {
    var _this2 = this;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    var callNow = immediate && !timeout;
    var nowTime = Date.now();
    var next = function next() {
      timeout = null;
      fn.apply(_this2, args);
    };
    if (timeout || lastTime && nowTime < lastTime + wait) {
      return;
    }
    lastTime = nowTime;
    if (callNow) {
      fn.apply(this, args);
    } else {
      timeout = setTimeout(next, wait);
    }
  };
}

/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VMLocalStorage; });
var _VMLocalStorage;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var VMLocalStorage = /*#__PURE__*/_createClass(function VMLocalStorage() {
  _classCallCheck(this, VMLocalStorage);
});
_VMLocalStorage = VMLocalStorage;
_defineProperty(VMLocalStorage, "getKey", function (key) {
  return 'JQVM_ls_' + key;
});
_defineProperty(VMLocalStorage, "getVal", function (key) {
  return JSON.parse(localStorage.getItem(_VMLocalStorage.getKey(key)));
});
_defineProperty(VMLocalStorage, "setVal", function (key, val) {
  val = String(val);
  localStorage.setItem(_VMLocalStorage.getKey(key), JSON.stringify(val));
});
_defineProperty(VMLocalStorage, "reloadJqvmLocalStorage", function (state, status) {
  // user handed some data into storage key
  if (state.storage !== undefined) {
    // get data from const storage
    var stateStorage = Object.assign({}, state.storage);
    Object.keys(stateStorage).forEach(function (name, index) {
      var localStorageValue = _VMLocalStorage.getVal(name);

      // set state from storage if exists and it mount step (pipe)
      if (status === '$mount') {
        _VMLocalStorage.setVal(state.storage[name]);
        var localStoreVal = _VMLocalStorage.getVal(name);
        if (localStoreVal === null || localStoreVal === undefined) {
          _VMLocalStorage.setVal(name, String(state.storage[name]));
        } else {
          state.storage[name] = localStoreVal;
        }
      }

      // local storage empty
      if (localStorageValue === null) {
        _VMLocalStorage.setVal(name, stateStorage[index]);

        // storage have items, load it
      } else {
        if (status === '$change') {
          _VMLocalStorage.setVal(name, state.storage[name]);
        }
      }
    });
  }
});

/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export makeKeyChain */
/* unused harmony export makeKeyPath */
/* unused harmony export makeKey */
/* unused harmony export parse */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return assign; });
/* unused harmony export remove */
/* unused harmony export keyin */
/* harmony import */ var _is_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87);
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }


/**
 * convert a keyPath string to be an array
 * @param {string} path
 * @param {boolean} [isStrict] whether to keep square bracket keys
 * @returns {array}
 */
function makeKeyChain(path, isStrict) {
  var mapping = [];
  var text = path.replace(/\[.*?\]/g, function (matched, position) {
    var index = mapping.length;
    mapping.push(matched);
    return "".concat(position ? '.' : '', "{").concat(index, "}");
  });
  var chain = text.split('.');
  chain.forEach(function (item, i) {
    if (/^\{\d+\}$/.test(item)) {
      var index = item.substring(1, item.length - 1);
      var str = mapping[index];
      var key = isStrict ? str : str.substring(1, str.length - 1);
      chain[i] = key;
    }
  });
  return chain;
}

/**
 * convert an array to be a keyPath string
 * @param {array} chain the array for path, without any symbol in it
 * @param {boolean} [isStrict] wether to use [] to wrap number key
 * @returns {string}
 */
function makeKeyPath(chain, isStrict) {
  // if there is only one item, return the first one
  // this support return a symbol
  if (chain.length === 1) {
    return chain[0];
  }
  var path = '';
  for (var i = 0, len = chain.length; i < len; i++) {
    var key = chain[i];
    // do not support symbols
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isSymbol */ "o"])(key)) {
      var symbol = key.toString();
      path += '[' + symbol + ']';
    }
    // 1
    else if (isStrict && Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isNumber */ "k"])(key)) {
      path += '[' + key + ']';
    }
    // '1'
    else if (isStrict && Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "n"])(key) && /^[0-9]+$/.test(key)) {
      path += '[' + key + ']';
    }
    // '[1]' or '[a]' or '[a.b]'
    else if (isStrict && Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "n"])(key) && /^\[.*\]$/.test(key)) {
      path += key;
    }
    // 'a.b'
    else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "n"])(key) && key.indexOf('.') > -1) {
      path += '[' + key + ']';
    } else {
      path += path ? '.' + key : key;
    }
  }
  return path;
}

/**
 * convert a keyPath array or string to be a keyPath string
 * @param {string|array} keyPath
 * @returns {string}
 */
function makeKey(keyPath) {
  var chain = Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(keyPath) ? keyPath : makeKeyChain(keyPath);
  var key = makeKeyPath(chain);
  return key;
}

/**
 * parse a property's value by its keyPath
 * @param {object|array} obj
 * @param {string|array} key
 */
function parse(obj, key) {
  var chain = Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(key) ? _toConsumableArray(key) : makeKeyChain(key);
  if (!chain.length) {
    return obj;
  }
  var target = obj;
  var _loop = function _loop() {
      // fallback, without error
      if (!target || _typeof(target) !== 'object') {
        return {
          v: void 0
        };
      }
      var key = chain[i];

      // want an array
      if (key === '*') {
        if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(target)) {
          return {
            v: void 0
          };
        }
        if (i + 1 >= len) {
          return {
            v: target
          };
        }
        var restChain = chain.slice(i + 1);
        var items = target.map(function (item) {
          return parse(item, restChain);
        });
        return {
          v: items
        };
      }

      // want a value
      var node = target[key];
      target = node;
    },
    _ret;
  for (var i = 0, len = chain.length; i < len; i++) {
    _ret = _loop();
    if (_ret) return _ret.v;
  }
  return target;
}

/**
 * assign a property's value by its keyPath
 * @param {object|array} obj
 * @param {string|array} key
 * @returns {object|array}
 */
function assign(obj, key, value) {
  var chain = Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(key) ? _toConsumableArray(key) : makeKeyChain(key);
  if (!chain.length) {
    return obj;
  }
  var tail = chain.pop();
  if (!chain.length) {
    obj[tail] = value;
    return obj;
  }
  var target = obj;
  for (var i = 0, len = chain.length; i < len; i++) {
    var current = chain[i];
    var next = chain[i + 1];
    // at the end
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isUndefined */ "p"])(next) && i === len - 1) {
      next = tail;
    }
    if (Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isNumber */ "k"])(next) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(target[current])) {
      target[current] = [];
    } else if (Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isString */ "n"])(next) && /^[0-9]+$/.test(next) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(target[current])) {
      target[current] = [];
    } else if (target[current] === null || _typeof(target[current]) !== 'object') {
      target[current] = {};
    }
    target = target[current];
  }
  target[tail] = value;
  return obj;
}

/**
 * remove a property by its keyPath
 * @param {object|array} obj
 * @param {string|array} key
 * @returns {object|array}
 */
function remove(obj, key) {
  var chain = Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(key) ? _toConsumableArray(key) : makeKeyChain(key);
  if (!chain.length) {
    return obj;
  }
  if (chain.length === 1) {
    delete obj[chain[0]];
    return obj;
  }
  var tail = chain.pop();
  var target = parse(obj, chain);
  if (!Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isObject */ "l"])(target) && !Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(target)) {
    return obj;
  }
  delete target[tail];
  return obj;
}

/**
 * check whether a keyPath is in the given object,
 * both string and symbol properties will be checked,
 * as default, it will check:
 *  - both enumerable and non-enumerable properties;
 *  - both own and prototype-chain properties;
 * if enumerable=true, it will check:
 *  - only enumerable properties;
 *  - only own properties;
 * @param {*} key
 * @param {*} obj
 * @param {*} [enumerable]
 * @returns {boolean}
 */
function keyin(key, obj, enumerable) {
  if (!obj || _typeof(obj) !== 'object') {
    return false;
  }
  var chain = Object(_is_js__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "d"])(key) ? _toConsumableArray(key) : makeKeyChain(key);
  if (!chain.length) {
    return false;
  }
  var tail = chain.pop();
  var has = function has(obj, key) {
    return Object.prototype.propertyIsEnumerable.call(obj, key);
  };
  if (!chain.length) {
    return enumerable ? has(obj, tail) : tail in obj;
  }
  var target = obj;
  for (var i = 0, len = chain.length; i < len; i++) {
    var _key = chain[i];
    var node = enumerable ? has(target, _key) ? target[_key] : null : target[_key];
    if (!node || _typeof(node) !== 'object') {
      return false;
    }
    target = node;
  }
  return enumerable ? has(target, tail) : tail in target;
}

/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createAsyncComponent; });
function createAsyncComponent(defer, callback) {
  var component = null;
  var deferer = null;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (!deferer) {
      var view = this.view;
      deferer = defer().then(function (res) {
        if (typeof Symbol !== 'undefined' && res && res[Symbol.toStringTag] === 'Module') {
          component = res["default"];
        } else if (res && res.__esModule) {
          component = res["default"];
        } else {
          component = res;
        }
        if (callback) {
          component = callback.call.apply(callback, [view, component].concat(args)) || component;
        }
        view.update(true);
      });
    }
    return component;
  };
}

/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return createRouter; });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85);
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

function rewriteHistory(type) {
  var origin = window.history[type];
  return function () {
    var rv = origin.apply(this, arguments);
    var e = new Event(type);
    e.arguments = arguments;
    window.dispatchEvent(e);
    return rv;
  };
}
window.history.pushState = rewriteHistory('pushState');
window.history.replaceState = rewriteHistory('replaceState');
var Base = /*#__PURE__*/function () {
  function Base(options) {
    _classCallCheck(this, Base);
    this.events = [];
    var off = this.init(options);
    if (off) {
      this.on('$destroy', off);
    }
  }
  return _createClass(Base, [{
    key: "init",
    value: function init() {}
  }, {
    key: "on",
    value: function on(e, fn) {
      this.events.push({
        e: e,
        fn: fn
      });
      return this;
    }
  }, {
    key: "off",
    value: function off(e, fn) {
      var _this = this;
      this.events.forEach(function (item, i) {
        if (item.e === e && item.fn === fn) {
          _this.events.splice(i, 1);
        }
      });
      return this;
    }
  }, {
    key: "emit",
    value: function emit(e) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      this.events.forEach(function (item) {
        if (item.e === e) {
          item.fn.apply(item, args);
        }
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.emit('$destroy');
    }
  }]);
}();
var Navigation = /*#__PURE__*/function (_Base) {
  function Navigation() {
    _classCallCheck(this, Navigation);
    return _callSuper(this, Navigation, arguments);
  }
  _inherits(Navigation, _Base);
  return _createClass(Navigation, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      this.actionType = '';
      this.latestState = window.history.state;
      var onUrlChanged = function onUrlChanged(e) {
        _this2.actionType = e.type;
        var currentState = _this2.latestState;
        _this2.latestState = window.history.state;
        var nextState = _this2.latestState;
        if (e.type === 'popstate') {
          if ((currentState === null || currentState === void 0 ? void 0 : currentState.prev) === nextState) {
            _this2.actionType = 'back';
          } else if ((currentState === null || currentState === void 0 ? void 0 : currentState.next) === nextState) {
            _this2.actionType = 'forward';
          }
        }
        _this2.emit(_this2.actionType, window.location.href);
        _this2.emit('change', window.location.href);
      };
      var onBeforeUnload = function onBeforeUnload(e) {
        if (_this2.events.some(function (item) {
          return item.e === 'protect';
        })) {
          var prevented = false;
          var resolve = function resolve() {
            return void 0;
          };
          var reject = function reject() {
            return prevented = true;
          };
          _this2.emit('protect', resolve, reject);
          if (prevented) {
            e.preventDefault();
          }
        }
      };
      window.addEventListener('popstate', onUrlChanged);
      window.addEventListener('replaceState', onUrlChanged);
      window.addEventListener('pushState', onUrlChanged);
      window.addEventListener('beforeunload', onBeforeUnload);
      return function () {
        window.removeEventListener('popstate', onUrlChanged);
        window.removeEventListener('replaceState', onUrlChanged);
        window.removeEventListener('pushState', onUrlChanged);
        window.removeEventListener('beforeunload', onBeforeUnload);
      };
    }
  }, {
    key: "back",
    value: function back() {
      window.history.back();
    }
  }, {
    key: "forward",
    value: function forward() {
      window.history.forward();
    }
  }, {
    key: "push",
    value: function push(url) {
      if (window.location.href === url) {
        return;
      }
      var state = window.history.state;
      var next = {
        prev: state,
        url: url
      };
      window.history.pushState(next, null, url);
    }
  }, {
    key: "replace",
    value: function replace(url) {
      var _state$prev;
      if (window.location.href === url) {
        return;
      }
      var state = window.history.state;
      var prev = state === null || state === void 0 || (_state$prev = state.prev) === null || _state$prev === void 0 ? void 0 : _state$prev.state;
      var next = {
        prev: prev,
        url: url
      };
      window.history.replaceState(next, null, url);
    }
  }, {
    key: "open",
    value: function open(url) {
      window.open(url);
    }
  }]);
}(Base);
var navigation = new Navigation();
var Router = /*#__PURE__*/function (_Base2) {
  function Router() {
    _classCallCheck(this, Router);
    return _callSuper(this, Router, arguments);
  }
  _inherits(Router, _Base2);
  return _createClass(Router, [{
    key: "init",
    value: function init(options) {
      var _this3 = this;
      this.options = options;
      this.url = this.getUrl();
      var onChange = function onChange() {
        var _options$baseUri = options.baseUri,
          baseUri = _options$baseUri === void 0 ? '' : _options$baseUri;
        var url = _this3.getUrl();
        var prev = _this3.url;
        _this3.url = url;

        // dont trigger change
        if (prev === url) {
          return;
        }
        var flag = true;
        if (baseUri && url.indexOf(baseUri) !== 0) {
          flag = false;
        }
        if (flag) {
          _this3.emit('change', url);
        }
      };
      navigation.on('change', onChange);
      return function () {
        return navigation.off('change', onChange);
      };
    }
  }, {
    key: "navigate",
    value: function navigate(type, to) {
      var mode = this.options.mode;
      if (mode === 'history') {
        navigation[type](to);
      } else {
        var _window$location = window.location,
          pathname = _window$location.pathname,
          _window$location$sear = _window$location.search,
          search = _window$location$sear === void 0 ? '' : _window$location$sear;
        var url = pathname + search + '#' + to;
        navigation[type](url);
      }
    }
  }, {
    key: "getUrl",
    value: function getUrl() {
      var mode = this.options.mode;
      var _window$location2 = window.location,
        hash = _window$location2.hash,
        href = _window$location2.href,
        origin = _window$location2.origin;
      if (mode === 'history') {
        return href.replace(origin, '');
      }
      return hash.replace('#', '') || '/';
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      var url = this.getUrl();
      var _url$split = url.split('?'),
        _url$split2 = _slicedToArray(_url$split, 2),
        pathname = _url$split2[0],
        _url$split2$ = _url$split2[1],
        search = _url$split2$ === void 0 ? '' : _url$split2$;
      var params = {};
      search.split('&').filter(Boolean).forEach(function (item) {
        var _item$split = item.split('='),
          _item$split2 = _slicedToArray(_item$split, 2),
          key = _item$split2[0],
          value = _item$split2[1];
        params[key] = value;
      });
      return {
        pathname: pathname,
        search: search,
        params: params
      };
    }
  }, {
    key: "setParams",
    value: function setParams(params) {
      var _this$getLocation = this.getLocation(),
        pathname = _this$getLocation.pathname,
        query = _this$getLocation.query;
      var next = _objectSpread(_objectSpread({}, query), params);
      var search = Object.keys(next).reduce(function (str, key) {
        var value = next[key];
        var pre = str ? str + '&' : '';
        if (typeof value === 'undefined') {
          return pre + key;
        }
        return pre + key + '=' + value;
      }, '');
      var url = pathname + (search ? '?' + search : '');
      this.navigate('push', url);
    }
  }, {
    key: "isMatch",
    value: function isMatch(uri) {
      var url = this.getUrl();
      if (uri instanceof RegExp) {
        return uri.test(url);
      }
      return url === uri;
    }
  }]);
}(Base);
function createRouter() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mode = options.mode,
    baseUri = options.baseUri;
  var router = new Router({
    mode: mode,
    baseUri: baseUri
  });
  return function () {
    var view = this.view;
    var $route = {};
    Object.defineProperty($route, 'params', {
      get: function get() {
        var _router$getLocation = router.getLocation(),
          params = _router$getLocation.params;
        return params;
      },
      enumerable: true
    });
    view.directive('w-route', function ($el, attrs) {
      var attr = attrs['w-route'];
      var hidden = "<!-- ".concat(Object(_utils_js__WEBPACK_IMPORTED_MODULE_0__[/* getNodeName */ "d"])($el[0]), " w-route=\"").concat(attr, "\" (hidden) -->");
      var toMatch = attr;
      if (/^\/.+?\/[a-z]*$/.test(toMatch)) {
        var str = toMatch.substring(1);
        var items = str.split('/');
        var sym = items.pop();
        var exp = items.join('/');
        var reg = new RegExp(exp, sym);
        toMatch = reg;
      }
      if (!(toMatch instanceof RegExp)) {
        toMatch = this.scope.parse(attr);
      }
      if (!router.isMatch(toMatch)) {
        return hidden;
      }
    });
    view.directive('w-navigate', function ($el, attrs) {
      var type = attrs['w-navigate'];
      if (['back', 'forward'].indexOf(type) > -1) {
        if (!$el.attr('href')) {
          $el.attr('href', '#');
        }
      } else if (type === 'open') {
        if ($el.attr('target') !== '_blank') {
          $el.attr('target', '_blank');
        }
      } else {
        if (mode !== 'history') {
          var href = $el.attr('href');
          var url = href.replace(/^#+/, '');
          $el.attr('href', '#' + url);
        }
      }
    }, function ($el, attrs) {
      var type = attrs['w-navigate'] || 'push';
      var navigate = function navigate(e) {
        if (['back', 'forward'].indexOf(type) > -1) {
          e.preventDefault();
          router.navigate(type);
        } else if (['push', 'replace'].indexOf(type) > -1) {
          e.preventDefault();
          var href = $el.attr('href');
          var url = href.replace(/^#+/, '');
          router.navigate(type, url);
        }
      };
      $el.on('click', navigate);
      return function () {
        return $el.off('click', navigate);
      };
    });
    var routerChange = function routerChange() {
      view.emit('$route', router.getUrl());
      view.update(true);
    };
    return {
      $init: function $init(state) {
        view.$router = router;
        state.$route = $route;
        router.on('change', routerChange);
      },
      $destroy: function $destroy() {
        router.off('change', routerChange);
        router.destroy();
      },
      $clone: function $clone(state, clonedView) {
        clonedView.$router = router;
      }
    };
  };
}

/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return createWire; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return $wire; });
/* unused harmony export noopAjax */
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
var strategies = {
  drop: function drop(serverState, key, incoming) {
    serverState[key] = incoming;
  },
  push: function push(serverState, key, incoming) {
    var current = serverState[key];
    if (Array.isArray(current) && Array.isArray(incoming)) {
      serverState[key] = current.concat(incoming);
    } else {
      serverState[key] = incoming;
    }
  },
  nomerge: function nomerge() {},
  error: function error(serverState, key, incoming, failHandlers) {
    var current = serverState[key];
    var isEmpty = current === null || current === undefined || Array.isArray(current) && current.length === 0 || _typeof(current) === 'object' && !Array.isArray(current) && Object.keys(current).length === 0;
    if (!isEmpty) {
      var err = new Error('wire:error — ключ "' + key + '" уже содержит данные');
      err.strategy = 'error';
      err.key = key;
      failHandlers.forEach(function (fn) {
        fn(err);
      });
      return;
    }
    serverState[key] = incoming;
  },
  // зарезервировано — умный мерж по id для пагинации
  merge: function merge(serverState, key, incoming) {
    var current = serverState[key];
    if (Array.isArray(current) && Array.isArray(incoming)) {
      serverState[key] = current.concat(incoming);
    } else {
      serverState[key] = incoming;
    }
  }
};
function noopAjax() {
  // заглушка когда jQuery недоступен — используется в тестах
  // никогда не резолвится, просто возвращает deferred
  return {
    done: function done() {
      return this;
    },
    fail: function fail() {
      return this;
    },
    always: function always() {
      return this;
    }
  };
}
function defaultAjax(options) {
  if (typeof $ !== 'undefined' && $.ajax) return $.ajax(options);
  throw new Error('$wire: jQuery не найден. Подключите jQuery или передайте ajax в опциях createWire.');
}
function createWire(options) {
  options = options || {};
  var ajaxFn = options.ajax || defaultAjax;
  var csrf = options.csrf || null;
  var pending = {};
  var listeners = {};
  function emit(event) {
    var args = Array.prototype.slice.call(arguments, 1);
    (listeners[event] || []).forEach(function (fn) {
      fn.apply(null, args);
    });
  }
  function on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return wire;
  }
  function request(method, url, data, strategy) {
    strategy = strategy || 'drop';
    var doneHandlers = [];
    var failHandlers = [];
    var alwaysHandlers = [];
    var hasDone = false;
    var state = null;
    var target = null;
    var chain = {
      to: function to(ref) {
        target = ref;
        return chain;
      },
      // .before(fn) вызывает fn немедленно при регистрации —
      // это позволяет писать .get().before(fn) и fn вызовется до ответа
      before: function before(fn) {
        fn();
        return chain;
      },
      done: function done(fn) {
        hasDone = true;
        doneHandlers.push(fn);
        return chain;
      },
      fail: function fail(fn) {
        failHandlers.push(fn);
        return chain;
      },
      always: function always(fn) {
        alwaysHandlers.push(fn);
        return chain;
      },
      withState: function withState(s) {
        state = s;
        return chain;
      }

      // TODO: затычки для w-wire декларативного сахара
      // _prefetch:   null,
      // _bindView:   null,
      // _watchState: null,
    };
    pending[url] = true;
    emit('$wiring', 'start', url);
    var ajaxOptions = {
      url: url,
      method: method.toUpperCase(),
      headers: {}
    };
    if (csrf) ajaxOptions.headers['X-CSRF-TOKEN'] = csrf;
    if (data && (method === 'post' || method === 'put')) {
      ajaxOptions.data = JSON.stringify(data);
      ajaxOptions.contentType = 'application/json';
    }
    var req = ajaxFn(ajaxOptions);
    req.done(function (responseData) {
      emit('$wiring', 'done', url);

      // если указан .to() — пишем туда напрямую
      if (target !== null) {
        // пишем всё содержимое ответа прямо туда
        if (Array.isArray(target)) {
          target.length = 0;
          responseData.forEach(function (item) {
            target.push(item);
          });
        } else {
          Object.assign(target, responseData);
        }
        doneHandlers.forEach(function (fn) {
          fn(responseData);
        });
        return;
      }

      // авто-мерж всегда
      if (state && state.server && _typeof(responseData) === 'object' && responseData !== null) {
        var strategyFn = strategies[strategy] || strategies.drop;
        Object.keys(responseData).forEach(function (key) {
          strategyFn(state.server, key, responseData[key], failHandlers);
        });
      }

      // .done() просто дополнительный колбэк, не отменяет мерж
      doneHandlers.forEach(function (fn) {
        fn(responseData);
      });
    });
    req.fail(function (jqXHR, textStatus) {
      emit('$wiring', 'fail', url);
      failHandlers.forEach(function (fn) {
        fn(jqXHR, textStatus);
      });
    });
    req.always(function () {
      delete pending[url];
      emit('$wiring', 'always', url);
      alwaysHandlers.forEach(function (fn) {
        fn();
      });
    });
    return chain;
  }

  // $wire()       → true если хоть один запрос активен
  // $wire('/url') → true если этот URL активен
  function wire(url) {
    if (url === undefined) return Object.keys(pending).length > 0;
    return !!pending[url];
  }
  wire.get = function (url, strategy) {
    return request('get', url, null, strategy);
  };
  wire.post = function (url, data, strategy) {
    return request('post', url, data, strategy);
  };
  wire.put = function (url, data, strategy) {
    return request('put', url, data, strategy);
  };
  wire["delete"] = function (url, strategy) {
    return request('delete', url, null, strategy);
  };
  wire.on = on;
  return wire;
}
var $wire = createWire();


/***/ })
/******/ ]);
});