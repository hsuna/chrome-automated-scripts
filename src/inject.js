import PS from "./common/pubsub.js"
import BaseReply from './module/reply/BaseReply'

let reply;

PS.listen(PS.INJECT+'.load', ({ id, code, data }) => {
  try{
    let Reply = new Function(`return ${code}`)()(BaseReply)
    reply = new Reply(id)
    reply.init(data)
  }catch(e){
    PS.popup('toast', '脚本读取失败')
    PS.popup('fail')
    console.log(e)
  }
})

PS.listen(PS.INJECT+'.call', ({ name, data }) => {
  reply && reply[Symbol.for(name)](data);
})

PS.popup('inject')