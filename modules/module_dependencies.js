//
// EduVis.dependencies
//

(function (eduVis) {

    "use strict";

    // test if has own property
    console.dir(eduVis);
    console.dir(EduVis);

    var _dependencies_identify = function () {

        // Identify Dependencies for the tool.

    },

    _dependency_check = function() {

        // Test if a dependency is currently loaded into EduVis. If not, add to load queue.

    },

    _dependency_load = function () {

    }

    eduVis.dependencies = {
        check: _dependency_check,
        load: _dependency_load,
        identify: _dependencies_identify
    };

}(EduVis));
