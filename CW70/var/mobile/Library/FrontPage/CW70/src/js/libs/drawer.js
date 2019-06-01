/**
 
 * App drawer for FrontPage Themes
 *
 * http://junesiphone.com/
 *
 * Copyright 2019, Edward Winget
 *
 * Released on: October 7, 2017 - Last Update: April 7, 2019


 Drawer.toggleDrawer({
    state: 'changingApp',
    callback: function(newApp) {
        //do something with app selected
        var div = document.getElementById(selectedDockIcon);
        lStorage.replaceInAppArray('iconHolderBundles', div.title, newApp);
    }
});

 */

/* global FPI jPopup shortcutMaker createDOM */
(function(doc) {
    'use strict';
    var Drawer = function(params) {
        var idPrefix = params.idPrefix || "DDApp",
            iconWidth = params.iconWidth || 30,
            iconMargin = params.iconMargin || 20,
            pagingAmount = params.pagingAmount || 30,
            pageSpacing = params.pageSpacing || 10,
            pagePadding = params.pagePadding || 0,
            snapPoint = 100 + pageSpacing,
            labelTopPadding = params.labelTopPadding || 0,
            drawer = null,
            drawerCreate = null;
        Drawer.hideLabels = function() {
            doc.querySelector('.drawer_page').style.color = 'transparent';
        };
        Drawer.showLabels = function() {
            doc.querySelector('.drawer_page').style.color = 'white';
        };
        Drawer.removeDOM = function(parent, child) {
            if (parent) {
                if (child) {
                    parent.removeChild(child);
                }
            }
        };
        Drawer.resetDivs = function() {
            if (doc.querySelector('.drawer_main')) {
                var bodyRef = document.body,
                    docRef = document;
                this.removeDOM(bodyRef, docRef.querySelector('.drawer_close_button'));
                this.removeDOM(bodyRef, docRef.querySelector('.drawer_main'));
                this.removeDOM(bodyRef, docRef.getElementById('ICONS'));
                this.removeDOM(bodyRef, docRef.getElementById('abcList'));
                this.removeDOM(bodyRef, docRef.getElementById('shortcutFolder'));
            }
        };
        Drawer.uninstall = function() {
            if (FPI.bundle[window.selectedApp].systemApp === "no") {
                window.location = 'frontpage:uninstallApp:' + window.selectedApp;
            } else {
                alert("You cannot delete a system app from here.");
            }
        };
        Drawer.sortArray = function(array) {
            if (array) {
                array = array.sort(function(a, b) {
                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                });
                return array;
            }
        };
        Drawer.toggleDrawerWindows = function(obj) {
            var h1 = doc.querySelector(obj.holder),
                h2 = doc.getElementById(obj.folder),
                h3 = doc.querySelector(obj.close);
            if (obj.hidden) {
                h1.style.display = 'none';
                h2.style.display = 'none';
                h3.style.display = 'none';
            } else {
                h1.style.display = 'block';
                h3.style.display = 'block';
            }
        };
        Drawer.toggleDrawer = function(obj) {
            var drawer = doc.querySelector('.drawer_main');
            drawer.classList.toggle('drawer_open');

            /* If drawer only has class drawer_main it's closed */
            if (drawer.className === 'drawer_main') {
                Drawer.toggleDrawerWindows({
                    holder: '.shortcutHolder',
                    folder: 'shortcutFolder',
                    close: '.drawer_close_button',
                    hidden: true
                });
                if (Drawer.onClose) {
                    Drawer.onClose();
                }
                window.location = 'frontpage:allowTouchPass';
            } else {
                Drawer.toggleDrawerWindows({
                    holder: '.shortcutHolder',
                    folder: 'shortcutFolder',
                    close: '.drawer_close_button',
                    hidden: false
                });
                window.location = 'frontpage:stopTouchPass';
            }

            if (obj) {
                Drawer.afterSelection = obj;
            } else {
                Drawer.afterSelection = null;
            }

        };
        Drawer.handleAppAction = function(target) {
            var bundle = target.replace(idPrefix, '');
            bundle = bundle.replace('shortcut', '');
            if (bundle) {
                if (Drawer.afterSelection) {
                    Drawer.afterSelection.callback(bundle);
                    Drawer.toggleDrawer();
                    Drawer.afterSelection = null;
                } else {
                    window.location = 'frontpage:openApp:' + bundle;
                    setTimeout(Drawer.toggleDrawer, 400);
                }
            }
        };
        Drawer.addMainEvents = function(div) {
            var moving = false,
                holdTimer = null,
                holding = false,
                startY = 0,
                startX = 0,
                X = null,
                Y = null,
                endedTouch = function() {
                    clearTimeout(holdTimer);
                    if (!moving && !holding) {
                        Drawer.handleAppAction(event.target.id);
                    }
                    moving = false;
                    holding = false;
                },
                startedTouch = function(el) {
                    window.selectedApp = el.target.id.replace('APP', '');
                    moving = false;
                    startY = event.touches[0].clientY;
                    startX = event.touches[0].clientX;
                    holdTimer = setTimeout(function() {
                        holding = true;
                        Drawer.toggleDrawer();
                        jPopup({
                            type: "confirm",
                            message: "Uninstall the app " + window.selectedApp + "?",
                            yesButtonText: "Yes",
                            noButtonText: "No",
                            functionOnOk: function() {
                                Drawer.uninstall();
                            }
                        });
                    }, 600);
                },
                movedTouch = function() {
                    clearTimeout(holdTimer);
                    X = Math.abs(startX - event.touches[0].clientX);
                    Y = Math.abs(startY - event.touches[0].clientY);
                    if (X > 20 || Y > 20) {
                        moving = true;
                    }
                },
                scroll = function() {
                    var result = Math.round((snapPoint / 100) * drawer.clientWidth),
                        pageNumber;
                    if (event.target.scrollLeft % result === 0) {
                        pageNumber = (event.target.scrollLeft / result) + 1;
                        console.log(pageNumber);
                    }
                };
            div.addEventListener('touchstart', startedTouch, {
                passive: true
            });
            div.addEventListener('touchmove', movedTouch, {
                passive: true
            });
            div.addEventListener('touchend', endedTouch);
            div.addEventListener('scroll', scroll);
        };

        Drawer.helpers = {
            createCloseButton: function() {
                var closeButton = doc.createElement('div');
                closeButton.className = 'drawer_close_button';
                doc.body.appendChild(closeButton);
                closeButton.addEventListener('touchstart', Drawer.toggleDrawer, {
                    passive: true
                });
            },
            setDynamicStyles: function() {
                var style = doc.createElement('style'),
                    label = iconWidth + 4,
                    left = ((iconWidth * screen.width / 100) - (label * screen.width / 100)) / 2,
                    labelTop = labelTopPadding + iconWidth,
                    css = ".drawer_icon::after{margin-left:" + left + "px;margin-top:" + labelTop + "vw; width: " + label + "vw;}";
                css += ".drawer_icon::before{}";
                style.type = 'text/css';
                style.id = 'ICONS';
                style.appendChild(doc.createTextNode(css));
                doc.body.appendChild(style);
            }
        };
        Drawer.updateBadge = function(bundle) {
            var badge = "";
            if (FPI.bundle[bundle].badge > 0) {
                badge = FPI.bundle[bundle].badge;
            }
            if (doc.getElementById(idPrefix + bundle)) {
                doc.getElementById(idPrefix + bundle).setAttribute('badge', badge);
            }
        };
        Drawer.createIcons = function() {
            var i, div, spacer, sel, count, bundle, icon, name,
                paging = 0,
                allApps = Drawer.sortArray(FPI.apps.all),
                page = doc.createElement('div');
            drawer = doc.createElement('div');
            drawer.className = 'drawer_main';
            drawer.style.cssText += "-webkit-scroll-snap-points-x: repeat(" + snapPoint + "%);";

            /* reset shortcuts for new info */
            shortcutMaker.resetInfo();

            for (i = 0; i < allApps.length; i += 1) {
                paging += 1;
                sel = FPI.bundle[allApps[i].bundle];
                name = sel.name;
                count = sel.badge;
                bundle = allApps[i].bundle;

                //fix whatsapp mess (mainly for shortcutMaker)
                if (name.indexOf("WhatsApp") >= 0) {
                    name = "WhatsApp";
                }

                //store info for shortcuts
                shortcutMaker.populateShortcuts({
                    firstLetter: String(name).charAt(0).toLowerCase(),
                    bundle: bundle
                });


                icon = '/var/mobile/Library/FrontPageCache/' + bundle + '.png';
                if (bundle === "com.junesiphone.drawer") {
                    icon = 'drawer.png';
                }

                div = createDOM({
                    type: 'div',
                    id: idPrefix + bundle,
                    attribute: ['letter', name.charAt(0)],
                    className: 'drawer_icon'
                });

                div.style.cssText += "margin:" + iconMargin + "px;width: " + iconWidth + "vw;height: " + iconWidth + "vw;";
                div.style.backgroundImage = 'url("' + icon + '")';
                div.setAttribute('badge', (count >= 1) ? count : "");
                div.setAttribute('name', name);
                page.appendChild(div);

                if (paging === pagingAmount || i === allApps.length - 1) {
                    paging = 0;
                    page.className = 'drawer_page';
                    if (i === allApps.length - 1) { //lastpage
                        page.style.cssText += "padding:" + pagePadding + "px; margin-right:0px;";

                    } else {
                        page.style.cssText += "padding:" + pagePadding + "px; margin-right:" + pageSpacing + "%;";
                    }
                    if (params.labels === false) {
                        page.style.color = 'transparent';
                    }
                    drawer.appendChild(page);

                    if (i === allApps.length - 1) { //lastpage
                        spacer = doc.createElement('div');
                        spacer.className = 'drawer_page';
                        spacer.style.cssText += "margin-left:-5px;opacity:0;width:0;height:0;";
                        drawer.appendChild(spacer);
                    }

                    page.title = page.children[0].getAttribute('letter') + '-' + page.children[page.children.length - 1].getAttribute('letter');
                    page = doc.createElement('div');
                }
            }
            doc.body.appendChild(drawer);
            drawer.lastChild.previousElementSibling.style.cssText += 'height:' + drawer.firstChild.offsetHeight + 'px';
            Drawer.addMainEvents(drawer);
            Drawer.helpers.createCloseButton();
            shortcutMaker.createShortcutLetters();
        };
        drawerCreate = function(methods) {
            Drawer.resetDivs();
            Drawer.createIcons();
            methods.reloadIcons = function() {
                var drawerDiv = doc.querySelector('.drawer_main'),
                    closer = doc.querySelector('.drawer_close_button');
                if (drawerDiv) {
                    doc.body.removeChild(drawerDiv);
                    doc.body.removeChild(closer);
                }
                return Drawer.createIcons();
            };
            Drawer.helpers.setDynamicStyles();
            return methods;
        };
        return drawerCreate(this);
    };
    window.Drawer = Drawer;
}(document));