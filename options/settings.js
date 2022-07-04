chrome.storage.local.get("readingHelperSettings", (result) =>
{
    let settings = result.readingHelperSettings;
    document.getElementById("word-speed").value = settings.speed;
    document.getElementById("use-lower-speed").value = settings.useLowerSpeed;
    document.getElementById("long-word-length").value = settings.longWordLength;
    document.getElementById("font-size").value = settings.fontSize;
    document.getElementById("color-scheme").value = settings.colorSchemeChoice;
    document.getElementById("font-color").value = settings.fontColor;
    document.getElementById("bg-color").value = settings.bgColor;

    toggleColorSettings(settings.colorSchemeChoice);
    toggleWordLengthSettings(settings.useLowerSpeed);
});

function toggleColorSettings(colorScheme) {
    let colorSettings = document.getElementsByClassName("color");
    if (colorScheme === 'use-custom') {
        for (let i = 0; i < colorSettings.length; i++) {
            colorSettings[i].style.display = '';
        }
    } else {
        for (let i = 0; i < colorSettings.length; i++) {
            colorSettings[i].style.display = 'none';
        }
    }
}

function toggleWordLengthSettings(useLowerSpeed) {
    let wordLength = document.getElementById("div-word-length");
    if (useLowerSpeed === "1") {
        wordLength.style.display = '';
    } else {
        wordLength.style.display = 'none';
    }
}

document.getElementById("color-scheme").addEventListener('change', (event) => {
    toggleColorSettings(event.target.value);
});

document.getElementById("use-lower-speed").addEventListener('change', (event) => {
    toggleWordLengthSettings(event.target.value);
});

document.getElementById("save-setting").addEventListener('click', (event) => {
    saveSettings();
});

function saveSettings() {
    let newSettings = {};

    newSettings.speed = document.getElementById("word-speed").value;
    newSettings.useLowerSpeed = document.getElementById("use-lower-speed").value;
    newSettings.longWordLength = document.getElementById("long-word-length").value;
    newSettings.fontSize = document.getElementById("font-size").value;
    newSettings.colorSchemeChoice = document.getElementById("color-scheme").value;
    newSettings.fontColor = document.getElementById("font-color").value;
    newSettings.bgColor = document.getElementById("bg-color").value;

    chrome.storage.local.set({"readingHelperSettings": newSettings})
}

$(function(){
    $(window).scroll(function(){
        let winTop = $(window).scrollTop();
        if(winTop >= 30){
            $("body").addClass("sticky-header");
        }else{
            $("body").removeClass("sticky-header");
        }
    });
});

document.getElementById("settings-link").addEventListener("click", () => {
    toggleSections("settings");
})