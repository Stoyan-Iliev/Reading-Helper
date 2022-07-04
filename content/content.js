const HOSTNAME = window.location.hostname.replace("www.", "").toLowerCase();

let stop = false;

chrome.runtime.onMessage.addListener((data) => {
    switch (data.msg) {
        case 'load':
            chrome.storage.local.remove(HOSTNAME);
            document.addEventListener('dblclick', getElementsFromPageOnMouseClick);
            break;
        case 'start':
            document.removeEventListener("dblclick", getElementsFromPageOnMouseClick)
            getAllText().then((result) => {
                displayAll(result.split(' '))
            })
            break;
        case 'end':
            stop = true;
            break;

    }
});

function returnPageToBeforeStart(dialog) {
    dialog.close();
    document.getElementById("rh-overlay").remove();
}

function displayWords(settings, words, dialog) {
    let counter = 0;
    let wordsContainer = $("#rh-words-container");
    const normalIntervalTime = 60000 / settings.speed;
    const slowIntervalTime = normalIntervalTime + 200;
    let intervalID = setInterval(updateWord, normalIntervalTime);

    let previousTimeInterval = normalIntervalTime;
    function updateWord() {
        wordsContainer.html(words[counter]);

        let changedTime;
        if (settings.useLowerSpeed === 1 && words[counter].length >= settings.longWordLength) {
            changedTime = slowIntervalTime;
        } else {
            changedTime = normalIntervalTime;
        }
        if (previousTimeInterval !== changedTime) {
            clearInterval(intervalID);
            intervalID = setInterval(updateWord, changedTime);
        }
        counter++;
        previousTimeInterval = changedTime;

        if (counter >= words.length || stop) {
            clearInterval(intervalID);
            returnPageToBeforeStart(dialog);
            stop = false;
        }
    }
}

function buildDialog(settings) {
    let overlay = document.createElement("div")
    overlay.id = "rh-overlay"

    let wrapper = document.createElement("div")
    wrapper.id = 'rh-wordDialogWrapper'
    overlay.append(wrapper)

    let dialog = document.createElement("dialog")
    dialog.id = 'rh-wordDialog'


    let div = document.createElement('div')
    div.id = 'rh-words-container'

    div.style.fontSize = settings.fontSize + "px";
    if (settings.colorSchemeChoice === 'use-custom') {
        dialog.style.backgroundColor = settings.bgColor;
        div.style.color = settings.fontColor
    }

    wrapper.append(dialog)
    dialog.append(div)

    document.body.append(overlay)

    dialog.show()

    return dialog;
}

function displayAll(words) {
    if (words.length > 1) {
        chrome.storage.local.get("readingHelperSettings", (result) =>
        {
            let settings = result.readingHelperSettings;

            let dialog = buildDialog(settings);

            displayWords(settings, words, dialog);
        });
    } else {
        alert("We are sorry, we didn't find any text to display.")
    }
}

function getElementsFromPageOnMouseClick(e) {
    chrome.storage.local.get(HOSTNAME, (result) =>
    {
        if (typeof result[HOSTNAME] !== "undefined") {
            let obj = {};

            obj[HOSTNAME] = result[HOSTNAME];
            obj[HOSTNAME].secondX = e.clientX;
            obj[HOSTNAME].secondY = e.clientY;

            chrome.storage.local.set(obj)
        } else {
            let obj = {};
            obj[HOSTNAME] = {firstX: e.clientX, firstY: e.clientY};
            chrome.storage.local.set(obj)
        }
    });
}

async function getAllText() {
    let webSiteElements = getWebSiteElements();
    if (webSiteElements.length > 0) {
        return extractTextFromElements(webSiteElements);
    }

    return new Promise((resolve, reject) => {
        chrome.storage.local.get(HOSTNAME, (result) =>
        {
            let textResult = '';
            if (typeof result[HOSTNAME] !== "undefined") {
                let tempElements = [];
                tempElements.push(document.elementsFromPoint(result[HOSTNAME].firstX, result[HOSTNAME].firstY));
                tempElements.push(document.elementsFromPoint(result[HOSTNAME].secondX, result[HOSTNAME].secondY));

                console.log(tempElements)
                textResult = findTheNeededLayoutOfHtml(tempElements);
                resolve(textResult);
            } else {
                reject();
            }
        });
    })
}

function getWebSiteElements() {
    switch(HOSTNAME) {
        case 'wuxiaworld.com':
            let div = document.getElementsByClassName("chapter-content");
            return div[0].getElementsByTagName("p");
        case 'madnovel.com':
            let outer = document.getElementById("chapter__content");
            let inner = outer.getElementsByClassName("content-inner");
            return inner[0].getElementsByTagName("p");
        default: return [];
    }
}

function extractTextFromElements(elements) {
    let result = '';
    for (let i = 0; i < elements.length; i++) {
        result += ' ' + elements[i].textContent.trim();
    }
    return result;
}

function findTheNeededLayoutOfHtml(elements) {
    if (elements.length >= 2 && elements[0].length > 0
            && elements[1].length > 0) {
        let set = new Set()

        for (let i = 0; i < elements[0].length; i++) {
            set.add(elements[0][i])
        }

        let duplicateElement;
        for (let i = 1; i < elements.length; i++) {
            if (elements[0][0].textContent !== elements[i][0].textContent) {
                for (let j = 0; j < elements[i].length; j++) {
                    if (set.has(elements[i][j])) {
                        duplicateElement = elements[i][j]
                        break;
                    }
                }
            }
        }

        let maxParagraphElements = elements[0].length >= elements[1].length
                ? elements[0] : elements[1]

        let neededDepth = 0;
        for (let i = 0; i < maxParagraphElements.length; i++) {
            if (maxParagraphElements[i] === duplicateElement) {
                neededDepth = i;
            }
        }

        let resultText = '';
        if(duplicateElement.hasChildNodes()) {

            let children = duplicateElement.children
            for (let i = 0; i < children.length; i++) {
                let curParagraphChildren = children[i]
                for (let j = 0; j < neededDepth - 1; j++) {
                    if (curParagraphChildren.hasChildNodes()) {
                        curParagraphChildren.firstChild
                    } else {
                        break;
                    }
                }
                if (curParagraphChildren.textContent.trim() !== '') {
                    console.log(curParagraphChildren.textContent.trim())
                    resultText += ' ' + curParagraphChildren.textContent.trim()
                }
            }
        } else {
            resultText = duplicateElement.textContent.trim()
            console.log(resultText)
        }
        return resultText;
    }
}

