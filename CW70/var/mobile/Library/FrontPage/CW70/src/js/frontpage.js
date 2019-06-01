/* global globalVars Drawer macDock lStorage getIconInfo translate current clock desktopIcons*/
var FPI = {},
    doc = document;

function createDrawer() {
    var iconW = 11,
        iconM = 25,
        pagingAmount = 20;
    // iPhone X
    if (window.innerHeight == 812) {
        iconW = 12;
        iconM = 15;
        pagingAmount = 32;
    }
    // iPhone XS Max / XR
    if (window.innerHeight == 896) {
        iconW = 12;
        iconM = 15;
        pagingAmount = 32;
    }
    // iPhone 7
    if (window.innerHeight == 667) {
        iconW = 11;
        iconM = 23;
        pagingAmount = 20;
    }
    // iPhone 5, 5s, SE
    if (window.innerHeight == 568) {
        iconW = 10;
        iconM = 20;
        pagingAmount = 20;
    }
    // iPhone 6S+
    if (window.innerHeight == 736) {
        iconW = 12;
        iconM = 15;
        pagingAmount = 32;
    }
    FPI.drawer = new Drawer({
        labels: true,
        idPrefix: "APP",
        pagingAmount: pagingAmount,
        iconWidth: iconW,
        iconMargin: iconM,
        pageSpacing: 20,
        pagePadding: 10,
        labelTopPadding: 1,
    });
}

function setFPIInfo(info, label, parse) {
    if (parse) {
        FPI[label] = JSON.parse(info);
    } else {
        FPI[label] = info;
    }
}

function appsInstalled() {
    FPI.drawer.reloadIcons();
}

function badgeUpdated(bundle) {
    Drawer.updateBadge(bundle);
    var element = document.getElementById(bundle + 'badge');
    if (typeof(element) != 'undefined' && element != null) {
        element.innerHTML = getIconBadge(bundle);
    }
}

function deviceUnlocked() {
    FPI.system["unlocked"] = "yes";
}

function selectedImageFromFP(img) {
    if(globalVars.changingBadgeImage){
        globalVars.changingBadgeImage = false;
        lStorage.badgeImage = img;
    }else{
        lStorage.replaceIconLocation('iconImageLocations', globalVars.changingIconDiv.id, img);
        globalVars.changingIconDiv.style.backgroundImage = "url('" + img + "')";
        globalVars.changingIconImage = false;
    }
    lStorage.saveStorage();
    loadCWApps();
}

function selectedImageFromFPCancelled() {
    globalVars.changingIconImage = false;
    globalVars.changingBadgeImage = false;
}

function updateWeatherString(){
    var condition, string;

    condition = translate[current].condition[FPI.weather.conditionCode].toLowerCase();
    string = "";
    string += "Currently it's " + condition;

    if(isDay()){
        string += ", the high today will reach " + FPI.weather.dayForecasts[0].high;
    }else{
        string += ", the low tonight will reach " + FPI.weather.dayForecasts[0].low;    
    }

    string += "&deg; Right now it's " + FPI.weather.temperature;
    string += "&deg; and your battery is " + FPI.battery.percent + "%";
    document.getElementById('weatherString').innerHTML = string;
}

function loadWeather() {
    updateWeatherString();
}

function loadBattery() {
    updateWeatherString();
}
function loadClock() {
    clock({
        twentyfour: (FPI.system.twentyfour == "yes") ? true : false,
        padzero: false,
        refresh: 5000,
        success: function(clock) {
            document.getElementById('day').innerHTML = translate[current].weekday[clock.day()];
            document.getElementById('month').innerHTML = translate[current].month[clock.month()];
            document.getElementById('time').innerHTML = "[" + clock.hourtext() + "]" + clock.minuteonetext() + clock.minutetwotext();
        }
    });
}

function FPIloaded() {
    loadClock();
    createDrawer();
    loadCWApps();
}

function todayDismissed(){
    document.body.style.opacity = 1;
}
function loadSystem() {}
function loadFolders() {}
function loadAlarms() {}
function loadMemory() {}
function loadStatusBar() {}
function loadApps() {}
function loadMusic() {}
function loadSettings() {}
function deviceLocked() {}
function loadNotifications() {}
function loadSwitcher() {}
function viewRotated(direction) {}