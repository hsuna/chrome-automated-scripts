# chrome-automated-scripts

> 谷歌插件自动化脚本工具<br/>
> 作者：Hsuna<br/>
> 日期：2018/09/30<br/>

## 启动

1.  `git clone https://github.com/hsuna/chrome-automated-scripts.git`
3.  安装依赖：`npm i`
4.  开发：`npm run dev`
5.  生产：`npm run build`
6.  脚本生成： `npm run create`

## 项目结构

```
//工作空间
./workspace
├── config                 // 项目编译配置
├── css                    // 样式目录
├── dist                   // 打包目录
├── images                 // 资源目录
├── js                     // 运行时编译目录
├── scripts                // 脚本生成目录
├── src                    // 项目目录
├── popup.html             // 插件弹窗页
├── manifest.json          // 插件配置信息
└── package.json           // 项目配置信息

// 项目目录         
./src                         
├── common                  // 公共
├── lib                     // 库（打包时会复制）
├── module                  // 模块
├── script                  // 脚本
├── background.js           // 插件背景页
├── inject.js               // 插件注入页
└── popup.js                // 插件弹窗页
```

## 项目说明

### fs.js 文件系统模块

通过使用 `window.requestFileSystem` 将文件系统的调用方法进行封装，编译文件的写入及读取，并将其保存在`chrome extension`沙箱内：

```
import fs from "./common/fs"

fs.writerFile(filename, file).then(res => {
    //TODO
})

fs.readerFile(filename).then(res => {
    //TODO
})
```

### pubsub.js 通信模块

对 `background.js` `inject.js` `popup.js` 之间的双向消息通道进行封装，便于页面的通信：

```
const Pubsub = {
    BACKGROUND,
    POPUP,
    INJECT,
    background(type, data={}, callback=NOOP){
        chrome.extension.sendMessage({ type: `${BACKGROUND}.${type}`, data }, callback)
    },
    popup(type, data={}, callback=NOOP){
        chrome.extension.sendMessage({ type: `${POPUP}.${type}`, data }, callback)
    },
    inject(type, data={}, callback=NOOP){
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { type: `${INJECT}.${type}`, data }, callback)
        })
    },
    listen(type, callback=NOOP){
        chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
            if(request.type == type){
                callback(request.data, sendResponse)
            }
        })
    }
}
```

### storage.js 缓存模块

摒弃了window的storage缓存机制，而是采用chrome.storage.local进行更为高效的方式来缓存页面数据：


```
const getLocal = key => new Promise(resolve => chrome.storage.local.get(key, data => resolve(data[key])))
const setLocal = (key, value) => new Promise(resolve => chrome.storage.local.set({[key]: value}, resolve))
const removeLocal = key => new Promise(resolve => chrome.storage.local.remove(key, resolve))
```

## 脚本模板的编写

脚本模板是在继承 `BaseScript` 类的基础上进行开发，通过简单工厂，将实体返回给 `inject` 进行控制：

```
module.exports = BaseScript => class DemoScript extends BaseScript {
    constructor(id){
        super(id)
        this.name = '测试demo'
    }
    //....
}
```
其中 `BaseScript` 的公开属性及方法有：

### 属性

| 属性 | 类型 | 说明 |
|--|--|--|
| id | String | 脚本的唯一id，初始化时传入进来的，用于缓存数据及拷贝脚本等作用 |
| data | any | 脚本的运行数据 |
| isStop | Boolean | 脚本是否被中断 |

### 重写方法

* 渲染器： renderer()

用于返回popup配置页的渲染数据

```
async renderer(){
    return {
        data: {
            search: ''
        },
        style: `
            .popup-renderer .form-control{overflow:hidden;-webkit-flex:1;flex:1;height:30px;line-height:30px;padding:0 4px;border:1px solid #dadada;border-radius:3px;text-overflow:ellipsis;white-space:nowrap;}
        `,
        template: `
            <h4>搜索：</h4>
            <input class="form-control" v-model="data.search" />
        `
    }
}
```

> `data`: 类似vue的data，用于页面数据，同时用于缓存<br/>
> `style`：页面的样式，使用`popup-renderer`来作用页面，仅支持css写法<br/>
> `template`: 类似vue的，用于页面的模板<br/>

* 初始化： init(data)

需要执行super，进行实际的初始化，在此之前，可以进行页面判断，参数 `data` 是配置页面数据

```
async init(data){
    if(-1 != window.location.href.indexOf('baidu.com')){
        window.location.href = "https://www.baidu.com"
    }else{
        super.init(data);
    }
}
```

* 运行：run()

脚本运行方法，通过判断运行时数据，校验是继续运行下去，还是完成运行

```
run(){
    // TODO
}
```

* 解析：parse(data)

将配置数据解析成运行数据，用于脚本的执行

```
parse(data){
    return data
}
```

* 其他方法

```
complete()：脚本执行成功
fail(message)：脚本执行失败
save()：在页面跳转前缓存运行数据
sleep()：延迟/睡眠方法
toast(message)：提示方法
log(message)：历史记录方法
```

> 详细可以看下 `DemoScript` 文件

## 参考文献

* [ 谷歌浏览器扩展程序manifest.json参数详解 ](https://www.cnblogs.com/GoCircle/p/9332836.html)
* [ Chromium扩展（Extension）通信机制分析 ](https://blog.csdn.net/luoshengyang/article/details/52519089)
* [ vue与chrome浏览器插件开发 ](http://ju.outofmemory.cn/entry/349592)
* [ HTML5 本地文件操作之FileSystemAPI简介 ](https://www.cnblogs.com/tianma3798/p/6439258.html)
*  [使用HTML5 FileWriter truncatetable](http://www.itdaan.com/blog/2011/07/22/193e5a9f5d8785dbbe9d60e08c437c1c.html)