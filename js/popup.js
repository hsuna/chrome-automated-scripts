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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_fs__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_pubsub__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_storage__ = __webpack_require__(6);





const uuid = () => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
}

let vm = new Vue({
  el: '#app',
  data: {
    id: null,
    status: 0, //0：停止 1：运行 2：运行中 -1：编辑

    isShowFile: true,
    isShowLog: false,
    dialogType: null,

    logText: '',

    newFileName: '',
    newFilePath: '',
    newFile: null,
    delFileIds: [],

    checkFile: [],
    batchFile:[],
    
    fileList: [],

    renderName: '',
    renderData: {}
  },
  created () {
    Object(__WEBPACK_IMPORTED_MODULE_2__common_storage__["a" /* getLocal */])('fileList').then(res => {
      this.fileList = res || [];
    })

    __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].POPUP+'.inject', () => {
      if(this.id) this.readerFile(this.id)
    })

    __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].POPUP+'.init', reply => {
      this.id = reply.id
      this.renderData = reply.data
      if(-1 == this.status){
        this.isShowFile = false;
        this.createRender(reply)
        this.status = 0
      }else if(1 == this.status){
        __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].inject('call', { name:'start', data: this.renderData })
        this.log('================================')
        this.toast(`开始运行【${this.getFileNameById(this.id)}】脚本`)
        this.status = 2;
      }else if(2 == this.status){
        __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].inject('call', { name:'continue' })
      }
    })

    /** 监听运行完成  */
    __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].POPUP+'.complete', data => {
      this.status = 0
      this.toast('脚本运行完成')
      this.log('================================')
      if(this.fileBatch.length>0) {
        let file = this.fileBatch.shift()
        this.handlerRunFile(file)
      }
    })

    /** 监听提示信息  */
    __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].POPUP+'.toast', msg => this.toast(msg))

    /** 监听打印信息  */
    __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].POPUP+'.log', msg => this.log(msg))
  },
  methods: {
    handlerAddDialog(){
      if('' == this.newFileName){
        return this.toast('脚本名不能为空')
      }
      if('' == this.newFilePath){
        return this.toast('脚本路径不能为空')
      }

      let data = {
        id: uuid(),
        name: this.newFileName,
        path: this.newFilePath,
      }
      
      __WEBPACK_IMPORTED_MODULE_0__common_fs__["a" /* default */].writerFile(data.id, this.newFile).then(res => {
        this.fileList.push(data)
        return Object(__WEBPACK_IMPORTED_MODULE_2__common_storage__["c" /* setLocal */])('fileList', this.fileList)
      }).then(res => {
        this.dialogType = null
        this.newFile = null
        this.newFileName = ''
        this.newFilePath = ''
        this.toast('添加成功')
      })
    },
    handlerDelDialog(){
      for(let i=this.fileList.length-1; i>=0; i--){
        let item = this.fileList[i]
        if(this.delFileIds.includes(item.id)){
          this.fileList.splice(i, 1);
          Object(__WEBPACK_IMPORTED_MODULE_2__common_storage__["b" /* removeLocal */])(`cache-${item.id}`)
        }
      }
      Object(__WEBPACK_IMPORTED_MODULE_2__common_storage__["c" /* setLocal */])('fileList', this.fileList).then(res => {
        this.dialogType = null
        this.delFileIds = [];
        this.toast('删除成功')
      })
    },
    handlerAddFile(){
      this.newFileName = ''
      this.newFilePath = ''
      this.dialogType = 'add'
    },
    handlerSaveFile(){
      Object(__WEBPACK_IMPORTED_MODULE_2__common_storage__["c" /* setLocal */])(`cache-${this.id}`, this.renderData).then(res => {
        this.toast('保存成功')
      })
    },
    handlerStopFile(){
      __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].inject('call', { name:'stop' })
      this.toast('已暂停')
      this.fileBatch = []
      this.status = 0
    },
    handlerRunFile(file){
      if(file){
        this.status = 1
        this.readerFile(file.id)
      }else{
        this.status = 2
        Object(__WEBPACK_IMPORTED_MODULE_2__common_storage__["c" /* setLocal */])(`cache-${this.id}`, this.renderData)
        __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].inject('call', { name:'start', data: this.renderData })
        this.log('================================')
        this.toast(`开始运行【${this.getFileNameById(this.id)}】脚本`)
      }
    },
    handlerModifyFile(file){
      this.status = -1;
      this.readerFile(file.id)
    },
    handlerDeleteFile(file){
      this.delFileIds = [file.id];
      this.dialogType = 'remove';
    },
    handlerBatchDelFile(){
      if(this.checkFile.length>0){
        this.delFileIds = this.checkFile.map(item => item.id)
        this.dialogType = 'remove';
      }else{
        this.toast('至少选中一条数据')
      }
    },
    handlerBatchRunFile(){
      if(this.checkFile.length>0){
        this.fileBatch = [...this.checkFile];
        let file = this.fileBatch.shift()
        this.handlerRunFile(file)
      }else{
        this.toast('至少选中一条数据')
      }
    },
    handlerBack(){
      this.id = null
      this.status = 0
      this.renderName = ''
      this.renderData = {}
      this.isShowFile = true;
      this.isShowLog = false;
    },
    handlerClose(){
      let popup = chrome.extension.getViews({type: "popup"})[0];
      popup.close()
    },

    createRender(data) {
      let renderName = 'component_'+data.id;
      let renderComponent = Vue.extend({
        name: renderName,
        props: ['data'],
        template: `<div>${data.template}</div>`
      })
      Vue.component(renderName, renderComponent);
      document.getElementById('renderStyle').innerHTML = data.style;
      this.renderName = renderName;
    },
    readerFile(id){
      Object(__WEBPACK_IMPORTED_MODULE_2__common_storage__["a" /* getLocal */])(`cache-${id}`).then(data => {
        __WEBPACK_IMPORTED_MODULE_0__common_fs__["a" /* default */].readerFile(id).then(res => {
          this.id = id
          let reader = new FileReader();
          reader.onloadend = _=> __WEBPACK_IMPORTED_MODULE_1__common_pubsub__["a" /* default */].inject('load', { id, data, code: reader.result })
          reader.readAsText(res);
        })
      })
    },
    getFileNameById(id){
      let list = this.fileList.filter(item => id==item.id)
      return list[0]?list[0].name:''
    },

    /** 提示信息  */
    toast(txt = '', time = 1500) {
      let $msg = document.createElement('div')
      $msg.innerHTML = `<div class="toast-box">${txt}</div>`
      document.body.appendChild($msg)
      setTimeout(_ => document.body.removeChild($msg), time)
      this.log(txt)
    },
    /** 打印信息  */
    log(msg){
      this.logText += msg + '\n'
    }
  }
})

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

const TYPE = window.TEMPORARY
const SIZE = 5 * 1024

const fs = {
    writerFile(name, file){
        return new Promise((resolve, rejects) => {
            window.requestFileSystem(TYPE, SIZE, fs => {
                fs.root.getFile(name, { create: true, exclusive: true }, entry => {
                    entry.createWriter(writer => {
                        writer.onwriteend = resolve
                        writer.onerror = rejects
                        writer.write(file)
                    })
                }, rejects)
            }, rejects)
        })
    },
    readerFile(name){
        return new Promise((resolve, rejects) => {
            window.requestFileSystem(TYPE, SIZE, fs => {
                fs.root.getFile(name, { create: false }, entry => entry.file(resolve))
            }, rejects)
        })
    }
}

/* harmony default export */ __webpack_exports__["a"] = (fs);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return getLocal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return setLocal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return removeLocal; });
const getLocal = key => new Promise(resolve => chrome.storage.local.get(key, data => resolve(data[key])))
const setLocal = (key, value) => new Promise(resolve => chrome.storage.local.set({[key]: value}, resolve))
const removeLocal = key => new Promise(resolve => chrome.storage.local.remove(key, resolve))



/***/ })
/******/ ]);