
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

const TYPE = window.TEMPORARY
const SIZE = 5 * 1024

const fs = {
    writerFile(name, file){
        return new Promise((resolve, rejects) => {
            window.requestFileSystem(TYPE, SIZE, fs => {
                fs.root.getFile(name, { create: true, exclusive: true }, entry => {
                    entry.createWriter(writer => {
                        writer.onwriteend = resolve
                        writer.onerror = rejects
                        writer.write(file)
                    })
                }, rejects)
            }, rejects)
        })
    },
    updateFile(name, file){
        return new Promise((resolve, rejects) => {
            window.requestFileSystem(TYPE, SIZE, fs => {
                fs.root.getFile(name, { create: false }, entry => {
                    entry.createWriter(writer => {
                        writer.seek(0)
                        writer.onwriteend = resolve
                        writer.onerror = rejects
                        writer.write(file)
                    })
                }, rejects)
            }, rejects)
        })
    },
    readerFile(name){
        return new Promise((resolve, rejects) => {
            window.requestFileSystem(TYPE, SIZE, fs => {
                fs.root.getFile(name, { create: false }, entry => entry.file(resolve))
            }, rejects)
        })
    }
}

export default fs;