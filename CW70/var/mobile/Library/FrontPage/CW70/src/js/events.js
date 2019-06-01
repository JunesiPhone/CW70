(function(doc){
	var drawer = doc.getElementById('drawer'),
		container = doc.getElementById('container');

	/* 
		Set class of container to just container
		so we know that settings aren't opened.

		Close settings
	*/
	function closeSettings(){
		container.className = "container";
		jSettings.closeSettings();
        jSettings.closeSettingsMenus();
        jSettings.closeColorPickers();
	}

	/* Close settings if opened then open drawer */
	function openDrawer(){
		closeSettings();
		Drawer.toggleDrawer();
	}

	function animateIcon(on, bundle){
	  if(bundle){
	    var grow = 1.2,
	        standard = 1.0,
	        divEl = document.getElementById(bundle);
	    divEl.style.transition = 'transform 0.2s ease-in-out';
	    if(on){
	        divEl.style.webkitTransform = "scale(" + grow + ")";
	    }else{
	        divEl.style.webkitTransform = "scale(" + standard + ")";
	    }
	  }
	}

	/* cancel open if moved */
	function cancelOpen(){
		globalVars.movedWhilePressing = true;
	}

	/* Animate app on touchstart pressed */
	function animateApp(el){
		if(el.target.id && el.target.className == 'icon' && !globalVars.changingIconImage && !globalVars.movedWhilePressing){
			animateIcon(true, el.target.id);
		}
	}

	/* check if element has an id and user is not changing icons */
	function openApp(el){
		if(el.target.id && !globalVars.changingIconImage && !globalVars.movedWhilePressing){
			window.location = 'frontpage:openApp:' + el.target.id;
		}
		if(el.target.className === 'icon'){
			setTimeout(function(){
				animateIcon(false, el.target.id);
			},100);
		}
		globalVars.movedWhilePressing = false;
	}

	/* If tap hold is triggered then user is trying to change an app or icon */
	function tapHoldOnIcon(element){
		globalVars.changingIconImage = true;
        jPopup({
            type: "confirm",
            message: "Change icon or app?",
            yesButtonText: "Icon",
            noButtonText: "App",
            functionOnNo: function() {
                globalVars.changingIconImage = false;
                globalVars.changingIconDiv = element;
		        Drawer.toggleDrawer({
		            state: 'changingApp',
		            callback: function(newApp) {
		                lStorage.replaceInAppArray('iconHolderBundles', element.id, newApp);
		                loadCWApps();
		            }
		        });
            },
            functionOnOk: function() {
                globalVars.changingIconDiv = element;
                window.location = 'frontpage:loadIconBrowser';
            }
        });
	}

	/* 
		Add multiple tap on the container div to open settings.
	*/
	multipleTap({
        div: container,
        taps:3,
        callback: function(){
        	container.className = "container settingsopen";
            jSettings.openSettings();
        }
    });

	/*
		Listen for clicks if element clicked has a class of
		container and settingsopen then close settings.
	*/
    container.addEventListener('click', function(el) {
	    if (el.target.className === 'container settingsopen') {
	        closeSettings();
	    }
	});

    /*
		Add tap hold on container. This is for changing apps of icons of apps
    */
	taphold({
        time: 1000,
        element: doc.getElementById('container'),
        action: function(element) {
            tapHoldOnIcon(element);
        },
        passTarget: true
    });

	/* Open Drawer */
	drawer.addEventListener('touchstart', openDrawer, false);
	/* Open App */
	container.addEventListener('touchend', openApp, false);
	container.addEventListener('touchstart', animateApp, false);
	container.addEventListener('touchmove', cancelOpen, false);
}(document));