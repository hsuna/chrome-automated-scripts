chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {        
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { urlContains: '.com' }
                })
            ],
            actions: [
                new chrome.declarativeContent.ShowPageAction()
            ]
        }])
    })
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.url) {
        chrome.downloads.download({
            url: message.url,
            conflictAction: 'uniquify',
            saveAs: false
        });
    }
});