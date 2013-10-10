/*  *  *  *  *  *  *  
*
* EduVis.resource
*
*/

/**
Provides the base resource queue, loading, and updating functionality.

@module Resource
**/

/**
* The resource module...
*
* @class resource
* @constructor
*/

(function (eduVis) {

    "use strict";

    var _resource_version = "0.0.1",
        _resource_path = EduVis.Environment.getPathResources(), // path to javascript resources
        _resource_path_js = _resource_path + "js/",
        _version_jquery = "1.10.1", // latest tested and supported version of jquery
        _version_d3 = "3.0.8",

/** Queue and load tool resources based on the tool resource object
* 
* @method _resource_queue
* @param {Object} _obj_resources The tool resources object
* @param {Object} _tool_name  A reference to the tool name
* @return none 
*/

    _resource_queue = function( _obj_resources, _tool_name){

        console.log("obj resources in _resource_queue", _obj_resources);

        var d = _obj_resources,
            scr_local = d.scripts_local,
            scr_external =  d.scripts_external,
            sty_local = d.stylesheets_local,
            sty_ext = d.stylesheets_external,
            queued = _resources_queued,
            q = queued[_tool_name];
 
        q = typeof q !== "object" ? {} : q;
        
        // all all resources to queue
        $.each(scr_local, function(i,v){
            
            q[v.name] = i;
            q["applies_to_tool"] = _tool_name;

            console.log("..internal queued..", i, q);
        });

        $.each(scr_external, function(i,v){
            
            console.log("..external queued..", i, v,  q);

            q[v.name] = i;
            q["applies_to_tool"] = _tool_name;

        });

        $.each(sty_local, function(i,v){
            
            q[v.name] = i;
            q["applies_to_tool"] = _tool_name;

            console.log("..local style queued..", i, q);
        });

        $.each(sty_ext, function(i,v){
            
            q[v.name] = i;
            q["applies_to_tool"] = _tool_name;

            console.log("..external style queued..", i, q);
        });

        // load queued resources

        $.each(scr_local,function(i,v){
            console.log(".. scr_local  resource .. " + i + " - " , v);
            _resource_load_local( v );
        });

        $.each(scr_external,function(i,v){
            console.log(".. scr_external resource .. " + i + " - " , v);
            _resource_load_external( v );
        });

        $.each(sty_local,function(i,v){
            _resource_load_stylesheet( v );
        });

        $.each(sty_ext,function(i,v){
            _resource_load_stylesheet( v );
        });   

    },

/** Log to the console when a script has loaded
* 
* @method _resource_notify
* @param {Object} _obj_resource The tool resource
* @return {} 
*/

    _resource_notify = function( _obj_resource){

        // log to EV debug object.. 
        console.log("script " + _obj_resource.name + " has loaded;");
    },

/** Load a JavaScript dependency (local resource that has been tested) from the resources folder. 
* 
* @method _resource_load_local
* @param {Object} _obj_resource an object with the dependency name, file name, 
* @return {} 
*/
    _resource_load_local = function ( _obj_resource ) {

        // test if local resource is available

        //var url = _obj_resource.resource_path || _resource_path_js;
        //var url = EduVis.Environment.getPathResources() + "js/";
        var url = _obj_resource.resource_path || _resource_path_js;

        console.log(".....");
        console.log("Resource load local.", url, _obj_resource);
        console.log(".....");

        _resource_inject({
            "name" : _obj_resource.name,
            "url" : url + _obj_resource.resource_file_name,
            "validation": _obj_resource.validation || _obj_resource.name,
            "global_reference" : _obj_resource.global_reference,
            "attributes" : _obj_resource.attributes || {}
        });
    },

/** Load an external JavaScript dependency.. object is standarized and _resource_inject is called
* 
* @method _resource_load_external
* @param {Object} _obj_resource an object with the dependency name, file name, 
* @return {} 
*/
    _resource_load_external = function ( _obj_resource ) {

        // test if external resource is available
        _resource_inject({
            "name" : _obj_resource.name,
            "url" : _obj_resource.url,
            "validation": _obj_resource.validation || _obj_resource.name,
            "global_reference" : _obj_resource.global_reference,
            "version": _obj_resource.version,
            "attributes" : _obj_resource.attributes
        });

    },

/** Load a css style sheet via an ajax call and inject into DOM head
* 
* @method _resource_load_stylesheet
* @param {Object} _obj_stylesheet an object with the dependency name, file name, 
* @return {} 
*/

    _resource_load_stylesheet = function( _obj_stylesheet ){

        var sheet = document.createElement("link");

        console.log( "get path resources" + EduVis.Environment.getPath());

        var sheet_href = _obj_stylesheet.src.indexOf("http")==0 ? _obj_stylesheet.src : EduVis.Environment.getPath() +_obj_stylesheet.src;

        sheet.setAttribute('type', 'text/css');
        sheet.setAttribute('href',  sheet_href);
        sheet.setAttribute('rel','stylesheet')

        if (sheet.readyState){  //internet explorer
            sheet.onreadystatechange = function(){
                if (sheet.readyState == "loaded" || sheet.readyState == "complete"){
                    
                    sheet.onreadystatechange = null;

                    setTimeout( 
                        (function(){
                            
                            // remove resource from resource queue
                            console.log("remove STYLESHEET from queue....")
                            _resource_queue_remove(_obj_stylesheet);

                        })()
                    );
                        
                }
            };
        } else {  // other browsers
            sheet.onload = function(){

                 setTimeout( 
                    (function(){
                        
                        // remove resource from resource queue
                        console.log("remove STYLESHEET from queue....")
                        _resource_queue_remove(_obj_stylesheet);

                    })()
                );
            }
        }

        document.getElementsByTagName('head')[0].appendChild(sheet);
    },

    /** 
    * Load a JavaScript dependency (local and tested) from the resources folder
    * 
    * @param {Object} an object with the dependency name, file name, 
    * @return {Object} a standarized object to be used in _resource_inject
    no return value. a callback is set and executed on load of script
    */

/** Load a script resource via jquery ajax request. Remove the resource from the resource queue 
* when the script is returned.
* 
* @method _resource_inject
* @param {Object} _obj_resource a resource object containing information on the resource to request
* @return {} 
*/
    _resource_inject = function(_obj_resource){

        console.log("......injecting resource.....");

        $.getScript( _obj_resource.url, function(){

            console.log("......now remove resource from queue....." , _obj_resource.name );

             _resource_queue_remove( _obj_resource );

        });

    },

/** Remove a resource from the resource loading queue
* 
* @method _resource_queue_remove
* @param {Object} _obj_resource a resource object containing information on the resource to request
* @return {} 
*/
    _resource_queue_remove = function(_obj_resource){

        // remove from queue object
        delete _resources_queued[ _obj_resource.name ];

        // add the dependency as an available resource
        _resources_loaded[ _obj_resource.name ] = _obj_resource;

    },

/** Test if a resource is currently loaded.
* 
* @method _resource_is_loaded
* @param {String} _resource_name a resource name to be checked for load status
* @return {Boolean} 
*/
    _resource_is_loaded = function( _resource_name ){

        console.log("..IS this resource loaded.. ", _resource_name);
        return typeof _resources_loaded[ _resource_name ] === "object" ? true : false;

    },

/** Find the version of a resource
* 
* @method _resource_version_loaded
* @param {String} _resource_name a resource name to be version checked
* @return {String}  
*/

    _resource_version_loaded = function( _resource_name ){

        var ver = _resoures_loaded[_resource_name];

        if( typeof ver === "object" || typeof ver === "Object"){
            if(ver.hasOwnProperty("version")){
                return ver["version"];
            }
         }

        return "default";
    },

    _resources_loaded = {},
    _resources_queued = {};

    eduVis.resource = {

        // resource loading for scripts
        resource_path : _resource_path,
        resource_path_js : _resource_path_js,

        load : _resource_load_local,
        load_external : _resource_load_external,
        load_stylesheet : _resource_load_stylesheet,
        //loaded : (function(){return _resources_loaded;})(),

        loaded : _resources_loaded,

        queue : _resource_queue,
        //queued : (function(){return _resources_queued;})(),
        queued : _resources_queued,
        
        // identify : _resource_identify,
        notify : _resource_notify,

        is_loaded : _resource_is_loaded,

        version : _resource_version_loaded
    };

}(EduVis));

/*
* TO DO:
*
* todo: path will move to resources
* todo: load tool tests on script request callback

*/
