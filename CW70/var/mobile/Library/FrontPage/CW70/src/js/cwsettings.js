/* global lStorage jSettings jPopup */
/*
    Pass an object to jSettings. It will create an element based on the type.
    If type is menu it will create a sub menu.
    If you define menu: in an object it will be a child of that menu
    Current Types: 
        menu: Button that opens another menu
        input: Input for value, can have type color:true and will be a color picker.
        toggle: Toggle setting with a checked or unchecked value
        button: Standard button.
*/
var settingsObject = {
    /* 
        -------------------------- Menus 
    */
    positionMenu: {
        saveName: '',
        type: 'menu',
        menuID: 'positionMenu',
        placeholder: 'Position Options',
        callback: function(menu) {
            jSettings.closeSettings();
            menu.style.display = 'block';
        }
    },
    colorMenu: {
        saveName: '',
        type: 'menu',
        menuID: 'colorMenu',
        placeholder: 'Color Options',
        callback: function(menu) {
            jSettings.closeSettings();
            menu.style.display = 'block';
        }
    },
    drawerButtonMenu: {
        saveName: '',
        type: 'menu',
        menuID: 'drawerButtonMenu',
        placeholder: 'Drawer Button',
        callback: function(menu) {
            jSettings.closeSettings();
            menu.style.display = 'block';
        }
    },
    drawerMenu: {
        saveName: '',
        type: 'menu',
        menuID: 'drawerMenu',
        placeholder: 'Drawer Options',
        callback: function(menu) {
            jSettings.closeSettings();
            menu.style.display = 'block';
        }
    },
    swipeMenu: {
        saveName: '',
        type: 'menu',
        menuID: 'swipeMenu',
        placeholder: 'Swipe Options',
        callback: function(menu) {
            jSettings.closeSettings();
            menu.style.display = 'block';
        }
    },
    resetMenu: {
        saveName: '',
        type: 'menu',
        menuID: 'resetMenu',
        placeholder: 'Reset Options',
        callback: function(menu) {
            jSettings.closeSettings();
            menu.style.display = 'block';
        }
    },
    /* 
        -------------------------- Toggle to disable shadows 
    */
    disableiconshadow: {
        menu: '',
        saveName: 'disableiconshadow',
        type: 'toggle',
        placeholder: 'Disable icon shadow',
        callback: function(input, ref) {
            var settings = "";
            var blur = "";
            if (input.checked) {
                blur = "-webkit-box-shadow: 0 8px 6px -6px rgba(0,0,0,0);";
            } else {
                blur = "-webkit-box-shadow: 0 8px 6px -6px rgba(0,0,0,0.6);";
            }
            settings += ".icon{"+blur+"}";
            jSettings.addStyleString(settings, ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.checked);
            }
        }
    },
    hidewidget: {
        menu: '',
        saveName: 'hidewidget',
        type: 'toggle',
        placeholder: 'Hide widget',
        callback: function(input, ref) {
            if (input.checked) {
                jSettings.addStyleString("#widget{display:none;}", ref + 'settings');
            } else {
                jSettings.addStyleString("#widget{display:block;}", ref + 'settings');
            }
            if (ref) {
                lStorage.replaceStorageItem(ref, input.checked);
            }
        }
    },
    iconborderradius: {
        menu: '',
        saveName: 'iconborderradius',
        type: 'input',
        example: '0',
        placeholder: 'Icon border radius',
        callback: function(input, ref) {
            jSettings.addStyleString(".icon{border-radius:"+ input.value +"px}", ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    /* 
        -------------------------- Toggle to respring 
    */
    respring: {
        menu: '',
        saveName: '',
        type: 'button',
        placeholder: 'Respring',
        callback: function(){
            jSettings.closeSettings();
            jPopup({
                type: "confirm",
                message: "Do you wish to respring?",
                yesButtonText: "Yes",
                noButtonText: "No",
                functionOnNo: function() {
                    
                },
                functionOnOk: function() {
                    window.location = 'frontpage:respring';
                }
            });
        }
    },
    /* 
        -------------------------- Swipe options 
    */
    clearSwipeOptions: {
        menu: 'swipeMenu',
        saveName: '',
        type: 'button',
        placeholder: 'Reset swipe options',
        callback: function(){
            jSettings.closeSettings();
            jPopup({
                type: "confirm",
                message: "This clears all swipe settings back to default. Are you sure you want to do this?",
                yesButtonText: "Yes",
                noButtonText: "No",
                functionOnNo: function() {
                    
                },
                functionOnOk: function() {
                    lStorage.removeStorageArray('swipeMenu');
                }
            });
        }
    },
    swipeleft: {
        menu: 'swipeMenu',
        saveName: 'swipeleft',
        type: 'options',
        default: 'switcher',
        optionsPlaceholders: ['Open Switcher', 'Open CC', 'Open Search', 'Open Today', 'None'],
        options: ['switcher', 'cc', 'search', 'today', 'none'],
        placeholder: 'Swipe left',
        callback: function(input, ref) {
            if (ref) {
                lStorage.replaceStorageItem(ref, input);
            }
        }
    },
    swiperight: {
        menu: 'swipeMenu',
        saveName: 'swiperight',
        type: 'options',
        default: 'today',
        optionsPlaceholders: ['Open Switcher', 'Open CC', 'Open Search', 'Open Today', 'None'],
        options: ['switcher', 'cc', 'search', 'today', 'none'],
        placeholder: 'Swipe right',
        callback: function(input, ref) {
            if (ref) {
                lStorage.replaceStorageItem(ref, input);
            }
        }
    },
    swipedown: {
        menu: 'swipeMenu',
        saveName: 'swipedown',
        type: 'options',
        default: 'search',
        optionsPlaceholders: ['Open Switcher', 'Open CC', 'Open Search', 'Open Today', 'None'],
        options: ['switcher', 'cc', 'search', 'today', 'none'],
        placeholder: 'Swipe down',
        callback: function(input, ref) {
            if (ref) {
                lStorage.replaceStorageItem(ref, input);
            }
        }
    },
    swipeup: {
        menu: 'swipeMenu',
        saveName: 'swipeup',
        type: 'options',
        default: 'cc',
        optionsPlaceholders: ['Open Switcher', 'Open CC', 'Open Search', 'Open Today', 'None'],
        options: ['switcher', 'cc', 'search', 'today', 'none'],
        placeholder: 'Swipe up',
        callback: function(input, ref) {
            if (ref) {
                lStorage.replaceStorageItem(ref, input);
            }
        }
    },

    /* 
        -------------------------- Badge and Color options 
    */

     badgeimage: {
        menu: 'colorMenu',
        saveName: '',
        type: 'button',
        placeholder: 'Set Badge Image',
        callback: function(){
            jSettings.closeSettings();
            globalVars.changingBadgeImage = true;
            window.location = 'frontpage:loadIconBrowser';
        }
    },
    resetbadgeimage: {
        menu: 'colorMenu',
        saveName: '',
        type: 'button',
        placeholder: 'Reset Badge Image',
        callback: function(){
            jSettings.closeSettings();
            jPopup({
                type: "confirm",
                message: "Do you wish to reset the badge image?",
                yesButtonText: "Yes",
                noButtonText: "No",
                functionOnNo: function() {
                    
                },
                functionOnOk: function() {
                    lStorage.badgeImage = null;
                    lStorage.saveStorage();
                    loadCWApps();
                }
            });
        }
    },
    badgecolor: {
        menu: 'colorMenu',
        saveName: 'badgecolor',
        type: 'input',
        color: true,
        defaultColor: 'red',
        placeholder: 'Badge color',
        callback: function(input, ref) {
            jSettings.addStyleString('.badge{background-color:'+input.value+';}', ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    badgetextcolor: {
        menu: 'colorMenu',
        saveName: 'badgetextcolor',
        type: 'input',
        color: true,
        defaultColor: 'white',
        placeholder: 'Badge text color',
        callback: function(input, ref) {
            jSettings.addStyleString('.icon::before{color:'+input.value+';}', ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    widgetcolor: {
        menu: 'colorMenu',
        saveName: 'widgetcolor',
        type: 'input',
        color: true,
        defaultColor: 'white',
        placeholder: 'Widget text color',
        callback: function(input, ref) {
            jSettings.addStyleString('#widget{color:'+input.value+';}', ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    /* 
        -------------------------- Drawer button options 
    */
    drawerbuttonwidth: {
        menu: 'drawerButtonMenu',
        saveName: 'drawerbuttonwidth',
        type: 'input',
        example: 30,
        placeholder: 'Drawer btn width',
        callback: function(input, ref) {
            jSettings.addStyleString("#drawer::after{width:"+ input.value +"px}", ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerbuttonheight: {
        menu: 'drawerButtonMenu',
        saveName: 'drawerbuttonheight',
        type: 'input',
        example: 3,
        placeholder: 'Drawer btn height',
        callback: function(input, ref) {
            jSettings.addStyleString("#drawer::after{height:"+ input.value +"px}", ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerbuttonposition: {
        menu: 'drawerButtonMenu',
        saveName: 'drawerbuttonposition',
        type: 'input',
        example: 10,
        placeholder: 'Drawer btn position from bottom',
        callback: function(input, ref) {
            jSettings.addStyleString("#drawer{bottom:"+ input.value +"px}", ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerbuttoncolor: {
        menu: 'drawerButtonMenu',
        saveName: 'drawerbuttoncolor',
        type: 'input',
        color: true,
        defaultColor: 'white',
        placeholder: 'Drawer btn color',
        callback: function(input, ref) {
            jSettings.addStyleString('#drawer::after{background-color:'+input.value+';}', ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    /* 
        -------------------------- Element position options 
    */
    iconposition: {
        menu: 'positionMenu',
        saveName: 'iconposition',
        type: 'input',
        example: 185,
        placeholder: 'Icon position from bottom',
        callback: function(input, ref) {
            jSettings.addStyleString(".iconHolder{bottom:"+ input.value +"px}", ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    widgetposition: {
        menu: 'positionMenu',
        saveName: 'widgetposition',
        type: 'input',
        example: 240,
        placeholder: 'Widget position from bottom',
        callback: function(input, ref) {
            jSettings.addStyleString("#widget{bottom:"+ input.value +"px}", ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    widgetpositionx: {
        menu: 'positionMenu',
        saveName: 'widgetpositionx',
        type: 'input',
        example: 10,
        placeholder: 'Widget position from left',
        callback: function(input, ref) {
            jSettings.addStyleString("#widget{left:"+ input.value +"px}", ref + 'settings');
            if (ref) {
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    /* 
        -------------------------- Drawer options 
    */
    drawerBGColor: {
        menu: 'drawerMenu',
        saveName: 'drawerBGColor',
        type: 'input',
        color: true,
        defaultColor: 'rgba(0,0,0,0.3)',
        placeholder: 'Drawer bg Color',
        callback: function(input, ref){
            jSettings.addStyleString('.drawer_main{background-color:'+input.value+'}', ref + 'settings');
            if(ref){
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerBadgeColor: {
        menu: 'drawerMenu',
        saveName: 'drawerBadgeColor',
        type: 'input',
        color: true,
        defaultColor: 'red',
        placeholder: 'Drawer badge Color',
        callback: function(input, ref){
            jSettings.addStyleString('.drawer_icon::before{background-color:'+input.value+'}', ref + 'settings');
            if(ref){
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerLabelColor: {
        menu: 'drawerMenu',
        saveName: 'drawerLabelColor',
        type: 'input',
        color: true,
        defaultColor: 'white',
        placeholder: 'Drawer label Color',
        callback: function(input, ref){
            jSettings.addStyleString('.drawer_icon::after{color:'+input.value+'}', ref + 'settings');
            if(ref){
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerShortcutColor: {
        menu: 'drawerMenu',
        saveName: 'drawerShortcutColor',
        type: 'input',
        color: true,
        defaultColor: 'white',
        placeholder: 'Drawer shortcut Color',
        callback: function(input, ref){
            jSettings.addStyleString('.shortcut{color:'+input.value+'}', ref + 'settings');
            if(ref){
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerShortcutBGColor: {
        menu: 'drawerMenu',
        saveName: 'drawerShortcutBGColor',
        type: 'input',
        color: true,
        defaultColor: 'rgba(0, 0, 0, 0.8)',
        placeholder: 'Drawer shortcut BG color',
        callback: function(input, ref){
            jSettings.addStyleString('.shortcutHolder{background-color:'+input.value+'}', ref + 'settings');
            if(ref){
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerShortcutFolderColor: {
        menu: 'drawerMenu',
        saveName: 'drawerShortcutFolderColor',
        type: 'input',
        color: true,
        defaultColor: 'rgba(0, 0, 0, 0.8)',
        placeholder: 'Drawer shortcut folder color',
        callback: function(input, ref){
            jSettings.addStyleString('.shortcutFolderHolder{background-color:'+input.value+'}', ref + 'settings');
            if(ref){
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    drawerShortcutFolderLabelColor: {
        menu: 'drawerMenu',
        saveName: 'drawerShortcutFolderLabelColor',
        type: 'input',
        color: true,
        defaultColor: 'white',
        placeholder: 'Drawer shortcut folder label',
        callback: function(input, ref){
            jSettings.addStyleString('.shortcutFolderHolder{color:'+input.value+'}', ref + 'settings');
            if(ref){
                lStorage.replaceStorageItem(ref, input.value);
            }
        }
    },
    roundDrawer: {
        menu: 'drawerMenu',
        saveName: 'roundDrawer',
        type: 'toggle',
        placeholder: 'Round drawer icons',
        callback: function(input, ref){
            var strings = "";
            if(input.checked){
                strings += '.drawerFolderIcon{border-radius: 99px!important;}';
                strings += '.drawer_icon{border-radius: 99px!important;}';
                jSettings.addStyleString(strings, ref + 'settings');
            }else{
                strings += '.drawerFolderIcon{border-radius: 0px!important;}';
                strings += '.drawer_icon{border-radius: 0px!important;}';
                jSettings.addStyleString(strings, ref + 'settings');    
            }
            if(ref){
                lStorage.replaceStorageItem(ref, input.checked);
            }
        }
    },
    drawerShadow: {
        menu: 'drawerMenu',
        saveName: 'drawerShadow',
        type: 'toggle',
        placeholder: 'Drawer shadows',
        callback: function(input, ref){
            if(input.checked){
                jSettings.addStyleString('.drawer_icon{box-shadow: 0 8px 6px -6px rgba(0,0,0,0.6)!important;}', ref + 'settings');
            }else{
                jSettings.addStyleString('.drawer_icon{box-shadow: 0 8px 6px -6px rgba(0,0,0,0)!important;}', ref + 'settings');
            }
            if(ref){
                lStorage.replaceStorageItem(ref, input.checked);
            }
        }
    },
    clearDrawerOptions: {
        menu: 'drawerMenu',
        saveName: '',
        type: 'button',
        placeholder: 'Reset drawer options',
        callback: function(){
            jSettings.closeSettings();
            jPopup({
                type: "confirm",
                message: "This clears all drawer settings back to default. Are you sure you want to do this?",
                yesButtonText: "Yes",
                noButtonText: "No",
                functionOnNo: function() {
                    
                },
                functionOnOk: function() {
                    lStorage.removeStorageArray('drawerMenu');
                }
            });
        }
    },
    /* 
        -------------------------- Reset options 
    */
    clearPositions:{ 
        menu: 'positionMenu', //not this is in postition menu
        saveName: '',
        type: 'button',
        placeholder: 'Clear changed positions',
        callback: function(){
            jSettings.closeSettings();
            jPopup({
                type: "confirm",
                message: "This clears widget and icon positions. Are you sure you want to do this?",
                yesButtonText: "Yes",
                noButtonText: "No",
                functionOnNo: function() {
                    
                },
                functionOnOk: function() {
                    lStorage.widgetposition = null;
                    lStorage.iconposition = null;
                    lStorage.saveStorage();
                    location.href = location.href;
                }
            });
        }
    },
    clearDockIconImages: {
        menu: 'resetMenu',
        saveName: '',
        type: 'button',
        placeholder: 'Clear set icon images',
        callback: function(){
            jSettings.closeSettings();
            jPopup({
                type: "confirm",
                message: "This clears all changed icon images. Are you sure you want to do this?",
                yesButtonText: "Yes",
                noButtonText: "No",
                functionOnNo: function() {
                    
                },
                functionOnOk: function() {
                    lStorage.iconImageLocations = {};
                    lStorage.launcherIcon = 'null';
                    lStorage.saveStorage();
                    location.href = location.href;
                }
            });
        }
    },
    clearUserSettings: {
        menu: 'resetMenu',
        saveName: '',
        type: 'button',
        placeholder: 'Clear all user settings',
        callback: function(){
            jSettings.closeSettings();
            jPopup({
                type: "confirm",
                message: "This clears all settings back to default. Are you sure you want to do this?",
                yesButtonText: "Yes",
                noButtonText: "No",
                functionOnNo: function() {
                    
                },
                functionOnOk: function() {
                    localStorage.removeItem(lStorage.storageName);
                    location.href = location.href;
                }
            });
        }
    },
};

/*
    All info is stored under testStorage (can be changed).
    check localStorage.testStorage to see what is stored.
    storedNames is the name in which the value is stored under
    it should match the saveName in jSettings to get a callback on load.
    storageItems are for FrontPage themes, for app changes and icon images.
*/

function initiateStorage() {
    lStorage.preload(settingsObject);
    lStorage.init({
        name: 'cwStorage',
        storageItems: {
            iconImageLocations: {}, //icon images picked by users
            iconHolderBundles: ['com.apple.mobilephone', 'com.apple.MobileSMS', 'com.apple.mobilesafari', 'com.apple.mobilemail', 'com.apple.Preferences'],
            badgeImage: null //badge image picked by user
        }
    });
    jSettings(settingsObject);
    settingsObject = null; //remove object as it's now stored in storage.js
}
initiateStorage();

