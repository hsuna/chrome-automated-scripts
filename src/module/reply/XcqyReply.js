import BaseReply from './BaseReply'

/* 星辰奇缘 */
export default class XcqyReply extends BaseReply{
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