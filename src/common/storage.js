const getLocalStr = key => localStorage.getItem(key)
const saveLocalStr = (key, value) => localStorage.setItem(key, value)

const getLocal = key => JSON.parse(localStorage.getItem(key) || '{}')
const saveLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value))
const removeLocal = key => localStorage.removeItem(key)

export {
	getLocalStr,
	saveLocalStr,
	getLocal,
	saveLocal,
	removeLocal
}