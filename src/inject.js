import PS from "./common/pubsub"
import BaseScript from './module/BaseScript'

let script;

const getSubClass = (code, context={}) => {
  Function.prototype.constructor('BaseScript', code).call(context, BaseScript)
  return context['SubScript'].default
}

PS.listen(PS.INJECT+'.load', ({ id, code, data }) => {
  try{
    const SubScript = getSubClass(code)
    script = new SubScript(id)
    script.init(data)
  }catch(e){
    PS.popup('toast', '脚本读取失败')
    PS.popup('fail')
    console.log(e)
  }
})

PS.listen(PS.INJECT+'.call', ({ name, data }) => {
  script && script[Symbol.for(name)](data);
})

PS.popup('inject')