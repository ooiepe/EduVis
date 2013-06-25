
/*  *  *  *  *  *  *  *
*
* EduVis.tool
*
* tool initialization, loading, and information access
*
*/

(function (eduVis) {

    "use strict";

    var _tools_version = "0.02",
        _tools_path = "tools/", // full url can be used
        _tools_resource_path = "",

    _tool_load = function(obj_tool) {

        var tools = typeof eduVis.tools === "object" ? eduVis.tools : {};

        obj_tool.instance_id = typeof obj_tool.instance_id === "undefined" ? "default" : obj_tool.instance_id;
        obj_tool.dom_target = obj_tool.name + "_" + obj_tool.instance_id;



        console.log("----Tool target --> ", obj_tool.dom_target);

        var dom_target = $("#" + obj_tool.dom_target);

        // creat tool container at dom_target
        if(dom_target.length == 0){

            $('body').append(
                $("<div></div>")
                    .addClass("tool-container")
                    .append("<div></div>")
                        .attr("id", obj_tool.dom_target)
            )
        }
        else{


        }

        // create loading div

        var loading_div = $("<div></div>")
            .addClass("loading")
            .attr("id", obj_tool.dom_target + "_loading")
            .append(
                $("<div></div>")
                    .html(
                        "<h1>Educational Visualization</h1>"+
                        "<h2>"+ obj_tool.name+"</h2>"
                    )
            )
            .append(
                $('<img src="resources/img/loading_small.gif" />')
            )
            .appendTo(
                $("#"+obj_tool.dom_target)
            )

        // converted to jquery get script..
        // load the tool source... further tool initilization will 
        $.getScript( _tools_path + obj_tool.name + "/" + obj_tool.name + '.js', function() {
            
            console.log("....tool notify....")
            EduVis.tool.notify( {"name":obj_tool.name,"tool_load":"complete"});

            console.log("....tool queue....");
            EduVis.resource.queue( EduVis.tool.tools[obj_tool.name].resources, obj_tool.name);

            console.log("....tool instance....");
            
            //if(typeof obj_tool.instance_id !== "undefined"){
            if(obj_tool.instance_id !== "default"){
                
                console.log("....tool instance request....");
                EduVis.configuration.request_instance(obj_tool);

                // note: tool initialized in request_instance function.
            }else{

                console.log("....tool instance init default....");
                EduVis.tool.init( obj_tool );
            }

        });
    
    },

    _tool_loading = function(_obj_tool){



    },
    _tool_loading_complete = function(tool){


        //remove loading div
        var div_loading = tool.dom_target + "_loading";
        
        $('#' + div_loading).fadeOut();

        //loading_div.removeChild(document.getElementById(div_name));

    },
    _tool_notify = function ( _obj_notify){

        console.log("tool notify", _obj_notify);
        
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

    _tool_init = function(obj_tool){ //, instance_config) {

        // need to set new target div here....

        var name = obj_tool.name,
            Tool = EduVis.tool.tools[name];

            Tool.objDef = obj_tool;

        console.log("--> Tool", Tool);
        console.log("--> Tool Name", name, "tool object", obj_tool);

        Tool.dom_target = obj_tool.dom_target;
        
        if(typeof Tool === "object"){

            if( _tool_is_ready(Tool) ){

                var instance_id = obj_tool.instance_id;

                // not a very elegant solution to dealing with multiple instances with the same instances configuration
                if(typeof EduVis.tool.instances[name] === "object" ){

                    if(typeof EduVis.tool.instances[name][instance_id] === "object"){

                        instance_id = instance_id + "_" + ($(EduVis.tool.instances[name]).length + 1);

                        obj_tool.instance_id = instance_id;

                        EduVis.tool.instances[name][instance_id] = Tool;

                    }
                    else{
                        EduVis.tool.instances[name][instance_id] = Tool;
                    }
                }
                else{
                
                    EduVis.tool.instances[name] = {};
                    EduVis.tool.instances[name][instance_id] = Tool;
                }

                // update instance configuration 
                $.extend(EduVis.tool.instances[name][instance_id].configuration, obj_tool.instance_config);

                console.log(" .... Instance! ....");
                console.log(EduVis.tool.instances[name][instance_id]);
                console.log("Initializing " + name + " with instance_id " + instance_id + " and instance:", obj_tool.instance_config);

                // initialize tool instance
                EduVis.tool.instances[name][instance_id].init();
            }
            else{
                
                console.log("Tool Not ready to load. Still waiting on some dependencies..");

                setTimeout((function(){

                    // rescursive delayed call.. 1 seconds.. to tool initiation
                    if(EduVis.utility.hault){
                        console.log("..EduVis Haulted..");
                    }else{

                        _tool_init(obj_tool);
                    }

                }),1000);
            }
        }
        else{
            alert("..no tool object..")
        }
    },

    _tool_customize = function( tool_name, instance_id, target_div ){

        var tool = EduVis.tool.instances[tool_name][instance_id],
            divToolEditor,
            divControls
            el_btn;


            divToolEditor = $("<div></div>").addClass("ToolEditor");
            divControls = $("<div></div>").addClass("tool-control")

            console.log("...TOOL CUSTOMIZE....")
            console.log("tool->",tool);
        // get target div

        // create a div and write out all controls for editing a specific tool configuration file
        // the tool does not need to be loaded as an instance, but must be loaded into object


        // a button will be clicked and it will refresh the tool.. 
        // div with controls will be refreshed on tool updates or when "refresh" is clicked.

        // test if tool has any controls
        if(typeof tool.controls !== "object"){

            divToolEditor.append("<p>This tool does not have an configurable properties..</p>")

        }
        else{

            // Add each control to the specified div
            $.each(tool.controls, function (index, control) {
                
                divControls.append(
                    EduVis.controls.create(tool,"config-"+index, control)
                    //instance.evtool.toolControl(instance,"config-"+index, control)
                );

            });

            divToolEditor.append(divControls);

             // Now draw an update button that will redraw the instance
            el_btn = $('<button type="button">Redraw Visualization</button>')
                .addClass("btn pull-right")
                .click( function () { _tool_redraw(tool_name, instance_id); })
                .appendTo(divToolEditor);
        }
                
        // todo: add instance 

        $("#" + target_div).append(divToolEditor);

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
            "tools" : {},
            "instances" : {}

        };
    };

    eduVis.tool = {
        resource_path : _tools_resource_path,
        load : _tool_load,
        init : _tool_init,
        version : _tool_version,
        notify : _tool_notify,
        is_ready : _tool_is_ready,
        find_resources : _tool_find_resources,
        template : _tool_base_template,
        customize : _tool_customize,
        load_complete : _tool_loading_complete,
        tools : {},
        instances : {}
    };

}(EduVis));
