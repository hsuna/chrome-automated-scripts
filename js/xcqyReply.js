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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ (function(module, exports) {

module.exports = Reply => class XcqyReply extends Reply{
    constructor(id){
        super(id)
        this.name = '星辰奇缘'
        this.curItem = null
    }
    async init(data){
        if(-1 == window.location.href.indexOf('m=SMP_GM_Feedback')){
            window.location.href = 'http://smp.xc2016.shiyuegame.com/?m=SMP_GM_Feedback'
        }else if($('#loginform').length>0){
            this.fail('请登录成功后，再操作');
        }else{
            super.init(data);
        }
    }
    run(){
        if(this.data &&  this.data.length > 0){
            let item = this.curItem = this.data[0];
            this.selectChannel(item.id)
        }else{
            this.complete();
        }
    }
    async renderer(){
        let { channels } = await this.getChannels()
        return {
            data: {
                checks: channels.map(item => item.id),
                value: '',
                list: channels.map(item => ({
                    id: item.id,
                    text: item.text,
                    checked: false,
                    value: ''
                }))
            },
            style: `
                .popup-renderer h4{margin-bottom:5px;padding-bottom:5px;border-bottom:1px solid #DADADA;font-size:14px;}
                .popup-renderer .checkbox-group{padding:5px;font-size:14px;}
                .popup-renderer .checkbox-group label{display:inline-block;margin-right:10px;margin-bottom:2px;}
                .popup-renderer .checkbox-group [type="checkbox"]{margin-right:4px;}
                .popup-renderer .textarea-group{padding:4px;}
                .popup-renderer .textarea-group textarea{overflow-y:auto;width:100%;font-size:14px;font-family:Arial;}
                .popup-renderer .form-group{display:-webkit-flex;display:flex;margin-bottom:10px;font-size:14px;}
                .popup-renderer .form-group label{display:block;line-height:30px;padding-right:10px;text-align:right;}
                .popup-renderer .form-group label span{display:inline-block;width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle;}
                .popup-renderer .form-group label [type="checkbox"]{margin-left:6px;vertical-align:middle;}
                .popup-renderer .form-control{overflow:hidden;-webkit-flex:1;flex:1;height:30px;line-height:30px;padding:0 4px;border:1px solid #dadada;border-radius:3px;text-overflow:ellipsis;white-space:nowrap;}
                .popup-renderer textarea.form-control{height:80px;line-height:1.5;resize:none;white-space:inherit;}
            `,
            template: `
                <h4>统一回复：</h4>
                <div class="checkbox-group">
                    <label v-for="item in data.list"><input type="checkbox" :value="item.id" v-model="data.checks" />{{item.text}}</label>
                </div>
                <div class="textarea-group"><textarea class="form-control" v-model="data.value"></textarea></div>
                <h4 style="margin-top: 20px; margin-bottom: 10px;">个性化回复：</h4>
                <div class="form-group" v-for="item in data.list">
                    <label :title="item.text"><span>{{item.text}}</span><input type="checkbox" class="form-checkbox" v-model="item.checked"} /></label>
                    <input type="text" class="form-control" v-model="item.value" />
                </div>
            `
        }
    }
    parse(data){
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
        console.log('selectChannel', id)
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
            this.data.shift()
            this.save()
            this.run()
        }
    }
    selectReply(){
        if(this.isStop) return;

        let $replys = $('[onclick^="show_reply"]:not(.ignore)');
        if($replys.length > 0){
            let $reply = $replys.eq(0)
            let id = $reply.attr('onclick').replace(/[\s\S]*\(\'([^']*)[\s\S]*/, '$1')
            $reply.addClass('ignore')//执行过回复的加入忽略
            
            if(!this.curItem.value){
                this.toast('回复信息不能为空！')
                this.selectReply();
            }else{
                $.get('?m=SMP_GM_ReplyFeedback&id=' + id, html => {
                    $('#js_reply_body').remove();
                    $('<span id="js_reply_body" style="position: relative;left:0;"> V</span>').append(html).appendTo($reply.parent());
                    $('#js_reply').val(this.curItem.value);
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

/***/ })

/******/ });