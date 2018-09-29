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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const BACKGROUND = 'background';
const POPUP = 'popup';
const INJECT = 'inject';

const NOOP = _ => _;

const Pubsub = {
    BACKGROUND,
    POPUP,
    INJECT,
    background(type, data={}, callback=NOOP){
        chrome.extension.sendMessage({ type: `${BACKGROUND}.${type}`, data }, callback)
    },
    popup(type, data={}, callback=NOOP){
        chrome.extension.sendMessage({ type: `${POPUP}.${type}`, data }, callback)
    },
    inject(type, data={}, callback=NOOP){
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { type: `${INJECT}.${type}`, data }, callback)
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
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__module_reply_BaseReply__ = __webpack_require__(3);



let reply;

__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].INJECT+'.load', ({ id, code, data }) => {
  let Reply = new Function(`return ${code}`)()(__WEBPACK_IMPORTED_MODULE_1__module_reply_BaseReply__["a" /* default */])
  reply = new Reply(id)
  reply.init(data)
})

__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].INJECT+'.call', ({ name, data }) => {
  reply && reply[Symbol.for(name)](data);
})

__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].popup('inject')

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_pubsub__ = __webpack_require__(0);


const _start = Symbol.for('start')
const _continue = Symbol.for('continue')
const _stop = Symbol.for('stop')

class BaseReply{
    constructor(id){
        this.id = id
        this.isStop = false
    }
    async [_start](data){
        this.isStop = false
        this.data = this.parse(data)
        this.save()
        //运行数据
        this.toast('自动回复开始，请勿操作')
        this.run()
    }
    async [_continue](){
        this.data = JSON.parse(window.sessionStorage.getItem(this.id) || '{}');
        this.run();
    }
    async [_stop](){
        this.isStop = true;
    }
    /** 渲染器接口 */
    async renderer(){
        return {
            data: '',
            style: '',
            template: '',
        }
    }

    /**-暴露- */
    async init(data){
        let res = await this.renderer()
        res.data = data || res.data
        let reply = Object.assign({
            id: this.id
        }, res)

        __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].popup('init', reply)
    }
    
    run(){

    }
    complete(msg='自动回复完成'){
        this.isStop = true;
        this.toast(msg)
        __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].popup('complete')
    }
    parse(data){
        return data;
    }
    save(){
        return window.sessionStorage.setItem(this.id, JSON.stringify(this.data || {}))
    }

    /** 共用方法 */
    sleep(t){
        return new Promise(r => setTimeout(r, t || 1000))
    }
    toast(m){
        __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].popup('toast', m)
    }
    log(m){
        __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].popup('log', m)
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseReply;


/***/ })
/******/ ]);