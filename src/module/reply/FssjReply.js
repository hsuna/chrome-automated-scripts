module.exports = BaseReply => class FssjReply extends BaseReply{
    constructor(id){
        super(id)
        this.name = '风色世界'
    }
    async init(data){
        if(-1 != window.location.href.indexOf('admin.data.shiyuegame.com/login')){
            this.fail('请登录成功后，再操作');
        }else if(-1 == window.location.href.indexOf('gm/feedback')){
            window.location.href = 'https://admin.data.shiyuegame.com/gm/feedback/8'
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
        if(channelIds.sort().toString() != this.data.checks.sort().toString()){
            let html = this.data.checks.map(id => `<label class="col-sm-3" style="font-weight: normal;"><input type="checkbox" checked value="${id}" name="scope[channelIds][]"></label>`).join('');
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
        let { channels } = await this.getChannels()
        return {
            data: {
                checks: Object.keys(channels),
                value: ''
            },
            style: `
                .popup-renderer h4{margin-bottom:5px;padding-bottom:5px;border-bottom:1px solid #DADADA;font-size:14px;}
                .popup-renderer .checkbox-group{padding:5px;font-size:14px;}
                .popup-renderer .checkbox-group label{display:inline-block;margin-right:10px;margin-bottom:2px;}
                .popup-renderer .checkbox-group [type="checkbox"]{margin-right:4px;}
                .popup-renderer .textarea-group{padding:4px;}
                .popup-renderer .textarea-group textarea{overflow-y:auto;width:100%;height:80px;line-height:1.5;padding:0 4px;border:1px solid #dadada;border-radius:3px;font-size:14px;font-family:Arial;resize:none;}
            `,
            template: `
                <h4>统一回复：</h4>
                <div class="checkbox-group">
                    <label v-for="item in data.list"><input type="checkbox" :value="item.id" v-model="data.checks" />{{item.text}}</label>
                </div>
                <div class="textarea-group"><textarea class="form-control" v-model="data.value"></textarea></div>
            `
        }
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
        if(!this.data.value){
            this.toast('回复信息不能为空！')
            return;
        }

        let $edits = $('.fa-mail-reply.edit:not(.ignore)');
        if($edits.length > 0){
            let $edit = $edits.eq(0);
            $edit.click();
            await this.sleep(500);
            $('#reply_content').val(this.data.value)
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