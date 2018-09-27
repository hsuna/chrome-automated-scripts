import PS from "./common/pubsub"
import { getLocal, saveLocal } from "./common/storage"
import { serializeObject } from "./common/serializer"

let initComplete = false;
let injectData = {
  name: '',
  isStop: true,
  cache: null
}

/** 打印信息  */
const log = msg => {
  let logText = $('#logTxt').val()
  $('#logTxt').val(logText += msg + '\n')
}

/** 提示信息  */
const toast = (txt = '', time = 1500) => {
  let $msg = $('<div />').html(`<div class="msg-box">${txt}</div>`).appendTo($('body'))
  setTimeout(_ => $msg.remove(), time)
  log(txt)
}

/** 保存页面信息  */
const saveStorage = () => {
  let data = serializeObject($('#renderer').serializeArray());
  saveLocal(`group_${injectData.name}`, data)
  return data;
}

/** 保存按钮  */
$('#saveBtn').on('click', evt => {
  saveStorage()
  toast('保存成功')
})

/** 运行按钮  */
$('#runBtn').on('click', evt => {
  //保存数据
  injectData.isStop = false;
  let data = saveStorage();
  PS.content('call', { type:'start', data })
})

/** 关闭按钮  */
$('#closeBtn').on('click', evt => {
  injectData.isStop = true;
  let popup = chrome.extension.getViews({type: "popup"})[0];
  popup.close()
})

/** 停止按钮  */
$('#stopBtn').on('click', evt => {
  injectData.isStop = true;
  toast('停止运行')
  PS.content('call', { type:'stop' })
})

/** 打开打印信息  */
$('#openLogBtn').on('click', evt => {
  $('#log').removeClass('hidden');
});

/** 关闭打印信息  */
$('#closeLogBtn').on('click', evt => {
  $('#log').addClass('hidden');
});

/** 清除打印信息  */
$('#clearBtn').on('click', evt => {
  $('#logTxt').val('');
});

/** 监听渲染模板  */
PS.listen(PS.POPUP+'.render', ({ enabled, template }, sendRes) => {
  enabled && $('.popup-footer .btn').removeAttr('disabled')
  $('#renderer').html(template)

  initComplete = true;
})

/** 监听缓存数据  */
PS.listen(PS.POPUP+'.cache', cache => {
  injectData.cache = cache;
})

/** 监听提示信息  */
PS.listen(PS.POPUP+'.toast', msg => toast(msg))

/** 监听打印信息  */
PS.listen(PS.POPUP+'.log', msg => log(msg))

/** 监听内容页初始化完成  */
PS.listen(PS.POPUP+'.init', (name, sendRes) => {
  if(initComplete){
    PS.content('call', { type:'continue', data: injectData })
  }else if(name){
    PS.content('call', { type:'init', data: getLocal(`group_${name}`) })
  }
  injectData.name = name;
})

/** 通知内容页-插件启动  */
PS.content('init')