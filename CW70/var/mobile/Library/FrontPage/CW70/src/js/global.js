/*
    Global vars to let us know if certain things are happening.
*/
var globalVars = {
	changingIconImage: false,
	changingIconDiv: null,
    changingBadgeImage: false,
    movedWhilePressing: false
};

/* check if user has a stored image if not just default to fp images */
function getIconImage(bundle) {
    var imageLoc = '/var/mobile/Library/FrontPageCache/' + bundle + '.png';
    if (lStorage.iconImageLocations[bundle]) {
        imageLoc = lStorage.iconImageLocations[bundle];
    }
    return imageLoc;
}

/* set icon image with a blank default */
function setIconImage(element, bundle){
    var img = new Image(),
        src = getIconImage(bundle);
    img.onload = function(){
        element.style.backgroundImage = "url('" + src + "')";
    }; 
    img.onerror = function(){
        element.style.backgroundImage = "url('blank.png')";
    };
    img.src = src;
}

/* check if bundle has a badge */
function getIconBadge(bundle){
	var badge = "";

	if (FPI.bundle[bundle] && FPI.bundle[bundle].badge > 0) {
        badge = FPI.bundle[bundle].badge;
    }
    return badge;
}

/* check if it's day or not */
function isDay(){
    var hours = new Date().getHours();
    return hours > 6 && hours < 20;
}