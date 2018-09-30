
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

const TYPE = window.TEMPORARY
const SIZE = 10 * 1024 * 1024

let _fs = null
const request = (resolve, rejects) => {
    if(_fs){
        resolve(_fs)
    }else{
        window.requestFileSystem(TYPE, SIZE, fs => resolve(_fs=fs), rejects)
    }
}

const getFile = (name, flags, resolve, rejects) => {
    request(fs => fs.root.getFile(name, flags, resolve, rejects), rejects)
}

const fs = {
    writerFile(name, file){
        return new Promise((resolve, rejects) => {
            getFile(name, { create: true, exclusive: true }, entry => {
                entry.createWriter(writer => {
                    writer.onwriteend = resolve
                    writer.onerror = rejects
                    writer.write(file)
                })
            }, rejects)
        })
      
    },
    updateFile(name, file){
        return new Promise((resolve, rejects) => {
            getFile(name, { create: false }, entry => {
                entry.createWriter(writer => {
                    let flag = false;
                    writer.onwriteend = evt => {
                        if (!flag) {
                            flag = true;
                            writer.truncate(writer.position);
                        }else{
                            resolve(evt)
                        }
                    }
                    writer.onerror = rejects
                    writer.write(file)
                })
            }, rejects)
        })
    },
    readerFile(name){
        return new Promise((resolve, rejects) => { getFile(name, { create: false }, entry => entry.file(resolve, rejects), rejects) })
    },
    deleteFile(name){
        return new Promise((resolve, rejects) => { getFile(name, { create: false }, entry => entry.remove(resolve, rejects), rejects) })
    }
}

export default fs;