/*
    Ocean Observatories Initiative
    Education & Public Engagement Implementing Organization

    Name: EV Glider Deployment Chooser
    Description: 
    Version: Beta
    Revision Date: 3/09/2013
    Author: Michael Mills
    Author URL: http://marine.rutgers.edu/~mmills/
    Function Name: EV_Glider_Deployment_Chooser
    Help File: 


Example Configurations: 
    
    http://epe.marine.rutgers.edu/framework/EV_Tool_Basic_Loading.php?tool=
    http://epe.marine.rutgers.edu/framework/EV_Tool_Basic_Loading.php?tool=

*/

var EV_Glider_Deployment_Chooser_Dependencies =
    {
        force error.. redo with latest dependency structuring
       "scripts":{
            "jquery":{
                "src":'resources/js/jquery-1.9.1.min.js',
                "dependsOn":[]
            },
            "jquery_ui":{
                "src":"resources/js/jquery-ui-1.10.1.custom.min.js",
                "dependsOn":["jquery"]
            },
            "bootstrap":{
                "src":"resources/js/bootstrap.min.js",
                "dependsOn":["jquery_ui"]
            },
            "evtools":{
                "src":'ev_tools.js',
                "dependsOn":['jquery']
            },
            "d3_min":{
                "src":'http://d3js.org/d3.v3.min.js',
                "dependsOn":['jquery']
            },
            "leaflet":{
            	"src":"http://cdn.leafletjs.com/leaflet-0.5/leaflet-src.js",
                "dependsOn":[]
            }
            
        },

        "stylesheets":[
            {
                "stylesheet":"jquery-ui",
                "src":"resources/css/smoothness/jquery-ui-1.10.1.custom.min.css"
            },
            {
                "stylesheet":"leaflet",
                "src":"http://cdn.leafletjs.com/leaflet-0.5/leaflet.css"
            },
            {
                "stylesheet":"toolstyle",
                "src":"EV_Glider_Deployment_Chooser/EV_Glider_Deployment_Chooser.css"
            },
            {
                "stylesheet":"bootstrap",
                "src":"resources/css/bootstrap.min.css"
            },

        ]
    };

var EV_Glider_Deployment_Chooser = function( domId, customToolConfiguration ){

    var self = this;

    self.evtool = new EVTool();

    // Default Configuration
    self.configuration = {
    	"version": "0.0.1",
        "mapDiv":"glider_deployment_chooser_map"
    };

	self.tool = {
	 	domID:self.evtool.domToolID( domId ),
		configuration:{
		    original:self.configuration,
		    custom:self.configuration
		}
	};

    layout = self.layout = {

        dMain:null,
        dRight:null,
        dfooter:null,
        titleH2:null,

        dMap:null,
        dMapTop:null,
        dMapBottom:null
    };

    controls = self.controls = {
        cDateStart:null,
        cDateEnd:null
    }

    searchResults = self.searchResults = {

    }

    self.evtool.configurationParse( self.tool.configuration.custom, customToolConfiguration );

       // define layout object
    self.setupLayout();
    self.setupLeafletMap();

    layout.dContainer = $("#dContainer");

    layout.dMain.append(

        $("<div></div>")
            .addClass("container-fluid")

            .append(
                $("<div></div>")
                    .addClass("row-fluid")
                    .append(
                        $("<h4></h4>").html("4. Choose Deployments")
                    )
            )

            .append(
                $("<div></div>")
                    .addClass("row-fluid")
                    
                    .append(
                        $("<div></div>")
                            .addClass("span6")
                            .addClass("borderRounded")
                            .append(
                                $("<h5></h5>")
                                .addClass("page-header")
                                .html('Search Results')

                            )
                            .append(
                                layout.dSearchResults = $("<div></div>")
                                .html("search results will appear here...")
                            )
                            
                    )
                    .append(
                        $("<div></div>")
                            .addClass("span6")
                            .addClass("borderRounded")
                            .append(
                                $("<h5></h5>")
                                .addClass("page-header")
                                .html('Select Deployments')

                            )
                            .append(
                                layout.dSelectedDeployments = $("<div></div>")
                                .html("selected deployments will appear here.")
                            )
                            
                    )

            )
    )
    .append(

        $("<div></div>").append(
            $("<div></div>").html("2")
        )
    )
    
    height = layout.dContainer.height();

    // appeend to the main div
    layout.dMain
        .append(
           $("<div></div>")
               .addClass("container-fluid")
               
                .append(
                    $("<div></div>")
                    .css(
                            {
                                "background-color":"#F8F8F8",
                                "border":"1px solid #6699CC",
                                "height":"100%"
                            }
                        )
                )
                .append(
                    $("<div></div>")
                    .css("background-color","blue")
                )
        );

    layout.dRight.css("border-right","1px solid blue");
    
    layout.dFooter.append(
        
        $("<div></div>").html("Glider Deployment Chooser v" + self.configuration.version)
    )

};


EV_Glider_Deployment_Chooser.prototype.setupLayout = function(){

    var self = this;
    layout = self.layout;

    var toolDiv = $("#"+self.tool.domID);
    
    // now append the loading div;
    toolDiv.append(
        $("<div></div>")
            .attr("class","container-fluid")
            .attr("id","dContainer")

            .css({
                "margin":"6px",
                "padding":"6px",
                "border":"2px solid #666666",
                "-moz-border-radius": "5px",
                "border-radius": "5px"
            })
            .append(
                $("<div></div>")
                    .append(
                        // set reference like this.. be sure to define the variable in the appropriate scope
                        layout.titleH2=$("<h2></h2>")
                            .html("Glider Deployment Chooser")
                    )
            )
            .append(
                $("<div></div>")
                    .attr("class","row-fluid")
                    .append(

                        $("<div></div")
                            .attr("class","span5")
                            .append(

                                $("<div></div>")
                                    .addClass("container-fluid")
                                    .append(
                                        $("<div></div>")
                                        .addClass("row-fluid")
                                        .append(
                                            
                                            layout.dMapTop=$("<h4></h4>")
                                            .html("1. Zoom to an Area of Interest <small>( Map Boundary will be used )</small>")

                                        )
                                        .append(
                                            // initialize map div
                                            layout.dMap=$("<div></div")
                                                .attr("id", self.tool.configuration.custom.mapDiv)
                                        )
                                        .append(
                                            $("<div></div>")
                                                .attr("id","mapCoords")
                                                .addClass("text-right")
                                                .html("_")
                                        )
                                    )     
                            )
                            
                            .append(

                                layout.dMapBottom=$("<div></div")
                                     
                                    .addClass("container-fluid")
                                    .append(
                                        $("<div></div>")
                                            .addClass("row-fluid")
                                            .append(
                                                $("<div></div>")
                                                    .addClass("span12")
                                                    .append($("<h4></h4>").html("2. Select Date Range"))
                                            )
                                    )

                                    .append(
                                        $("<div></div>")
                                            .addClass("row-fluid")
                                            .append(
                                                $("<div></div>")
                                                    .addClass("span3")
                                                    .css(
                                                        {
                                                            //"border":"2px dashed #6699CC",
                                                            "padding":"6px"
                                                        }
                                                    )                       
                                                    .append(
                                                        controls.cDateStart=self.evtool.toolControl(self, "-cDateStart", 
                                                            {
                                                                type:"datepicker",
                                                                default_value:"2011-08-10",
                                                                maxLength:100,
                                                                description:"Start Date:",
                                                                toolTip:"Select a Start Date"
                                                            }
                                                        ).addClass("pull-right")
                                                    )
                                            )
                                            .append(
                                                $("<div></div>")
                                                    .addClass("span3")
                                                    .css(
                                                        {
                                                            //"border":"2px dashed #6699CC",
                                                            "padding":"6px"
                                                        }
                                                    )                       
                                                    .append(
                                                        controls.cDateEnd=self.evtool.toolControl(self, "-cDateEnd", 
                                                            {
                                                                type:"datepicker",
                                                                default_value:"2012-11-05",
                                                                maxLength:100,
                                                                description:"End Date:",
                                                                toolTip:"Select an End Date"
                                                            }
                                                        )   
                                                    )
                                            )
                                    )
                                    .append(
                                        $("<div></div>")
                                            .addClass("row-fluid")
                                            .append(
                                                $("<div></div>")
                                                    .addClass("span12")
                                                    .append(
                                                        $("<h4></h4>")
                                                            .html("3. Search")
                                                    )
                                                    .append(
                                                        $("<div></div>")
                                                        .addClass("span3")
                                                        .css("padding-right","20px")
                                                        .append(

                                                            $("<a></a>").addClass("btn btn-medium btn-primary pull-right")
                                                                .html("Search")

                                                                .on("click",function(){self.getDeployments()})
                                                        )
                                                    )
                                            )
                                    )
                                
                                                        
                            )

                        )
                    .append(

                        layout.dMain=$("<div></div").attr("class","span5")
                        
                        
                    )
                    .append(

                        layout.dRight=$("<div></div").attr("class","span2")
                        
                    )
            )
             .append(
                
                $("<div></div>")
                    .attr("class","row-fluid")
                    .append(

                        layout.dFooter=$("<div></div").attr("class","span12").html(" ")
                    )
            )
    );

};

EV_Glider_Deployment_Chooser.prototype.setupLeafletMap = function(){

    var self = this;
    config = self.tool.configuration.custom,
    controls = self.controls;

    mapControl = controls.leafletMap = {};

    mapControl.map = L.map(config.mapDiv);
    mapControl.map.setView([38.5,-78.92], 3);

    mapControl.tracks = [];
    mapControl.layers = [];
    
    mapControl.styles = {
        tracks:{
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        }

    };

    mapControl.icons = {
        profileIconRed : L.icon({
            iconUrl: 'EV_Glider_Deployment_Chooser/icon-profile-dot-red.png',
            //shadowUrl: 'leaf-shadow.png',

            iconSize:     [8, 8], // size of the icon
            //shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [8,8],//[22, 94], // point of the icon which will correspond to marker's location
            //shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [0,0]//[-3, -76] // point from which the popup should open relative to the iconAnchor
        })
    }

    //var streetMapUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
    // pull in the ocean basemap.. we will link to other map sources here
    mapControl.oceanBasemap_url = 'http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}';

    mapControl.oceanBasemap_layer = new L.TileLayer(mapControl.oceanBasemap_url, { maxZoom: 19, attribution: 'Tile Layer: &copy; Esri' }).addTo(mapControl.map);

    // set map event listeners here
    mapControl.map.on('mousemove', function(e) {
        //console.log(e.latlng);
        $("#mapCoords").html(e.latlng.lat + " - " + e.latlng.lng);

    });

};

EV_Glider_Deployment_Chooser.prototype.getDeployments = function(){

    var self = this,
    mapControl = self.controls.leafletMap;

    var bounds = mapControl.map.getBounds();
    
    var lng_min = bounds.getNorthWest().lng,//  LatLng  Returns the south-west point of the bounds.
        lng_max = bounds.getSouthEast().lng,
        lat_min = bounds.getSouthWest().lat,
        lat_max = bounds.getNorthEast().lat;

    // getWest()   Number  Returns the west longitude of the bounds.
    // getSouth()  Number  Returns the south latitude of the bounds.
    // getEast()   Number  Returns the east longitude of the bounds.
    // getNorth()  Number  Returns the north latitude of the bounds.

    // getSouthWest()  LatLng  Returns the south-west point of the bounds.
    // getNorthEast()  LatLng  Returns the north-east point of the bounds.
    // getNorthWest()  LatLng  Returns the north-west point of the bounds.
    // getSouthEast()  LatLng  Returns the south-east point of the bounds.

    var requestUrl = "EV_Glider_Deployment_Chooser/glider_data.php?dbtask=find_deployments&"+

        "date_start=" + $("#-cDateStart").val() + "&"+
        "date_end=" + $("#-cDateEnd").val() + "&"+

        "lng_min=" + lng_min + "&" +   
        "lng_max=" + lng_max + "&" +   
        "lat_min=" + lat_min + "&" +   
        "lat_max=" + lat_max;  

    var requestBoundingBox = "EV_Glider_Deployment_Chooser/glider_data.php?dbtask=query_bounding_box&"+

        "date_start=" + $("#-cDateStart").val() + "&"+
        "date_end=" + $("#-cDateEnd").val() + "&"+

        "lng_min=" + lng_min + "&" +   
        "lng_max=" + lng_max + "&" +   
        "lat_min=" + lat_min + "&" +   
        "lat_max=" + lat_max;  


    var requestTracks = "EV_Glider_Deployment_Chooser/glider_data.php?dbtask=json_day_summarized_tracks&"+

        "date_start=" + $("#-cDateStart").val() + "&"+
        "date_end=" + $("#-cDateEnd").val() + "&"+

        "lng_min=" + lng_min + "&" +   
        "lng_max=" + lng_max + "&" +   
        "lat_min=" + lat_min + "&" +   
        "lat_max=" + lat_max;  

    $.getJSON(requestTracks,

        function(data){
            
            var d = data;
            
            if(typeof(mapControl.layers.geojsonTrackLayer)!=="undefined"){
                mapControl.layers.geojsonTrackLayer.clearLayers();    
            }
            
            mapControl.layers.geojsonTrackLayer = new L.GeoJSON(null, {
                
                // we can filter out any features
                // filter: function (feature, layer) {
                    
                //     if (feature.properties) {
                //         // If the property "underConstruction" exists and is true, return false (don't render features under construction)
                //         return feature.properties.PROPERTY !== undefined ? !feature.properties.PROPERTY : true;
                        
                //     }
                //     return false;
                // },
                pointToLayer: function (feature, latlng) {
                    
                    if(feature.properties.direction){

                        return L.marker(latlng, {icon: mapControl.icons.profileIconRed})
                    }
                    return false;
                },


                onEachFeature: function (feature, layer) {
                   
                    if (feature.properties) {

                        //sr = self.searchResults[feature.properties.deployment] = {};
                        
                        var popupString = '<div class="popup">';
                        
                        for (var k in feature.properties) {
                            var v = feature.properties[k];
                            popupString += k + ': ' + v + '<br />';
                            //sr[k]=v;

                        }
                        popupString += '</div>';

                        // bind feature event here to highlight info in search results on hover or click
                        
                        layer.bindPopup(popupString, {
                            maxHeight: 200
                        });
                    }
                }
            });

            function onEachFeature(feature, layer) {
                var popupContent = "<p>I started out as a GeoJSON " +
                        feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

                if (feature.properties && feature.properties.popupContent) {
                    popupContent += feature.properties.popupContent;
                }

                layer.bindPopup(popupContent);
            }


            // add data to layer
            mapControl.layers.geojsonTrackLayer.addData(d);

            // add layer to map
            mapControl.map.addLayer(mapControl.layers.geojsonTrackLayer);

            mapControl.map.fitBounds(mapControl.layers.geojsonTrackLayer.getBounds());
        
    });


    $.getJSON(requestUrl,function(data){

        console.log(requestUrl);
        self.searchResults = data;

        self.processSearchResults();

    });

    //$.getJSON("EV_Glider_Deployment_Chooser/glider_data.php?dbtask=json_day_summarized_tracks",
    $.getJSON(requestBoundingBox,
        
        function(data){
            
            var d = data;
            
            if(typeof(mapControl.layers.geojsonLayer)!=="undefined"){
                mapControl.layers.geojsonLayer.clearLayers();    
            }
            
            mapControl.layers.geojsonLayer = new L.GeoJSON(null, {
                
                // we can filter out any features
                // filter: function (feature, layer) {
                    
                //     if (feature.properties) {
                //         // If the property "underConstruction" exists and is true, return false (don't render features under construction)
                //         return feature.properties.PROPERTY !== undefined ? !feature.properties.PROPERTY : true;
                        
                //     }
                //     return false;
                // },
                pointToLayer: function (feature, latlng) {
                    
                    if(feature.properties.direction){

                        return L.marker(latlng, {icon: mapControl.icons.profileIconRed})
                    }
                    return false;
                },


                onEachFeature: function (feature, layer) {
                   
                    if (feature.properties) {

                        //sr = self.searchResults[feature.properties.deployment] = {};
                        
                        var popupString = '<div class="popup">';
                        
                        for (var k in feature.properties) {
                            var v = feature.properties[k];
                            popupString += k + ': ' + v + '<br />';
                            //sr[k]=v;

                        }
                        popupString += '</div>';

                        // bind feature event here to highlight info in search results on hover or click
                        
                        layer.bindPopup(popupString, {
                            maxHeight: 200
                        });
                    }
                }
            });

            function onEachFeature(feature, layer) {
                var popupContent = "<p>I started out as a GeoJSON " +
                        feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

                if (feature.properties && feature.properties.popupContent) {
                    popupContent += feature.properties.popupContent;
                }

                layer.bindPopup(popupContent);
            }

            
            
            // add data to layer
            mapControl.layers.geojsonLayer.addData(d);

            // add layer to map
            mapControl.map.addLayer(mapControl.layers.geojsonLayer);

            mapControl.map.fitBounds(mapControl.layers.geojsonLayer.getBounds());

            mapControl.map.zoomOut();

            // mapControl.tracks.push(data);
            // mapControl.layers.push(L.geoJson().addTo(mapControl.map));

            // var trackPosition = mapControl.tracks.length - 1;
            // var layerPosition = mapControl.layers.length -1;

            //mapControl.layers[layerPosition].addData(mapControl.tracks[trackPosition]);

            //self.processSearchResults();

        });

};

EV_Glider_Deployment_Chooser.prototype.processSearchResults = function () {
    var self = this,
    sr = self.searchResults,
    layout = self.layout;

    // deployment_id
    // glider_id    
    // start_date   
    // end_date     
    // name         
    // date_added 
    layout.dSearchResults.empty();
    
    $.each(sr,function(r){

        //console.log(r, sr[r]);

        layout.dSearchResults.append(
            $("<div></div>")
                .append(
                    $("<h6></h6>").html(sr[r].name + " <small>("+sr[r].deployment_id + ")</small>")
                )
                .append(
                    $("<div></div>")
                        .css("float","right")

                        .append(
                            // button
                            $("<a></a>")
                                .addClass("btn")
                                .attr("title", "Add Deployment "+ sr[r].deployment_id )

                                .on("click",function(){

                                    // change icon to check
                                    //icon-ok-sign
                                    console.log(this);

                                    $(this)
                                         .removeClass("icon-chevron-right")
                                         .addClass("icon-ok-sign");


                                    layout.dSelectedDeployments.append(
                                        $("<div></div>")
                                           //.attr("data-attr-deployment", sr[r].deployment_id)
                                            .attr("data-attr-deployment-selected", sr[r].deployment_id)
                                            .append(
                                                $("<h6></h6>").html(sr[r].name + " <small>("+sr[r].deployment_id + ")</small>")
                                            )
                                            .append(
                                                $("<div></div>")
                                                    .css("float","right")

                                                    .append(
                                                        // button
                                                        $("<a></a>")
                                                            .addClass("btn")
                                                            .attr("title", "Remove Deployment "+ sr[r].deployment_id )
                                                            .html('<i class="icon-remove-sign"><i>')
                                                            .on("click",function(){

                                                                $('[data-attr-deployment-selected="'+ sr[r].deployment_id +'"]').remove();



                                                            })
                                                        )
                                            )
                                            .append(
                                                $("<div></div>")
                                                    .css({"margin-left":"10px","font-size":"12px"})
                                                    .html(
                                                        '<b>Start Date:</b> ' + sr[r].start_date + "<br>" + 
                                                        "<b>End Date: </b>" + sr[r].end_date
                                                    )
                                                

                                        )

                                    )
                                    


                                })
                                .append(
                                    $("<i></i>")
                                        .addClass("icon-chevron-right")
                                        
                                )
                                
                        )
                )
                .append(
                    $("<div></div>")
                        .css({"margin-left":"10px","font-size":"12px"})
                        .html(
                            '<b>Start Date:</b> ' + sr[r].start_date + "<br>" + 
                            "<b>End Date: </b>" + sr[r].end_date
                        )
                        

                )
        )
    })

   

}

EV_Glider_Deployment_Chooser.prototype.customization_update = function () {
    
    var self = this, sr = self.searchResults;


    //placeholder. we wont update anything here

};
