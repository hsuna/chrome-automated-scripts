import fs from "./common/fs"
import PS from "./common/pubsub"

import { getLocal, setLocal, removeLocal } from "./common/storage"

const uuid = () => {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
}

let vm = new Vue({
  el: '#app',
  data: {
    id: null,
    status: 0, //0：停止 1：运行 2：运行中 -1：编辑

    isShowFile: true,
    isShowLog: false,
    dialogType: null,

    logText: '',

    newFileName: '',
    newFilePath: '',
    newFile: null,
    delFileIds: [],

    checkFile: [],
    batchFile:[],
    
    fileList: [],

    renderName: '',
    renderData: {}
  },
  created () {
    getLocal('fileList').then(res => {
      this.fileList = res || [];
    })

    PS.listen(PS.POPUP+'.inject', () => {
      if(this.id) this.readerFile(this.id)
    })

    PS.listen(PS.POPUP+'.init', reply => {
      this.id = reply.id
      this.renderData = reply.data
      if(-1 == this.status){
        this.isShowFile = false;
        this.createRender(reply)
        this.status = 0
      }else if(1 == this.status){
        PS.inject('call', { name:'start', data: this.renderData })
        this.log('================================')
        this.toast(`开始运行【${this.getFileNameById(this.id)}】脚本`)
        this.status = 2;
      }else if(2 == this.status){
        PS.inject('call', { name:'continue' })
      }
    })

    /** 监听运行完成  */
    PS.listen(PS.POPUP+'.complete', data => {
      this.status = 0
      this.toast('脚本运行完成')
      this.log('================================')
      if(this.fileBatch.length>0) {
        let file = this.fileBatch.shift()
        this.handlerRunFile(file)
      }
    })

    /** 监听提示信息  */
    PS.listen(PS.POPUP+'.toast', msg => this.toast(msg))

    /** 监听打印信息  */
    PS.listen(PS.POPUP+'.log', msg => this.log(msg))
  },
  methods: {
    handlerAddDialog(){
      if('' == this.newFileName){
        return this.toast('脚本名不能为空')
      }
      if('' == this.newFilePath){
        return this.toast('脚本路径不能为空')
      }

      let data = {
        id: uuid(),
        name: this.newFileName,
        path: this.newFilePath,
      }
      
      fs.writerFile(data.id, this.newFile).then(res => {
        this.fileList.push(data)
        return setLocal('fileList', this.fileList)
      }).then(res => {
        this.dialogType = null
        this.newFile = null
        this.newFileName = ''
        this.newFilePath = ''
        this.toast('添加成功')
      })
    },
    handlerDelDialog(){
      for(let i=this.fileList.length-1; i>=0; i--){
        let item = this.fileList[i]
        if(this.delFileIds.includes(item.id)){
          this.fileList.splice(i, 1);
          removeLocal(`cache-${item.id}`)
        }
      }
      setLocal('fileList', this.fileList).then(res => {
        this.dialogType = null
        this.delFileIds = [];
        this.toast('删除成功')
      })
    },
    handlerAddFile(){
      this.newFileName = ''
      this.newFilePath = ''
      this.dialogType = 'add'
    },
    handlerSaveFile(){
      setLocal(`cache-${this.id}`, this.renderData).then(res => {
        this.toast('保存成功')
      })
    },
    handlerStopFile(){
      PS.inject('call', { name:'stop' })
      this.toast('已暂停')
      this.fileBatch = []
      this.status = 0
    },
    handlerRunFile(file){
      if(file){
        this.status = 1
        this.readerFile(file.id)
      }else{
        this.status = 2
        setLocal(`cache-${this.id}`, this.renderData)
        PS.inject('call', { name:'start', data: this.renderData })
        this.log('================================')
        this.toast(`开始运行【${this.getFileNameById(this.id)}】脚本`)
      }
    },
    handlerModifyFile(file){
      this.status = -1;
      this.readerFile(file.id)
    },
    handlerDeleteFile(file){
      this.delFileIds = [file.id];
      this.dialogType = 'remove';
    },
    handlerBatchDelFile(){
      if(this.checkFile.length>0){
        this.delFileIds = this.checkFile.map(item => item.id)
        this.dialogType = 'remove';
      }else{
        this.toast('至少选中一条数据')
      }
    },
    handlerBatchRunFile(){
      if(this.checkFile.length>0){
        this.fileBatch = [...this.checkFile];
        let file = this.fileBatch.shift()
        this.handlerRunFile(file)
      }else{
        this.toast('至少选中一条数据')
      }
    },
    handlerBack(){
      this.id = null
      this.status = 0
      this.renderName = ''
      this.renderData = {}
      this.isShowFile = true;
      this.isShowLog = false;
    },
    handlerClose(){
      let popup = chrome.extension.getViews({type: "popup"})[0];
      popup.close()
    },

    createRender(data) {
      let renderName = 'component_'+data.id;
      let renderComponent = Vue.extend({
        name: renderName,
        props: ['data'],
        template: `<div>${data.template}</div>`
      })
      Vue.component(renderName, renderComponent);
      document.getElementById('renderStyle').innerHTML = data.style;
      this.renderName = renderName;
    },
    readerFile(id){
      getLocal(`cache-${id}`).then(data => {
        fs.readerFile(id).then(res => {
          this.id = id
          let reader = new FileReader();
          reader.onloadend = _=> PS.inject('load', { id, data, code: reader.result })
          reader.readAsText(res);
        })
      })
    },
    getFileNameById(id){
      let list = this.fileList.filter(item => id==item.id)
      return list[0]?list[0].name:''
    },

    /** 提示信息  */
    toast(txt = '', time = 1500) {
      let $msg = document.createElement('div')
      $msg.innerHTML = `<div class="toast-box">${txt}</div>`
      document.body.appendChild($msg)
      setTimeout(_ => document.body.removeChild($msg), time)
      this.log(txt)
    },
    /** 打印信息  */
    log(msg){
      this.logText += msg + '\n'
    }
  }
})