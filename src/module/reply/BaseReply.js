import PS from "../../common/pubsub"

export default class BaseReply{
    constructor(name){
        this.name = name;
        this.isStop = true;
        this.cacheData = null;
        this.storageData = null
    }
    async init(data={}){
        this.storageData = data
        let render = await this.renderer()
        PS.popup('render', {
            enabled: render ? true : false,
            template: render || '该插件不能应用在该页面上'
        })
    }
    async start(data={}){
        this.isStop = false;
        this.cacheData = this.parseData(data);
        PS.popup('cache', this.cacheData)
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
        PS.popup('cache', this.cacheData);
    }
    parseData(data){
        return data;
    }
    sleep(t){
        return new Promise(r => setTimeout(r, t || 1000))
    }
    toast(m){
        PS.popup('toast', m)
    }
    log(m){
        PS.popup('log', m)
    }
}