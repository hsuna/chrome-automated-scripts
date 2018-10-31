export default BaseScript => class DemoScript extends BaseScript{
    constructor(id){
        super(id)
        this.name = '测试样例'
    }
    async init(data){
        if('www.baidu.com' != window.location.host){
            window.location.href = 'https://www.baidu.com/'
        }else{
            super.init(data)
        }
    }
    async run(){
        let { serarch } = this.data;
        if(!this.isStop){
            $('#kw').val(serarch)
            $('#form').submit()
            this.complete()
        }
    }
    async renderer(){
        return {
            data: {
                serarch: 'Demo'
            },
            style: `
                .popup-renderer h4{margin-bottom:5px;padding-bottom:5px;border-bottom:1px solid #DADADA;font-size:14px;}
                .popup-renderer .form-group{display:-webkit-flex;display:flex;margin:10px 0;font-size:14px;}
                .popup-renderer .form-group label{display:block;line-height:30px;padding-right:10px;text-align:right;}
                .popup-renderer .form-control{overflow:hidden;-webkit-flex:1;flex:1;height:30px;line-height:30px;padding:0 4px;border:1px solid #dadada;border-radius:3px;text-overflow:ellipsis;white-space:nowrap;}
            `,
            template: `
                <h4>自动搜索：</h4>
                <div class="form-group">
                    <label>文本：</label>
                    <input class="form-control" v-model="data.serarch" />
                </div>
            `
        }
    }
}