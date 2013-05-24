
/*  *  *  *  *  *  *  *
*
* EduVis.tool
*
* tool initialization, loading, and information access
*
*/

(function (eduVis) {

    "use strict";

    var _tools_version = "0.01",
        _tools_path = "tools/",

    _tool_load = function(obj_tool) {


        var tools = typeof eduVis.tools === "object" ? eduVis.tools : {};

        //todo: move to function.. 
        // SET LOADING SPINNER..

        _tool_loading(obj_tool);

        
        // supports all recent browsers, ie7,8,9
        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState){  //internet explorer
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    
                    // todo: look for better alternative to lazy call
                    // now load dependencies

                    setTimeout((function(){

                        alert("put code here");

                    }));
                }
            };
        } else {  // other browsers
            script.onload = function(){
                
                // todo: look for better alternative to lazy call
               // setTimeout(EduVis.dependencies.notify(obj_tool.name));

                setTimeout((function(){
                
                    EduVis.tool.notify( {"name":obj_tool.name,"tool_load":"complete"});
                    
                    //EduVis.resource.queued();
                    console.log(".. now queue all tool resources ..");

                    EduVis.resource.queue( EduVis.tool.tools[obj_tool.name].resources, obj_tool.name);

                    EduVis.tool.init( obj_tool.name );

                }));
            };
        }

        script.src = _tools_path + obj_tool.name + "/" + obj_tool.name + '.js';
        document.body.appendChild(script);
    
    },

    _tool_loading = function(_obj_tool){

        //alert(obj_tool div_target);
        var div_name = _obj_tool.name + "_" + _obj_tool.instance + "_loading";

        var div_loading = document.createElement("div");
        div_loading.setAttribute("id", div_name);

        var img_loading = document.createElement("img");
        img_loading.src = "resources/img/loading_small.gif";

        var div_title = document.createElement("div");
        div_title.innerHTML = "<h1>Educational Visualization</h1><h2>"+_obj_tool.name+"</h2>";

        var div_target = document.getElementById(_obj_tool.target_div);
        // a.style.height = "300px";
        // a.style.width = "300px";
        // a.style.backgroundColor = "red";

        div_loading.appendChild(div_title);
        div_loading.appendChild(img_loading);
        div_target.appendChild(div_loading);

    },
    _tool_loading_complete = function(_obj_tool){

        //remove loading div
        var div_name = _obj_tool.name + "_" + _obj_tool.instance + "_loading";
        var loading_div = document.getElementById(_obj_tool.div_target);

        console.log("Name:",div_name, _obj_tool)
        loading_div.removeChild(document.getElementById(div_name));

    },
    _tool_notify = function ( _obj_notify){

        console.log("tool notify", _obj_notify)
    },

    _tool_is_ready = function( _obj_tool ){

        console.log("Tool Obj", _obj_tool);

        // test if all resources have been loaded for the tool
        var r = _tool_find_resources(_obj_tool),
            i = 0,
            scripts = r.scripts,
            stylesheets = r.stylesheets,
            scripts_length = scripts.length,
            stylesheets_length = stylesheets.length;

            console.log("RRRRR", r);

        for (;i<scripts_length; i++) {

            if(typeof EduVis.resource.loaded[scripts[i]] !== "object"){

                console.log("returned FALSE! -> ", scripts[i])
                return false;
            }
        }

        i=0;
        for (;i<stylesheets_length; i++) {

            if(typeof EduVis.resource.loaded[stylesheets[i]] !== "object"){
                console.log("returned FALSE! -> ", stylesheets[i])
                return false;
            }
        }

        //_tool_loading_complete(_obj_tool);
        return true;

    },
    _tool_find_resources = function(_obj_tool){

        var resources = _obj_tool.resources,
            scr_ext = resources.scripts_external,
            scr_ext_length = scr_ext.length,

            scr_local = resources.scripts_local,
            scr_local_length = scr_local.length,

            sty_ext = resources.stylesheets_external,
            sty_ext_length = sty_ext.length,

            sty_local = resources.stylesheets_local,
            sty_local_length = sty_local.length,

            scripts = [],
            stylesheets = [],
            i = 0, j=0, k=0, l=0,
            _tool_resources = {
                "scripts" : [],
                "stylesheets" : []
            },
            scripts = _tool_resources.scripts,
            stylesheets = _tool_resources.stylesheets,

            script_count = 0,
            style_count = 0;

        for(; i<scr_ext_length; i++){

            scripts[script_count] = scr_ext[i].name;
            script_count+=1;

        }

        for(; j<scr_local_length; j++){
            scripts[script_count] = scr_local[j].name;
            script_count+=1;
        }

        for(; k<sty_ext_length; k++){

            stylesheets[style_count] = sty_ext[k].name;
            style_count+=1;
        }

        for(; l<sty_local_length; l++){
            stylesheets[style_count] = sty_local[l].name;
            style_count+=1;
        }

        return _tool_resources;

    },

    _tool_init = function(_tool_name) {

        console.log("Tool Name", _tool_name);
        console.log(typeof EduVis.tool.tools[_tool_name]);
        
        var Tool = EduVis.tool.tools[_tool_name];

        console.log("_tool_init on Tool: " + Tool.name, Tool)
        
        if(typeof Tool === "object"){


            if( _tool_is_ready(Tool) ){

                //Tool.resources.loaded = true;

                console.log("Tool Initialization >> Tool:" + Tool.name );

                EduVis.tool.tools[_tool_name].init();

            }
            else{
                console.log("Tool Not ready to load. Still waiting on some dependencies..");

                setTimeout((function(){

                    // rescursive delayed call.. 2 seconds.. to tool initiation

                    if(EduVis.utility.hault){
                        console.log("..EduVis Haulted..");
                    }else{

                        _tool_init(_tool_name);
                    }

                }),2000);
            }
        }
        else{
            alert("no tool object..")
        }

        //?  : false;

        return;
    },

    _tool_version = function(){
        return _tool_version;
    },
    
    // todo: add constructor to tool base
    _tool_base_template = function(){

        return {

            "name" : "_undefined_tool_name_",
            "description" : "__undefined_description_",
            "url" : "helpfile does not exist",
            "instance":"", 

            "version" : "",
            "authors" : [],        
            "resources" : {

                "scripts_local" : [],
                "scripts_external" : [],
                "stylesheets_local" : [],
                "stylesheets_external" : [],
                "datasets" : [] 
                
            },

            "configuration" : {},
            "instance_configuration" : {},
            "controls" : {},
            "data" : {},
            "div_target" : "__undefined_target__",
            "tools" : {}

        };
    };

    eduVis.tool = {
        load: _tool_load,
        init: _tool_init,
        version: _tool_version,
        notify: _tool_notify,
        is_ready: _tool_is_ready,
        find_resources: _tool_find_resources,
        template: _tool_base_template,
        tools: {}
    };

}(EduVis));
