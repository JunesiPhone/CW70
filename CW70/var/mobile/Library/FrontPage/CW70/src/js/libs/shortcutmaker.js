/* global createDOM FPI Drawer */
var shortcutMaker = {
    abcList: [],
    abcApps: {},
    shortcutMoving: false,
    createIconsListShortcutLetter: function(array) {
        var sf = document.getElementById('shortcutFolderHolder'),
            icon;
        sf.innerHTML = "";
        for (var e = 0; e < array.length; e++) {
            var div = createDOM({
                type: 'div',
                className: 'drawerFolderIcon',
                id: 'shortcut' + array[e],
                attribute: ['title', FPI.bundle[array[e]].name]
            });
            icon = '/var/mobile/Library/FrontPageCache/' + array[e] + '.png';
            if (array[e] === "com.junesiphone.drawer") {
                icon = 'drawer.png';
            }
            div.style.backgroundImage = 'url(' + icon + ')';
            div.addEventListener('touchmove', function() {
                this.shortcutMoving = true;
            });
            div.addEventListener('touchend', function(el) {
                if (!this.shortcutMoving) {
                    Drawer.handleAppAction(el.target.id);
                }
                this.shortcutMoving = false;
            });
            sf.appendChild(div);
        }
        document.getElementById('shortcutFolder').style.display = 'block';
    },
    createShortcutLetters: function() {
        var abc, folder, folderHolder, i,
            placement = document.body;
        if (document.getElementById('abcList')) {
            placement.removeChild(document.getElementById('abcList'));
        }
        if (document.getElementById('shortcutFolder')) {
            placement.removeChild(document.getElementById('shortcutFolder'));
        }
        abc = createDOM({
                type: 'div',
                className: 'shortcutHolder',
                id: 'abcList'
            }),
            folder = createDOM({
                type: 'div',
                id: 'shortcutFolder',
                className: 'shortcutFolder',
                attribute: ['title', 'alsocloser']
            }),
            folderHolder = createDOM({
                type: 'div',
                className: 'shortcutFolderHolder',
                id: 'shortcutFolderHolder'
            });
        folder.addEventListener('touchend', function(el) {
            if (el.target.title === 'alsocloser') {
                folder.style.display = 'none';
            }
        });
        for (i = 0; i < this.abcList.length; i++) {
            var shortcut = createDOM({
                type: 'div',
                innerHTML: this.abcList[i],
                className: 'shortcut',
                attribute: ['title', this.abcList[i]]
            });
            abc.appendChild(shortcut);
            shortcut.addEventListener('touchend', function(el) {
                var arrayOfAppsForLetter = shortcutMaker.abcApps[el.target.title];
                shortcutMaker.createIconsListShortcutLetter(arrayOfAppsForLetter);
            });
        }
        placement.appendChild(abc);
        placement.appendChild(folder);
        folder.appendChild(folderHolder);
    },
    populateShortcuts: function(obj) {
        if (this.abcList.indexOf(obj.firstLetter) < 0) {
            this.abcList.push(obj.firstLetter);
        }
        if (this.abcApps[obj.firstLetter]) {
            this.abcApps[obj.firstLetter].push(obj.bundle);
        } else {
            this.abcApps[obj.firstLetter] = [];
            this.abcApps[obj.firstLetter].push(obj.bundle);
        }
    },
    resetInfo: function() {
        this.abcApps = {};
    }
};