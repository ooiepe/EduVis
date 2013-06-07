/*  *  *  *  *  *  *  
*
* EduVis.configuration
*
*/

(function (eduVis) {

    "use strict";

    /** * Parse a configuration. 
    * 
    * @param {String} tool name for reference
    * @param {String} tool instance ID for reference
    * @return {String} The reversed string 
    */

    var _config_instance_ws = EduVis.parameters.local_resource_url + "custom_instance.php",

    _config_parse = function( tool_reference ) {

        // Load a configuration
        var self = this,
            ref = EduVis.tool.tools[tool_reference].configuration;

        console.log("...Tool Reference...");
        console.log(tool_reference);
        console.log(ref);

    },

    _config_validate = function( ) {

        // Preview a configuration in new window?.. in div?



    },

    _config_parse_instance_config = function(obj_tool){

        // get reference to instance..
        // overide instance "settings" with configuration.
        var tool_name = obj_tool.name,
            tool_instance = obj_tool.instance_id,
            instance_configuration;

        // todo: fallback for lack of JSON parsing..
        instance_configuration = JSON.parse(obj_tool.str_instance_configuration);

        obj_tool.instance_configuration = instance_configuration;

        console.log("...instance configuration...");
        console.log(instance_configuration);

        //var EduVis.tool.instances[instance_id] = EduVis.tool.tools[]

        // now init tool w/ custom instance configuraiton
        EduVis.tool.init( obj_tool, instance_configuration );

        //EduVis.tool.instances[tool_name][tool_instance].init();
        //EduVis.tool.instance_init( obj_tool );

    },
    _config_export = function( tool_reference, instance_reference ){

        // 
        console.log(EduVis.tool.tools[tool_reference].configuration);


    },
    _config_settings_update = function(){

    },
    _config_request_instance = function(obj_tool){

        var xmlhttp,
            tool_name = obj_tool.name,
            tool_instance = obj_tool.instance_id;

        if (window.XMLHttpRequest){
            // IE7+, FF, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        }
        else{
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                
                console.log(".. Instance Requested ...");
                console.log(".. Instance Configuration: " + xmlhttp.responseText);
                obj_tool.str_instance_configuration = xmlhttp.responseText;

                _config_parse_instance_config(obj_tool);

            }else{

                console.log(".. Error with Instance Request ..");
            }
        }
        xmlhttp.open("GET", _config_instance_ws + "?iid=" + tool_instance, true);
        xmlhttp.send();
    };

    eduVis.configuration = {
        parse: _config_parse,
        validate: _config_validate,
        tool: _config_parse,
        instance: _config_parse_instance_config,
        request_instance : _config_request_instance
    };


}(EduVis));
