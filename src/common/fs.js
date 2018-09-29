
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

const TYPE = window.TEMPORARY
const SIZE = 10 * 1024 * 1024

let _fs = null
const request = call => new Promise((resolve, rejects) => {
    if(_fs){
        call(_fs, resolve, rejects)
    }else{
        window.requestFileSystem(TYPE, SIZE, fs => call(_fs=fs, resolve, rejects), rejects)
    }
})

const fs = {
    writerFile(name, file){
        return request((fs, resolve, rejects) => {
            fs.root.getFile(name, { create: true, exclusive: true }, entry => {
                entry.createWriter(writer => {
                    writer.onwriteend = resolve
                    writer.onerror = rejects
                    writer.write(file)
                })
            }, rejects)
        })
    },
    updateFile(name, file){
        return request((fs, resolve, rejects) => {
            fs.root.getFile(name, { create: false }, entry => {
                entry.createWriter(writer => {
                    writer.onwriteend = resolve
                    writer.onerror = rejects
                    writer.write(file)
                })
            }, rejects)
        })
    },
    readerFile(name){
        return request((fs, resolve, rejects) => {
            fs.root.getFile(name, { create: false }, entry => entry.file(resolve))
        })
    }
}

export default fs;