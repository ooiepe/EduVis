(function (eduVis) {

    "use strict";

    var _tools_version = "0.01",

    _getObservationObj = function ( aryObservation ) {

	    // get a minimum observations object as required by tool
	    // pass an array of observations and get object of observation and all properties

	    var observations = {

	        "sea_water_temperature" : {
	            "name"        : "Seawater Temperature",
	            "label"       : "Seawater Temperature (C)",
	            "query_param" : "sea_water_temperature",
	            "value"       : "sea_water_temperature",
	            "column"      : "sea_water_temperature (C)",
	            "units"       : "&deg;C",
	            "units2"      : "Degrees Celcius",
	            "shortName"   : "Water Temp"
	        },
	        "sea_water_salinity" : {
	            "name"        : "Seawater Salinity",
	            "label"       : "Seawater Salinity",
	            "query_param" : "sea_water_salinity",
	            "value"       : "sea_water_salinity",
	            "column"      : "sea_water_salinity (psu)",
	            "units"       : "",
	            "units2"      : "",
	            "shortName"   : "Salinity"
	        },
	        "air_temperature" : {
	            "name"        : "Air Temperature",
	            "label"       : "Air Temperature (C)",
	            "query_param" : "air_temperature",
	            "column"      : "air_temperature (C)",
	            "units"       : "&deg;C",
	            "units2"      : "Degrees Celcius",
	            "shortName"   : "Air Temp"
	        },
	        "air_pressure_at_sea_level":{
	            "name"        : "Air Pressure at Sea Level",
	            "label"       : "Air Pressure at Sea Level (hPa)",
	            "query_param" : "air_pressure_at_sea_level",
	            "column"      : "air_pressure_at_sea_level (hPa)",
	            "units"       : "(hPa)",
	            "units2"      : "-hPa-",
	            "shortName"   : "Air Pressure"
	        },
	        "waves" : {
	            "name"        : "Wave Height",
	            "label"       : "Wave Height (m)",
	            "query_param" : "waves",
	            "column"      : "sea_surface_wave_significant_height (m)",
	            "units"       : "m",
	            "units2"      : "meters",
	            "shortName"   : "Wave Height"
	        },
	        "winds" : {
	            "name"        : "Wind Speed",
	            "label"       : "Wind Speed (m/s)",
	            "query_param" : "winds",
	            "column"      : "wind_speed (m/s)",
	            "units"       : "m/s",
	            "units2"      : "m/s",
	            "shortName"   : "Wind Speed"
	        }
	    };

	    var toolObservations = {};

	    // add observations for on aryObservation elements
	    $.each( aryObservation , function( index, observation ){

	        toolObservations[observation] = observations[observation];

	    });

	    return toolObservations;

	},
	_request = function () {},
	_request_Url_Timeseries_Date = function ( ndbcStation, observedProperty, eventTime ){

	    /***

	     this function will generate a properly formatted IOOS SOS request for a timeseries
	     dataset for a specific bouy, observation, and date range

	     ndbcStation
	     - Acceptable Values: see http://sdf.ndbc.noaa.gov/stations.shtml

	     observedProperty
	     - air_pressure_at_sea_level
	     - air_temperature
	     - currents
	     - sea_water_salinity
	     - sea_water_electrical_conductivity
	     - sea_floor_depth_below_sea_surface (water level for tsunami stations)
	     - sea_water_temperature
	     - waves
	     - winds

	     eventTime as string
	     - hours and minutes are acceptable
	     - properly formatted eventTime --> 2010-01-01T00:00Z/2010-01-14T00:00Z

	     eventTime as object
	     - eventTime.dateStart --> 2010-01-01
	     - eventTime.dateEnd   --> 2010-01-14

	     todo: we could add checks to ensure the station, property and time are correctly formatted

	     **/

	    var eventTimeFormatted;

	    if( typeof(eventTime) === "object" ){
	        //CONSOLE LOG//console.log("eventtime is object",eventTime);
	        eventTimeFormatted = eventTime.dateStart +  "T00:00Z/" + eventTime.dateEnd + "T00:00Z";
	    }
	    else{
	        //CONSOLE.LOG//console.log("eventtime is string",eventTime);
	        eventTimeFormatted = eventTime;
	    }

	    return "http://epe.marine.rutgers.edu/visualization/" + "proxy_ndbc.php?" +
	        "http://sdf.ndbc.noaa.gov/sos/server.php?" +
	        "request=GetObservation" +
	        "&" + "version=1.0.0" +
	        "&" + "service=SOS" +
	        "&" + "offering=urn:ioos:station:wmo:" + ndbcStation +
	        "&" + "observedproperty=" + observedProperty +
	        "&" + "responseformat=text/csv" +
	        "&" + "eventtime=" + eventTimeFormatted;

	},
	_station_List_LB = function ( stationList, delimiterElement, delimiterProperty ) {

	    // generate a station object from a text area delimited by line breaks

	    // todo: remove leading and trailing line breaks before splitting.
	    //s = s.replace(/(^\s*)|(\s*$)/gi,"");
	    //s = s.replace(/[ ]{2,}/gi," ");

	    //todo: remove usage of line breaks. use true functions whenever possible

	    var stationsObj = {}, stationAry, delimEl, delimProp;

	    if( typeof( delimiterElement ) === "undefined" ) delimEl = "\n";
	    if( typeof( delimiterProperty ) === "undefined" ) delimProp = "|";

	    if( typeof(stationList) === "string"){

	        stationAry = stationList.split( delimEl );

	    }
	    else{
	        stationAry = stationList;
	    }

	    console.log("STATION LIST: " , stationList);

	    $.each(stationAry, function ( index, station) {

	        var parts = station.split( delimProp );

	        var stationId = parts[0];
	        var stationName = parts[1];

	        stationsObj[stationId] = {
	            "name": stationId,
	            "label": stationName + " (" + stationId + ")"
	        };

	    });

	    return stationsObj;
	}

	EduVis.ioos = {
		stationListLB : _station_List_LB,
		requestUrlTimeseriesDate : _request_Url_Timeseries_Date,
		getObservationObj : _getObservationObj
	}

}(EduVis));