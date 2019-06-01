function loadCWApps(){
	var iconArray = lStorage.iconHolderBundles, //apps to load
		iconHolder = document.getElementById('iconHolder'),
		icon, badge, i;
		
	iconHolder.innerHTML = ""; //clear container

	for (i = 0; i < iconArray.length; i++) {
		//create icon
		icon = createDOM({
	        type: 'div',
	        className: 'icon',
	        id: iconArray[i]
	    });

	    //create badge
	    badge = createDOM({
	        type: 'div',
	        className: 'badge',
	        innerHTML: getIconBadge(iconArray[i]),
	        id: iconArray[i] + 'badge'
	    });

	    /*
	    	if badge is set then change the width, padding and set text
	    	color to transparent
	    */
	    if(lStorage.badgeImage){
	    	badge.style.backgroundImage = "url('" + lStorage.badgeImage + "')";
	    	badge.style.width = "15px";
	    	badge.style.padding = "0px";
	    	badge.style.color = 'transparent';
	    }else{
	    	badge.style.backgroundImage = "";
	    	badge.style.width = "auto";
	    	badge.style.padding = "0 6px";
	    	badge.color = (lStorage.badgetextcolor) ? lStorage.badgetextcolor : 'white';

	    }
	    //append badge to the icon
	    icon.appendChild(badge);
	    setIconImage(icon, iconArray[i]);

	    //set icon image
	    //icon.style.backgroundImage = "url('" + getIconImage(iconArray[i]) + "')";
		
		//append icon to icon holder
		iconHolder.appendChild(icon);
	}
}