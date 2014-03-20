
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
