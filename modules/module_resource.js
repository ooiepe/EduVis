/*  *  *  *  *  *  *  
*
* EduVis.resource
*
*/

(function (eduVis) {

    "use strict";

    // test if has own property
    console.dir(EduVis);

    /** 
    * Check if the required base resource are loaded. If they are loaded, check the version.
    * 
    */
    
    var _resource_version = "0.0.1",
        _resource_path = "resources/", // path to javascript resources
        _resource_path_js = _resource_path + "/js/",
        _version_jquery = "1.9.1", // latest tested and supported version of jquery
        _version_d3 = "3.0.8";

    /** 
    * Original funciton to test if base javascript libs were loaded. 
    * tests for jquery and sets callback to load lib if not present
    * 
    * @return none
    */

    var _resource_identify = function (  ) {

        // test for base resource

        // Identify resource for the tool.
        if (typeof window["jQuery"] !== 'undefined') {  
            
            // jquery version is in global scope. how to add with specific version and EduVis scope?
            if( jQuery.fn.jquery != _version_jquery){

                _resource_load_local( { 
                    "name" : "jquery-" + _version_jquery,
                    "resource_file_name" : "jquery-1.9.1.min.js",
                    "validation" : "jQuery",
                    "Global" : "jQuery",
                    "version": "1.9.1"
                });
            }

        }
        else{

            // jquery has not been loaded, so load the version as defined above
                _resource_load_local( { 
                    "name": "jquery-" + _version_jquery,
                    "resource_file_name" : "jquery-1.9.1.min.js",
                    "validation" : "jQuery",
                    "Global" : "jQuery",
                    "version": "1.9.1"
                });

        }
    },

    /** 
    * Queue all tool resources.. local and external scripts and styles into loading queue
    * set callbacks for all resources

    * @return none
    */

    _resource_queue = function( _obj_resources, _tool_name){

        console.log("realll?", _obj_resources);

        var d = _obj_resources,
            scr_local = d.scripts_local,
            scr_external =  d.scripts_external,
            scr_local_length = scr_local.length,
            scr_external_length = scr_external.length,

            sty_local = d.stylesheets_local,
            sty_local_length = sty_local.length,

            sty_ext = d.stylesheets_external,
            sty_ext_length = sty_ext.length,

            i=0, ii=0, j=0, k=0,
            queued = _resources_queued,
            q = queued[_tool_name];
            
        //debugConsole console.log( "scr_external scripts", scr_external, "scr_local scripts",  scr_local);

      
        // scr_local scripts, if any
      
        q = typeof q !== "object" ? {} : q;
        // if(typeof q !== "object"){
        //     q = {};
        // }

        // add scr_local files to queue using toolname as placement
        for(; i<scr_local_length; i+=1){
            
            // add
            var local = scr_local[i];

            q[local.name] = local;
            q["applies_to_tool"] = _tool_name;

            console.log("..internal queued..", i, q)
        };

        //i=i-1;
        i = scr_local_length>0 ? scr_local_length-1:0;

        // todo: review usage of non iterator values in for loop
        var ext, name;
        for(; i<scr_external_length; i+=1){
           
            ext = scr_external[i],
            name = ext.name;

           q[name] = ext; 
           q[name]["applies_to_tool"] = _tool_name;

           console.log(" .. scr_external queued ..", i, q[name])
        } 

        for(;j<sty_local_length;j+=1){
            var local = sty_local[j];
            //_resource_load_stylesheet( sty_local[j] );
             q[local.name] = local; 
             q[local.name]["applies_to_tool"] = _tool_name;
        }

        for(;k<sty_ext_length;k+=1){
            //_resource_load_stylesheet( sty_ext[k] );
            var ext = sty_ext[k],
            name = ext.name;

             q[name] = ext;
             q[name]["applies_to_tool"] = _tool_name;
        }

        // load queued resources
        i = 0;
        for(;i<scr_local_length;i+=1){
    
            // load each scr_local resource
            _resource_load_local( scr_local[i]);

            console.log(".. scr_local scr_local resource .. " + i + " - " , scr_local[i]);

        }
       
        for(;ii<scr_external_length;ii+=1){

            // load each scr_external resource
            _resource_load_external( scr_external[ii]);

            console.log(".. load scr_external resource .. " + ii + " - " , external[ii]);

        }

        j=0; k=0;
         // // scr_external scripts, if any
        for(;j<sty_local_length;j+=1){

            console.log("Load Stylesheet", sty_local[j]);
            _resource_load_stylesheet( sty_local[j] );
        }

        for(;k<sty_ext_length;k+=1){
            console.log("Load Stylesheet", sty_ext[k]);
            _resource_load_stylesheet( sty_ext[k] );
        }

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

        // supports all recent browsers, ie7,8,9
        var script = document.createElement("script"),
        attribs = obj_resource.attributes;

        // add attributes. type is always present.. additional attributes if provided d3 charset, for example
        script.setAttribute("type","text/javascript");

        for(var attrib in attribs){
            if (attribs.hasOwnProperty(attrib)) {
                script.setAttribute(attrib,attribs[attrib]);
            }
        }

        if (script.readyState){ //internet explorer
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    
                    script.onreadystatechange = null;
                    alert("...IE CALLBACKS...")
                        
                }
            };
        } else {  // other browsers
            script.onload = function(){

                setTimeout( 
                    (function(){
                        
                        // remove resource from resource queue

                        _resource_queue_remove(obj_resource);

                    })()
                );
            }
        }

        script.src = obj_resource.url;
        document.body.appendChild(script);
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
        console.lg("....typeof _resources_loaded[_resource_name] === object", typeof _resources_loaded[_resource_name] === "object");

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
        
        identify : _resource_identify,
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
