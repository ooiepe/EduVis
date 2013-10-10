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

