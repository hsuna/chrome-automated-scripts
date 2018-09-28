import PS from "../../common/pubsub"

export default class BaseReply{
    constructor(id){
        this.id = id
        this.isStop = true
        this.cacheData = null
        this.storageData = null
        this.init();
    }
    async init(data){
        let reply = {
            id: this.id,
            data: data || await this.data(),
            style: await this.style(),
            template: await this.template()
        }
        PS.popup('init', reply)
    }
    async start(data){
        this.isStop = false;
        this.cacheData = this.parseData(data);
        PS.popup('cache', this.cacheData)
        //运行数据
        this.toast('自动回复开始，请勿操作');
        this.run();
    }
    async continue(cache){
        this.cacheData = cache;
        this.run();
    }
    async stop(){
        this.isStop = true;
    }

    async data(){
        return {}
    }
    async style(){
        return ''
    }
    async template(){
        return ''
    }
    run(){

    }
    complete(){
        this.toast('自动回复完成')
        PS.popup('cache', this.cacheData);
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