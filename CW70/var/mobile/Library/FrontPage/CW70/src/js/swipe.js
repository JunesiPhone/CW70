/*global lStorage widgetContainer */
(function(window, doc) {
    var swipe = {
            getCommand: function(state, settings) {
                /* set defaults */
                if (!settings) {
                    if (state == 'swipeup') {
                        return 'frontpage:opencc';
                    } else if (state == 'swipedown') {
                        return 'frontpage:opensearch';
                    } else if (state == 'swipeleft') {
                        return 'frontpage:openswitcher';
                    } else if (state == 'swiperight'){
                        return 'frontpage:showToday';
                    }
                }
                var fpCommand = '';
                switch (settings) {
                    case 'cc':
                        fpCommand = 'frontpage:opencc';
                        break;
                    case 'search':
                        fpCommand = 'frontpage:opensearch';
                        break;
                    case 'switcher':
                        fpCommand = 'frontpage:openswitcher';
                        break;
                    case 'today':
                        fpCommand = 'frontpage:showToday';
                        break;
                    case 'none':
                        fpCommand = '';
                        break;
                    default:
                        fpCommand = 'frontpage:openswitcher';
                        break;
                }
                return fpCommand;
            },
            bgSwipe: function(direction) {
                var command = '';
                if (direction === 'u') {
                    command = swipe.getCommand('swipeup', lStorage['swipeup']);
                } else if (direction === 'd') {
                    command = swipe.getCommand('swipedown', lStorage['swipedown']);
                } else if (direction === 'l') {
                    command = swipe.getCommand('swipeleft', lStorage['swipeleft']);
                } else if (direction === 'r') {
                    command = swipe.getCommand('swiperight', lStorage['swiperight']);
                }
                if (command != '') {
                    if(command == 'frontpage:showToday'){
                        document.body.style.opacity = 0;
                    }
                    window.location = command;
                }
            }
        };

    function detectswipe(el, func) {
        var data = {
                sX: 0,
                sY: 0,
                eX: 0,
                eY: 0,
                mXY: '',
                touches: 0
            },
            min_x = 30, //min x swipe for horizontal swipe
            max_x = 50, //max x difference for vertical swipe
            min_y = 200, //min y swipe for vertical swipe
            max_y = 70, //max y difference for horizontal swipe
            direction = "",
            ele = document.querySelector(el);
        ele.addEventListener('touchstart', function(e) {
            data.mXY = '';
            data.touches = e.touches.length;
            if (e.touches.length == 1) {
                var t = e.touches[0];
                data.sX = t.screenX;
                data.sY = t.screenY;
            }
        }, {
            passive: true
        });
        ele.addEventListener('touchmove', function(e) {
            var t = e.touches[0];
            data.eX = t.screenX;
            data.eY = t.screenY;
            data.movedXY = "yes";
        }, {
            passive: true
        });
        ele.addEventListener('touchcancel', function(e) {
            e.preventDefault();
        });
        ele.addEventListener('touchend', function() {
            if (data.touches == 1) {
                if (data.movedXY === 'yes') {
                    if ((((data.eX - min_x > data.sX) || (data.eX + min_x < data.sX)) && ((data.eY < data.sY + max_y) && (data.sY > data.eY - max_y)))) {
                        if (data.eX > data.sX) {
                            direction = "r";
                        } else if (data.eX < data.sX) {
                            direction = "l";
                        }
                    }
                    if ((((data.eY - min_y > data.sY) || (data.eY + min_y < data.sY)) && ((data.eX < data.sX + max_x) && (data.sX > data.eX - max_x)))) {
                        if (data.eY > data.sY) {
                            direction = "d";
                        } else if (data.eY < data.sY) {
                            direction = "u";
                        }
                    }
                }
                if (direction !== "") {
                    if (typeof func === 'function') {
                        func(direction);
                    }
                }
                direction = "";
                data.movedXY = "";
            }
        }, {
            passive: true
        });
    }
    detectswipe('#container', swipe.bgSwipe);
}(window, document));