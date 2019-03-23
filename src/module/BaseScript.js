import PS from "../common/pubsub"

const _start = Symbol.for('start')
const _continue = Symbol.for('continue')
const _stop = Symbol.for('stop')

export default class BaseReply{
    constructor(id){
        this.id = id
        this.isStop = false
    }
    async [_start](data){
        this.isStop = false
        this.data = this.parse(data)
        this.save()
        //运行数据
        this.toast('脚本自动运行中，请勿操作')
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

        PS.popup('init', reply)
    }
    
    run(){

    }
    complete(){
        this.isStop = true;
        this.toast('脚本自动运行结束')
        PS.popup('complete')
    }
    fail(msg){
        this.isStop = true;
        this.toast(msg)
        PS.popup('fail')
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
        PS.popup('toast', m)
    }
    log(m){
        PS.popup('log', m)
    }
}