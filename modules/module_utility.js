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
