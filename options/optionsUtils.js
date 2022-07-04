window.onload = () => {
    let href = window.location.href;
    toggleSections(href.substring(href.lastIndexOf('?') + 1))
}

function toggleSections(sectionToShow) {
    let sectionsIDs = ["about", "settings", "controls"];

    if(!sectionsIDs.includes(sectionToShow)) {
        sectionToShow = "about";
    }

    for (let i = 0; i < sectionsIDs.length; i++) {
        if (sectionsIDs[i] === sectionToShow) {
            document.getElementById(sectionToShow).style.display = 'block';
        } else {
            document.getElementById(sectionsIDs[i]).style.display = 'none';
        }
    }
}