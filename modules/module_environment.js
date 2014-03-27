/*  *  *  *  *  *  *  *
*
* EduVis.Environment
*
*   TODO: document this module
*/

(function (eduVis) {

    "use strict";

    /** 
    * TODO: document this module
    * This is where the function actions are defined
    * 
    * @param {Object} define the function paramenter(s) here ( in this case an object ).. be specific as to its usage 
    * @return {Object} define the returned value here, in this case an Object.. be specific
    */

    var _environment_path_root = "",
    	_environment_path_server = "",
    	_environment_path_service_instance = "",

        _environment_path_eduvis = "",
        _environment_path_tools = "tools/",
        _environment_path_resources = "resources/",

    _environment_set_path = function( _path ) {

    	_environment_path = (_path || "");

    	console.log(".... P A T H .....", _path);
    },
    
    _environment_get_path = function() {
        return _environment_path_root;
    },

    _environment_set_paths = function( _root, _tools, _resources ) {

        // initialize with defaults.
        _environment_path_root = (_root || "");
        _environment_path_tools = (_tools || _root + "tools/"); // + "tools/";
        _environment_path_resources = (_resources || _root + "resources/"); // + "resources/";

        /*
            console.log("....  P A T H S .....", _root);
            console.log("root path", _environment_path_root);
            console.log("tools path", _environment_path_tools);
            console.log("resources path", _environment_path_resources);
        */
    },

    _environment_set_path_tools = function( _path_tools ) {
        _environment_path_tools = _path_tools;
    },
	
    _environment_get_path_tools = function() {
		return _environment_path_tools;

    },

    _environment_set_path_root = function( _path_root ) {
        _environment_path_root = _path_root;
    },
    
    _environment_get_path_root = function() {
        return _environment_path_root;

    },

    _environment_set_path_resources = function( _path_resources ) {
        _environment_path_resources = _path_resources;
    },

    _environment_get_path_resources = function() {
		return _environment_path_resources;
    },

    _environment_set_webservice = function( _path_webservice ) {

        _environment_path_webservice = _path_webservice;

    },
    _environment_get_webservice = function() {

      	console.log("_environment_path_webservice", _environment_path_webservice);

		return _environment_path_webservice;

    },

	// Document Referrer
	_environment_referrer = function() {
		if ( self == top ) return document.referrer;
		else return parent.document.referrer;
	},

	// This Document
	_environment_name = function() {
		return document.URL;
	};


    eduVis.Environment = {
        setPath: _environment_set_path,
        setPaths: _environment_set_paths,
        getPath: _environment_get_path,
        getPathRoot: _environment_get_path_root,

        setPathTools : _environment_set_path_tools,
        
        getPathTools : _environment_get_path_tools,
        getPathResources : _environment_get_path_resources,

        setWebservice : _environment_set_webservice,
        getWebservice : _environment_get_webservice,
        
        path_webservice : _environment_get_webservice,
        
        referrer : _environment_referrer,
        name : _environment_name

    };

}(EduVis));
