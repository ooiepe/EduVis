//
// EduVis.formats
//

(function (eduVis) {

    "use strict";
    
    /** 
    * Format latitude number into usable string. use North(+) and South(-)
    * 
    * @param {Number} lat Latidude to convert
    * @return {String} the input converted to readable latitude measurement
    */

    var _format_lat = function(lat) {
        //  40.350741
        return _format_number_decimal(Math.abs(lat), 4) + (+lat > 0 ? "N" : "S");
    },

    /** 
    * Format longitude number into usable string. use East(+) and West(-)
    * 
    * @param {Number} lat longitude to convert
    * @return {String} the input converted to readable longitude measurement
    */

    _format_long = function(lng) {
        //  -73.882319
        return _format_number_decimal(Math.abs(lng), 4) + (+lng > 0 ? "E" : "W");
    },

    /** 
    * Format a number to given decimal places
    * 
    * @param {Number} x the number to format
    * @param {Number} n the number of decimal places
    * @return {Number} the input rounded to the given decimal places
    */

    _format_number_decimal = function(x, n) {
        return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
    }

    eduVis.formats = {
        lat: _format_lat,
        lng: _format_long,
        numberDecimal : _format_number_decimal
    };

}(EduVis));