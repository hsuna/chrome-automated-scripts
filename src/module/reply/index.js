import BaseReply from './BaseReply'
import XcqyReply from './XcqyReply'
import FssjReply from './FssjReply'


let host = window.location.host
let Reply = BaseReply

switch(host){
  case 'smp.xc2016.shiyuegame.com':
    Reply = XcqyReply
    break;
  case 'admin.data.shiyuegame.com':
    Reply = FssjReply
    break;
}

export {
  Reply
};