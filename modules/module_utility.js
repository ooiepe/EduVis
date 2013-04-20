//
// EduVis.utility
//

(function (eduVis) {

    "use strict";

    /** 
    * Copy all properties of an object to another object
    * 
    * @param {Object} parent target object where to copy properties
    * @param {Object} child source object from where to copy properties
    * @return {Object} parent object is returned if needed
    */

    var _extend_deep = function (parent, child) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]";

        child = child || {};

        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    _extend_deep(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
            return child;
        }`
    }

    eduVis.utility = {
        extend: _extend_deep
    };

}(EduVis));
