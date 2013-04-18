var EduVis = (function () {

    "use strict";

	var eduVis = {version : "0.0.1"};

	eduVis.test = function () {


	};

	return eduVis;

}());

//
// EduVis.dependencies
//

(function (eduVis) {

    "use strict";

    // test if has own property
    console.dir(eduVis);
    console.dir(EduVis);

    function getDependencies(tool) {

        // Identify Dependencies for the tool.

    }

    function checkDependencies(tool) {

        // Test if dependencies are currently loaded. If not, add to load queue.

    }

    function loadDependencies(tool) {


    }

    // make only necessary methods public

    EduVis.dependencies = {
        get: getDependencies,
        check: checkDependencies,
        load: loadDependencies
    };

}(EduVis));


//
// EduVis.configuration
//

(function (eduVis) {

    "use strict";

    function configParse(control) {

        // Load a control

    }

    function configValidate(control) {

        // Preview a control
    }

    // make only necessary methods public

    EduVis.configuration = {
        parse: configParse,
        validate: configValidate
    };


}(EduVis));

//
// EduVis.controls
//

(function (eduVis) {

    "use strict";

    function loadControl(control) {

        // Load a control

    }

    function previewControl(control) {

        // Preview a control

    }

    // make only necessary methods public

    EduVis.controls = {
        load: loadControl,
        preview: previewControl
    };


}(EduVis));

//
// EduVis.tools
//

(function (eduVis) {

    "use strict";

    function toolLoad() {
        return;
    }

    function toolInit() {
        return;
    }

    EduVis.tools = {
        load: toolLoad,
        init: toolInit
    };


}(EduVis));


//
// EduVis.formats
//

(function (eduVis) {

    "use strict";

    function formatLat(lat) {
        //  40.350741
        return Math.round(Math.abs(lat), 4) + (+lat > 0 ? "N" : "S");

    }

    function formatLong(long) {
        //  -73.882319
        return Math.round(Math.abs(long), 4) + (+long > 0 ? "E" : "W");
    }

    function formatNumberDecimal(x, n) {
        return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
    }

    EduVis.formats = {
        lat: formatLat,
        long: formatLong,
        numberDecimal: formatNumberDecimal
    };

}(EduVis));

//
// EduVis.utility
//

(function (eduVis) {

    "use strict";

    // deep copy of an object or array

    function extendDeep(parent, child) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]";

        child = child || {};

        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    extendDeep(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
            return child;
        }
    }

    EduVis.utility = {
        extend: extendDeep
    };

}(EduVis));


