/*  *  *  *  *  *  *  
*
* EduVis.Configuration
*
*/

/**
@namespace EduVis
**/

/**
* The configuration module...
*
* @class Configuration
* @constructor
*/


(function (eduVis) {

    "use strict";

/**
* Path to the instance configuration web service. This will ultimatly be adapted as a Drupal component.
* 
* @property _config_instance_ws
* @type {string}
* @default ""
*/

    var 
    //_config_instance_ws = EduVis.Environment.path + "custom_instance.php",

/** Parse a Configuration file from the tools default configuration
* 
* @method _config_parse
* @param {String} tool name for reference
* @param {String} tool instance ID for reference
* @return {String} The reversed string 
*/

    _config_parse = function( _tool_reference ) {

        // Load a configuration
        var self = this,
            ref = EduVis.tool.tools[tool_reference].configuration;

        console.log("...Tool Reference...");
        console.log(_tool_reference);
        console.log(ref);

        return true;

    },

/**
* Validate a json configuration
*
* @method _config_validate
* @param {Object} _config Tool Configuration
* @param {Object} _tool Tool Reference
* @return {Boolean} Returns true on success
*/
    _config_validate = function( _config, _tool) {

        // this Tool
        // Preview a configuration in new window?.. in div?

        return true;

    },

/**
* Writes the configuration object of an instance to the console and returns the configuration object.
*
* @method _config_export
* @param {String} _tool_reference The tool name
* @param {String} _instance_reference The instance name or id
* @return {Boolean} Returns true on success
*/
    _config_export = function( _tool_reference, _instance_reference ){

        var instanceConfiguration = EduVis.tool.instances[_tool_reference][_instance_reference].configuration;
        console.log(".. Instance Configuration .. ", instanceConfiguration);
        return instanceConfiguration;
    },

/**
* Update the configuration settings of an instance.
*
* @method _config_settings_update
* @param {String} _tool_reference The tool name
* @param {String} _instance_reference The instance name or id
* @param {Object} _configuration_object

* @return {Boolean} Returns true on success
*/
    _config_settings_update = function(_tool_reference, _instance_reference, _configuration_object){

        EduVis.tool.instances[_tool_reference][_instance_reference].configuration;

    },
    _config_set_state = function(){

    },
    _config_get_state = function(){

    },

/**
* Triggers Ajax request for an instance configuratino of a tool creation object. 
* This is triggerd when a tool instance id is provided on the load tool call... EduVis.tool.load().
* On a successful Ajax response, the tool is initialized with EduVis.tool.init( _tool_object ) 
*
* @method _config_request_instance
* @param {Object} _tool_object The tool object

* @return {null} 
*/
    _config_request_instance = function(_tool_object){

        var self = this,
            toolName = _tool_object.name,
            toolInstance = _tool_object.instance_id;

        // request instance configuration
        $.getJSON( EduVis.Environment.path_webservice + "?iid=" + toolInstance, function(data){
                
            // set tool object instance configuration
            _tool_object.instance_config = data;

            // initialize tool with requested configuration
            EduVis.tool.init( _tool_object );
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
