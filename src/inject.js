import PS from "./common/pubsub"
import BaseScript from './module/BaseScript'

let script;

PS.listen(PS.INJECT+'.load', ({ id, code, data }) => {
  try{
    let SubScript = new Function(`return ${code}`)()(BaseScript)
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