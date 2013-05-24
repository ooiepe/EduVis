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

	var eduVis = {version : "0.0.1"};

	eduVis.test = function () {


	};

	return eduVis;

}());

// some simple helper functions
var cE = function(el){return document.createElement(el);}
var gE = function(el){return document.getElementById(el);}

/* 
* Last Revision: 05/07/13
* Version 1.0.3
* Notes:
*
*
*//*  *  *  *  *  *  *  
*
* EduVis.configuration
*
*/

(function (eduVis) {

    "use strict";

    /** * Reverse a string 
    * 
    * @param {String} input String to reverse 
    * @return {String} The reversed string 
    */

    var _config_parse = function( ) {

        // Load a control

    },

    _config_validate = function( ) {

        // Preview a control
    }


    eduVis.configuration = {
        parse: _config_parse,
        validate: _config_validate
    };


}(EduVis));

/*  *  *  *  *  *  *  
*
* EduVis.controls
*
*/

(function (eduVis) {

    "use strict";

    var _control_load = function () {
    },

    _control_create = function (tool, id, _obj_control) {

        // tool type - ie. textbox, colorpicker, etc - must exist in switch

        // standarization of tool controls, including advanced tools ie. datepicker

        // todo: editor,viewer should both reference this function

        var control = _obj_control,
        lbl, input, ctrl;

        switch (control.type) {

            case "textbox":

                lbl = $("<label />")
                    .attr({
                        'for': id
                    })
                    .html(control.description);

                input = $("<input />")
                    .attr({
                        'id': id,
                        'type': 'textbox',
                        'value': control.default_value,
                        'title': control.tooltip,
                        'maxlength': typeof (control.maxlength) === "undefined" ? "" : control.maxlength
                    })
                    //.addClass("span2")
                    .on("change", function () {
                        tool.customization_update();
                    });

                ctrl = $("<div></div>")
                    .addClass("control")
                    .append(lbl)
                    .append(input);

                break;

            case "textarea":
                lbl = $("<label />")
                    .attr({'for':id})
                    .html(control.label);

                var textarea = $("<textarea></textarea>")
                    .attr({
                        'id':id,
                        'type':'textarea',
                        'value':control.default_value,
                        //'title':control.tooltip,
                        'rows':5
                    })
                    .change(function(){
                        self.customization_update();
                    });

                ctrl = $("<div></div>")
                    .addClass("control")
                    .append(lbl)
                    .append(textarea);

                break;

            case "dropdown":


                lbl = $("<label />")
                    .attr({
                        'for': id,
                        'title': control.tooltip
                    })
                    .html(control.description);

                // create select element and populate it
                var select = $("<select></select>")
                    //.addClass("span3")
                    .attr({
                        "id": id
                    }).change(function () {
                        tool.customization_update();
                    });

                console.log("control dropdown: options:",control.options);
                // add drop down names and value pair options from contols "options" object
                $.each(control.options, function (option) {

                    var opt = control.options[option];

                    $(select)
                        .append($('<option></option>')
                        .val(opt.value)
                        .html(opt.name));
                });

                // set the default value based on the controls default value element
                // todo: override with custom config value
                select.val( control.default_value );


                ctrl = $('<div></div>');
                //.addClass("control");

                if (control.nolabel !== "true" ){
                    ctrl.append( lbl );
                }

                ctrl.append( select );

                break;

            case "checkbox":

                lbl = $("<label />").attr({
                    'for': id,
                    'title': control.tooltip
                }).html(control.description);

                input = $("<input />")
                    .attr({
                        'id': id,
                        'type': 'checkbox',
                        //'value':control.default_value,
                        'title': control.tooltip,
                        'maxlength': typeof (control.maxlength) === "undefined" ? "" : control.maxlength
                        //'onclick':function(){alert("test");}
                    });

                if ( control.selected ) {
                    $(input).attr({
                        'checked': 'checked'
                    });
                }

                ctrl = $("<div></div>")
                    .addClass("control")
                    .append(lbl)
                    .append(input);

                break;

            case "svg":

                ctrl = $("<svg></svg>");

                break;

            case "datepicker":

                lbl = $("<label />")
                    .attr({
                        'for': id + "_dp",
                        'title': control.tooltip
                    })
                    .html(control.description);

                input = $("<input />")
                    .addClass("input-small")
                    .attr({
                        "id": id,
                        "type": "text"
                    })
                    .addClass("datepicker")
                    .val(control.default_value)
                    .on("change", function () {
                        tool.customization_update();
                    });

                // set jquery datepicker settings
                $( input ).datepicker({
                    "dateFormat": "yy-mm-dd",
                    changeMonth: true,
                    changeYear: true,
                    showButtonPanel: true
                })
                    .on("changeDate", function () {
                        tool.customization_update();
                    });

                ctrl = $("<div></div>")
                    .addClass("control ctlhandle")
                    .append(lbl)
                    .append(input);

                break;


            case "colorpicker":


                // find the textbox in the control and init colorpicker
                lbl = $("<label />")
                    .attr({
                        'for': id + "_cp",
                        'title': control.tooltip
                    })
                    .html(control.description);

                input = $("<input />")
                    .attr({
                        "id": id,
                        "type": "text"
                    })
                    .addClass("readonly")
                    .val(control.default_value)
                   // .css({"float":"left !important"});

                var el_i = $("<i></i>")
                    .css({
                        "background-color": control.default_value,
                    });

                var el_span = $("<span></span>")
                    .addClass("add-on")
                    .append(el_i);

                var el_div = $("<div></div>")
                    .addClass("input-append color")
                    .attr({
                        "id": id + "_cp",
                        "data-color": control.default_value,
                        "data-color-format": "hex"
                    })
                    .append(input).append(el_span);

                $(el_div).colorpicker()
                    .on("changeColor", function (cp) {
                        $("#" + id).val(cp.color.toHex());
                        //$("#" + id).val(tool.current_config[id] = cp.color.toHex())
                        //self.updateJSON();
                        tool.customization_update();
                    });

                ctrl = $("<div></div>")
                    .addClass("control ctlhandle")
                    .append(lbl)
                    .append(el_div);

                break;


            case "selection": 
                console.log("tool control.. SELECTION");

                lbl = $("<label />")
                    .attr({
                        'for': id + "-dropdown",
                        'title': control.tooltip
                    })
                    .html( control.description );

                // add dropdown..

                var el_selectionDropdown = self.toolControl(tool, id+"-dropdown", control );

                var el_button = $("<a></a>")
                    .addClass("btn next")
                    .html("Add")
                    .on("click",function(){ alert("clicked");} );

                var el_selections = $("<ul></ul>")
                    .attr("id", id + "observations-selected");

                $.each( control.selectedItems, function(  item, itemObj ){

                        el_selections.append(
                            $("<li></li>").html( itemObj.name )
                        );
                    }
                );
                // add button next to dropdown..
                // event handler for click of button.. remove option from dropdown

                $(el_selectionDropdown).val( control.default_value );

                var template = self.uiBootstrap( id, "fluidContainer",
                    {
                        rows:[
                            {
                                cols:[12],
                                colControls:[ el_lbl ]
                            },
                            {   cols:[ 10, 2 ],
                                colControls:[ el_selectionDropdown , el_button]

                            },
                            {
                                cols:[12],
                                colControls:[ el_selections ]
                            }
                        ]

                    }
                );

                console.log(template);

                ctrl = $(template)
                    .addClass("control");
        //                .append(lbl)
        //                .append(el_selectionDropdown)
        //                .append(el_button)
        //                .append(
        //                    $("<div></div>").append( el_selections )
        //                )


                break;


            case "slider":

                //todo: slider control should be moved here from EV3/4

                break;

            default:
                // empty div if nothing is passed
                ctrl = $("<div></div>");
                break;
        }

        if ( control.popover ) {
            // now attach the popover to the div container for the control if set
            $(ctrl).attr({
                'rel': 'popover',
                'title': control.label,
                'data-content': control.tooltip
            }).popover();

        }

        return ctrl;


    },

    _control_preview = function() {

        // Preview a control

    };

    eduVis.controls = {
        load : _control_load,
        preview : _control_preview,
        create : _control_create
    };


}(EduVis));

/*  *  *  *  *  *  *  *
*
* EduVis.formats
*
*/

(function (eduVis) {

    "use strict";
    
    /** 
    * Format latitude number into usable string. use North(+) and South(-)
    * 
    * @param {Number} lat Latidude to convert
    * @return {String} the input converted to readable latitude measurement
    */
    var _formatting_version = "0.0.1",

    _formatting_format_lat = function(lat) {
        //  40.350741
        return _formatting_format_number_decimal(Math.abs(lat), 4) + (+lat > 0 ? "N" : "S");
    },

    /** 
    * Format longitude number into usable string. use East(+) and West(-)
    * 
    * @param {Number} lat longitude to convert
    * @return {String} the input converted to readable longitude measurement
    */

    _formatting_format_long = function(lng) {
        //  -73.882319
        return _formatting_format_number_decimal(Math.abs(lng), 4) + (+lng > 0 ? "E" : "W");
    },

    /** 
    * Format a number to given decimal places
    * 
    * @param {Number} x the number to format
    * @param {Number} n the number of decimal places
    * @return {Number} the input rounded to the given decimal places
    */

    _formatting_format_number_decimal = function(x, n) {
        return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
    },
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
        };

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
        _resource_path = "resources/js/", // path to javascript resources
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
            "url" : ( obj_resource.resource_path || _resource_path ) + obj_resource.resource_file_name,
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

        console.log("IS resource loaded? ", _resource_name);
        console.lg("typeof _resources_loaded[_resource_name] === object", typeof _resources_loaded[_resource_name] === "object");

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
/*  *  *  *  *  *  *  *
*
* EduVis.utility
*
*/

(function (eduVis) {
    "use strict";

    /** 
    * Copy all properties of an object to another object
    * 
    * @param {Object} parent target object where to copy properties
    * @param {Object} child source object from where to copy properties
    * @return {Object} parent object is returned if needed
    */

    var _utility_version = "0.0.1", 
    
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
    },

    /** 
    * Check if an object is empty
    * 
    * @param {Object} Object to test for properties\
    * @return {Bool} returns true or false
    */

    _utility_is_object_empty = function ( obj ){

        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    },

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
    linearRegression = function( x, y ){

        var lr = {}, n = y.length, sum_x = 0, sum_y = 0, sum_xy = 0, sum_xx = 0, sum_yy = 0;

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
    };


    /** 
    * Utility object functions exposed to EduVis
    * 
    **/

    eduVis.utility = {
        extend: _utility_extend_deep,
        obj_empty : _utility_is_object_empty,
        stdev : _utility_standard_deviation,
        linReg:linearRegression
    };

}(EduVis));
