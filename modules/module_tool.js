
/*  *  *  *  *  *  *  *
*
* EduVis.tool
*
* tool initialization, loading, and information access
*
*/

/**
* The tool module...
*
* @class Tool
* @constructor
*/

(function (eduVis) {

    "use strict";

    var _tools_version = "0.03",
        _tools_resource_path = "",
        __image_path__ = "img/",


/** Load the tool. Show the loading screen. Request the tool javascript via jQuery getScript
* 
* @method _tool_load
* @param {Object} obj_tool tool creation object
* @return {String} The reversed string 
*/

    _tool_load = function(obj_tool) {

        var tools = typeof eduVis.tools === "object" ? eduVis.tools : {};

        obj_tool.instance_id = typeof obj_tool.instance_id === "undefined" ? "default" : obj_tool.instance_id;
        obj_tool.tool_container_div = typeof obj_tool.tool_container_div === "undefined" ? "body" : "#"+obj_tool.tool_container_div;
        obj_tool.dom_target = obj_tool.name + "_" + obj_tool.instance_id;

        var isEdit;

        if(typeof obj_tool.isEdit === "undefined"){
            isEdit = false;
        }
        else{
            if(obj_tool.isEdit){ isEdit = true; }
            else{isEdit = false;}
        }
                        
        var tool_container_div = $(obj_tool.tool_container_div);
        //dom_target = $("#" + obj_tool.dom_target);

        var tool_container = $("<div></div>")
            .addClass("tool-container")
            .append(
                $("<div/>").attr("id", obj_tool.dom_target)
            )
            .appendTo(
                tool_container_div
            )

        // create loading div

        var loading_div = $("<div/>")
            .addClass("loading")
            .attr("id", obj_tool.dom_target + "_loading")
            .append(
                $("<div></div>")
                    .html(
                        "<p><em>Loading... " + obj_tool.name + "</em><p>"
                    )
            )
            .append(
                $('<img src="' + EduVis.Environment.getPathResources() + 'img/loading_small.gif" />')
            )
            .appendTo(
                tool_container_div
            )

        // Ajax request for tool javascript source. on success, queue up the tool resources. If an instance id is provided, call Configuraiton.request_instance.
        $.getScript( EduVis.Environment.getPathTools() + obj_tool.name + "/" + obj_tool.name + '.js', function() {
            
            //c onsole.log("....tool notify....")

            var isControlEdit;

            EduVis.tool.notify( {"name":obj_tool.name,"tool_load":"complete"});

            if(isEdit){
                //alert("is edit.. show controls.")
                EduVis.asset.queue_assets(EduVis.tool.tools[obj_tool.name].resources.controls, obj_tool.name);
            }
        
            EduVis.asset.queue_assets(EduVis.tool.tools[obj_tool.name].resources.tool, obj_tool.name);
            
            if(obj_tool.instance_id !== "default"){

                // request the tool instance
                EduVis.configuration.request_instance(obj_tool);

                // note: tool initialized in request_instance function.
            }else{
                //load default instance
                EduVis.tool.init( obj_tool );              
            }

        });
    
    },

/** placeholder for Tool Loading when/if we want to isolate all tool loading functions
* 
* @method _tool_load
* @param {Object} _obj_tool tool creation object
* @return {null} 
*/

    _tool_loading = function(_obj_tool){
    },

/** function trigged when the tool loading is complete
* 
* @method _tool_loading_complete
* @param {Object} _obj_tool tool creation object
* @return {null} 
*/
    _tool_loading_complete = function(_obj_tool){
        
        //fade out loading div for a specific tool instance
        var div_loading = _obj_tool.dom_target + "_loading";

        if(typeof _obj_tool.objDef.onLoadComplete === "function"){
            _obj_tool.objDef.onLoadComplete();
        }
        
        $('#' + div_loading).fadeOut();

    },

/** notifcations for a specic tool. currently just console logging the entire object. * could be developed to bring pop up notificaiton or alert notification to tools
* 
* @method _tool_notify
* @param {Object} _obj_notify a notify object. 
* @return {null} 
*/    
    _tool_notify = function ( _obj_notify ){

        //console.log("tool notify", _obj_notify);
        
    },

/** check to see if all the dependencies of a tool are loaded 
* 
* @method _tool_is_ready
* @param {Object} _obj_tool a tool object. 
* @return {Boolean} 
*/  
    _tool_isReady = function( _obj_tool ){

        // test if all assets are loaded, if so, the tool is ready
        if(EduVis.asset.areAssetsLoaded(_obj_tool.resources.tool.scripts)){
            return true;
        }
    },

    _tool_is_ready = function( _obj_tool ){

        // test if all resources have been loaded for the tool
        var r = _tool_find_resources(_obj_tool),
            i = 0,
            scripts = r.tool.scripts,
            stylesheets = r.stylesheets,
            scripts_length = scripts.length,
            stylesheets_length = stylesheets.length;

        for (;i<scripts_length; i++) {

            // the the loaded resource a script object. if so, its loaded
            if(typeof EduVis.resource.loaded[scripts[i]] !== "object"){
                return false;
            }
        }

        i=0;
        for (;i<stylesheets_length; i++) {

            // is the stylesheet an object, if so, its loaded
            if(typeof EduVis.resource.loaded[stylesheets[i]] !== "object"){
                return false;
            }
        }

        //_tool_loading_complete(_obj_tool);
        return true;

    },

/** initialize the tool. override configuration with appropriate instance configuration
* 
* @method _tool_init
* @param {Object} _obj_tool a tool object. 
* @return {null}
*/ 
    _tool_init = function(obj_tool){

        var name = obj_tool.name,
            Tool = EduVis.tool.tools[name],
            isEdit;

            Tool.objDef = obj_tool;
            
        if(typeof obj_tool.isEdit === "undefined"){
            isEdit = false;
        }
        else{
            if(obj_tool.isEdit){ isEdit = true; }
            else{ isEdit = false; }
        }

        //c onsole.log("--> Tool", Tool);
        //c onsole.log("--> Tool Name", name, "tool object", obj_tool);

        Tool.dom_target = obj_tool.dom_target;
        
        if(typeof Tool === "object"){

            if( _tool_isReady( Tool ) ){

                var instance_id = obj_tool.instance_id;

                // not a very elegant solution to deal with multiple instances with the same instances configuration
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

                // instance
                // EduVis.tool.instances[name][instance_id]
                //" + name, instance_id, obj_tool.instance_config);

                // initialize tool instance
                EduVis.tool.instances[name][instance_id].init_tool();

                // test to see if the tool is in edit mode
                if(isEdit){
                    EduVis.tool.instances[name][instance_id].init_controls("#vistool-controls");
                }

            }
            else{
                
                // This tool is not ready to load. Still waiting on some dependencies..

                setTimeout((function(){

                    // rescursive delayed call.. 1 seconds.. to tool initiation
                    if(EduVis.utility.halt){
                        console.log("..EduVis Halted..");
                    }else{

                        _tool_init(obj_tool);
                    }

                }),1000);
            }
        }
        else{
            alert("function: _tool_init.... ..no tool object..");
        }
    },

/** output the controls of a tool for custom configuration
* 
* @method _tool_customize
* @param {String} tool_name the name of the tool to customize
* @param {String} instance_id the instance ID of the tool
* @param {String} target_div the div where the output will be placed
* @return {null}
*/
    _tool_customize = function( tool_name, instance_id, target_div ){

        var tool = EduVis.tool.instances[tool_name][instance_id],
            divToolEditor,
            divControls,
            el_btn;

            divToolEditor = $("<div></div>")
                .addClass("ToolEditor");

            divControls = $("<div></div>")
                .addClass("tool-control")

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

        $("#" + target_div)
            .append(divToolEditor);

    },

/** returns the tool version
* 
* @method _tool_version
* @return {String} The tool version
*/
    _tool_version = function(){
        return _tool_version;
    },

/** returns a bare tool object structure
* 
* @method _tool_base_template
* @return {Object} _object a bare tools object structure
*/    
    // todo: add constructor to tool base
    // _tool_base_template = function(){

    //     return {

    //         "name" : "_undefined_tool_name_",
    //         "description" : "__undefined_description_",
    //         "url" : "helpfile does not exist",
    //         "instance":"", 

    //         "version" : "",
    //         "authors" : [],        
    //         "resources" : 

    //             "tool":{

    //                 "scripts_local" : [],
    //                 "scripts_external" : [],
    //                 "stylesheets_local" : [],
    //                 "stylesheets_external" : [],
    //                 "datasets" : [] 
    //             }
    //         }

    //         "configuration" : {},
    //         "instance_configuration" : {},
    //         "controls" : {},
    //         "data" : {},
    //         "div_target" : "__undefined_target__",
    //         "tools" : {},
    //         "instances" : {}

    //     };
    // },

/** Request the tool listing via getJSON and display thumbnails and links for the tools.
* 
* @method _tool_listing
* @param _target_div the dom element where the generated thumbnail list should appear
* @param callback callback function to trigger on append

* @return {null}  
*/
    _tool_listing = function(_target_div){

        var domTarget = (typeof _target_div === "undefined") ? "body" : "#" + _target_div; 

        $.getJSON( EduVis.Environment.getPathTools() + "tools.json" , function(tools) {

            // set up dom element and add title
            var toolsHeading = $("<div></div>")
                .append(
                    $("<h1></h1>",{
                        "html" : tools.name,
                        "title" : "Tools as of " + tools.date
                    })
                        .append(
                            $("<small></small>").html(" Version " + tools.version)
                        )
                )
            
            var toolsListing = $("<ul></ul>",{"class":"thumbnails"});

            // add a thumbnail for each tool... classed as thumbnail
            $.each(tools.tools, function(id, tool){

                var toolName = tool.name.replace(/ /g,"_"),
                    
                    thumb = $("<li></li>",{"class": "thumbnail span3"})
                    .css({"height":"280px"})
                    .append(

                        $("<div></div>", {
                            "title" : tool.evId + " - " + tool.name
                        })
                            .append(
                                $("<img />",{
                                    "src" : EduVis.Environment.getPathTools() + __image_path__ + tool.thumbnail
                                })
                            )
                            .append(
                                $("<h5></h5>",{
                                    "html" : tool.evId + " - " + tool.name
                                })   
                            )
                            .on("click", function(){
                                
                                EduVis.tool.load(
                                    {
                                        "name" : toolName
                                    });

                            })
                    )

                toolsListing.append(thumb);
            });

            $(domTarget).attr("class","container-fluid")
                .append(toolsHeading)
                .append(toolsListing)


        });

    };


    eduVis.tool = {
        resource_path : _tools_resource_path,
        load : _tool_load,
        init : _tool_init,
        version : _tool_version,
        notify : _tool_notify,
        is_ready : _tool_is_ready,
        //find_resources : _tool_find_resources,
        //template : _tool_base_template,
        customize : _tool_customize,
        load_complete : _tool_loading_complete,
        tools : {},
        instances : {},
        tool_list : _tool_listing
    };

}(EduVis));
