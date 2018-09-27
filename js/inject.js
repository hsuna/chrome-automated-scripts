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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_pubsub__ = __webpack_require__(0);


class BaseReply{
    constructor(name){
        this.name = name;
        this.isStop = true;
        this.cacheData = null;
        this.storageData = null
    }
    async init(data={}){
        this.storageData = data
        let render = await this.renderer()
        __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].popup('render', {
            enabled: render ? true : false,
            template: render || '该插件不能应用在该页面上'
        })
    }
    async start(data={}){
        this.isStop = false;
        this.cacheData = this.parseData(data);
        __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].popup('cache', this.cacheData)
        //运行数据
        this.toast('自动回复开始，请勿操作');
        this.run();
    }
    async continue({ cache, isStop }){
        this.isStop = isStop;
        this.cacheData = cache;
        this.run();
    }
    async stop(){
        this.isStop = true;
    }
    async renderer(){
        return null
    }
    run(){

    }
    complete(){
        this.toast('自动回复完成')
    }
    cache(){
        __WEBPACK_IMPORTED_MODULE_0__common_pubsub__["a" /* default */].popup('cache', this.cacheData);
    }
    parseData(data){
        return data;
    }
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


/***/ }),
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__module_reply__ = __webpack_require__(4);



let reply = new __WEBPACK_IMPORTED_MODULE_1__module_reply__["a" /* Reply */]();

/**监听前台初始化 */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].CONTENT+'.init', ({ type, data }) => {
  __WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].popup('init', reply.name)
})

/**监听回调函数 */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].listen(__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].CONTENT+'.call', ({ type, data }) => {
  reply[type](data);
});

/**通知前台初始化完成 */
__WEBPACK_IMPORTED_MODULE_0__common_pubsub_js__["a" /* default */].popup('init', reply.name)


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Reply; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseReply__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__XcqyReply__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__FssjReply__ = __webpack_require__(6);





let host = window.location.host
let Reply = __WEBPACK_IMPORTED_MODULE_0__BaseReply__["a" /* default */]

switch(host){
  case 'smp.xc2016.shiyuegame.com':
    Reply = __WEBPACK_IMPORTED_MODULE_1__XcqyReply__["a" /* default */]
    break;
  case 'admin.data.shiyuegame.com':
    Reply = __WEBPACK_IMPORTED_MODULE_2__FssjReply__["a" /* default */]
    break;
}



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseReply__ = __webpack_require__(1);


/* 星辰奇缘 */
class XcqyReply extends __WEBPACK_IMPORTED_MODULE_0__BaseReply__["a" /* default */]{
    constructor(){
        super('xcqy')
        this.curData = null;
    }
    async init(data){
        if(-1 == window.location.href.indexOf('m=SMP_GM_Feedback')){
            window.location.href = '//smp.xc2016.shiyuegame.com/?m=SMP_GM_Feedback'
        }else{
            super.init(data);
        }
    }
    run(){
        if(this.cacheData &&  this.cacheData.length > 0){
            let item = this.curData = this.cacheData[0];
            this.selectChannel(item.id)
        }else{
            this.complete();
        }
    }
    async renderer(){
        let res = await this.getChannels();
        let ckbHtml = '', iptHtml = '';
        let { checks, value='', list=[] } = this.storageData;
        res.channels.forEach(item => {
            let data = list.find(data => data.id == item.id) || {};
            ckbHtml += `<label><input name="checks[]" type="checkbox" value="${item.id}" ${checks&&-1==checks.indexOf(item.id) ? '' : 'checked'} />${item.text}</label>`;
            iptHtml += ` <div class="form-group">
                <input type="hidden" name="list[][id]" value="${item.id}" />
                <label title="${item.text}"><span>${item.text}</span><input name="list[][checked]" type="checkbox" class="form-checkbox" value="true" ${data.checked || false ? 'checked' : ''} /></label>
                <input type="text" name="list[][value]" class="form-control" value="${data.value || ''}" />
            </div>`;
        })

        return  `
            <h4>统一回复：</h4>
            <div class="checkbox-group">${ckbHtml}</div>
            <div class="textarea-group"><textarea name="value" class="form-control">${value}</textarea></div>
            <h4 style="margin-top: 20px; margin-bottom: 10px;">个性化回复：</h4>
            ${iptHtml}
        `;
    }
    parseData(data){
        let inputs = {};
        data.checks.forEach(id => {
          inputs[id] = {
            id,
            checked: true,
            value: data.value,
          }
        })
        data.list.forEach(item => {
          if(item.checked) inputs[item.id] = item
        })
        return Object.values(inputs);
    }
    getChannels(){
        return new Promise((resolve, reject) => {
            let channels = $('[name="group_id"]').map((index, elem) => ({
                id: elem.value,
                text: $(elem).parent().find('a').text()
            })).get()
            resolve({
                 channels
            });
        })
    }
    selectChannel(id){
        if(0 == $('[name="status"]').val() && id == $('[name="group_id"]:checked').val()){//已经选中
            this.selectReply();
        }else{
            $('[name="status"]').val(0);//选中未回复
            $('[name="group_id"]').each((index, elem) => {
                elem.checked = id == elem.value ? true : false;
            });
            $('#js_f1').submit();
        }
    }
    selectNextPage(){
        let $next = $(".page .curpage").next('a');
        if($next.length > 0){
            $next.click();
        }else{
            this.cacheData.shift();
            this.cache();
            this.run();
        }
    }
    selectReply(){
        if(this.isStop) return;

        let $replys = $('[onclick^="show_reply"]:not(.ignore)');
        if($replys.length > 0){
            let $reply = $replys.eq(0)
            let id = $reply.attr('onclick').replace(/[\s\S]*\(\'([^']*)[\s\S]*/, '$1')
            $reply.addClass('ignore')//执行过回复的加入忽略
            
            if(!this.curData.value){
                this.toast('回复信息不能为空！')
                this.selectReply();
            }else{
                $.get('?m=SMP_GM_ReplyFeedback&id=' + id, html => {
                    $('#js_reply_body').remove();
                    $('<span id="js_reply_body" style="position: relative;left:0;"> V</span>').append(html).appendTo($reply.parent());
                    $('#js_reply').val(this.curData.value);
                    this.submitReply();
                });
            }
        }else{
            this.selectNextPage()
        }
    }
    submitReply(){
        let $form = $('#js_reply_form')
        $.getJSON($form.attr('action'), $form.serialize(), data => {
            if(!data.error) {
                $('#js_reply_body').parent().html('已回复').siblings('.status').html('<em>已回复</em>');
                this.toast('回复成功！')
            }else{
                $('#js_reply_body').remove();
                this.toast(data.data)
            }
            this.selectReply();
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = XcqyReply;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__BaseReply__ = __webpack_require__(1);


/* 风色世界 */
class FssjReply extends __WEBPACK_IMPORTED_MODULE_0__BaseReply__["a" /* default */]{
    constructor(){
        super('fssj')
    }
    async init(data){
        if(-1 == window.location.href.indexOf('gm/feedback')){
            window.location.href = '//admin.data.shiyuegame.com/gm/feedback/8'
        }else{
            super.init(data);
        }
    }
    async run(){
        //等待1s中，界面初始化完在获取
        if('' == $('.scope-channels .col-sm-10 .row').html().trim()){
            await this.sleep(1000)
        }

        let flag = !1;
        //切换到未回复
        if(0 != $('[name="scope[reply_status]"]').val()){
            $('[name="scope[reply_status]"]').val(0)
            flag = !0;
        }

        let channelIds = $('#scope-form [name="scope[channelIds][]"]:checked').map((index, item) => item.value).get()
        //选择对应的渠道
        if(channelIds.sort().toString() != this.cacheData.checks.sort().toString()){
            let html = this.cacheData.checks.map(id => `<label class="col-sm-3" style="font-weight: normal;"><input type="checkbox" checked value="${id}" name="scope[channelIds][]"></label>`).join('');
            $('.scope-channels .col-sm-10 .row').html(html);
            flag = !0;
        }
        if(flag){
            $('#scope-form').submit();
        }else{
            this.selectReply()
        }
    }
    async renderer(){
        let res = await this.getChannels();
        
        let { checks, value='' } = this.storageData;
        let ckbHtml = $.map(res.channels, (v, k) => {
            return `<label><input type="checkbox" name="checks[]" value="${k}" ${checks && -1==checks.indexOf(k) ? '' : 'checked'} />${v.alias}</label>`
        }).join('')

        return `
            <h4>统一回复：</h4>
            <div class="checkbox-group">${ckbHtml}</div>
            <div class="textarea-group"><textarea name="value" class="form-control">${value}</textarea></div>
        `;
    }
    getChannels(){
        return new Promise((resolve, reject) => {
            let platformCheck = $('.scope-platforms :checkbox').map(function(){
                return $(this).attr('checked', true).prop('checked', true).val()
            }).get();
            $.getJSON('https://admin.data.shiyuegame.com/channels-gameservers/8', {platformIds: platformCheck}, resolve)
        })
    }
    async selectReply(){
        if(this.isStop) return;
        if(!this.cacheData.value){
            this.toast('回复信息不能为空！')
            return;
        }

        let $edits = $('.fa-mail-reply.edit:not(.ignore)');
        if($edits.length > 0){
            let $edit = $edits.eq(0);
            $edit.click();
            await this.sleep(500);
            $('#reply_content').val(this.cacheData.value)
            let url =  $edit.is('a') ? $edit.attr('href') : $edit.parent('a').attr('href');
            this.submitReply(url, $edit.closest('tr'))
            $edit.addClass('ignore')//执行过回复的加入忽略  $edit
        }else{
            this.complete();
        }
    }
    submitReply(url, $tr){
        let info = {
            tag: $('#tag').val(),
            reply_content: $('#reply_content').val()
        }

        $.getJSON(url+'?'+ $.param(info), res => {
            if(res.success == true){
                $tr.remove();
                $('.bootbox.fade.in').remove();
                this.toast('回复成功！')
            }else{
                this.toast(JSON.stringify(res))
            }
            this.selectReply();
        })
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FssjReply;


/***/ })
/******/ ]);