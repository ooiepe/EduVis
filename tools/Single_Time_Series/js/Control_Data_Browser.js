/*

 * OOI EPE - Data Browser Control
 * for use with Time Series Tools - STS, STSM, DTS
 *
 * Revised 9/16/2014
 * Written by Michael Mills, Rutgers University
 
*/

(function (eduVis) {

  "use strict";

  var tool,
    control = {

    "name":"Data_Browser_Control",
    "version" : "0.2.4",
    "description" : "This controls allows the user to select Time Series Datasets via a map and search criteria interface. The search is supported by EPE Data Services.",
    "authors" : [
      {
        "name" : "Michael Mills",
        "association" : "Rutgers University",
        "url" : "http://rucool.marine.rutgers.edu"
      }
    ],

    "layer_station_markers" : {},
    "timerSearchProgress" : {},
    "timerSearchQueue" : {},
    "stationMarkerOptions" : {

      "NDBC" : {
          radius: 6,
          fillColor: "#ff0000",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      },
      "CO-OPS" : {
          radius: 6,
          fillColor: "#ffff00",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      }
    },

    "styleStationHighlight" : { 
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.6
    },

    "styleStationClicked" : { 
        weight: 8,
        color: '#ff0000',
        dashArray: '',
        fillOpacity: 0.7
    },

    "styleStationReset" : {
        radius: 6,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
      
  };

  control.init = function(parent_tool){

      tool = parent_tool;

     // place data browser in provided Dom, otherwise add to body
      var dataBrowserDom = $("<div/>",{"id": "data_browser"}),

      dataBrowser_html = $("<div/>", {
        id : "data-broswer"
      }),

      // html_data_browser -> hdb

      db_header = $("<div>",{
        id : "data-browser-header"
      }),

      db_wrap = $("<div>",{
        id:"data-browser-wrap",
        "css":{
          "height":"600px"
        }
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
            .html(
              $("<h5>Parameters</h5>")
              .css({"border-bottom":"1px solid #CCCCCC"})
            )
          )
          .append(
              $("<div/>", {
                "id":"db-select-networks"
              })
              .html(
                $("<h5>Networks</h5>")
                .css({"border-bottom":"1px solid #CCCCCC"})
              )
          )
          .append(

            $("<div/>", {
                "id":"db-select-dates"
            })
            .html(
              $("<h5>Date Range</h5>")
              .css({"border-bottom":"1px solid #CCCCCC"})
            )
            .append(
              $("<div/>")
              .append(
                $("<select/>",{
                    "id":"db-dates-dropdown"
                })
                .on("change", function(evt){

                  $("#db-dates-realtime").hide();
                  $("#db-dates-archived").hide();

                  $("#db-dates-"+evt.target.value).show();

                  control.apply_button_update("modified");

                })
                .append('<option value="realtime">Real Time</option>')
                .append('<option value="archived">Archived</option>')
              )
            )
            .append(
              $("<div/>", {
                "id":"db-dates-archived"
              })
              .css({"display":"none"})
              .append(

                $("<div/>")
                .append(
                  $("<label />")
                  .attr({
                      'title':  "The Start date.",
                  })
                  .html("<b>Start Date<b>")
                )
                .append(

                  $("<input />")
                  .attr({
                    "id": "db-date-start",
                    "name":"db-date-start",
                    "type": "text",
                  })
                  .addClass('datepicker')
                  .datepicker({
                      "dateFormat": "yy-mm-dd",
                      "changeMonth": true,
                      "changeYear": true,
                      "onClose" : function(d,i){
                        $("#date_range_label").remove();

                        if(control.verify_date_range()){

                          control.apply_button_update("modified");
                          $("#db-btn_search").removeClass("disabled");

                        }
                        else{

                          $("#db-btn_search").addClass("disabled");

                          $("<label />")
                            .attr("id","date_range_label")
                            .html("Please select a date range that is one year or less.")
                            .css({"color":"red"})
                            .insertBefore('#db-selection-search');
                        }

                      },
                      "defaultDate": tool.configuration.start_date

                  })
                  .val(tool.configuration.start_date)
                )
              )
              .append(
                $("<div/>")
                .append(
                  $("<label />")
                  .attr({
                      'title':  "The End date.",
                  })
                  .html("<b>End Date<b>")
                )
                .append(

                  $("<input />")
                  .attr({
                      "id": "db-date-end",
                      "name":"db-date-end",
                      "type": "text",
                  })
                  .addClass('datepicker')
                  .datepicker({
                      "dateFormat": "yy-mm-dd",
                      "changeMonth": true,
                      "changeYear": true,
                      "onClose" : function(d,i){
                          $("#date_range_label").remove();

                          if(control.verify_date_range()){

                            control.apply_button_update("modified");
                            $("#db-btn_search").removeClass("disabled");
                          }
                          else{

                            $("#db-btn_search").addClass("disabled");

                            $("<label />")
                              .attr("id","date_range_label")
                              .html("Please select a date range that is one year or less.")
                              .css({"color":"red"})
                              .insertBefore('#db-selection-search');
                          }
                      },
                      "defaultDate": tool.configuration.end_date
                  })
                  .val(tool.configuration.end_date)
                )
              )
            )
          )
          .append(
            $("<div/>", {
              "id":"db-dates-realtime"
            })
            .css({"display":"none"})
            .append(
              $("<div/>")
              .append(
                $("<label />")
                .attr({
                    'title':  "Days Prior.",
                })
                .html("<b>Days Prior<b>")
              )
              .append(
                
              )
              .append(

                $("<input />")
                .attr({
                  "id": "db-reatltime_days",
                  "name":"db-reatltime_days",
                  "type": "text",
                })
                .addClass('small')
                .val(tool.configuration.realtime_days)
                .on("change", function(){
                  control.apply_button_update("modified");
                })
              )
              .append(
                $("<div/>")
                .append(
                  $("<select/>")
                  .on("change",function(evt){
                    if(evt.target.value !== "Predefined")
                      $("#db-reatltime_days").val(evt.target.value);
                  })
                  .append($('<option>Predefined</option>'))
                  .append($('<option value="1">24 hours</option>'))
                  .append($('<option value="7">1 Week</option>'))
                  .append($('<option value="30">1 Month</option>'))
                )
              )
            )
          )
          .append(
          $("<div/>", {
              "id":"db-selection-search"
          })
          .append(
            $("<div/>", {
                "id":"db-select-networks"
            })
            .html(
              $("<h5>&nbsp;</h5>")
                .css({"border-bottom":"1px solid #CCCCCC"})
            )
          )
          .append(
            $("<div/>", {
                "id":"db-btn_search",
            })
            .addClass("btn")
            .html("Search")
            .on("click", function(){
              $("#db-search-progress").show();
              control.searchQueue();
            })
          )
          .append(
            $("<div>",{"id":"db-search-progress"})
              .hide()
            //search-progress
          )
        )
      ),

      db_main_content = $("<div/>",{
        "id":"db-main-content"                              /// data browser main-content
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
        "id":"db-sidebar-right"                             /// data browser sidebar-right
      })
      .append(
        $("<div/>", {
          "id":"db-station-window"
        })
        .append(
          $("<h5/>", {
            "class":"db-title",
            "css":{
                "border-bottom":"1px solid #CCCCCC"
            }
          })
          .html("Station Details")
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
          $("<h5/>", {
            "class":"db-title",
            "css":{
                "border-bottom":"1px solid #CCCCCC"
            }
          })
          .html("Selected Station List")
        )
        .append(
          $("<div/>", {
            "id":"db-data-cart"
          })
        )
      )
       .append(
          $("<div/>", {
            "id":"db-data-cart-apply",
          })
          .append(
            $("<div/>", {
              "id":"btn-apply",
              "type":"button",
              "class":"btn btn-medium disabled",
            })
            .css({
              "width": "100px",
              "margin-right":"10px"
            })
            .html('Apply') //icon-exclamation-sign
            .on("click", control.apply_button_press)
          )
          .append(
            $('<img src="'+ EduVis.Environment.getPathTool(tool.name) + '/img/check_green.png"' + ' id="apply-check" style="display:none" />')
          )   
      ),

      db_footer = $("<div/>", {
          "id":"db-footer"
      });

      dataBrowser_html
        .append(db_header)
        .append(
          db_wrap
          .append(db_sidebar_left)
          .append(db_main_content)
          .append(db_sidebar_right)
          .append(db_footer)
        );

      dataBrowserDom
        .append(dataBrowser_html)
        .appendTo("#vistool-controls");

      // set default configuration options

      $("#db-dates-"+tool.configuration.date_type).show();

      $("#db-dates-dropdown").val(tool.configuration.date_type);

      var height = $(dataBrowserDom).height(),
      header = $("#db-header").height(),
      footer = $("#db-footer").height(),
      mainHeight = height - header - footer - 2,
      winStationHeight = (mainHeight/2-60), // now compensate for Apply button original->(mainHeight/2-20)
      winCartHeight = winStationHeight,
      winApplyHeight = 60;

      $("#data-browser-wrap").height(mainHeight);
      $("#db-map").height(mainHeight);

      $("#db-station-details").height(winStationHeight);
      $("#db-data-cart").height(winStationHeight);
      $("#db-data-cart-apply").height(winApplyHeight);

    // END DataBrowser HTML

    //--//

    // BEGIN dataBrowser JavaScript

    // initialize leaflet map
      control.map = L.map('db-map', {
        center: [38.5,-78.2],
        zoom: 3
        // ,noWrap : true
      });

      // set esri tile service url for ocean basemap
      var oceanBasemap_url = 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
      
      // set leaflet layer of esri ocean basmap
      oceanBasemap_layer = new L.TileLayer(oceanBasemap_url,{ 
        maxZoom: 19, 
        attribution: 'Tile Layer: &copy; Esri' 
      })
      .addTo(control.map),

      // set resize timer for window 
      resizeTimer;

      control.map.on('viewreset', function(){
       if(control.searchActive === true){
          control.searchData();
        }
      });
      
      control.map.on('dragend', function(){
        if(control.searchActive === true){
          control.searchData();
        }
      });

//
// PARAMETERS
//

    // get the parameters from the json file.
     //$.getJSON( "http://epedev.oceanobservatories.org/timeseries/parameters", function( data ) {
      $.getJSON( "http://epedata.oceanobservatories.org/parameters", function( data ) {

        control.parameters = data.parameters;
        
        //var parameters = this.db_data.parameters,
        var parameters = data.parameters,
        selects = [];

        $.each( parameters, function( params, param) {

          selects.push( 
            $("<div/>")
              .attr("title", param.description)
              .append( 
                $("<input />")
                .attr({
                  "id":"db-select-"+param.name,
                  "type":"checkbox",
                  "value":param.name
                })
              )
              .append( 
                $("<label/>")
                .attr("for","db-select-"+param.name)
                .html(control.parameter_clean_name( param.name ))
              )
              .append( 
                $("<a></a>")
                .attr("title", param.description)
              )
          );

        });
       
        $( "<div/>", {
          "class": "db-select-list",
          "html": selects
        })
        .css({
          "max-height":"140px",
          "overflow-y":"scroll"
        })
        .appendTo( "#db-select-parameters" );

        // load data cart after parameters definition is loaded
        control.dataCart();
     });

// //
// // networks
// //

      //$.getJSON( "http://epedev.oceanobservatories.org/timeseries/networks", function( data ) {
        $.getJSON( "http://epedata.oceanobservatories.org/networks", function( data ) {

        control.networks = data.networks;

        //{ "networks": [ { "id": "ndbc", "name": "NDBC", "description": "National Data Buoy Center", "url": "http://sdf.ndbc.noaa.gov/" }, { "id": "co-ops", "name": "CO-OPS", "description": "Center for Operational Oceanographic Products and Services", "url": "http://opendap.co-ops.nos.noaa.gov/" } ] }
        
        //var networks = this.db_data.networks,
        var networks = data.networks,
        selects = [];

        $.each( networks, function( networks, network) {

          selects.push( 
            $("<div/>")
            .attr("title", network.description)
            .append( 
              $("<input />")
              .attr({
                  "id":"db-select-" + network.name,
                  "type":"checkbox",
                  "value":network.name
              })
            )
            .append( 

              $("<label/>")
              .attr("for","db-select-" + network.name)
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
          "class": "db-select-list",
          html: selects
        })
        .appendTo( "#db-select-networks" );

      });

      // check any parameters that currently exist in the data cart

      // attach search to the button for now
      //$("#db-btn_search").on("click", control.searchQueue);

      //control.dataCart();

};

   /** 
      verify the date range is only 1 year
    */

    control.verify_date_range = function(){

      var el_date_start = $("#db-date-start"),
          el_date_end = $("#db-date-end"),
          
          date_start = new Date(el_date_start.val()),
          date_end = new Date(el_date_end.val()),

          date_start_ms = date_start.getTime(),
          date_end_ms = date_end.getTime(),

          oneday_ms = 1000 * 60 * 60 * 24,

          diff_ms = Math.abs(date_start_ms - date_end_ms),
          diff_days = Math.floor(diff_ms/oneday_ms);
        
          if(diff_days > 366){  
            return false;
          }else{
            return true;
          }
          // if(diff_days > 365){
          //   // is the start date or end date a leap year?
          //   if( (new Date(date_start.getFullYear(), 1, 29).getMonth() == 1) || (new Date(date_end.getFullYear(), 1, 29).getMonth() == 1) ){
          //     if(diff_days > 366){
          //       return false;
          //     }
          //     else{
          //       return true;
          //     }
          //   }
          //   return false;
          // }
          // else{
          //   return true;
          // }
    };

    /**
     * ???
     * Not currently used?
     */
    control.processDateTime = function(){

      // get reference to date elements
      var el_date_start = $("#db-date-start"),
          el_date_end = $("#db-date-end"),
          el_date_label = $("#db-date-details");

      //console.log("el_date_start: " +el_date_start.val());
      //console.log("el_date_end: " +el_date_end.val());
    };

    /**
     * Perform delayed station search
     * Attached to search button in init_controls 
     */
    control.searchQueue = function(){

        var self = this,
            time_segments = 5,
            time_overall = 2000,
            time_interval = time_overall/time_segments,
            time_progress_interval = 100/time_segments;
        
        // turn on the progress bar and set value to 25
        $( "#db-search-progress" )
        .progressbar({"enabled":true, value: time_progress_interval});
        
        // clear interval
        clearInterval(control._timerSearchProgress);

        // set the interval timer to increment 25. time is 3/4 second
        control._timerSearchProgress = setInterval(function(){

          var progressbar = $( "#db-search-progress" ),
              progressValue = progressbar.progressbar("value");

          progressbar.progressbar({"value": progressValue + time_progress_interval});

        }, time_interval);

        clearTimeout(control._timerSearchQueue);
        control._timerSearchQueue = setTimeout(function(){
            
          // tun the search timer
          control.searchData();

          $( "#db-search-progress" ).progressbar( "value",0).hide();

          clearInterval(control._timerSearchProgress);

        }, time_overall);

    };

    /**
     * Station search
     * Called by searchQueue
     */


    control.searchData = function (){

        if(control.map.hasLayer(control.layer_station_markers)){
            control.map.removeLayer(control.layer_station_markers);
        }

        //var search_stations_query = "http://epedev.oceanobservatories.org/timeseries/" + control.stationSearch();

        var search_stations_query = "http://epedata.oceanobservatories.org/" + control.stationSearch();


        $.getJSON( search_stations_query, function(geodata){

            //console.log(geodata);

            var stationsFeatureCollection = geodata,

            layer_stations = new L.GeoJSON(stationsFeatureCollection,
            {
                onEachFeature: function (station, station_feature) {
                    
               //   layer.bindPopup(
                        // station.properties.description
               //   );
                    //console.log(station.properties.network + " - " + station.properties.name, station);

                    //station_feature.setAttribute("title","testing");

                    station_feature.on({

                        "click": function(e){
                            //alert("Name:" + station.properties.name);

                            // network and station name are needed for the station pull
                            //http://ooi.dev/epe/data-services/stations/CO-OPS/UNI1024
                            
                            //todo: show station being clicked.. epedev-232
                            var layer = e.target;
                            layer.setStyle(tool.styleStationClicked);

                            setTimeout(function(){layer.setStyle(tool.styleStationReset);},2000);

                            control.stationWindowUpdate(station_feature);

                        },

                        // highlight the layer path when the station is hovered
                        "mouseover": function(e){

                            var layer = e.target;

                            //console.log("dev: need to hightlight station in station window, if present");

                            layer.setStyle(control.styleStationHighlight);

                            if (!L.Browser.ie && !L.Browser.opera) {
                                layer.bringToFront();
                            }

                        },

                        // remove the station highlight when mouse leaves
                        "mouseout": function(e){

                            var layer = e.target;
                
                            layer.setStyle(control.styleStationReset);

                            if (!L.Browser.ie && !L.Browser.opera) {
                                layer.bringToFront();
                            }

                        }
                    });
                },
                pointToLayer: function (station, latlng) {
                    //console.log(tool.stationMarkerOptions[station.properties.network]);

                    return L.circleMarker(latlng, control.stationMarkerOptions[station.properties.network]);
                }
            
            });

            control.layer_station_markers = new L.markerClusterGroup();
            
            control.layer_station_markers
                .addLayer(layer_stations);
                //.addLayers([if we want to add multiple layers]);
            
            //this.map.addLayer(this.layer_station_markers);
            control.map.addLayer(control.layer_station_markers);

        });

        control.searchActive = true;
    };

    /**
     * Add a network,station,parameter to the data cart
     * Attached to Add button in Station Window
     * @param station station object from geojson, includes geometry
     * @param param parameter
     */
    control.data_cart_add_param = function(station_obj, param){

      var network, station;

      if(typeof(station_obj.feature)==="object"){
        network = station_obj.feature.properties.network;
        station = station_obj.feature.properties.name;
      }
      else{
        network = station_obj.network;
        station = station_obj.station;
      }
      //console.log("data_cart_add_param", station, network, station_obj, param);

      control.dataCartAddParam(network,station,param);

    };
    
    /**
     * Adds a network,station,parameter to the configuration
     * Called by data_cart_add_param and stationWindowUpdate_fromCart
     */
    control.dataCartAddParam = function(network,station,param){
        
      var dc = tool.configuration.data_cart,
        dc_index = tool.station_get_index(station),
        dc_obj,
        param_obj = {};

      param_obj[param] = {};

      // if station does not exist, add to array, otherwise update parameter
      if(dc_index === false){

        dc_obj = {
          "network" : network,
          "station" : station,          
          "custom_name" : network + " " + station,
          "parameters" : param_obj
        };

        dc.push(dc_obj);
      }
      else{
        $.extend(true, dc[dc_index]["parameters"], param_obj);
      }
      
      // update apply button
      control.apply_button_update("modified");
    };

    /**
     * Extracts the bounds of the current map view 
     * Called by stationSearch
     * @param {object} reference to global map
     * @return {String} the map bounding box string "lng_min,lat_min,lng_max,lat_max" - bbox 
     */
    control.searchMapBounds = function(_map){
      // example return bbox string "-73.970947265625,40.54720023441049,-71.28753662109375,41.88592102814744"

      return _map.getBounds().toBBoxString();
    };

    /** 
     * Set a style of the feature to prove interaction
     * Not currently used?
     * @param {event click object e} 
     */
    control.highlightFeature = function(){
        var layer = e.target;

        //console.log(layer);

        layer.setStyle({ // highlight the feature
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.6
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
        //map.info.update(layer.feature.properties); // Update infobox
    };

    /**
     * Identify checked networks or parameters
     * Called by stationSearch
     * @param selectionType network or parameter
     * generate comma separated list of selected parameters from:  parameters,networks
     */
    control.getSelections = function(selectionType){

        var selections = [];
        // find selected parameters
        $("#db-select-" + selectionType + " .db-select-list input:checked")
        .each(
          function(i, selected){
              selections.push($(selected).val());
          }
        );

        return selections.join(",");
    };

    /*
     * Update the station window div with station details when a dot is clicked
     * Attached to map dots in searchData
     *   @param station station object
     */
    control.stationWindowUpdate = function(station_obj){

      var network, station;

      //console.log("Station Object", "type: " + typeof(station_obj.properties), station_obj);

      if(typeof(station_obj.feature)==="object"){

        //if(typeof(station_obj.feature.properties)==="object"){
          network = station_obj.feature.properties.network;
          station = station_obj.feature.properties.name;
        //}
      }
      else{
        network = station_obj.network;
        station = station_obj.station;
      }
      
        var station_dom_id = "station-" + network + "-"+station;

        if( $("#" + station_dom_id).length > 0){

            // item already exists in DOM, no need for request, just set visibility of div
            //console.log("station already present")

        }
        else{

            // $("#station_window_dropdown")
            // .append(
            //  $("<option/>")
            //      .val(station.properties.network + "|" + station.properties.name)
            //      .html(station.properties.network + " - " + station.properties.name)
            // )

            // coordinates -- + "(" + station.geometry.coordinates[0] + ", " + station.geometry.coordinates[1] + ")"
            // request station from data-services

            $.getJSON( "http://epedata.oceanobservatories.org/stations/" + network + "/" + station, function( data ) {
                // get reference to drop down
                // if exists, check for presence of current network/station

                /*
                  // Example Station Response
                  {
                    "id": "259",
                    "network": "NDBC",
                    "name": "44056",
                    "description": "NDBC Station 44056 - Duck FRF, NC",
                    "longitude": "-75.714",
                    "latitude": "36.2",
                    "start_time": "2009-05-14 15:45:00",
                    "end_time": "9999-01-01 00:00:00",
                    "parameters": [
                      "mean_wave_period",
                      "peak_wave_period",
                      "significant_wave_height",
                      "water_temperature",
                      "wave_to_direction"
                    ]
                  }

                */

                // move to function to add to station dropdown.. also add to object to track additions / subtractions
                var dom_station_window = $("<div></div>")
                  .attr({
                      "id" : station_dom_id
                  });

                  $.each(data.parameters, function(parameters, param){
                    
                    //console.log("param",param);

                    dom_station_window.append( $("<div/>") 
                        
                        .append( 

                            $("<label/>")
                                .attr("for","select-" + station_dom_id + "_" + param)
                                .html(control.parameter_clean_name(param))
                        )
                        .append( 

                            $("<div />")
                                .attr({
                                    "class":"btn btn-info btn-mini",
                                    "id":"select-" + station_dom_id + "_" +  param
                                })
                                .html("Add")
                                .on("click", function(evt){

                                    //console.log("station window add param", station_obj, param);

                                    //evt.stopPropagation();
                                    evt.stopImmediatePropagation();

                                    control.data_cart_add_param(station_obj, param);
                                    control.dataCart();
                                })
                        )
                        .append( 

                            $("<a></a>")
                                .attr("title", param.description)
                                .attr("href", "#"+param)
                        )
                    );

                });

// "id": "259",
// "network": "ND
// "name": "44056
// "description":
// "longitude": "
// "latitude": "3
// "start_time": 
// "end_time": "9
// "parameters": 

                // format the station window details
                $("#db-station-details")
                .empty()
                .append(
                  
                  $("<div/>")
                    .append(
                      $("<div/>")
                        .addClass("title")
                        .append(
                          $("<b/>").html("" + network + " " + station)
                        )
                        .append(
                          $("<span/>")
                            .html("&nbsp;&nbsp;")
                            .css({
                                "float":"right",
                                "margin":"2px",
                                //"border":"1px solid red",
                            })
                            .attr("title","Remove Station " + station)
                            .addClass("cart-station-tools ui-icon ui-icon-info")

                            .on("click", function(){
                              $("#db-station-meta-data").toggle();
                            })
                        )
                    )
                    .append(
                      $("<div/>")
                      .attr({"id":"db-station-meta-data"})
                      .append(

                        (function(data){

                          // create attribute table for the station
                          var attrs = ["id","network","name","description","longitude", "start_time","end_time"],
                            table = $("<table class='table'></table>");

                          $.each( attrs , function( a, attr_val ){

                            var dataAttr = data[attr_val],
                              row = $("<tr></tr>")
                                .append($("<th></th>")
                                  .html(attr_val))
                                .append($("<td></td>")
                                  .html(dataAttr));
                                
                            //console.log("attr", a, attr_val, dataAttr);

                            table.append(row);

                          });

                          return table;

                        })(data)

                      )
                      .hide()
                    )
                )
                .append(dom_station_window)
                .scrollTop(0);

            });
        }
    };

    /**
     * Create the URL to query available stations
     * Called by searchData
     */
    control.stationSearch = function (){
        var location = control.searchMapBounds(control.map),
            start_time = "1",
            end_time = "now",
            networks = control.getSelections("networks"),
            params = control.getSelections("parameters"),
            service_url,
            el_start_time = $("#db-date-start").val(),
            el_end_time = $("#db-date-end").val();

        // some testing of dates
        //  only testing for presense of values for now

        if(el_start_time !== ""){
            start_time = el_start_time;
            
            if(el_end_time === ""){
                end_time = start_time;
            }
        }

        if(el_end_time !== ""){
          end_time = el_end_time;

          if(el_start_time === ""){
            start_time = end_time;
          }
        }

        service_url = "/stations/search?location=" + location +
            "&start_time=" + start_time+
            "&end_time=" + end_time+
            "&networks=" + networks+
            "&parameters=" + params;

        //console.log("service_url: " + service_url);

        return service_url;
    };

    control.dataCart = function(){

      var dc = $("#data-cart"),
          cart_stations = $("<div />").addClass("cart-stations");

      $.each( tool.configuration.data_cart , function( index, station_obj){

        var s = station_obj;

/*
        { 
          "network":"NDBC",
          "station": "44033",
          "custom_name":"NDBC 44033",
          "parameters": {
            "water_temperature":{},
            "air_temperature":{}
          }
        }
*/

        if(typeof s.custom_name === "undefined"){
          s.custom_name = s.network + " " + s.station;
        } 

        var cart_station = $("<div />")
          .addClass("cart-station")
          .attr("data-id", index)
          .append(
            $("<div />")
              .addClass("station-name-edit")
              .css("display","none")
          )
          .append(
            $("<div />")
              .addClass("station-name")
              .html(s.custom_name)
              .click(function(){
                  control.stationWindowUpdate(s);
              })
              .hover(
                // this hover element is the edit and remove button
                function() {
                  var sta = $(this);
                  sta.css("text-decoration","underline");

                  // is there already a span element? if so, remove it
                  if(sta.parent().has( "span" ).length > 0){
                    sta.find(".cart-station-tools").remove();
                  }
                      
                  var tmpSpan = $("<span />")
                    //.html("&nbsp;&nbsp;")
                    .css({
                        "position":"relative",
                        "top":"0",
                        "float":"right",
                        "margin":"2px"
                        //"border":"1px solid red",
                    })
                    .append(
                      $("<span />")
                        .css("float","left")
                        .attr("title","Edit Name for " + s.station)
                        .addClass("cart-station-tools ui-icon ui-icon-pencil")

                      .on("click", function(evt_station_edit_name_click){

                        var station_input; 
                        $(tmpSpan).remove();

                         // load input box and cancel button
                        var current_name = sta.find(".station-name").html();

                        //console.log("station remove click");
                        sta.parent().find(".station-name")
                          .css("display","none");

                        sta.parent().find(".station-name-edit")
                          .css("display","block")
                          .empty()
                          .append(

                            $("<div />")
                              .append(
                                station_input = $("<input />")
                                  .attr("type","text")
                                  .addClass("input input-medium")
                                  .val(s.custom_name)
                                  .keypress(function(e){
                                    if(e.which == 13) {

                                      s.custom_name = $(this).val();

                                      //console.log("Station Obj.custom name", station_obj.custom_name);

                                      sta.parent().find(".station-name")
                                        .html(s.custom_name)
                                        .css("display","block");
                                      
                                      sta.parent().find(".station-name-edit")
                                        .css("display","none")
                                    }
                                  })
                                  //.on("click", function(e){e.stopImmediatePropagation();})
                              )
                              .append(
                                $("<span />")
                                .css("float","right")
                                  .addClass("cart-station-tools ui-icon ui-icon-circle-close")
                                  .on("click",function(evt){
                                    
                                    sta.parent().find(".station-name")
                                      .html(s.custom_name);

                                  })
                              )
                              .append(
                                $("<span />")
                                .css("float","right")
                                  .addClass("cart-station-tools ui-icon ui-icon-circle-check")
                                  .on("click",function(evt){

                                    s.custom_name = station_input.val();
                                    
                                    sta.parent().find(".station-name")
                                      .html(s.custom_name)
                                      .css("display","block");
                                    
                                    sta.parent().find(".station-name-edit")
                                      .css("display","none")

                                  })
                              )
                              .hover(function(hover_evt){
                                hover_evt.stopImmediatePropagation();
                              })

                          );

                        evt_station_edit_name_click.stopImmediatePropagation();

                        control.apply_button_update("modified");

                      })

                    )
                    .append(
                    $("<span />")
                      .css("float","left")
                      .attr("title","Remove Station " + s.station)
                      .addClass("cart-station-tools ui-icon ui-icon-circle-close")

                      .on("click", function(evt_station_remove_click){

                        evt_station_remove_click.stopImmediatePropagation();

                        // need function to find and delete specific station
                        tool.configuration.data_cart.splice(index,1);

                        $(".cart-param-tools").remove();

                        sta.parent().fadeOut();

                        control.apply_button_update("modified");

                      })
                  )
                  .prependTo(sta);
                    
                },
                function() {
                  $( this )
                    .css("text-decoration","none")
                    .find( "span" ).remove();
                }
              )
          );
            
          var station_params = $("<div></div>")
              .addClass("cart-params");

          $.each(s.parameters, function(param){
                
            var station_param = $("<div></div>")
                .addClass("cart-param")
                .html(control.parameter_clean_name(param))

                //mouseover of parameter item
                .hover(
                  function() {
                    var par = $(this);

                    $( par ).append( 
                      $("<span/>")
                      .html(
                          "&nbsp;&nbsp;"
                          
                      )//'<img src="' + EduVis.Environment.getPathTools() + 'Single_Time_Series/img/x_black.png" />'
                      .css({
                        "float":"right",
                        "margin":"2px",
                        //"border":"1px solid red",
                      })
                      .attr("title", "Remove " + param)
                      .addClass("cart-station-tools ui-icon ui-icon-circle-close")

                      .on("click", function(evt_param_remove_click){
                        
                        // click of remove button will delete the item from the cart
                        // do we want an ok prompt?

                        evt_param_remove_click.stopImmediatePropagation();

                        delete tool.configuration.data_cart[index]["parameters"][param];

                        $(".cart-param-tools").remove();

                        par.fadeOut();

                        control.apply_button_update("modified");

                      })
                    );
                  },
                  function() {
                    $( this ).find( "span" ).remove();
                  }
                );

            station_params.append(station_param);                   

        });

        cart_station
          .append(station_params);

        cart_stations
          .append(cart_station);

      });


      // clear and update data cart
      $("#db-data-cart")
        .empty()
        .append(cart_stations);

      cart_stations
        .sortable({
          change : function(evt,ui){
            control.apply_button_update("modified");
          }
        });

    };

    /**
     * Update the station window div with details when a parameter is clicked in the cart
     * Called by dataCart
     */

    control.stationWindowUpdate_fromCart = function(network,station){

      var station_dom_id = "station-" + network + "-"+station;

      if( $("#" + station_dom_id).length > 0){
          // item already exists in DOM, no need for request, just set visibility of div
          //console.log("station already present")
      }
      else{

        $.getJSON( "http://epedata.oceanobservatories.org/stations/" + network + "/" + station, function( data ) {

          //console.log("**** station data **** ", data);

          var stationObj = data;

          // get reference to drop down
          // if exists, check for presence of current network/station

          // move to function to add to station dropdown.. also add to object to track additions / subtractions
          //
          var dom_station_window = $("<div></div>")
              .attr({
                "id" : station_dom_id
              });

          $.each(data.parameters, function(parameters, param){
              
            //console.log("param",param);

            dom_station_window.append( 

              $("<div/>")
              .css({"overflow":"overlay"})
              
              .append( 
                $("<label/>")
                .attr("for","select-" + station_dom_id + "_" + param)
                .html(param)
              )
              .append( 

                $("<a/>")
                .attr({
                  "class":"btn btn-mini station-window-add",
                  "id":"select-" + station_dom_id + "_" +  param
                })
                .html("Add")
                .on("click", function(evt){

                  //evt.stopPropagation();
                  evt.stopImmediatePropagation();

                  control.dataCartAddParam(network, station, param);
                  control.dataCart();
                })
              )
            );
          });

          $("#db-station-details")
          .empty()
          .append(
            $("<div>")
            .append(
              $("<h4/>")
                .addClass("title")
                .html("Network: (" + network + ") " + station)
            )
            .hover(
              function() {
                $(this).parent().prepend(
                  //$('<span class="station-detail-hover" style="float:right">[this]</span>')
                )
              },
              function() {
                $( ".station-detail-hover" ).remove();
              }
            )
          )
          .append(dom_station_window);
        });
      }
    };

    /* clean paramater names */

    control.parameter_clean_name = function (clean_parameter){
      var proper = "";
      $.each(control.parameters,function(i,param){
        if(param.name === clean_parameter){
          $.each(param.name.split("_"),function(p,part){
            proper += part.charAt(0).toUpperCase() + part.substr(1).toLowerCase() + " ";
          });
        }
      });
      return proper;
    };

    /*
     * Update the Apply button by enabling or disabling via class and changing icon between exlamation mark or checkmark
     * 
    */
    control.apply_button_update = function(status){

      // status up-to-date or modified?
      if(status == "modified"){

        $("#btn-apply")
          .attr('class', 'btn btn-medium')
          .html('Apply');
          // <i class="icon-exclamation-sign"></i>'
        
      }
      else if(status == "up-to-date"){

        $("#btn-apply")
          .attr('class', 'btn btn-medium disabled')
          .html('Apply');
           //<i class="icon-ok-sign"></i>'

        $("#apply-check").show().fadeOut(3000);

      }
    };

    control.apply_button_press = function(evt){

      var btn_apply = $(evt.target);

      // check to see if button is disabled, if not, apply changes
      if(!btn_apply.hasClass('disabled')){

        var config = tool.configuration,
            x=0,
            sorted_ary=[],
            sorted_cart = $( ".cart-stations" ).sortable( "toArray", {"attribute":"data-id"});

        for(; x<sorted_cart.length;x++){
          sorted_ary.push(config.data_cart[sorted_cart[x]]);
        }

        // update the array with the newly sorted array
        config.data_cart = sorted_ary;

        // default chart properties
        // updated by the visualization

        // "station" : "44033",
        // "network" : "NDBC",
        // "parameter" : "water_temperature",
        // updated by the data browser
         
        config["date_type"] = $("#db-dates-dropdown").val();

        if(config["date_type"] == "archived"){
         
          config["start_date"] =  $("#db-date-start").val();
          config["end_date"] =  $("#db-date-end").val();
          config["realtime_days"] = 0; //? set to zero?

        }
        else{

          //var tmpDate = new Date(),
              // month,
              // day,
              // dateString;

          // month = tmpDate.getMonth() + 1;
          // month = month<10? "0" + month : month;

          // day = tmpDate.getDate();
          // day = day<10 ? "0" + day : day;

          // dateString = tmpDate.getFullYear() + "-" + month + "-" + day;

          config["end_date"] =  "now";
          config["start_date"] =  $("#db-reatltime_days").val();

          config["realtime_days"] =  $("#db-reatltime_days").val();

        }

        tool.select_updateStations("1");
        tool.select_updateParameters("1");

        tool.select_updateStations("2");
        tool.select_updateParameters("2");

        tool.update_callback();

        control.apply_button_update("up-to-date");
      }

    };

  // set default for search
  control.searchActive = false;

  if ( 'object' !== typeof EduVis.controls ) {
    EduVis.controls = {};
  }

  EduVis.controls[control.name] = control;

}(EduVis));