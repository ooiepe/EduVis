/*  *  *  *  *  *  *  
*
* EduVis.dataBrowser
*
*/

(function (eduVis) {

	"use strict";


	var _data_browser_version = "0.1",
		_db = {
			"info":"info",
			"resources-loaded":false
		},
		_cart_data = {},
		_data_browser_domid,

	_load_dependencies = function(){

		var resource = EduVis.resource;

		// load css resources
		var cssResources = [
			{	"name":"jquery-smoothness",
				"src":"http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
			},
			{
				"name":"leaflet-css",
				"src":"http://cdn.leafletjs.com/leaflet-0.6/leaflet.css"
			},
			{
				"name":"markercluster",
				"src":"resources/css/MarkerCluster.css"
			},
			{
				"name":"markercluster-default",
				"src":"resources/css/MarkerCluster.Default.css"
			}, 
			{
				"name":"module-data-browser",
				"src":"resources/css/module-dataBrowser.css"
			}, 
				
		];

		$.each(cssResources, function(i,sheet){

			console.log(i,sheet,sheet.src);

			resource.load_stylesheet(sheet);

		});

		// array of javascript resource objects
		var jsResources_local = [
			{
				"name":"leaflet-markercluster",
				"src":"leaflet.markercluster-src.js"
			}

			// {"src":"jquery-1.9.1.min.js"},
			// {"src":"jquery-ui-1.10.1.custom.min.js"},
			//"leaflet.markercluster.js"
		];
		
		$.each(jsResources_local,function(i, script){

			resource.load(script);

		});

		// external scripts to load 
		var jsResources_external = [
			{
				"name":"leaflet-js", 
				"url":"http://cdn.leafletjs.com/leaflet-0.6.2/leaflet-src.js"
			}
		];

		$.each(jsResources_external,function(i,script){
			resource.load_external();
		});

	},

	_epe_data_params = function( ){


	},

	_getObservationObj = function ( aryObservation ) {

		// get a minimum observations object as required by tool
		// pass an array of observations and get object of observation and all properties

		var observations = {

			"sea_water_temperature" : {
				"name"		: "Seawater Temperature",
				"label"	   : "Seawater Temperature (C)",
				"query_param" : "sea_water_temperature",
				"value"	   : "sea_water_temperature",
				"column"	  : "sea_water_temperature (C)",
				"units"	   : "&deg;C",
				"units2"	  : "Degrees Celcius",
				"shortName"   : "Water Temp"
			},
			"sea_water_salinity" : {
				"name"		: "Seawater Salinity",
				"label"	   : "Seawater Salinity",
				"query_param" : "sea_water_salinity",
				"value"	   : "sea_water_salinity",
				"column"	  : "sea_water_salinity (psu)",
				"units"	   : "",
				"units2"	  : "",
				"shortName"   : "Salinity"
			},
			"air_temperature" : {
				"name"		: "Air Temperature",
				"label"	   : "Air Temperature (C)",
				"query_param" : "air_temperature",
				"column"	  : "air_temperature (C)",
				"units"	   : "&deg;C",
				"units2"	  : "Degrees Celcius",
				"shortName"   : "Air Temp"
			},
			"air_pressure_at_sea_level":{
				"name"		: "Air Pressure at Sea Level",
				"label"	   : "Air Pressure at Sea Level (hPa)",
				"query_param" : "air_pressure_at_sea_level",
				"column"	  : "air_pressure_at_sea_level (hPa)",
				"units"	   : "(hPa)",
				"units2"	  : "-hPa-",
				"shortName"   : "Air Pressure"
			},
			"waves" : {
				"name"		: "Wave Height",
				"label"	   : "Wave Height (m)",
				"query_param" : "waves",
				"column"	  : "sea_surface_wave_significant_height (m)",
				"units"	   : "m",
				"units2"	  : "meters",
				"shortName"   : "Wave Height"
			},
			"winds" : {
				"name"		: "Wind Speed",
				"label"	   : "Wind Speed (m/s)",
				"query_param" : "winds",
				"column"	  : "wind_speed (m/s)",
				"units"	   : "m/s",
				"units2"	  : "m/s",
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

	/* @method dataBrowser_html
	* 
	*
	*/

	_dataBrowser_html = function(data_browser_domid){

		// place data browser in provided Dom, otherwise add to body
		var dataBrowserDom;

		// set dom element
		if(typeof data_browser_domid === "undefined"){
			
			_data_browser_domid = "data-browser-container";

			dataBrowserDom = $("<div/>",{"id": _data_browser_domid})

			// append to body since no target is supplied
			$("body").append(dataBrowserDom);

		}else{

			_data_browser_domid = data_browser_domid;

			// div should exist in html
			dataBrowserDom = $("#" + _data_browser_domid);
			
		}

		var dataBrowser_html = $("<div/>", {
			id : "data-broswer"
		});

		// html_data_browser -> hdb

		var db_header = $("<div>",{
				id : "data-browser-header"
			})
			.append(
				$("<div/>", { "class":"header-title"})
					.html("EPE Data Browser")
			),

			db_wrap = $("<div>",{
				id:"data-browser-wrap"
			}),

			db_sidebar_left = $("<div/>",{
				"id":"db-sidebar-left"
			})
			.append(

				$("<div/>",{"id":"db-data-selection-controls"})
					.append(

						$("<div/>", {
							"id":"db-select-parameters"
						})
						.html("<h3>Parameters</h3>")
					)
					.append(
						$("<div/>", {
							"id":"db-select-networks"
						})
						.html("<h3>Networks</h3>")
					)
					.append(
						
						$("<div/>", {
							"id":"db-select-times"
						})
					)
					.append(
						
						$("<div/>", {
							"id":"db-selection-search"
						})
						.append(
							$("<input/>", {
								"type":"button",
								"id":"db-btnSearch",
								"value": "search"
							})
						)
							
						.append(
							$("<div>",{"id":"db-search-progress"})		//search-progress
						)
					)
			),

			db_main_content = $("<div/>",{
				"id":"db-main-content"								/// data browser main-content
			})
			.append(
				$("<div/>", {
					"id":"db-map"
				})
			)
			.append(
				$("<div/>", {
					"id":"db-mapinfo"
				})
			),

			db_sidebar_right = $("<div/>",{
				"id":"db-sidebar-right"								/// data browser sidebar-right
			})
			.append(
				$("<div/>", {
					"id":"db-station-window"
				})
				.append(
					$("<h4/>", {
						"class":"db-title"
					})
					.html(".station.")
				)
				.append(
					$("<div/>", {
						"id":"db-station-details"
					})
				)
			)
			.append(
				$("<div/>", {
					"id":"db-data-cart-window"
				})
				.append(
					$("<h4/>", {
						"class":"db-title"
					})
					.html(".selection.")
				)
				.append(
					$("<div/>", {
						"id":"db-data-cart"
					})
				)
			),

			db_footer = $("<div/>", {
				"id":"db-footer"
			})
			.append(
				$("<div/>")
					.append(
						$("<label/>",{
							"for":"db-date-start"
						})
						.html("Start Date: ")
					)
					.append(
						$("<input/>",{
							"type":"text",
							"id":"db-date-start",
							"name":"db-date-start"			/// date_start
						})
					)
					.append(
						$("<label/>",{
							"for":"db-date-end"
						})
						.html("Start End: ")
					)
					.append(
						$("<input/>",{
							"type":"text",
							"id":"db-date-end",
							"name":"db-date-end"			/// date_end
						})
					)
					.append(
						$("<label/>",{
							"id":"db-date-details"
						})
					)
			);

		dataBrowser_html
			.append(db_header)
			.append(
				db_wrap
					.append(db_sidebar_left)
					.append(db_main_content)
					.append(db_sidebar_right)
					.append(db_footer)
			)

		dataBrowserDom.append(dataBrowser_html);

	},

	/* @method data_cart_add_param add the network,station,parameter 
	*  @param station station object from geojson.. includes geometry
	*  @param param parameter
	*/

	_cart_update = function(cart_data){

		var dc = $("#db-data-cart");

		var cart_networks = $("<div></div>");

		$.each( _cart_data , function( network, station){
			
			var cart_network = $("<div></div>")
				.addClass("db-cart-network")
				.html("<h4>"+network+"</h4>");

			var cart_network_stations = $("<div></div>")  
				.addClass("db-cart-stations");

			$.each(station, function( station, station_obj){

				var cart_network_station = $("<div></div>")
					.addClass("db-cart-station")
					.html("<h4>"+station+"</h4>");
				
				var station_params = $("<div></div>")
					.addClass("db-cart-params");

				$.each(station_obj.parameters, function(param){
					
					var station_param = $("<div></div>")
						.addClass("db-cart-param")
						.html(param)

						//mouseover of parameter item
						.hover(
							function() {
							    $( this ).append( 
							    	$("<span/>")
										.html("[X]")
										.css({
											"float":"right",
											"margin":"2px",
											"border":"1px solid red",
										})
										.addClass("db-cart-param-tools")

										.on("click", function(evt_param_remove_click){

											console.log("param remove click");
											
											// click of remove button will delete the item from the cart
											// do we want an ok prompt?

											evt_param_remove_click.stopImmediatePropagation();

											delete _cart_data[network][station]["parameters"][param];

											$(".db-cart-param-tools").remove();

											alert("_data_cart_call")
											//EduVis.dataBrowser.data_cart();
											_data_cart();
										})
								);
							},
							function() {
								$( this ).find( "span:last" ).remove();
							}
						 );

					station_params.append(station_param);

				});

				cart_network_station
					.append(station_params);

				cart_network_stations
					.append(cart_network_station);

			});

			cart_network.append(cart_network_stations);

			cart_networks.append(cart_network);

		});

		// clear and update data cart
		dc
			.empty()
		 	.append(cart_networks);

	},
	_initialize_dataBrowser = function(dom_el){

		_load_dependencies();

		console.log("initialize data browser");

		// interval delay for dependency check
		$(dom_el).append(
			dataBrowser_html(dom_el)
		);

		dataBrowser_js();

	},

	/* method dataBrowser_js
	*
	*
	*/

	dataBrowser_js = function(){

	// initialize leaflet map
		map = L.map('map', {
		    center: [38.5,-78.2],
		    zoom: 3
		});

		// set esri tile service url for ocean basemap
		var oceanBasemap_url = 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
		
			// set leaflet layer of esri ocean basmap
			oceanBasemap_layer = new L.TileLayer(oceanBasemap_url, 
		    	{ 
		    		maxZoom: 19, 
		    		attribution: 'Tile Layer: &copy; Esri' 
		    	}
			).addTo(map),

			// set resize timer for window 
			resizeTimer;

		// initialize the date picker for start date
		$( "#date_start" ).datepicker({
	      	defaultDate: "+1w",
	      	changeMonth: true,
      		changeYear: true,
		    numberOfMonths: 1,
		    showButtonPanel: true,
		    showOtherMonths: true,
      		selectOtherMonths: true,
		    dateFormat:"yy-mm-ddT00:00Z",

			onClose: function( selectedDate ) {
				$( "#date_end" ).datepicker( "option", "minDate", selectedDate );
			}
	    });

	    // initialize the date picker for end date
	    $( "#date_end" ).datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			changeYear: true,
			numberOfMonths: 1,
			showButtonPanel: true,
			showOtherMonths: true,
      		selectOtherMonths: true,
			dateFormat:"yy-mm-ddT00:00Z",
			onClose: function( selectedDate ) {
				$( "#date_start" ).datepicker( "option", "maxDate", selectedDate );
			}
	    });

//
// PARAMETERS
//

		// get the parameters from the json file.
		$.getJSON( "json/parameters.json", function( data ) {
		
			var parameters = data.parameters,
			selects = [];

			$.each( parameters, function( params, param) {

				selects.push( 
					
					$("<div/>")
						.attr("title", param.description)
						.append( 

							$("<input />")
								.attr({
									"id":"select-"+param.name,
									"type":"checkbox",
									"value":param.name
								})
						)
						.append( 

							$("<label/>")
								.attr("for","select-"+param.name)
								.html(param.name)
						)
						.append( 

							$("<a></a>")
								.attr("title", param.description)
								.attr("href","#"+param.name)
						)
				);

			});
		 
		  $( "<div/>", {
		    "class": "select-list",
		    html: selects
		  }).appendTo( "#select-parameters" );

		});

//
// networks
//

		$.getJSON( "json/networks.json", function( data ) {
		
			var networks = data.networks,
			selects = [];

			$.each( networks, function( networks, network) {

				selects.push( 
					
					$("<div/>")
						.attr("title", network.description)
						.append( 
							$("<input />")
								.attr({
									"id":"select-" + network.name,
									"type":"checkbox",
									"value":network.name
								})
						)
						.append( 

							$("<label/>")
								.attr("for","select-" + network.name)
								.html(network.name)
						)
						.append( 

							$("<a></a>")
								.attr("title", network.description)
								.attr("href","#" + network.name)
						)
				);
			});
		 
		  	$( "<div/>", {
		  		"class": "select-list",
		  		html: selects
			}).appendTo( "#select-networks" );
		});

//
// STATIONS
//

		// $.getJSON( "json/stations_geo.json", function( data ) {
		
		// 	var stationsFeatureCollection = data;

		// 	var layer = new L.GeoJSON(stationsFeatureCollection,
		// 	{
		// 	    onEachFeature: function (station, layer) {
			        
		// 	   //  	layer.bindPopup(
		// 				// station.properties.description
		// 	   //  	);

		// 	    	layer.on("click", function(){
		// 	    		//alert("Name:" + station.properties.name);

		// 	    		// network and station name are needed for the station pull
		// 	    		//http://ooi.dev/epe/data-services/stations/CO-OPS/UNI1024
			    		
		// 	    		stationWindowUpdate(station);
			    		

		//     		});
		// 		},
		// 		pointToLayer: function (station, latlng) {
		// 			return L.circleMarker(latlng, stationMarkerOptions[station.properties.network]);
		// 		}
			
	 	//   });

		// 	map.addLayer(layer);
		// 	map.fitBounds(layer.getBounds());

		// });

		//
		// WINDOW RESIZING
		//
    	$(window).bind('resize', function() {

    		clearTimeout(resizeTimer);
            resizeTimer = setTimeout(setHeight, 100);
		
		});
	
		// set the height of the map area div and other divs
		setHeight();

		// attach search to the button for now
		$("#btnSearch").on("click", searchQueue);
	};

	// add dependencies on module request

	EduVis.dataBrowser = {
		init : _initialize_dataBrowser,
		cart_update : _cart_update,
		dataBrowser_html : _dataBrowser_html,
		cart_data : function(){return _cart_data;}
	};

}(EduVis))