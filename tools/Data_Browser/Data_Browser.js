/*  *  *  *  *  *  *  *
*
* TOOL TEMPLATE
*
*/

(function (eduVis) {

    "use strict";

    var tool = {

        "name" : "Data_Browser",
        "description" : "A Tool for searching and selecting data sources.",
        "url" : "??__url_to_tool_help_file__?",

        "version" : "0.0.1a",
        "authors" : [
            {
                "name" : "Michael Mills",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~mmills"
            },
            {
                "name" : "Sage Lichtenwalner",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~sage"
            }
        ],
        
        "resources" : {


            "scripts_local" : [
                {
                    "name": "leaflet_js",
                    //"resource_path": "resources/js/",
                    "resource_file_name" : "leaflet.js",
                    "global_reference" : "L",
                    "attributes":{}
                },
                {
                    "name": "leaflet_markercluster",
                    //"resource_path": "resources/js/",
                    "resource_file_name" : "leaflet.markercluster.js",
                    "global_reference" : "L",
                    "dependsOn" : ["leaflet-js"],
                    "attributes":{}
                }
            ],

            "scripts_external" : [

                // {
                //     "name" : "leaflet-js", 
                //     "url" : "http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.js",
                //     "global_reference" : "L"
                // }
                //,
                {
                    "name" : "jquery_ui_js", 
                    "url" : "http://code.jquery.com/ui/1.10.3/jquery-ui.js",
                    //"dependsOn" : ["jquery"]
                }
                

            ],

            "stylesheets" : [
                {
                    "name": "data-browser-css",
                    "src": "css/Data_Browser.css"
                },
                {
                    "name": "leaflet-markercluster-css",
                    "src": "css/MarkerCluster.css"
                },
                {
                    "name": "leaflet-markercluster-default",
                    "src": "css/MarkerCluster.Default.css"
                },
            
                {   "name": "jquery-smoothness",
                    "src": "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css"
                },
                {
                    "name" : "jquery-ui",
                    "src" : "http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"
                },
                {
                    "name": "leaflet-css",
                    "src": "http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css"
                }
            ],

            "datasets" : [] // in case we being to support additional local resource files
            
        },

        "configuration" : {

            "data_cart" : {}
        },

        "controls" : {

            "data": {
                "type" : "textarea",
                "label" : "Data Array",
                "description" : "This text area represents the bar chart data.",
                "tooltip" : "Enter data in the following format:<br><br><em>label, value<br>label, value</em><br><br>Enter each pair of data on its own line.",
                "default_value" : "One, 1\nTwo, 2\nThree, 3\nFour, 4\nFive, 5"
            },
            "temp" : {

                "type" : "textbox",
                "label" : "Testing the Text Box",
                "tooltip": "What is a tooltip?",
                "default_value" : "This is a test",
                "description" : "this control is for testing the text box of template.js"
            }
        },
        "data" : {},
        "target_div" : "data-browser",
        "tools" : {},
        "data_browser_domid" : "",
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

        "styleStationReset" : {

            radius: 6,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        },

        //"data_cart" : {},

        "db_data" : {
            "parameters": [
                {
                    "name": "air_pressure",
                    "category": "atmospheric",
                    "description": "Pressure exerted by overlying air",
                    "units": "hPa",
                    "cf_parameter": "",
                    "ioos_parameter": "",
                    "modified": "0000-00-00 00:00:00"
                },
                {
                    "name": "air_temperature",
                    "category": "atmospheric",
                    "description": "Temperature of air in situ.",
                    "units": "celcius",
                    "cf_parameter": "",
                    "ioos_parameter": "",
                    "modified": "0000-00-00 00:00:00"
                },
                {
                    "name": "conductivity",
                    "category": "water_property",
                    "description": "Ability of a material to pass an electrical current. Inverse of resistance. In water, it is a proxy from which salinity is derived for water quality or to further derive water density.",
                    "units": "siemens | uS",
                    "cf_parameter": "",
                    "ioos_parameter": "",
                    "modified": "0000-00-00 00:00:00"
                }
            ],

            "networks": [
                {
                    "name": "NDBC",
                    "description":" National Data Buoy Center",
                    "website":"http://www.ndbc.noaa.gov/"
                },
                {
                    "name": "CO-OPS",
                    "description":"Center for Operational Oceanographic Products and Services",
                    "website":"http://tidesandcurrents.noaa.gov/"
                }
            ]
        }

    };

    /* sets up the DOM and layout elements
    * @method dataBrowser_html
    *
    */
    tool.dataBrowser_html = function(data_browser_domid){

        // place data browser in provided Dom, otherwise add to body
        var dataBrowserDom;

        // set dom element
        if(typeof data_browser_domid === "undefined"){
            
            this._data_browser_domid = "data-browser-container";

            dataBrowserDom = $("<div/>",{"id": this._data_browser_domid})

            // append to body since no target is supplied
            $("body").append(dataBrowserDom);

        }else{

            this._data_browser_domid = data_browser_domid;

            // div should exist in html
            dataBrowserDom = $("#" + this._data_browser_domid);
            
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
                                        "name":"db-date-start"          /// date_start
                                    })
                                )
                                .append("<br />")
                                .append(
                                    $("<label/>",{
                                        "for":"db-date-end"
                                    })
                                    .html("End Date: ")
                                )
                                .append(
                                    $("<input/>",{
                                        "type":"text",
                                        "id":"db-date-end",
                                        "name":"db-date-end"            /// date_end
                                    })
                                )
                                .append(
                                    $("<label/>",{
                                        "id":"db-date-details"
                                    })
                                )
                        )
                    )
                    .append(
                        
                        $("<div/>", {
                            "id":"db-selection-search"
                        })
                        .append(
                            $("<input/>", {
                                "type":"button",
                                "id":"db-btn_search",
                                "value": "search"
                            })
                        )
                            
                        .append(
                            $("<div>",{"id":"db-search-progress"})      //search-progress
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
            )
             .append(
                $("<div/>", {
                    "id":"db-data-cart-apply",
                })
                .css({
                    "margin":"0 30% 0 30%"
                })
                .append(
                    $("<a/>", {
                        "type":"button",
                        "class":"btn btn-large",
                    })
                    .html("Apply")
                    .on("click",function(){

                        var parentToolName = tool.objDef.parent_tool,
                            parentTool = EduVis.tool.instances[parentToolName].default;

                        parentTool.configuration.data_cart = tool.configuration.data_cart;
                        parentTool.controls.data_cart.update_event();

                    })
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
            )

        dataBrowserDom.append(dataBrowser_html);

        var height = $(dataBrowserDom).height(),
        header = $("#db-header").height(),
        footer = $("#db-footer").height(),
        mainHeight = height - header - footer - 2,
        winStationHeight = (mainHeight/2-50), // now compensate for Apply button original->(mainHeight/2-20)
        winCartHeight = winStationHeight,
        winApplyHeight = 60;


        $("#data-browser-wrap").height(mainHeight);
        $("#db-map").height(mainHeight);

        $("#db-station-details").height(winStationHeight);
        $("#db-data-cart").height(winStationHeight);
        $("#db-data-cart-apply").height(winApplyHeight);

    };


    tool.dataCart = function(){

        var dc = $("#data-cart");

        var cart_networks = $("<div></div>");

        $.each( tool.configuration.data_cart , function( network, station){
            
            var cart_network = $("<div></div>")
                .addClass("cart-network")
                .html("<h4>"+network+"</h4>");

            var cart_network_stations = $("<div></div>")
                .addClass("cart-stations");

            $.each(station, function( station, station_obj){

                var cart_network_station = $("<div></div>")
                    .addClass("cart-station")
                    .html("<h4>"+station+"</h4>");
                
                var station_params = $("<div></div>")
                    .addClass("cart-params");

                $.each(station_obj.parameters, function(param){
                    
                    var station_param = $("<div></div>")
                        .addClass("cart-param")
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
                                        .addClass("cart-param-tools")

                                        .on("click", function(evt_param_remove_click){

                                            console.log("param remove click");
                                            
                                            // click of remove button will delete the item from the cart
                                            // do we want an ok prompt?

                                            evt_param_remove_click.stopImmediatePropagation();

                                            delete tool.configuration.data_cart[network][station]["parameters"][param];

                                            $(".cart-param-tools").remove();

                                            tool.dataCart();
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
        $("#db-data-cart")
            .empty()
            .append(cart_networks);

    };

    /* load all javascript elements for the Data Browser
    * method dataBrowser_js
    *
    *
    */
    tool.dataBrowser_js = function(){

    // initialize leaflet map
        this.map = L.map('db-map', {
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
            ).addTo(this.map),

            // set resize timer for window 
            resizeTimer;

        // initialize the date picker for start date
        $( "#db-date-start" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            showButtonPanel: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat:"yy-mm-ddT00:00Z",

            onClose: function( selectedDate ) {
                $( "#db-date-end" ).datepicker( "option", "minDate", selectedDate );
            }
        });

        // initialize the date picker for end date
        $( "#db-date-end" ).datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            showButtonPanel: true,
            showOtherMonths: true,
            selectOtherMonths: true,
            dateFormat:"yy-mm-ddT00:00Z",
            onClose: function( selectedDate ) {
                $( "#db-date-start" ).datepicker( "option", "maxDate", selectedDate );
            }
        });

//
// PARAMETERS
//

        // get the parameters from the json file.
//      $.getJSON( "json/parameters.json", function( data ) {
        
            var parameters = this.db_data.parameters,
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
            "class": "db-select-list",
            html: selects
          }).appendTo( "#db-select-parameters" );

//      });

// //
// // networks
// //

//      $.getJSON( "json/networks.json", function( data ) {
        
            var networks = this.db_data.networks,
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
            }).appendTo( "#db-select-networks" );

//      });

//
// STATIONS
//

        // $.getJSON( "json/stations_geo.json", function( data ) {
        
        //  var stationsFeatureCollection = data;

        //  var layer = new L.GeoJSON(stationsFeatureCollection,
        //  {
        //      onEachFeature: function (station, layer) {
                    
        //     //   layer.bindPopup(
        //              // station.properties.description
        //     //   );

        //          layer.on("click", function(){
        //              //alert("Name:" + station.properties.name);

        //              // network and station name are needed for the station pull
        //              //http://ooi.dev/epe/data-services/stations/CO-OPS/UNI1024
                        
        //              stationWindowUpdate(station);

        //          });
        //      },
        //      pointToLayer: function (station, latlng) {
        //          return L.circleMarker(latlng, stationMarkerOptions[station.properties.network]);
        //      }
            
        //   });

        //  map.addLayer(layer);
        //  map.fitBounds(layer.getBounds());

        // });

        //
        // WINDOW RESIZING
        //
        
        // $(window).bind('resize', function() {
        //     clearTimeout(resizeTimer);
        //     resizeTimer = setTimeout(setHeight, 100);
        // });
    
        // set the height of the map area div and other divs
        // setHeight();

        // attach search to the button for now
         $("#db-btn_search").on("click", this.searchQueue);
    };

    tool.stationSearch = function (){

         /* Station Search 
         *  (returns only stations with valid parameter matches)
         * Path: /stations/search
         * Accepted parameters:
         *   location: lon_min,lat_min,lon_max,lat_max
         *   start_time: Either 0000-00-00T00:00Z or number of days before end_time
         *   end_time: Either 0000-00-00T00:00Z or now
         *   parameters: comma separated list of desired parameters (returns any matches, i.e. not just intersecting matches)
         *   networks: comma separated list of desired networks
         * Test URL: http://api.localhost/stations/search?location=-77,35,-69,42&start_time=1&end_time=now&networks=CO-OPS&parameters=salinity
         */

        var location = tool.searchMapBounds(tool.map),
            start_time = "1",
            end_time = "now",
            networks = tool.getSelections("networks"),
            params = tool.getSelections("parameters"),
            service_url,
            el_start_time = $("#db-date-start").val(),
            el_end_time = $("#db-date-end").val();


        // some testing of dates
        //  only testing for presense of values for now

        if(el_start_time != ""){
            start_time = el_start_time;
            
            if(el_end_time == ""){
                end_time = start_time;
            }
        }

        if(el_end_time != ""){
            end_time = el_end_time;

            if(el_start_time == ""){
                start_time = end_time;
            }
        }

        service_url = "/stations/search?location=" + location +
            "&start_time=" + start_time+
            "&end_time=" + end_time+
            "&networks=" + networks+
            "&parameters=" + params;

        console.log("service_url: " + service_url);

        return service_url;
    };

    tool.processDateTime = function(){

        // get reference to date elements
        var el_date_start = $("#db-date-start"),
            el_date_end = $("#db-date-end"),
            el_date_label = $("#db-date-details");

            console.log("el_date_start: " +el_date_start.val());
            console.log("el_date_end: " +el_date_end.val());
    };

    tool.searchQueue = function(){

        var self = this;
        // turn on the progress bar
        $( "#db-search-progress" ).progressbar({"enabled":true, value: 25});
        
        clearInterval(tool._timerSearchProgress);
        tool._timerSearchProgress = setInterval(function(){

            var progressbar = $( "#db-search-progress" ),
                progressValue = progressbar.progressbar("value");
                progressbar.progressbar({"value": progressValue + 25});

        }, 750);

        clearTimeout(tool._timerSearchQueue);
        tool._timerSearchQueue = setTimeout(function(){
            
            tool.searchData();

            $( "#db-search-progress" ).progressbar( "value",0);
            clearInterval(tool._timerSearchProgress);

        }, 3000);

    };


    // for now we will just use a button to run the searches. 
    // ultimately this will be on updates of any of the search criteria

    tool.searchData = function (){

        //console.log("layer station markers", tool.layer_station_markers);

        if(this.map.hasLayer(this.layer_station_markers)){
            this.map.removeLayer(this.layer_station_markers);
        }

        var search_stations_query = "http://ooi.dev/epe/data-services/" + this.stationSearch();

        $.getJSON( search_stations_query, function(geodata){

            //console.log(geodata);

            var stationsFeatureCollection = geodata,

            layer_stations = new L.GeoJSON(stationsFeatureCollection,
            {
                onEachFeature: function (station, station_feature) {
                    
               //   layer.bindPopup(
                        // station.properties.description
               //   );
                    console.log(station.properties.network + " - " + station.properties.name, station);

                    //station_feature.setAttribute("title","testing");

                    station_feature.on({

                        "click": function(){
                            //alert("Name:" + station.properties.name);

                            // network and station name are needed for the station pull
                            //http://ooi.dev/epe/data-services/stations/CO-OPS/UNI1024
                            
                            tool.stationWindowUpdate(station);

                        },

                        // highlight the layer path when the station is hovered
                        "mouseover": function(e){

                            var layer = e.target;

                            console.log("dev: need to hightlight station in station window, if present");

                            layer.setStyle(tool.styleStationHighlight);

                            if (!L.Browser.ie && !L.Browser.opera) {
                                layer.bringToFront();
                            }

                        },

                        // remove the station highlight when mouse leaves
                        "mouseout": function(e){

                            var layer = e.target;
                
                            layer.setStyle(tool.styleStationReset);

                            if (!L.Browser.ie && !L.Browser.opera) {
                                layer.bringToFront();
                            }

                        }
                    });
                },
                pointToLayer: function (station, latlng) {
                    console.log(tool.stationMarkerOptions[station.properties.network]);

                    return L.circleMarker(latlng, tool.stationMarkerOptions[station.properties.network]);
                }
            
            });

            tool.layer_station_markers = new L.markerClusterGroup();
            
            tool.layer_station_markers
                .addLayer(layer_stations);
                //.addLayers([if we want to add multiple layers]);
            
            //this.map.addLayer(this.layer_station_markers);
            tool.map.addLayer(tool.layer_station_markers);

        });
    };



    /* @method data_cart_add_param add the network,station,parameter 
    *  @param station station object from geojson.. includes geometry
    *  @param param parameter
    */

    tool.data_cart_add_param = function(station, param){

        var sp = station.properties,
            network = sp.network,
            station = sp.name,
            
            data_cart_item = {};
            data_cart_item[network] = {};
            data_cart_item[network][station] = {};
            data_cart_item[network][station]["parameters"] = {};
            data_cart_item[network][station]["parameters"][param]={};

            // extend the cart item into the cart.. bascially, just appending the parameter. 
            $.extend(true, tool.configuration.data_cart, data_cart_item);
    };

    /** 
    * 
    * @method searchMapBounds 
    * @param {object} reference to global map
    * @return {String} the map bounding box string "lng_min,lat_min,lng_max,lat_max" - bbox 
    */

    tool.searchMapBounds = function(_map){
        // example return bbox string "-73.970947265625,40.54720023441049,-71.28753662109375,41.88592102814744"

        return _map.getBounds().toBBoxString();
    };


    /** 
    * 
    * @method highlightFeature set a style of the feature to prove interaction
    * @param {event click object e} 
    * 
    */
    tool.highlightFeature = function(){
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

    /* 
    @method getSelections
    @param selectionType network or parameter
    generate comma separated list of selected parameters from:  parameters,networks

    */
    tool.getSelections = function(selectionType){

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
    *   @method stationWindowUpdate load the station details into the station window div
    *   @param station station object
    */

    tool.stationWindowUpdate = function(station){

        //console.log("station", station);

        var station_dom_id = "station-" + station.properties.network + "-"+station.properties.name;

        if( $("#" + station_dom_id).length > 0){

            // item already exists in DOM, no need for request, just set visibility of div
            console.log("station already present")

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

            $.getJSON( "http://ooi.dev/epe/data-services/stations/" + station.properties.network + "/" + station.properties.name, function( data ) {

                // get reference to drop down
                // if exists, check for presence of current network/station

                // move to function to add to station dropdown.. also add to object to track additions / subtractions
                //
                var dom_station_window = $("<div></div>")
                    .attr({
                        "id" : station_dom_id
                    });

                $.each(data.parameters, function(parameters, param){
                    
                    console.log("param",param);

                    dom_station_window.append( $("<div/>") 
                        
                        .append( 

                            $("<label/>")
                                .attr("for","select-" + station_dom_id + "_" + param)
                                .html(param)
                        )
                        .append( 

                            $("<a/>")
                                .attr({
                                    "class":"btn btn-info btn-mini",
                                    "id":"select-" + station_dom_id + "_" +  param,
                                    "href" : "#a-"+ station_dom_id + "_" +  param
                                })
                                .html("Add")
                                .on("click", function(evt){

                                    //evt.stopPropagation();
                                    evt.stopImmediatePropagation();

                                    tool.data_cart_add_param(station, param);
                                    tool.dataCart();
                                })
                        )
                        .append( 

                            $("<a></a>")
                                .attr("title", param.description)
                                .attr("href", "#"+param)
                        )
                    )

                });

                $("#db-station-details")
                .empty()
                .append(
                    $("<h4/>")
                        .addClass("title")
                        .html("Network: (" + station.properties.network + ") " + station.properties.name)
                )
                .append(dom_station_window);

            });
        }
    };

    tool.DataBrowser = function( _target ){

        console.log(" ..... DataBrowser ..... ");
        console.log("Version: " + tool.version);

        //document.getElementById(_target).innerHTML = "TEMPLATE TOOL LOADED";

        //this.dataBrowser_html( _target );

        if(typeof tool.objDef.toolParent !== "undefined"){
            tool.toolParent = tool.objDef.toolParent;
        }

        if(typeof tool.objDef.data_cart !== "undefined"){
            
            console.log("Data Browser Configuration", tool.objDef.data_cart);

            tool.configuration.data_cart = tool.objDef.data_cart;
        }

        this.dataBrowser_html(_target);
        this.dataBrowser_js();

        EduVis.tool.load_complete(this);

    };

    tool.init = function(_obj) {

        //console.log("TOOL OBJ", _obj)
        // todo: include instance in call

        this.DataBrowser(this.dom_target);

    };

    tool.exportCart = function(){
        return tool.configuration.data_cart;
    };

    // extend base object with tool.. need to be able to leave options out of tool configuration file.
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));

