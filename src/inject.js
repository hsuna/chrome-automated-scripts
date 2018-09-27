import PS from "./common/pubsub.js"
import { Reply, ReplyControl } from './module/reply';

let reply = new Reply();

/**监听前台初始化 */
PS.listen(PS.CONTENT+'.init', ({ type, data }) => {
  PS.popup('init', reply.name)
})

/**监听回调函数 */
PS.listen(PS.CONTENT+'.call', ({ type, data }) => {
  reply[type](data);
});

/**通知前台初始化完成 */
PS.popup('init', reply.name)
