const getLocal = key => new Promise(resolve => chrome.storage.local.get(key, data => resolve(data[key])))
const setLocal = (key, value) => new Promise(resolve => chrome.storage.local.set({[key]: value}, resolve))
const removeLocal = key => new Promise(resolve => chrome.storage.local.remove(key, resolve))

export {
	getLocal,
	setLocal,
	removeLocal
}