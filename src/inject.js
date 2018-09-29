import PS from "./common/pubsub.js"
import BaseReply from './module/reply/BaseReply'

let reply;

PS.listen(PS.INJECT+'.load', ({ id, code, data }) => {
  let Reply = new Function(`return ${code}`)()(BaseReply)
  reply = new Reply(id)
  reply.init(data)
})

PS.listen(PS.INJECT+'.call', ({ name, data }) => {
  reply && reply[Symbol.for(name)](data);
})

PS.popup('inject')