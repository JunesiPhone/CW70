/* 
    tapHold mini library

****** Usage *****

    taphold({
        time: 400,
        element: document.getElementById('start'),
        action: function(element){
            alert('you held on this element for 400ms ' + element);
        },
        passTarget: true
    });

    ???? For now the element must have an ID.

    https://junesiphone.com
*/
(function(window, doc) {

    var tapTimer = null,
        elementsAdded = {};

    function clearTimer() {
        if (tapTimer) {
            clearTimeout(tapTimer);
        }
    }

    function touchStarted(event) {
        clearTimer();
        var elementInfo = elementsAdded[event.target.id];
        if(!elementInfo){
            elementInfo = elementsAdded[event.target.parentElement.id];
            if(!elementInfo){
                elementInfo = elementsAdded[event.target.parentElement.parentElement.id];
            }
        }
        tapTimer = setTimeout(function() {
            elementInfo.action(event.target, event);
        }, elementInfo.time);
    }

    function removeTapEvents(id) {
        var element = doc.getElementById(id);
        element.removeEventListener('touchstart', touchStarted, false);
        element.removeEventListener('touchmove', clearTimer, false);
        element.removeEventListener('touchend', clearTimer, false);
        element.removeEventListener('touchcancel', clearTimer, false);
        delete elementsAdded[id];
    }

    function addTapEvents(element) {
        element.addEventListener('touchstart', touchStarted, false);
        element.addEventListener('touchmove', clearTimer, false);
        element.addEventListener('touchend', clearTimer, false);
        element.addEventListener('touchcancel', clearTimer, false);
    }

    function taphold(t) {
        /* delay due to not knowing how fast tapholds are added */
        setTimeout(function(){
            var tapID = t.element.id;
            elementsAdded[tapID] = {};
            elementsAdded[tapID].time = t.time;
            elementsAdded[tapID].action = t.action;
            elementsAdded[tapID].element = t.element;
            addTapEvents(t.element);
        },0);
    }

    function tapHold_externalMethods() {
        var tapActions = {};
        tapActions.removeEvents = function(element) {
            removeTapEvents(element);
        };
        return tapActions;
    }
    window.taphold = taphold;
    window.tapholdActions = tapHold_externalMethods();
}(window, document));


/*
    Usage:
        multipleTap({
            div: document.querySelector('.mnml'),
            callback: function(){
                document.getElementById('jSettings').style.display = "block";
            }
        });
*/

(function() {
    var taps = 0,
        tapTimer = null,
        clearTap = function() {
            taps = 0;
            clearTimeout(tapTimer);
            tapTimer = null;
        },
        multipleTap = function(obj) {
            obj.div.addEventListener('touchstart', function(e) {
                if (e.touches.length > 1) {
                    clearTap();
                    return;
                }
                taps = taps + 1;
                if (tapTimer === null) {
                    tapTimer = setTimeout(function() {
                        clearTap();
                    }, 600)
                }
            });
            obj.div.addEventListener('touchmove', function() {
                clearTap();
            });
            obj.div.addEventListener('touchend', function() {
                if (taps === obj.taps) {
                    setTimeout(function() {
                        obj.callback();
                    }, 0);
                    clearTap();
                }
            });
            obj.div.addEventListener('touchcancel', function() {
                clearTap();
            });
        };
    window.multipleTap = multipleTap;
}());