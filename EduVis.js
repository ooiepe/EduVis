//Date Compiled: 2015-02-23 12:46:45
/*  *  *  *  *  *  *  *
*
* EduVis - Educational Visualition Framework
* Ocean Observatories Initiative
* Education & Public Engagement Implementing Organization
* Written by Michael Mills, Rutgers University
*
*/

var EduVis = (function () {

  "use strict";

	var eduVis = {
		"version" : "1.0.6",
	};

	return eduVis;

}());

/* 
* Last Revision: 03/20/2014
* Version 1.0.6
* Notes:
*
*
*/
/*  *  *  *  *  *  *  *
*
* EduVis.asset
*
*/

/**
* Asset loading.. scripts and stylesheets
*
* @class asset

* to do: inline documentation 
*/

(function (eduVis) {
  
  "use strict";

  var _asset_version = "0.0.1",

  _asset_getStatus = function(a){
    if(typeof a.status === "undefined"){
      a.status = "";
    }
    return a;
  },

  _asset_isQueued = function(a){
    return _asset_getStatus(a).status == "queued";
  },

  _asset_isLoading = function(a){
    return _asset_getStatus(a).status == "loading";
  },

  _asset_isLoaded = function(a){
    return _asset_getStatus(a).status == "loaded";
  },

  _asset_hasDependency = function(a){
    if(typeof a.dependsOn !== "undefined"){
      if(a.dependsOn.length > 0){ return true; }
    }
    else{ a.dependsOn = []; }
    return false;
  },

  _asset_isDependencyLoaded = function(a){
    return _asset_isLoaded(a);
  },

  _asset_areDependenciesLoaded_byName = function(a,scripts){
    return _asset_areDependenciesLoaded(_asset_findDependencyByName(a,scripts),scripts);
  },

  _asset_areDependenciesLoaded = function(a,scripts){
   
    var dependendencies_loaded = 0;

    if(typeof a.dependsOn !== undefined)
      if(a.dependsOn.length==0) return true;

    $.each(a.dependsOn,function(i,d){
      if(_asset_isLoaded(_asset_findDependencyByName(d,scripts))){
        dependendencies_loaded++;
      } 
    });
    
    return dependendencies_loaded == a.dependsOn.length ? true : false;
  },

  _asset_areAssetsLoaded = function(scripts){
    var assets_loaded = true;
    $.each(scripts, function(a, asset){
      if(!_asset_isLoaded(asset)){
        assets_loaded = false;
      }
    });
    return assets_loaded;
  },

  _asset_findDependencyByName = function(name,scripts){
    
    var asset_selected;
    $.each(scripts, function(z, asset){

      if(asset.name == name) asset_selected = asset;
      return ( asset.name !== name);

    });
    return asset_selected;
  },

  _asset_load_script = function(sao, scripts, _tool_name){

    // is script status loaded
    if(!_asset_isLoaded(sao)){

      // is script status loading
      if(!_asset_isLoading(sao)) {
      
        var asset_path = "";
        
        sao.status = "loading";

        if(typeof sao.resource_type !== "undefined"){

          switch(sao.resource_type){
            case "system":
              asset_path = EduVis.Environment.getPathResources() + "/" + sao.url;
              break;
            case "tool":
              // default to the tools path
              asset_path = EduVis.Environment.getPathTools() + _tool_name + "/" + sao.url;
              break;
            case "external":
              asset_path = sao.url;
            default: 
              asset_path = ""; //EduVis.Environment.getPathTools() + _tool_name + "/" + sao.url;
          }
        }
        else{
          // default to tools path if resource_type is set but incorrectly
          asset_path = sao.url.indexOf("http")==0 ? sao.url : EduVis.Environment.getPathTools()  + _tool_name + "/" + sao.url;

        }
        
        //ajax request for script
        $.getScript( asset_path )
          
          .done(function( script, textStatus ) {

            sao.status = "loaded";

            // test if all assets are loaded.. if not, call asset queue
            if( !_asset_areAssetsLoaded(scripts)){
              _asset_queue_scripts(scripts,_tool_name);
            }

          })
          
          .fail(function( jqxhr, settings, exception ) {
            console.error("ajaxError:", exception);
            sao.status = "failure";
            sao.error = exception;
          });
      }
    }
  },
  _asset_load_stylesheet = function( _obj_stylesheet, _tool){

      var sheet = document.createElement("link");

      // if http, we assume external.. set stylesheet src
      // if not http, build the resource path and append the src.. append the tool name for folder

      var sheet_href = _obj_stylesheet.src.indexOf("http")==0 ? _obj_stylesheet.src : EduVis.Environment.getPathTools() + "/" + _tool + "/" + _obj_stylesheet.src; 

      sheet.setAttribute('type', 'text/css');
      sheet.setAttribute('href',  sheet_href);
      sheet.setAttribute('rel','stylesheet')

      if (sheet.readyState){  //internet explorer
          sheet.onreadystatechange = function(){
              if (sheet.readyState == "loaded" || sheet.readyState == "complete"){
                  
                  sheet.onreadystatechange = null;

                  //_resource_queue_remove(_obj_stylesheet);

                  // remove resource from resource queue
                  // setTimeout("_resource_queue_remove(_obj_stylesheet)");
                  //     (function(){                            
                  //         console.log("remove STYLESHEET from queue....")
                  //         ;

                  //     })()
                  // );
                      
              }
          };
      } else {  // other browsers
          sheet.onload = function(){

              //console.log(".....sheet onload......")
              //_resource_queue_remove(_obj_stylesheet);

              // setTimeout( "_resource_queue_remove(_obj_stylesheet)");
                  // (function(){
                      
                  //     // remove resource from resource queue
                  //     console.log("remove STYLESHEET from queue....")
                  //     _resource_queue_remove(_obj_stylesheet);

                  // })()
              //);
          }
      }

      document.getElementsByTagName('head')[0].appendChild(sheet);
  },

  _asset_load_dependency = function(sao, scripts, _tool_name){

    // does this dependency have sub dependencies
    // if not, load it
    if(!_asset_hasDependency(sao)){
      _asset_load_script(sao, scripts, _tool_name);
    }
    else{
      // sub dependencies are present
      // are the sub dependencies loaded
      // if so, load them
      if(_asset_areDependenciesLoaded(sao,scripts)){
        _asset_load_script(sao, scripts, _tool_name);
      }
      else{
        // sub sub dependencies are presnet
        $.each(sao.dependsOn, function(doi, dependencyName){
            
            // do the sub sub dependencies have additional dependencies?

            if(_asset_hasDependency(_asset_findDependencyByName(dependencyName,scripts))){
              
              // are sub sub dependencies loaded
              if(!_asset_areDependenciesLoaded(_asset_findDependencyByName(dependencyName,scripts),scripts)){
                _asset_load_dependency(_asset_findDependencyByName(dependencyName,scripts), scripts, _tool_name);
              }
              else{
                // if sub sub dependencies loaded, load it
                _asset_load_script(_asset_findDependencyByName(dependencyName,scripts), scripts, _tool_name); 
              }
            }
            else{
              _asset_load_dependency(_asset_findDependencyByName(dependencyName,scripts),sao, scripts, _tool_name);
            }
        });
      }
   }
  },

  _asset_queue_scripts = function( scripts, _tool_name){

    //console.log("ASSET QUEUE RESOURCES -> resources", scripts);

    // script asset object
    $.each(scripts, function(si, sao){
      /// does this have dependency?
      // if not, load it
      if(!_asset_hasDependency(sao)){
        _asset_load_script(sao, scripts, _tool_name);
      }
      else{
        //_asset_load_dependency(_asset_findDependencyByName(name));
        _asset_load_dependency(sao, scripts, _tool_name);
      }
    });
  },

  _asset_queue_stylesheets = function(stylesheets, _tool_name){

    //console.log("ASSET QUEUE STYLESHEETS -> stylesheets", stylesheets);

    $.each(stylesheets, function(i,v){

      //console.log(".. load the stylesheet", i, v);
      _asset_load_stylesheet( v, _tool_name );

    });

  },

  _asset_queue_assets = function(resources, _tool_name){

    _asset_queue_stylesheets(resources.stylesheets, _tool_name);
    _asset_queue_scripts(resources.scripts, _tool_name);

  };

  eduVis.asset = {

    load_script : _asset_load_script,
    queue_assets : _asset_queue_assets,
    areAssetsLoaded : _asset_areAssetsLoaded

  };

}(EduVis));

//inject into a new style via ajax
// $.ajax({
//   url:"site/test/style.css",
//   success:function(data){
//        $("<style></style>").appendTo("head").html(data);
//   }
// })

//firefox implementation for testing if styles have loaded
// var _asset_load_stylesheet = function(){
  
//  // firefox
//   var style = document.createElement('style');
//   style.textContent = '@import "' + url + '"';

//   var fi = setInterval(function() {
//     try {
//       style.sheet.cssRules; // <--- MAGIC: only populated when file is loaded
//       CSSDone('listening to @import-ed cssRules');
//       clearInterval(fi);
//     } catch (e){}
//   }, 10);  

//   head.appendChild(style);

// };
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

    	//console.log(".... P A T H .....", _path);
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

    _environment_get_path_tool = function(tool_name){

        return _environment_path_tools + "/" + tool_name;        

    },

    _environment_set_webservice = function( _path_webservice ) {

        _environment_path_webservice = _path_webservice;

    },
    _environment_get_webservice = function() {

      	//console.log("_environment_path_webservice", _environment_path_webservice);

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

        getPathTool : _environment_get_path_tool,

        setWebservice : _environment_set_webservice,
        getWebservice : _environment_get_webservice,
        
        path_webservice : _environment_get_webservice,
        
        referrer : _environment_referrer,
        name : _environment_name

    };

}(EduVis));

/*  *  *  *  *  *  *  *
*
* EduVis.formats
*
*/

/**
* A collection of reusable format functions 
*
* @class formats
*/

(function (eduVis) {

    "use strict";
    
    var _formatting_version = "0.0.1",

/** Format latitude number into usable string. use North(+) and South(-)
* 
* @method _formatting_format_lat
* @param {Number} lat The latitude coordinate to be formatted
* @return {String} The formatted latitude value
*/
    
    _formatting_format_lat = function(lat) {
        //  40.350741
        return _formatting_format_number_decimal(Math.abs(lat), 4) + (+lat > 0 ? "N" : "S");
    },

/** 
* Format longitude number into usable string. use East(+) and West(-)
* 
* @method _formatting_format_long
* @param {Number} lat longitude to convert
* @return {String} the input converted to readable longitude measurement
*/

    _formatting_format_long = function(lng) {
        //  -73.882319
        return _formatting_format_number_decimal(Math.abs(lng), 4) + (+lng > 0 ? "E" : "W");
    },

/** 
* Format a number rounded to given decimal places
* 
* @method _formatting_format_number_decimal
* @param {Number} x the number to format
* @param {Number} n the number of decimal places
* @return {Number} the input rounded to the given decimal places
*/

    _formatting_format_number_decimal = function(x, n) {
        return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
    },


/** 
* Return a d3 time format object
* 
* @method _formatting_getFormatDate
* @param {String} dateFormatType The type of format. hours, days, months, etc.
* @return {d3.time.format} The d3.time.format
*/
    _formatting_getFormatDate = function ( dateFormatType ) {

        var f;
        switch( dateFormatType ){
            case "hours": f = "%H:M"; break;
            case "days": f = "%d"; break;
            case "months": f = "%m/%y"; break;
            case "tooltip": f = "%Y-%m-%d %H:%M %Z"; break;
            case "context": f = "%m-%d"; break;
            case "data_source":f = "%Y-%m-%dT%H:%M:%SZ"; break;
            default: f = "%Y-%m-%d %H:%M %Z";
        }
        return d3.time.format(f);
    },

/** 
* Format a tool tip value
* 
* @method _formatting_tooltip
* @param {String} dateFormatType The type of format. hours, days, months, etc.
* @return {Object} A json object of various number and time formats.
*/

    _formatting_tooltip = function (){

        var tooltips = {
            "tooltip_num" : d3.format("g"),
            "tooltip_date" : d3.time.format("%Y-%m-%d %H:%M %Z"),
            "obsdate" : d3.time.format("%Y-%m-%dT%H:%M:%SZ"),
            "dateDisplay" : d3.time.format("%Y-%m-%d %H:%M %Z")
        },
        scales = {
            "datetime" : {
                "hours" : d3.time.scale().tickFormat("%H:M"),
                "days" : d3.time.scale().tickFormat("%d"),
                "months" : d3.time.scale().tickFormat("%m/%y")
            }
        }

    },
    _formatting_scales = function (){

    };

    eduVis.formats = {
        lat: _formatting_format_lat,
        lng: _formatting_format_long,
        numberDecimal : _formatting_format_number_decimal,
        version: _formatting_version,
        getFormatDate : _formatting_getFormatDate
    };

}(EduVis));

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
/*  *  *  *  *  *  *  *
*
* EduVis.utility
*
*/

/**
* The utility module...
*
* @class Utility
* @constructor
*/

(function (eduVis) {
    "use strict";

    var _utility_version = "0.0.2", 

/** Copy all properties of an object to another object
* 
* @method _utility_extend_deep
* @param {Object} parent Parent object
* @param {Object} child  object instance ID for reference
* @return {Object} object with parent and child
*/
    
    // has been replaced with jquery extend
    _utility_extend_deep = function (parent, child) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]";

        child = child || {};

        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    _utility_extend_deep(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
            return child;
        }
        return child;//?
    },

/** 
* Check if an object is empty
* 
* @method _utility_is_object_empty
* @param {Object} _obj Object to test for properties
* @return {Bool} returns true if empty, false if object contains a property
*/

    _utility_is_object_empty = function ( _obj ){

        for(var prop in _obj) {
            if(_obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    },
    
/** 
* calulate the standard deviation of an array based on key
* 
* @method _utility_standard_deviation
* @param {Object} _obj the object or array
* @param {String} _key the object property or array key
* @return {Number} standard deviation
*/
    _utility_standard_deviation = function ( _obj, _key ) {

        // basic standard deviation for the _key accessor of ary or obj array

        var sum = 0,
            diff_ary = [],
            mean,
            diff_sum = 0,
            stddev,
            len = _obj.length,
            x = 0;

        for (; x < len - 1; x++) {
            sum += _obj[x][_key];
        }

        mean = ( sum / _obj.length );

        x=0;

        for (; x < len - 1; x++) {
            diff_ary.push((_obj[x][_key] - mean) * (_obj[x][_key] - mean));
        }

        x=0;

        for (; x < diff_ary.length; x++) {
            diff_sum += diff_ary[x];
        }

        stddev = ( diff_sum / ( diff_ary.length - 1)  );

        return stddev;
    },

/** 
* calulate the linear regression of x and y
* 
* @method linearRegression
* @param {Array} x an array of x values
* @param {Array} y an array of y values
* @return {Number} linear regression object that includes slope, intercept, and r2
*/

    linearRegression = function( x, y ){

        var lr = {}, 
            n = y.length, 
            sum_x = 0, 
            sum_y = 0, 
            sum_xy = 0, 
            sum_xx = 0, 
            sum_yy = 0;

        for (var i = 0; i < y.length; i++) {
            sum_x += x[ i ];
            sum_y += y[ i ];
            sum_xy += ( x[ i ] * y[ i ] );
            sum_xx += ( x[ i ] * x[ i ] );
            sum_yy += ( y[ i ] * y[ i ] );
        }

        lr.slope =  (n * sum_xy - sum_x * sum_y ) / ( n * sum_xx - sum_x * sum_x );
        lr.intercept = ( sum_y - lr.slope * sum_x ) / n;
        lr.r2 = Math.pow( ( n * sum_xy - sum_x * sum_y) / Math.sqrt( ( n * sum_xx-sum_x * sum_x ) * ( n * sum_yy-sum_y*sum_y) ), 2);

        return lr;
    },

/** 
* creates an object with Month as Key and two digit month code "January":"01"
* 
* @method _static_months_obj
* @return {Object} object with key of Month and Value of two digit month representation
*/
    _static_months_obj = function () {

        return {
            "January"   : "01",
            "February"  : "02",
            "March"     : "03",
            "April"     : "04",
            "May"       : "05",
            "June"      : "06",
            "July"      : "07",
            "August"    : "08",
            "September" : "09",
            "October"   : "10",
            "November"  : "11",
            "December"  : "12"
        };
    },

/** 
* creates a string array of years from the start year parameter
* 
* @method getYearsToPresent
* @return {Array} string of years from given year param
*/
    _get_years_to_present = function ( yearStart ) {

        var presenetDate = new Date(),
            presenetYear = presenetDate.getFullYear(),
            yearsAry = [];

        for (var x = yearStart; x <= presenetYear; x++ ){
            yearsAry.push( x );
        }

        return yearsAry;
    },

    _svgToCanvas = function(svg_source_dom_id,canvas_dom_id){

        //load an svg snippet in the canvas
        canvg(
          document.getElementById('canvas'),
          $('<div>').append($("#vistool svg").clone()).html(), // hack to pull html contents
          { ignoreMouse: true, ignoreAnimation: true }
        );
    };


/** 
* Utility object functions exposed in EduVis
* 
**/

    eduVis.utility = {
        extend : _utility_extend_deep,
        obj_empty : _utility_is_object_empty,
        stdev : _utility_standard_deviation,
        linReg : linearRegression,
        getStaticMonthObj : _static_months_obj,
        getYearsToPresent : _get_years_to_present
    };

}(EduVis));
