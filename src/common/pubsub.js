const BACKGROUND = 'background';
const POPUP = 'popup';
const CONTENT = 'content';

const NOOP = _ => _;

const Pubsub = {
    BACKGROUND,
    POPUP,
    CONTENT,
    background(type, data={}, callback=NOOP){
        chrome.extension.sendMessage({ type: `${BACKGROUND}.${type}`, data }, callback)
    },
    popup(type, data={}, callback=NOOP){
        chrome.extension.sendMessage({ type: `${POPUP}.${type}`, data }, callback)
    },
    content(type, data={}, callback=NOOP){
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { type: `${CONTENT}.${type}`, data }, callback)
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
export default Pubsub;