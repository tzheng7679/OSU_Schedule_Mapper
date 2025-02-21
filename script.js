const Days = ["Mon.", "Tue.", "Wed.", "Thu.", "Fri."];

function getMaps() {

}

/**
 * Adds divs to website that contain maps for each day.
 */
function addDayDivs() {
    let tabNav = document.createElement("div");
    tabNav.className = "tabBar";
    
    for(let i = 0; i < Days.length; i++) {
        const tabButton = document.createElement("div");
        tabButton.onclick = function() {openTab(Days[i])};
        tabButton.innerHTML = Days[i];
        tabButton.className = "tabButton";
        tabNav.appendChild(tabButton);
    }

    let container = document.createElement("div");
    container.className = "container";

    for(let i = 0; i < Days.length; i++) {
        let tab = document.createElement("div");
        tab.className = "tab";
        tab.innerHTML = Days[i];
        tab.style.display = "none";
        container.appendChild(tab);
    }

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(tabNav);
    body.appendChild(container);
    openTab(Days[0]);
}

function openTab(day) {
    let tabs = document.getElementsByClassName("tab");

    for(let i = 0; i < tabs.length; i++) {
        let tab = tabs.item(i);
        if(tab.innerHTML == day) {
            tab.style.display = "block";
        } else {
            tab.style.display = "none";
        }
    }
}

/**
 * Hides a tab.
 * @param {Element} tab - The tab to hide 
 */
function hideTab(tab) {
    tab.style.display = "none";
}

/**
 * Shows a tab.
 * @param {Element} tab - The tab to show
 */
function showTab(tab) {
    tab.style.display = "block";
}

function addMaps() {

}

/**
 * Sets the tab to a given day.
 * 
 * @param {int} [day] - The day to set. 0 for Monday, {@ 1} for Tuesday, ..., 4 for Friday
 * @
 */
function getDay(day) {

}


main()