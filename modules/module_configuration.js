/*  *  *  *  *  *  *  
*
* EduVis.configuration
*
*/

(function (eduVis) {

    "use strict";

    var _config_instance_ws = EduVis.parameters.local_resource_url + "custom_instance.php",

    /** * Parse a configuration. 
    * 
    * @param {String} tool name for reference
    * @param {String} tool instance ID for reference
    * @return {String} The reversed string 
    */

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

    _config_export = function( tool_reference, instance_reference ){

        console.log(EduVis.tool.tools[tool_reference].configuration);

    },
    _config_settings_update = function(){

    },
    _config_set_state = function(){



    },
    _config_get_state = function(){


    },

    //todo: comment function
    /** 
    * make external request to instance configuration web service
    * 
    * @obj_tool {Object} the tool creation object
    * @return {} empty
    */

    _config_request_instance = function(obj_tool){

        var xmlhttp,
            tool_name = obj_tool.name,
            tool_instance = obj_tool.instance_id;

        // request instnace configuration
        $.getJSON( _config_instance_ws + "?iid=" + tool_instance, function(data){
                
            // set tool object instance configuration
            obj_tool.instance_config = data;

            // initialize tool with requested configuration
            EduVis.tool.init( obj_tool );
        });
    };


    eduVis.configuration = {
        parse: _config_parse,
        validate: _config_validate,
        tool: _config_parse,
        //instance: _config_parse_instance_config,
        request_instance : _config_request_instance
    };

}(EduVis));
