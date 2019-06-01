/*


Requires lStorage, jPopup, and spectrum (spectrum requires jQuery)

    Usage:
        jSettings({
            //MENU
            colorMenu: {
                saveName: '',
                type: 'menu',
                menuID: 'colorMenu',
                placeholder: 'Color Options',
                callback: function(menu){
                    jSettings.closeSettings();
                    setTimeout(function(){
                        menu.style.display = 'block';
                    },300);
                }
            },
            //COLOR
            panelColor: {
                menu: 'colorMenu',
                saveName: 'panelColor',
                type: 'input',
                color: true,
                defaultColor: 'rgba(0, 0, 0, 0.6)',
                placeholder: 'Dock Color',
                callback: function(input, ref){
                    jSettings.addStyleString(".iconImageBadge{color:"+ input.value +"}", ref + 'settings');
                    if(ref){
                        lStorage.replaceStorageItem(ref, input.value);
                    }
                }
            },
            //MULIPLE OPTIONS
            swipeleft: {
                menu: 'swipeMenu',
                saveName: 'swipeleft',
                type: 'options',
                default: 'cc',
                optionsPlaceholders: ['Open Switcher', 'Open CC'],
                options: ['switcher', 'cc'],
                placeholder: 'Swipe left',
                callback: function(input, ref) {
                    if (ref) {
                        lStorage.replaceStorageItem(ref, input);
                    }
                }
            },
            //CLEAR MENU SETTINGS
            clearSwipeOptions: {
                menu: 'resetMenu',
                saveName: '',
                type: 'button',
                placeholder: 'Reset swipe options',
                callback: function(input, ref){
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
            //TOGGLE
            disablenotch: {
                menu: '',
                saveName: 'disablenotch',
                type: 'toggle',
                placeholder: 'Disable notch hide (iPX)',
                callback: function(input, ref) {
                    if (input.checked) {
                        jSettings.addStyleString('#notcher{opacity:0;}.statusbarHolder:after{background-color:transparent;}', ref + 'settings');
                    } else {
                        jSettings.addStyleString('#notcher{opacity:1;}.statusbarHolder:after{background-color:black;}', ref + 'settings');
                    }
                    if (ref) {
                        lStorage.replaceStorageItem(ref, input.checked);
                    }
                }
            },
            //INPUT
            widgetX: {
                menu: 'widgetMenu',
                saveName: 'widgetx',
                type: 'input',
                placeholder: 'Widget X position',
                callback: function(input, ref) {
                    document.getElementById('datewidget').style.left = input.value + 'px';
                    if (ref) {
                        //update storaged item
                        lStorage.replaceStorageItem(ref, input.value);
                    }
                }
            },
            //BUTTON
            
        });

    Hide/Show panel
        Main Panel jSettings.closeSettings()
        All other panels jSettings.closeSettingsMenus();
*/
/* global lStorage createDOM $ */
(function(window, doc) {
    var storedItems = null,
        scrolling = false,
        storedInfo = {
            eventObject: [],
            appendedObject: [],
            appendedSpectrum: []
        };

    function appendToBody(item) {
        doc.body.appendChild(item);
        storedInfo.appendedObject.push(item);
    }

    function loadSettings(j, firstLoad) {
        var systemPopup = createDOM({
                type: 'div',
                id: 'jSettings'
            }),
            systemElements = createDOM({
                type: 'div',
                className: 'jElements'
            }),
            itemObject, domElement;

        Object.keys(j).forEach(function(value) {
            itemObject = j[value];

            domElement = createDOM({
                type: 'div',
                className: itemObject.saveName + '~' + itemObject.type
            });

            switch (itemObject.type) {
                case 'input':
                    createInput(j, domElement, itemObject);
                    break;
                case 'toggle':
                    createToggle(j, domElement, itemObject);
                    break;
                case 'button':
                    createButton(j, domElement, itemObject);
                    break;
                case 'menu':
                    createMenu(j, domElement, itemObject);
                    break;
                case 'options':
                    createOptions(j, domElement, itemObject);
                    break;
            }

            systemElements.appendChild(domElement);
        });
        systemPopup.appendChild(systemElements);
        appendToBody(systemPopup);
        //clear values
        systemPopup = systemElements = itemObject = domElement = null;

        if(firstLoad){
            setTimeout(function(){
                jSettings.removeElements();
            },1000);
        }
    }

    function callObject(event) {
        var i, obj;
        for (i = 0; i < storedInfo.eventObject.length; i++) {
            obj = storedInfo.eventObject[i];
            if (obj.divID === event.target && obj.event == event.type) {
                obj.callback();
            }
        }
    }

    function removePopupEventListeners() {
        var i, ob, div;
        if(storedInfo.eventObject.length > 0){
            for (i = 0; i < storedInfo.eventObject.length; i++) {
                ob = storedInfo.eventObject[i];
                div = ob.divID;
                div.removeEventListener(ob.event, callObject);
            }
            storedInfo.eventObject = [];
        }
    }

    function removeInputElements() {
        var i;
        if(storedInfo.appendedSpectrum.length > 0){
            for (i = 0; i < storedInfo.appendedSpectrum.length; i++) {
                $(storedInfo.appendedSpectrum[i]).spectrum("destroy");
            }
            storedInfo.appendedSpectrum = [];
        }
    }

    function removeAppendedToDocument() {
        var i, elem;
        if(storedInfo.appendedObject.length > 0){
            for (i = 0; i < storedInfo.appendedObject.length; i++) {
                elem = storedInfo.appendedObject[i];
                if (elem.parentNode) {
                    elem.parentNode.removeChild(elem);
                }
            }
            storedInfo.appendedObject = [];
        }
    }

    function resetStoredItems() {
        storedItems = null;
    }

    function removeSettingsElements() {
        removePopupEventListeners(); //doing nothing
        removeAppendedToDocument(); //removing nodes
        removeInputElements();
        resetStoredItems();
    }

    function registerPopupEvents(div, params) {
        var object = {
            divID: div,
            event: params.event,
            callback: params.callback
        };
        storedInfo.eventObject.push(object);
        div.addEventListener(params.event, callObject);
    }

    function addEventToButton(button, type, action, param1, param2, param3) {
        registerPopupEvents(button, {
            event: type,
            callback: function() {
                if (!scrolling) {
                    if (param1) {
                        action(param1, param2, param3);
                    } else {
                        action();
                    }
                }
                event.preventDefault();
                scrolling = false;
            }
        });
        /* 
            if touchend (menu usually) detect if menu is moving
            and don't trigger touchend if scrolling.
        */
        if (type == 'touchend') {
            registerPopupEvents(button, {
                event: 'touchmove',
                callback: function() {
                    scrolling = true;
                }
            });
        }
    }

    function spectrumEvent(action, param1, param2) {
        if (param1) {
            action(param1, param2);
        } else {
            action();
        }
    }

    function moveUpForInput(event) {
        var offsetFromCenter = event.target.getBoundingClientRect().top - ((screen.height / 2) - 40);
        if (Math.sign(offsetFromCenter) != -1) {
            doc.body.style.webkitTransform = 'translateY(' + -offsetFromCenter + 'px)';
        }
    }

    function resetMoveForInput() {
        doc.body.style.webkitTransform = 'translateY(0px)';
    }

    function setupSpectrumInput(input, itemObject) {
        var color, inputs;
        /* load saved color */
        if (!storedItems) {
            storedItems = JSON.parse(localStorage.getItem(lStorage.storageName));
        }
        /* if no stored color use default color */
        color = itemObject.defaultColor;
        if (storedItems && storedItems[itemObject.saveName]) {
            color = storedItems[itemObject.saveName];
        }
        /* add input for color picker */
        $(input).spectrum({
            preferredFormat: "rgb",
            showAlpha: true,
            showInput: true,
            color: color,
            move: function(color) {
                this.value = color.toRgbString();
                spectrumEvent(itemObject.callback, input, itemObject.saveName);
            },
            change: function() {
                spectrumEvent(itemObject.callback, input, itemObject.saveName);
            }
        });

        storedInfo.appendedSpectrum.push(input);
        inputs = doc.getElementsByClassName('sp-input');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i] !== undefined) {
                registerPopupEvents(inputs[i], {
                    event: 'focus',
                    callback: function() {
                        moveUpForInput(event);
                    }
                });
                registerPopupEvents(inputs[i], {
                    event: 'blur',
                    callback: function() {
                        resetMoveForInput(event);
                    }
                });
            }
        }
    }

    function setupInputEvents(input) {
        registerPopupEvents(input, {
            event: 'focus',
            callback: function() {
                moveUpForInput(event);
            }
        });
        registerPopupEvents(input, {
            event: 'blur',
            callback: function() {
                resetMoveForInput(event);
            }
        });
    }

    function getInputPlaceholder(itemObject) {
        var placeholder = "";
        if (itemObject.example) {
            placeholder = itemObject.example;
        }
        return placeholder;
    }

    function createInput(j, div, itemObject) {
        var text, input;
        text = createDOM({
            type: 'div',
            className: 'itemLabel',
            id: itemObject.saveName,
            innerHTML: itemObject.placeholder
        });
        input = createDOM({
            type: 'input',
            className: 'itemInput'
        });

        input.placeholder = getInputPlaceholder(itemObject);

        if (itemObject.color) {
            setTimeout(function() {
                setupSpectrumInput(input, itemObject);
            }, 200);
        } else {
            setupInputEvents(input);
        }

        /* if item has menu defined place it in that menu. */
        if (itemObject.menu) {
            var menu = doc.getElementById(itemObject.menu);
            if (menu.children[0].className === 'jElements') {
                menu = menu.children[0];
            }
            menu.appendChild(text);
            menu.appendChild(input);
        } else {
            div.appendChild(text);
            div.appendChild(input);
        }
        if (lStorage[itemObject.saveName]) {
            input.value = lStorage[itemObject.saveName];
            itemObject.callback(input, itemObject.saveName);
        }
        addEventToButton(input, 'blur', itemObject.callback, input, itemObject.saveName);
    }

    function createToggle(j, div, itemObject) {
        var text = createDOM({
                type: 'div',
                className: 'itemLabel',
                id: itemObject.saveName,
                innerHTML: itemObject.placeholder
            }),
            holder = createDOM({
                type: 'div',
                className: 'toggleHolder'
            }),
            label = createDOM({
                type: 'label',
                className: 'switch'
            }),
            input = createDOM({
                type: 'input',
                attribute: ['type', 'checkbox']
            }),
            span = createDOM({
                type: 'span',
                className: 'slider round'
            });
        /* if item has menu defined place it in that menu. */
        if (itemObject.menu) {
            var menu = doc.getElementById(itemObject.menu);
            if (menu.children[0].className === 'jElements') {
                menu = menu.children[0];
            }
            menu.appendChild(text);
            holder.appendChild(label);
            holder.appendChild(input);
            holder.appendChild(span);
            menu.appendChild(holder);
        } else {
            div.appendChild(text);
            holder.appendChild(label);
            holder.appendChild(input);
            holder.appendChild(span);
            div.appendChild(holder);
        }

        if (lStorage[itemObject.saveName]) {
            input.checked = true;
            itemObject.callback(input, itemObject.saveName);
        }
        addEventToButton(input, 'change', itemObject.callback, input, itemObject.saveName);
    }

    function createButton(j, div, itemObject) {
        var text = createDOM({
                type: 'div',
                className: 'itemLabel',
                id: itemObject.saveName,
            }),
            button = createDOM({
                type: 'div',
                className: 'jButton',
                innerHTML: itemObject.placeholder
            });
        /* if item has menu defined place it in that menu. */
        if (itemObject.menu) {
            var menu = doc.getElementById(itemObject.menu);
            if (menu.children[0].className === 'jElements') {
                menu = menu.children[0];
            }
            menu.appendChild(text);
            menu.appendChild(button);
        } else {
            div.appendChild(text);
            div.appendChild(button);
        }
        addEventToButton(button, 'touchstart', itemObject.callback);
    }

    function optionSelected(name, optionsMenu, itemObject) {
        optionsMenu.style.display = 'none';
        itemObject.callback(name, itemObject.saveName);
    }

    function showOptions(optionsMenu, value, object) {
        var item = optionsMenu.children;
        var storedValue = lStorage[value] || object.default;
        for (var i = 0; i < item.length; i++) {
            if (item[i].title === storedValue) {
                item[i].style.backgroundColor = 'white';
            } else {
                item[i].style.backgroundColor = '#ccc';
            }
        }
        optionsMenu.style.display = 'block';
        var divs = doc.getElementsByClassName('jSettingsMenu');
        if (divs) {
            for (var e = 0; e < divs.length; e++) {
                divs[e].style.display = 'none';
            }
        }
    }

    function createOptions(j, div, itemObject) {
        var saveValue;
        var text = createDOM({
                type: 'div',
                className: 'itemLabel',
                id: itemObject.saveName,
            }),
            button = createDOM({
                type: 'div',
                className: 'jMenuButton',
                innerHTML: itemObject.placeholder
            }),
            optionsMenu = createDOM({
                type: 'div',
                className: 'optionsMenu',
            }),
            array = itemObject.optionsPlaceholders,
            option = null;

        /* if item has menu defined place it in that menu. */
        if (itemObject.menu) {
            var menu = doc.getElementById(itemObject.menu);
            if (menu.children[0].className === 'jElements') {
                menu = menu.children[0];
            }
            menu.appendChild(text);
            menu.appendChild(button);
        } else {
            div.appendChild(text);
            div.appendChild(button);
        }

        for (var i = 0; i < array.length; i++) {
            option = createDOM({
                    type: 'div',
                    className: 'jButton',
                    innerHTML: array[i],
                    attribute: ['title', itemObject.options[i]]
                }),
                saveValue = itemObject.options[i];
            addEventToButton(option, 'touchstart', optionSelected, saveValue, optionsMenu, itemObject);
            optionsMenu.appendChild(option);
        }
        appendToBody(optionsMenu);
        addEventToButton(button, 'touchstart', showOptions, optionsMenu, itemObject.saveName, itemObject);
    }

    function createMenu(j, div, itemObject) {
        var menuButton = createDOM({
                type: 'div',
                className: 'jMenuButton',
                innerHTML: itemObject.placeholder
            }),
            menu = createDOM({
                type: 'div',
                className: 'jSettingsMenu',
                id: itemObject.menuID
            }),
            systemElements = createDOM({
                type: 'div',
                className: 'jElements'
            });
        menu.appendChild(systemElements);
        appendToBody(menu);
        div.appendChild(menuButton);
        addEventToButton(menuButton, 'touchend', itemObject.callback, menu);
    }

    function firstLoad() {
        loadSettings(jSettings.allInfo, true);
    }

    var jSettings = function(j) {
        jSettings.allInfo = j;
        firstLoad();
    }
    jSettings.loadSettings = function() {
        loadSettings(jSettings.allInfo);
    }
    jSettings.openSettings = function() {
        loadSettings(jSettings.allInfo);
        doc.getElementById('jSettings').style.display = 'block';
    };
    jSettings.closeSettings = function() {
        var settings;
        if (doc.getElementById('jSettings')) {
            settings = doc.getElementById('jSettings');
            if (settings.style.display === 'block') {
                settings.style.display = "none";
            }
        }
    };
    jSettings.removeElements = function() {
        removeSettingsElements();
    };
    jSettings.closeSettingsMenus = function() {
        /* removeAllElements and events as menu is closed */
        resetMoveForInput();
        setTimeout(function() {
            jSettings.removeElements();
        }, 0);
    };
    /* 
      Add styles by injecting into the html.
      Allows for :before and :after styling and classes
      Adds an id for each setting to stop duplicates.
    */
    jSettings.addStyleString = function(str, id) {
        var element, node;
        if (id) {
            /* If exists remove */
            if (doc.getElementById(id)) {
                element = doc.getElementById(id);
                doc.body.removeChild(element);
            }
        }
        node = doc.createElement('style');
        node.innerHTML = str;
        node.id = id;
        doc.body.appendChild(node);
    };

    jSettings.closeColorPickers = function() {
        resetMoveForInput();
        if (doc.getElementsByClassName('sp-container')) {
            var containers = doc.getElementsByClassName('sp-container');
            if (containers.length > 0) {
                for (var i = 0; i < containers.length; i++) {
                    if (!containers[i].classList.contains('sp-hidden')) {
                        containers[i].className += ' sp-hidden';
                    }
                }
            }
        }
    };

    // jSettings.testCount = 0;
    // jSettings.testMemory = function(iterations) {
    //     console.log(jSettings.testCount);
    //     jSettings.testCount = jSettings.testCount + 1;
    //     if (jSettings.testCount < iterations) {
    //         console.log("Test Started");
    //         jSettings.loadSettings(jSettings.allInfo);
    //         console.log("Items Injected");
    //         setTimeout(function() {
    //             jSettings.removeElements();
    //             console.log("Items Removed");
    //             setTimeout(function() {
    //                 jSettings.testMemory(iterations);
    //             }, 0);
    //         }, 2000);
    //     } else {
    //         console.log('Test has finished');
    //     }
    // };

    window.jSettings = jSettings;
}(window, document));