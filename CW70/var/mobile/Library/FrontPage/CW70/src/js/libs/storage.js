/*
	requires jpopup.js

	Usage -------------

	Saving Info:
		lStorage.replaceIconLocation('iconImageLocations', 'original.bundle', 'new.bundle');
		lStorage.replaceInAppArray('iconHolderBundles', 'com.apple.mobilephone', 'new.apple.bundle');
		lStorage.replaceStorageItem('default', true);
	
	Initializing lStorage:
		lStorage.init({
            name: 'mnml',
            storedNames: ['iconImageLocations', 'iconHolderBundles', 'default'],
            storageItems: {
                iconImageLocations: {},
                iconHolderBundles: ['com.apple.mobilephone', 'com.apple.MobileSMS', 'com.apple.mobilemail', 'com.apple.mobilesafari', 'com.apple.Preferences']
            }
        });

*/

/* global jPopup */
var lStorage = {
    storageName: '',
    storedNames: [],
    settingsArray: {},
    saveStorage: function() {
        var save = {};
        for (var i = 0; i < this.storedNames.length; i++) {
            save[this.storedNames[i]] = this[this.storedNames[i]];
        }
        localStorage.setItem(this.storageName, JSON.stringify(save));
    },
    loadStorage: function() {
        var storage = JSON.parse(localStorage.getItem(lStorage.storageName)),
            i;
        if (storage != null) {
            for (i = 0; i < this.storedNames.length; i++) {
                lStorage[this.storedNames[i]] = storage[this.storedNames[i]];
            }
        }
    },
    replaceInAppArray: function(array, older, newer) {
        //App is placed else where
        if (this[array].indexOf(newer) > -1) {
            var index1 = this[array].indexOf(older);
            var index2 = this[array].indexOf(newer);
            this[array][index1] = newer;
            this[array][index2] = older;
            this.saveStorage();
            return;
        }
        //app isn't placed
        var index = this[array].indexOf(older);
        if (index !== -1) {
            this[array][index] = newer;
        }
        this.saveStorage();
    },
    replaceIconLocation: function(storageName, bundle, location) {
        lStorage[storageName][bundle] = location;
        this.saveStorage();
    },
    replaceStorageItem: function(storageName, itemValue) {
        lStorage[storageName] = itemValue;
        this.saveStorage();
    },
    removeItemInArray: function(storageName, item) {
        var index = lStorage[storageName].indexOf(item);
        lStorage[storageName].splice(index);
        this.saveStorage();
    },
    addItemInArray: function(storageName, item) {
        var containsItem = false;
        for (var i = 0; i < lStorage[storageName].length; i++) {
            if (lStorage[storageName][i] === item) {
                containsItem = true;
            }
        }
        if (!containsItem) {
            lStorage[storageName].push(item);
            this.saveStorage();
        }
    },
    removeStorageArray: function(arrayName) {
        var array = lStorage.settingsArray[arrayName];
        for (var i = 0; i < array.length; i++) {
            lStorage[array[i]] = null;
        }
        lStorage.saveStorage();
        location.href = location.href;
    },
    clearStorage: function() {
        localStorage.removeItem(this.storageName);
    },
    preload: function(object) {
        Object.keys(object).forEach(function(k) {
            /* find saveName and add to the list */
            if (object[k].saveName != '') {
                lStorage.storedNames.push(object[k].saveName);
            }
            /* if has a menu name add an array for it on the settingsArray object*/
            if (object[k].menu) {
                if (!lStorage.settingsArray[object[k].menu]) {
                    lStorage.settingsArray[object[k].menu] = [];
                }
                lStorage.settingsArray[object[k].menu].push(object[k].saveName);
            }
        });
    },
    init: function(object) {
        if (!object) {
            console.log('Must have an object (storage.js)');
            return;
        }
        var i;
        this.storageName = object.name;

        /* Loop over storageItems and add them to storedNames */
        var extraSettings = [];
        Object.keys(object.storageItems).forEach(function(k) {
            extraSettings.push(k);
        });
        if (extraSettings.length > 0) {
            this.storedNames = this.storedNames.concat(extraSettings);
        }
        /* If exists load it */
        if (localStorage.getItem(object.name)) {
            this.loadStorage();
            return;
        }
        for (i = 0; i < this.storedNames.length; i++) {
            lStorage[this.storedNames[i]] = object.storageItems[this.storedNames[i]];
        }
        if (localStorage.getItem([this.object] != null)) {
            this.loadStorage();
        }
    }
};