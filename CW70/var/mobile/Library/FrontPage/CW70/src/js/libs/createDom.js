/*
** Creator: JunesiPhone
** Website: http://junesiphone.com
    
    Creates a domElement and will give the reverence to it. 

    Example:
    var folder = createDOM({
        type: 'div',
        id: 'shortcutFolder',
        className: 'shortcutFolder',
        attribute: ['title', 'alsocloser']
    });
    something.appendChild(folder);
*/

(function(window, doc) {
    window.createDOM = function(params) {
        var d = doc.createElement(params.type);
        if (params.className) {
            d.setAttribute('class', params.className);
        }
        if (params.id) {
            d.id = params.id;
        }
        if (params.innerHTML) {
            d.innerHTML = params.innerHTML;
        }
        if (params.attribute) {
            d.setAttribute(params.attribute[0], params.attribute[1]);
        }
        if (params.attribute2) {
            d.setAttribute(params.attribute2[0], params.attribute2[1]);
        }
        if (params.attribute3) {
            d.setAttribute(params.attribute3[0], params.attribute3[1]);
        }
        if (params.type === "img") {
            d.src = params.src;
        }
        if (params.appendChild) {
            d.appendChild(params.appendChild);
        }
        return d;
    };
}(window, document));


