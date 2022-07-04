chrome.storage.local.get("readingHelperSettings", (result) =>
{
    let settings = result.readingHelperSettings;
    document.getElementById("word-speed").value = settings.speed;
});

document.getElementById("word-speed").addEventListener("change", (event) => {
    if (event.target.value !== '' && isFinite(event.target.value)) {
        chrome.storage.local.get("readingHelperSettings", (result) =>
        {
            let settings = result.readingHelperSettings;
            let speed = parseInt(event.target.value);
            if (speed < 1) {
                alert("Words per minute can't be less than one.")
            } else if (speed !== settings.speed) {
                settings.speed = parseInt(event.target.value);
                chrome.storage.local.set({"readingHelperSettings": settings});
            }
        });
    }
});

document.getElementById("go-to-settings").addEventListener('click', () => {
    window.open(chrome.runtime.getURL('options/options.html') + "?settings");
});