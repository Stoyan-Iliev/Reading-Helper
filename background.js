chrome.runtime.onInstalled.addListener(setDefaultSettings)

function setDefaultSettings() {
    let settings = {
        speed: 300,
        useLowerSpeed: 0,
        longWordLength: 12,
        fontSize: 14,
        colorSchemeChoice: "use-inherited",
        fontColor: "#000000",
        bgColor: "#FFFFFF"
    }
    chrome.storage.local.set({"readingHelperSettings": settings});
}

chrome.commands.onCommand.addListener((command) => {
    switch (command) {
        case 'load':
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { msg: "load" });
            });
            break;
        case 'start':
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { msg: "start"})
            });
            break;
        case 'end':
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { msg: "end"})
            });
            break;
    }
});