/*  *  *  *  *  *  *  *
*
* EduVis.Environment
*
*/

(function (eduVis) {

    "use strict";

    /** 
    * This is where the function actions are defined
    * 
    * @param {Object} define the function paramenter(s) here ( in this case an object ).. be specific as to its usage 
    * @return {Object} define the returned value here, in this case an Object.. be specific
    */

    var _environment_path_root,
    	_environment_path_server,
    	_environment_path_service_instance,
    	//_environment_path = "",
    	//_environment_path_tools = "tools/",
    	//_environment_path_resources = "resources/",
        _environment_path,
        _environment_path_tools = "tools/",
        _environment_path_resources = "resources/",

    _environment_set_path = function( _path ) {

    	_environment_path = (_path || "");
    	_environment_path_tools = (_path || "") + "tools/";
    	_environment_path_resources = (_path || "") + "resources/";

    	console.log(".... P A T H .....", _path);
    },
    
    _environment_get_path = function() {
        return _environment_path;
    },

    _environment_set_paths = function( _path, _tools, _resources ) {

        // initialize with defaults.
        _environment_path_root = (_path || "");
        _environment_path_tools = (_tools || "");// + "tools/";
        _environment_path_resources = (_resources || "");// + "resources/";

        console.log("....  P A T H S .....", _path);
    },

    _environment_set_path_tools = function( _path_tools ) {
        _environment_path_tools = _path_tools;
    },
	
    _environment_get_path_tools = function() {
		return _environment_path_tools;

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

    // Color Depth 
	color_depth = function() {

		var color_depth, bits = 0;

		if (window.screen) {

			bits = screen.colorDepth;
			// DEAL WITH BUG IN NETSCAPE 4
			bits = (( bits==14 || bits==18) && bname=="Netscape") ? bits-10 : bits;
			color_depth = bits + " bits per pixel"; 
		}
		else{
			color_depth = "Only available on browsers v4 or greater";
		}
		if (bits == 4){
			color_depth += " (16 colors)";
		}
		else if (bits == 8){
			color_depth += " (256 colors)";
		}
		else if (bits == 16){
			color_depth += " (65,536 colors -- High Color)";
		}
		else if (bits == 24){
			color_depth += " (16,777,216 colors -- True Color)";
		}
		else if (bits == 32){
			color_depth += " (16,777,216 colors -- True Color [_not_ 4,294,967,296 colors!])"; 
		}
		return (color_depth); 
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

