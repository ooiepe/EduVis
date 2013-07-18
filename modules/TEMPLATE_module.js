/*  *  *  *  *  *  *  *
*
* EduVis.NAME_OF_MODULE
*
*/

(function (eduVis) {

    "use strict";

    /** 
    * This is where the function actions are defined
    * 
    * @param {Object} define the function paramenter(s) here ( in this case an object ).. be specific as to its usage 
    * @return {Object} define the returned value here, in this case an Object.. be specific
    */

    var _function_name = function() {

      return "this is cool";
      	// do cool things
    },

    /** 
    * this function does very cool things
    * 
    * @param {String} a name of something cool
    * @param {String} a name of something very cool
    * @return {String} name of something cool and somethign very cool 
    */

    _function_name_B = function(cool_thing, very_cool_thing){

    	// do very cool things;

    	return cool_thing + "is cool, but " + very_cool_thing + " is very cool";
    };

    eduVis.NAME_OF_MODULE = {
        functionA: _function_name,
        functionB: _function_name_B
    };

}(EduVis));
