/*  *  *  *  *  *  *  
*
* EduVis.resource
*
*/

(function (eduVis) {

    "use strict";

    var _resource_version = "0.0.1",
        _resource_path = "resources/", // path to javascript resources
        _resource_path_js = _resource_path + "js/",
        _version_jquery = "1.10.1", // latest tested and supported version of jquery
        _version_d3 = "3.0.8",

    /** 
    * Queue all tool resources.. local and external scripts and styles into loading queue
    * set callbacks for all resources

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

            console.log("..internal queued..", i, q)
        });

        $.each(scr_external, function(i,v){
            
            console.log("..external queued..", i, v,  q)

            q[v.name] = i;
            q["applies_to_tool"] = _tool_name;

        });

        $.each(sty_local, function(i,v){
            
            q[v.name] = i;
            q["applies_to_tool"] = _tool_name;

            console.log("..local style queued..", i, q)
        });

        $.each(sty_ext, function(i,v){
            
            q[v.name] = i;
            q["applies_to_tool"] = _tool_name;

            console.log("..external style queued..", i, q)
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

    _resource_notify = function( _obj_resource){

        // log to EV debug object.. 
        console.log("script " + _obj_resource.name + " has loaded;");
    },

    /** 
    * Load a JavaScript dependency (local resource that has been tested) from the resources folder
    * 
    * @param {Object} an object with the dependency name, file name, 
    * @return {Object} a standarized object to be used in _resource_inject
    */
    _resource_load_local = function ( obj_resource) {

        // test if local resource is available
        _resource_inject({
            "name" : obj_resource.name,
            "url" : ( obj_resource.resource_path || _resource_path_js ) + obj_resource.resource_file_name,
            "validation": obj_resource.validation || obj_resource.name,
            "global_reference" : obj_resource.global_reference,
            "attributes" : obj_resource.attributes
        });

    },

    _resource_load_external = function ( obj_resource) {

        // test if external resource is available
        _resource_inject({
            "name" : obj_resource.name,
            "url" : obj_resource.url,
            "validation": obj_resource.validation || obj_resource.name,
            "global_reference" : obj_resource.global_reference,
            "version": obj_resource.version,
            "attributes" : obj_resource.attributes
        });

    },
    _resource_load_stylesheet = function( _stylesheet ){

       // do we need an onload as well as an onreadystatechage for stylesheet?

        console.log("stylesheet",_stylesheet);

        var s = document.createElement("link");
        s.setAttribute('type', 'text/css');
        s.setAttribute('href', _stylesheet.src);
        s.setAttribute('rel','stylesheet')

        if (s.readyState){  //internet explorer
            s.onreadystatechange = function(){
                if (s.readyState == "loaded" || s.readyState == "complete"){
                    
                    s.onreadystatechange = null;

                    setTimeout( 
                        (function(){
                            
                            // remove resource from resource queue
                            console.log("remove STYLESHEET from queue....")
                            _resource_queue_remove(_stylesheet);

                        })()
                    );
                    alert("add lazy call?? _resource_load_stylesheet -> IE")
                        
                }
            };
        } else {  // other browsers
            s.onload = function(){

                 setTimeout( 
                    (function(){
                        
                        // remove resource from resource queue
                        console.log("remove STYLESHEET from queue....")
                        _resource_queue_remove(_stylesheet);

                    })()
                );
            }
        }

        document.getElementsByTagName('head')[0].appendChild(s);
    },

    /** 
    * Load a JavaScript dependency (local and tested) from the resources folder
    * 
    * @param {Object} an object with the dependency name, file name, 
    * @return {Object} a standarized object to be used in _resource_inject
    no return value. a callback is set and executed on load of script
    */
    _resource_inject = function(obj_resource){

        $.getScript(obj_resource.url, function(){

             _resource_queue_remove(obj_resource);

        });

    },

    _resource_queue_remove = function(obj_resource){

        console.log("resource to be removed from queue...->",obj_resource,_resources_queued[obj_resource.name]);

        // remove from queue object
        delete _resources_queued[obj_resource.name];

        // add the dependency as an available resource
        _resources_loaded[obj_resource.name] = obj_resource;

    },
    _resource_is_loaded = function(_resource_name){

        console.log("..IS resource loaded? ", _resource_name);
        return typeof _resources_loaded[_resource_name] === "object" ? true : false;

    },

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
        loaded : (function(){return _resources_loaded;})(),        

        queue : _resource_queue,
        queued : (function(){return _resources_queued;})(),
        
       // identify : _resource_identify,
        notify : _resource_notify,

        is_loaded : _resource_is_loaded,

        version : _resource_version_loaded
    };

}(EduVis));

/*
* TO DO:
*
* todo: look for better alternative to lazy call
* todo: will become a script object (name, path, version, link to documentation, etc.)
* todo: path will move to resources
* todo: load tool tests on script request callback
* todo: add callbacks for IE
* todo: 

/*
