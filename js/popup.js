/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const BACKGROUND = 'background';
const POPUP = 'popup';
const CONTENT = 'content';

const NOOP = _ => _;

const Pubsub = {
    BACKGROUND,
    POPUP,
    CONTENT,
    background(type, data={}, callback=NOOP){
        chrome.extension.sendMessage({ type: `${BACKGROUND}.${type}`, data }, callback)
    },
    popup(type, data={}, callback=NOOP){
        chrome.extension.sendMessage({ type: `${POPUP}.${type}`, data }, callback)
    },
    content(type, data={}, callback=NOOP){
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { type: `${CONTENT}.${type}`, data }, callback)
        })
    },
    listen(type, callback=NOOP){
        chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
            if(request.type == type){
                callback(request.data, sendResponse)
            }
        })
    }
}
/* harmony default export */ __webpack_exports__["a"] = (Pubsub);

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_pubsub__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_storage__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_serializer__ = __webpack_require__(9);




let initComplete = false;
let injectData = {
  name: '',
  isStop: true,
  cache: null
}

/** 打印信息  */
const log = msg => {
  let logText = $('#logTxt').val()
  $('#logTxt').val(logText += msg + '\n')
}

/** 提示信息  */
const toast = (txt = '', time = 1500) => {
  let $msg = $('<div />').html(`<div class="msg-box">${txt}</div>`).appendTo($('body'))
  setTimeout(_ => $msg.remove(), time)
  log(txt)
}

/** 保存页面信息  */
const saveStorage = () => {
  let data = Object(__WEBPACK_IMPORTED_MODULE_2__common_serializer__["a" /* serializeObject */])($('#renderer').serializeArray());
  Object(__WEBPACK_IMPORTED_MODULE_1__common_storage__["b" /* saveLocal */])(`group_${injectData.name}`, data)
  return data;
}

/** 保存按钮  */
$('#saveBtn').on('click', evt => {
  saveStorage()
  toast('保存成功')
})

/** 运行按钮  */
$('#runBtn').on('click', evt => {
  //保存数据
  injectData.isStop = false;
  let data = saveStorage();
  __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].content('call', { type:'start', data })
})

/** 关闭按钮  */
$('#closeBtn').on('click', evt => {
  injectData.isStop = true;
  let popup = chrome.extension.getViews({type: "popup"})[0];
  popup.close()
})

/** 停止按钮  */
$('#stopBtn').on('click', evt => {
  injectData.isStop = true;
  toast('停止运行')
  __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].content('call', { type:'stop' })
})

/** 打开打印信息  */
$('#openLogBtn').on('click', evt => {
  $('#log').removeClass('hidden');
});

/** 关闭打印信息  */
$('#closeLogBtn').on('click', evt => {
  $('#log').addClass('hidden');
});

/** 清除打印信息  */
$('#clearBtn').on('click', evt => {
  $('#logTxt').val('');
});

/** 监听渲染模板  */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].POPUP+'.render', ({ enabled, template }, sendRes) => {
  enabled && $('.popup-footer .btn').removeAttr('disabled')
  $('#renderer').html(template)

  initComplete = true;
})

/** 监听缓存数据  */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].POPUP+'.cache', cache => {
  injectData.cache = cache;
})

/** 监听提示信息  */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].POPUP+'.toast', msg => toast(msg))

/** 监听打印信息  */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].POPUP+'.log', msg => log(msg))

/** 监听内容页初始化完成  */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].POPUP+'.init', (name, sendRes) => {
  if(initComplete){
    __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].content('call', { type:'continue', data: injectData })
  }else if(name){
    __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].content('call', { type:'init', data: Object(__WEBPACK_IMPORTED_MODULE_1__common_storage__["a" /* getLocal */])(`group_${name}`) })
  }
  injectData.name = name;
})

/** 通知内容页-插件启动  */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].content('init')

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export getLocalStr */
/* unused harmony export saveLocalStr */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getLocal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return saveLocal; });
/* unused harmony export removeLocal */
const getLocalStr = key => localStorage.getItem(key)
const saveLocalStr = (key, value) => localStorage.setItem(key, value)

const getLocal = key => JSON.parse(localStorage.getItem(key) || '{}')
const saveLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const removeLocal = key => localStorage.removeItem(key)



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return serializeObject; });
/* unused harmony export serializeJSON */
const patterns = {
    validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
    key:      /[a-z0-9_]+|(?=\[\])/gi,
    push:     /^$/,
    fixed:    /^\d+$/,
    named:    /^[a-z0-9_]+$/i
};

function isObj(x){ 
    var type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}
 
function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
 
    return Object(val);
}
 
function assignKey(to, from, key) {
    var val = from[key];
 
    if (val === undefined || val === null) {
        return;
    }
 
    if (to.hasOwnProperty(key)) {
        if (to[key] === undefined || to[key] === null) {
            throw new TypeError('Cannot convert undefined or null to object (' + key + ')');
        }
    }
 
    if (!to.hasOwnProperty(key) || !isObj(val)) {
        to[key] = val;
    } else {
        to[key] = assign(Object(to[key]), from[key]);
    }
}
 
function assign(to, from) {
    if (to === from) {
        return to;
    }
 
    from = Object(from);
 
    for (var key in from) {
        if (from.hasOwnProperty(key)) {
            assignKey(to, from, key);
        }
    }
 
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(from);
 
        for (var i = 0; i < symbols.length; i++) {
            if (from.propIsEnumerable(symbols[i])) {
                assignKey(to, from, symbols[i]);
            }
        }
    }
 
    return to;
}
 
function deepAssign(target) {
    target = toObject(target);
 
    for (var s = 1; s < arguments.length; s++) {
        assign(target, arguments[s]);
    }
    return target;
}
  
function FormSerializer() {

  // private variables
  var data     = {},
      pushes   = {};

  // private API
  function build(base, key, value) {
    base[key] = value;
    return base;
  }

  function makeObject(root, value) {

    var keys = root.match(patterns.key), k;

    // nest, nest, ..., nest
    while ((k = keys.pop()) !== undefined) {
      // foo[]
      if (patterns.push.test(k)) {
        var idx = incrementPush(root.replace(/\[\]$/, ''));
        value = build([], idx, value);
      }

      // foo[n]
      else if (patterns.fixed.test(k)) {
        value = build([], k, value);
      }

      // foo; foo[bar]
      else if (patterns.named.test(k)) {
        value = build({}, k, value);
      }
    }

    return value;
  }

  function incrementPush(key) {
    if (pushes[key] === undefined) {
      pushes[key] = 0;
    }
    return pushes[key]++;
  }

  function addPair(pair) {
    if (!patterns.validate.test(pair.name)) return this;
    var obj = makeObject(pair.name, "true"===pair.value || pair.value);
    data = deepAssign(data, obj);
    return this;
  }

  function addPairs(pairs) {
    if (!Array.isArray(pairs)) {
      throw new Error("formSerializer.addPairs expects an Array");
    }
    for (var i=0, len=pairs.length; i<len; i++) {
      this.addPair(pairs[i]);
    }
    return this;
  }

  function serialize() {
    return data;
  }

  function serializeJSON() {
    return JSON.stringify(serialize());
  }

  // public API
  this.addPair = addPair;
  this.addPairs = addPairs;
  this.serialize = serialize;
  this.serializeJSON = serializeJSON;
}
  
FormSerializer.patterns = patterns;

const serializeObject = serializeArray => new FormSerializer().addPairs(serializeArray).serialize();
const serializeJSON = serializeArray => new FormSerializer().addPairs(serializeArray).serializeJSON();



/***/ })
/******/ ]);