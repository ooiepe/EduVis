/*
    Ocean Observatories Initiative
    Education & Public Engagement Implementing Organization

    Name: NDBC Month Comparator
    Description: 
    Version: 1.1.0
    Revision Date: 7/10/2013
    Author: Michael Mills
    Author URL: http://marine.rutgers.edu/~mmills/
    Function Name: EV1_Month_Comparator
    Help File: 

*/

/*  *  *  *  *  *  *  *
*
* TOOL TEMPLATE
*
*/

(function (eduVis) {

    "use strict";
    //var tool = EduVis.tool.template;

    //console.log("tool template", tool);

    var tool = {

        "name" : "NDBC_Month_Comparator",
        "description" : "NDBC Month Comparator",
        "url" : "??__url_to_tool_help_file__?",

        "version" : "0.0.1",
        "authors" : [
            {
                "name" : "Michael Mills",
                "association" : "Rutgers University",
                "url" : "http://marine.rutgers.edu/~mmills"
            }
        ],
        
        "resources" : {

            "scripts_local" : [
                {
                    "name" : "jquery-ui",
                    "resource_path" : "resources/js/",
                    "resource_file_name" : "jquery-ui-1.10.1.custom.min.js",
                    "dependsOn" : ["jquery-1.9.1"]
                },
                {
                    "name" : "bootstrap-colorpicker",
                    "resource_path" : "resources/js/",
                     "resource_file_name" : "bootstrap-colorpicker.js",
                    "dependsOn":["bootstrap"]
                },
                {
                    "name" : "module_IOOS_SOS",
                    "resource_path" : "resources/js/",
                    "resource_file_name" : "module_IOOS_SOS.js",
                    "global_reference" : "EduVis.ioos"
                }
            ],

            "scripts_external" : [
                {
                    "name" : "d3",
                    "url" : "http://d3js.org/d3.v3.min.js",
                    "global_reference" : "d3"
                }
            ],

            "stylesheets_local" : [
                {
                    "name" : "toolstyle",
                    "src" : "tools/NDBC_Month_Comparator/NDBC_Month_Comparator.css"
                },
                {
                    "name" : "jquery-ui-smoothness",
                    "src" : "resources/css/smoothness/jquery-ui-1.10.1.custom.min.css"
                },
                {
                    "name" : "bootstrap-css",
                    "src" : "resources/css/bootstrap.min.css"
                }
            ],

            "stylesheets_external" : [
                {
                    "name" : "jquery-ui-css",
                    "src" : "http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"
                },
                {
                    "name" : "colorpicker-css",
                    "src" : "http://epe.marine.rutgers.edu/visualization/css/colorpicker.css"
                }
            ],

            "datasets" : [] // in case we being to support additional local resource files
            
        },

        "configuration" : {
            
            "title" : "EV TOOL 1",
            "subtitle" : "Month Comparator",

            "station_list" : "44025|LONG ISLAND 33\n44027|Jonesport, Maine",

            // limited list, as per tool spec.. currently not selectable
            "observation_list" : ["sea_water_temperature", "sea_water_salinity"],

            // default station to show
            "station" : "44025",

            // default observation to show
            "observation" : "sea_water_temperature",

            // all observations
            "observations" : [
                "sea_water_temperature",
                "sea_water_salinity",
                "air_temperature",
                "air_pressure_at_sea_level",
                "waves",
                "winds"
            ],

            "datasets" : {

                "2009_01" : {
                    "isVisible" : true,
                    "color"      : "#CCC"
                },
                "2010_01" : {
                    "isVisible" : false,
                    "color"      : "#666"
                },
                "2011_01" : {
                    "isVisible" : true,
                    "color"      : "#999"
                },
                "2012_01" : {
                    "isVisible" : false,
                    "color"      : "#6699CC"
                }
            },

            "mean_lines":"visible"

        },

        "controls" : {

            "station_list" : {
                "type"          : "textarea",
                "label"         : "Station List",
                "description"   : "Station List",
                "tooltip"       : "Enter a list of NDBC stations in the format: <br><em>BuoyID|Label Name</em><br>Use a new line for each station.",
                "default_value" : "44025|LONG ISLAND 33\n44027|Jonesport, Maine",//self.configuration.custom.station_list
                "delimiter"     : "|",
                "namedValues"   : ["Station ID", "Station Name"] //? not sure about this approach just yet
            }
            //,

            // "color" : {
            //     "type" : "colorpicker",
            //     "label" : "Bar Color",
            //     "tooltip" : "Select a hexidecimal color for your graph.",
            //     "default_value" : "#4682B4",
            //     "validation" : {
            //         "type" : "hexcolor"
            //     }
            // }
        },
        "data" : {},
        "target_div" : "Template",
        "tools" : {}

    };

    tool.NDBC_Month_Comparator = function( ){

        console.log("NDBC_MONTH_COMPARATOR", this);

         // reference the evTool and IOOS SOS libraries
        var self = this;

        this.version = "0.2.5";

        // define the default tool configuration.. used when no configuration override is provided

        // all observations.. no longer limiting observations for this tool
        self.observations = EduVis.ioos.getObservationObj(
            [
                "sea_water_temperature",
                "sea_water_salinity",
                "air_temperature",
                "air_pressure_at_sea_level",
                "waves",
                "winds"
            ]
        );

        // create the tool object with id. initialize the custom and default configuration objects
        // this.tool = {

        //     domID:self.evtool.domToolID( domId ),

        //     configuration:{
        //         custom:self.configuration,
        //         base:self.configuration
        //     }
        // };

        // override the default configuration with one passed by user.
        //this.evtool.configurationParse( self.configuration.custom, customToolConfiguration );

        // define the controls that will be used to modify the default and custom instances

        // create the stations obeject from the line delimited string
        this.stations = EduVis.ioos.stationListLB( self.configuration.station_list );

        // tool layout object
        this.layout = {
            container:{
                // margin:{ top:10, right:10, bottom:10, left:30 },
                // width:700,
                // height:500

                margin:{
                      left:20
                }
            },

            chart:{

                height:400,

                title:{
                    height:40
                },
                axisX:{
                    height:40
                },
                titleAxisY:{
                    width:30
                },
                axisY:{
                    width:40
                }

                //margin:{top:40, right:10, bottom:40, left:20},
                //padding:{top:10, right:10, bottom:10, left:40},
                //width:500
            },

            controls:{
                //margin:{top:10, right:20, bottom:0, left:0},
                //width:450
            }

        };


        this.chart = {

            "timeseries":{
                "observation" : "",
                "station"     : "",
                "datasets"    : {},
                "extents"     : {
                    "x" : {},
                    "y" : {}
                }
            },

            formats:{
                    twoDigitMonth : function(){return;},//d3.format("02d"),
                    d_format : function(){return;}//d3.format( "0.2r" )
            },
            options:{
                legendSorting:"ascending"

            }
        };

    // initialize the timeseries object, where all monthly data will be stored
    //    this.tool.chart.timeseries = {
    //        "observation" : "",
    //        "station"     : "",
    //        "datasets"    : {},
    //        "extents"     : {
    //            "x" : {},
    //            "y" : {}
    //        }
    //    };

        // set the available values for the inputs
        this.inputs = {
            "months": EduVis.utility.getStaticMonthObj(),
            "years" : EduVis.utility.getYearsToPresent("2009")
        };

        this.uiToolInterface( );

        // draw ALL UI CONTROLS
        this.uiChart( );

        // draw ALL UI CONTROLS
        this.uiControls( );

        // load defaults if provided
        this.loadDefaultTimeseries( );


//dasdf
        // hide loading information div
        //EduVis.tool.load_complete(this);

    };

    tool.uiToolInterface = function ( ) {

        var self = this, 
            id = self.dom_target,
            layout = self.layout,
            chart = layout.chart,
            container = layout.container;

        var uiContainer = $("<div></div>")
            .attr("id",id + "-tool-container")
            .addClass("container-fluid");

        uiContainer.append(
            $("<div></div>")
                .addClass("row-fluid")
                .append(
                    $("<div></div>").addClass("span9")
                        .attr("id",id + "-uiChart")

                )
                .append(
                    $("<div></div>")
                        .addClass("span3")
                        .attr("id",id + "-uiControls")
                )
        );

        // add tool container to obtain  dimensions
        $("#" + id).append( uiContainer );

        chart.width = $("#" + id + "-uiChart").width();

        // calculate container height.. chart + chart title + chart x axis
        container.height = chart.height + chart.title.height + chart.axisX.height;

        // controls
        layout.controls.width = $("#" + id + "-uiControls").width();
        layout.controls.height = chart.height;

        // d3 selection references
        self.toolContainer = d3.select( "#" + id + "-tool-container" );
        self.chartContainer = d3.select( "#" + id + "-uiChart" );
        self.controlContainer = d3.select( "#" + id + "-uiControls" );
    };

    tool.uiChart = function () {

        var self = this;

        var layout = self.layout,
            //container = layout.container,
            chart = self.chart,
            //controls = self.controls,
            config = self.configuration,
            id = self.dom_target,
            chartTitleHeight = layout.chart.title.height,

            axisHeightX = layout.chart.axisX.height,
            axisWidthY = layout.chart.axisY.width,
            axisTitleWidthY = layout.chart.titleAxisY.width,
            chartMarginWidth =  axisWidthY + axisTitleWidthY + 20;

        // some calculations for width and height minus margins
        //container.width_m = container.width - container.margin.left - container.margin.right;
        //container.height_m = container.height - container.margin.top - container.margin.bottom;

        // adjust the d3 line details
        chart.timeseries.y = d3.scale.linear().range( [ layout.chart.height, 0 ] );

        /***************************************/
        // d3 elements
        /***************************************/

        self.x_vals = d3.scale.linear( )
            .range( [ 0, layout.chart.width - chartMarginWidth ] )
            .domain([1, 32]);

        self.x_axis = d3.svg.axis()
            .scale( self.x_vals )
            .ticks( 6 )
            .tickSubdivide( false );

        // jQuery DOM Elements

        //tooltip
        self.chart.tooltip = self.toolContainer
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style('background-color', '#FFFFFF')
            .style("padding", "3px")
            .style("border", "1px solid #333333")
            .text("");

        // loading div
        self.d_loading = self.toolContainer.append("div")
            .attr("id",  id + "div-loading")
            .style("z-index", "100")
            .style("float", "left")
            .style("position", "absolute")
            .style("width", self.layout.chart.width + "px")
            .style("height", self.layout.chart.height + "px")
            .style("opacity", ".8")
            .style("background-color", "#CCCCCC")
            .style("visibility", "hidden")
            .append("div")
            .append("img")
            .attr("src", "http://epe.marine.rutgers.edu/visualization/img/" + "chart_loading.gif")
            .attr("alt", "LOADING....")
            .style("position", "absolute")
            .style("top", (self.layout.container.height) / 2 - 20 + "px")
            .style("left", (self.layout.container.width / 2) - 30 + "px");

        // title svg
        self.chart.title = self.chartContainer.append("svg")
            .attr( "id", id + "-chart-svg-title")
            .attr( "width", layout.chart.width )// need full width, offset text
            .attr( "height", chartTitleHeight )// chart area height
            .append( "svg:text")
            .attr( "id", id + "-chart-label-title")
            .attr( "font-size","17")
            .attr( "font-weight","bold")
            .attr( "font-stretch","wider")
            .attr( "x", ( layout.chart.width - chartMarginWidth ) / 2 + axisTitleWidthY + axisWidthY )
            .attr( "y", axisTitleWidthY / 2)
            .attr( "fill","#000")
            .attr("text-anchor","middle")
            .text( self.observations[config.observation].label + " at " + self.stations[config.station].label);

        // y axis svg
        self.chart.axisY = self.chartContainer.append("svg")
            .attr( "id", id + "-chart-svg-yAxis")
            .attr( "width", axisWidthY )
            .attr( "height", layout.chart.height)// chart area height
            .append( "svg:text")
            .attr( "id", id + "-chart-label-yAxis")
            .attr( "transform", "rotate(270)" )
            .attr( "x", -( layout.chart.height / 2) )
            .attr( "y", axisWidthY / 2 )
            .attr( "text-anchor","middle")
            .attr( "font-size","14")
            .attr( "font-weight","bold")
            .attr( "font-stretch","wider")
            .text(  self.observations[config.observation].label);

        self.chart.dynamicY = self.chartContainer.append("svg")
           // .attr("id",  id + "-dynamic_y")
            .attr("width", axisWidthY)
            .attr("height", layout.chart.height)
            .append("svg:g")
            .attr("id", id + "-dynamic_y")
            .attr("class", "y axis")
            .attr("transform","translate("+ (axisWidthY-2) +",0)");

        // chart svg
        self.chart.svg = self.chartContainer.append("svg")
            .attr("id",  id + "-svg-main")
            .attr("width", layout.chart.width - chartMarginWidth)
            .attr("height", layout.chart.height);

        // x axis svg
        self.chart.axisX = self.chartContainer.append("svg")
            .attr( "width", layout.chart.width )
            .attr( "height", axisHeightX )
            .append("svg:g")
            .attr("id",  id + "-chart-svg-xAxis")
            .attr( "width", layout.chart.width - chartMarginWidth )
            .attr( "height", axisHeightX )
            .attr("class", "axis")
            .attr("transform","translate("+ ( axisTitleWidthY + axisWidthY + 10) +",1)")
            .call(self.x_axis)
            .attr("fill", "none")
            .attr("stroke", "#000000");

        self.chart.axisXlabel = self.chartContainer.append("svg")
            .attr( "width", layout.chart.width )
            .attr( "height", axisHeightX )
            .append( "svg:text")
            .attr( "id", id + "-chart-label-axisX")
            //.attr( "x", (layout.chart.width / 2) + axisTitleWidthY + axisWidthY )
            .attr( "x", ( layout.chart.width - chartMarginWidth ) / 2 + axisTitleWidthY + axisWidthY )
            .attr( "y", axisTitleWidthY / 2)
            .attr( "font-size","14")
            .attr( "font-weight","bold")
            .attr( "fill","#000")
            .attr( "text-anchor","middle")
            .text( "Day of Month");

        self.d_timeseries = self.chart.svg.append("g")
            .attr("id", id + "-timeseries-g")
    };

    tool.uiControls = function () {
        var self = this;

        var container = self.layout.container,
            id = self.dom_target,
            config = self.configuration;

        // CONTROLS


        // ui notification items

        var loading_data_image = $( "<img />" )
            .attr( "id", id + "-img_loading_data" )
            .attr( "src", "http://epe.marine.rutgers.edu/visualization/img/" + "loading_a.gif" )
            .css( { "float" : "right", "margin-right" : "20px" } )
            .hide( );

        // Month Selector

        var ctrl_dd_month_select = $( "<select></select>" )
            .attr( "id",  id + "-ctrl-dropdown-month" )
            .css( { "width" : "auto" } )
            .change( function ( ) {
                self.customizationUpdate( );
            });

        $.each( self.inputs.months, function ( month ) {
            ctrl_dd_month_select.append(
                $( "<option></option>" )
                    .html( month )
                    .val( self.inputs.months[ month ] )
            )
        });

        // Year Selector

        var ctrl_dd_year_select = $( "<select></select>" )
            .attr( "id",  id + "-ctrl-dropdown-year" )
            .css( { "width": "auto" }  )
            .change( function () {
                self.customizationUpdate( );
            });

        $.each( self.inputs.years, function ( year ) {
            ctrl_dd_year_select.append(
                $( "<option></option>" )
                    .html( self.inputs.years[year] )
                    .val( self.inputs.years[year]) )
        });

        // Color Picker

        var ctrl_colorpicker_input = $( "<input />" )
            .attr( { "id": id + "-ctrl-colorpicker", "type":"text" } )
            .css( { "width" : "60px" } )
           // .addClass( "span5" )
            .val( "#6699CC" );

        var ctrl_colorpicker_span = $( "<span></span>" )
            .addClass("add-on").append(
                $("<i></i>")
                    .css({"background-color":"#6699CC"})
        );

        var ctrl_colorpicker = $("<div></div>")
            .addClass( "input-append color" )
            .attr( {"id": id + "-ctrl-colorpicker-cp", "data-color":"#6699CC", "data-color-format":"hex"} )
            .append( ctrl_colorpicker_input )
            .append( ctrl_colorpicker_span );

        $(ctrl_colorpicker)
            .colorpicker()
            .on( "changeColor", function ( cp ) {
                $( "#" + id + "-ctrl-colorpicker" ).val( cp.color.toHex() );
                self.customizationUpdate( );
            });

        // add month button

        var ctrl_btn_addmonth = $("<a></a>")
            .attr("id",  id + "btn_add_timeseries")
            .addClass( "btn btn-primary" )
            .on( "click", function () {

                var tmpMonth = $("#" +  id + "-ctrl-dropdown-month").val(),
                    tmpYear = $("#" + id + "-ctrl-dropdown-year").val(),
                    tmpColor = $("#" + id + "-ctrl-colorpicker").val();

                //self.configuration.custom.datasets[tmpYear + "_" + tmpMonth] = {isLoaded:false};

                self.requestData(tmpMonth, tmpYear, tmpColor);

            })
            .html("Add Month");


        // Station, Parameter, and Chart Options

        // CONTROLS - STATIONS

        var ctrl_dd_station_select = $("<select></select>")
            .attr("id", id + "-ctrl-dropdown-station")
            .change(function () {
                self.customizationUpdate();
                self.updateStationAndObservation();
            });

        $.each(self.stations, function (station) {
            ctrl_dd_station_select.append(
                $("<option></option>")
                    .html(self.stations[station].label)
                    .val(station))
        });

        var ctrl_dd_station = $("<div></div>")
            .addClass("control-dd widthAuto")
            .append(
                $("<label />")
                    .attr({'for': id + '-ctrl-dropdown-station', 'title':"Select a Station"})
                    .css({"display": "inline-block","font-weight":"bold"})
                    .html("Station")
            )
            .append(ctrl_dd_station_select);

        ctrl_dd_station_select.val( self.configuration.station );

        // CONTROLS - Observation

        var ctrl_dd_observation_select = $("<select></select>")
            .attr("id", id + "-ctrl-dropdown-observation")
            .addClass("widthAuto")
            .on("change", function () {
                // alert("new observation");
                self.customizationUpdate();
                self.updateStationAndObservation();
            });

        $.each(config.observations, function (i, observation) {
            console.log("observations", observation, self.observations);

            ctrl_dd_observation_select.append(
                $("<option></option>")
                    .html(self.observations[observation].label)
                    .val(observation))
        });

        var ctrl_dd_observation = $("<div></div>")
            .addClass("control-dd widthAuto")
            .append(
                $("<label />")
                    .attr({
                        'for': id + '-ctrl-dropdown-observation',
                        'title':"Select an Observation"
                    })
                    .css({"display": "inline-block","font-weight":"bold"})
                    .html("Observation")
            )
            .append(ctrl_dd_observation_select);


        // CONTROLS (OPTIONS) - MEAN LINE TOGGLE

        var ctrl_checkbox_mean_lines = $("<div></div>")

            .append(

                $("<input />")
                    .attr({
                        'id': id + "-ctrl-checkbox-mean-lines",
                        'type':'checkbox',
                        //'value':control.default_value,
                        'title':"Toggle the visibility of the Monthly Mean Lines",
                        'checked':'checked'
                        //    ,
                        //'maxlength':typeof(control.maxlength)=="undefined"?"":control.maxlength

                    })
                    .on("click", function () {
                        self.toggleMeanLines();
                        self.customizationUpdate( );
                    })
            )

            .append(
                $("<label />")
                    .attr({"for": id + "-ctrl-checkbox-mean-lines",
                        "title":"Toggle the visibility of the Monthly Mean Lines"})
                    .css({"display":"inline-block", "margin":"6px"})
                    .html("Show Mean Lines")
            );

        // Control Legend

        var ctrl_legend = $("<div></div>")
            .attr("id",  id + "-legend-container")
            .addClass("container-fluid kill-padding")

            .append(

                $("<div></div>")
                    .attr("id",  id + "-legend-header")
                    .append(

                        $("<div></div>")
                            .addClass("row-fluid")
                            .append($("<div></div>").addClass("span2").css("font-weight", "bold").html("&nbsp;"))
                            .append(
                                $("<div></div>").addClass("span3")
                                    .css("font-weight", "bold")
                                    .html("Month")
                                    .on("click",function(){
                                        self.legendUpdate("sort");
                                    })
                            )
                            .append($("<div></div>").addClass("span3").css("font-weight", "bold").html("Mean"))
                            .append($("<div></div>").addClass("span4").css("font-weight", "bold").html("Stdv"))
                    )
            )
            .append(

                $("<div></div>")
                    .addClass("legend-stats")

                    .append(
                        $("<div></div>")
                            .addClass("row-fluid")
                            .append(
                                $("<div></div>")
                                    .addClass("span12")
                                    .attr("id",  id + "-legend-stats" )
                                    .css(
                                        {
                                            "min-height" : 100,
                                            "max-height" : self.layout.container.height/2 - 80,
                                            "overflow-y":"auto"

                                        }
                                    )
                            )
                    )
            );

        // data request area

        var ctrl_data_request = $("<div></div>")

            .append(
                $("<div></div>")
                        .append($("<h4></h4>")
                        .css({"border-bottom":"1px solid #999"})
                        .html("Add Month Time Series"))
            )

            .append(


                $("<div></div>")
                    .attr("id",  id + "-add-month")
                    .append(
                        $("<div></div>")
                            .addClass("container-fluid  kill-padding")
                            .append(
                                $("<div></div>")
                                    .addClass("row-fluid")
                                    .append(
                                        $("<div></div>")
                                            .addClass("span12")
                                            .append( $( "<h5></h5>" )
                                                .html("1. Select Month and Year")
                                        )
                                    )
                            )
                            .append(

                                $("<div></div>")
                                    .addClass( "row-fluid" )
                                    .append(
                                        $("<div></div>").addClass("span6")
                                            .append( ctrl_dd_month_select )
                                    )
                                    .append(
                                        $("<div></div>").addClass( "span6" )
                                            .append( ctrl_dd_year_select )
                                    )
                            )
                            .append(

                                $("<div></div>")
                                    .addClass( "row-fluid" )
                                    .append(
                                        $("<div></div>")
                                            .addClass("span6")
                                            .append(
                                                $("<h5></h5>")
                                                    .html("2. Choose a Color")
                                            )
                                    )
                                    .append(
                                        $("<div></div>")
                                            .addClass("span6")
                                            .append(
                                            $("<h5></h5>")
                                                .html("3. Request Data")
                                        )
                                    )
                            )
                            .append(
                                    $("<div></div>")
                                        .addClass( "row-fluid" )

                                        .append(
                                            $("<div></div>")
                                                .addClass("span6")
                                                .append( ctrl_colorpicker )
                                        )
                                        .append(
                                            $("<div></div>")
                                                .addClass("span6 kill-margin")
                                                .append( ctrl_btn_addmonth )
                                        )
                            )
                        )
                );

        // chart options

        var ctrl_chart_options = $("<div></div>")
            .attr("id",  id + "-chart-options")
            .append(
            $("<div></div>")
                .addClass("container-fluid  kill-padding")
                .append(
                        $("<div></div>")
                            .addClass("row-fluid")
                            .append(
                            $("<div></div>")
                                .addClass("span12")
                                .append( ctrl_dd_observation )
                        )
                    )
                .append(
                    $("<div></div>")
                        .addClass("row-fluid")
                        .append(
                        $("<div></div>")
                            .addClass("span12")
                            .append( ctrl_dd_station )
                    )
                )
                .append(
                    $("<div></div>")
                        .addClass("row-fluid")
                        .append(
                        $("<div></div>")
                            .addClass("span12")
                            .append( ctrl_checkbox_mean_lines )
                    )
                )
        );

        // add all control parts.. options, data request, and legend

        $("#" + id + "-uiControls")
            .append(ctrl_chart_options)
            .append(ctrl_legend)
            .append(ctrl_data_request)


        EduVis.tool.load_complete(self);
    };

    tool.loadDefaultTimeseries = function () {
        var self = this,
            datasets = self.configuration.datasets;

        console.log("loadDefaultTimeseries:", datasets);

        // -->
        // 2009_01: Object
        // color: "#CCC"
        // isVisible: true

        // load all datasets from configuration
        $.each( datasets, function ( ds_name, dataset ) {

            var year_month = ds_name.split("_"),
                year = year_month[0],
                month = year_month[1];

            datasets[ds_name].isLoaded = false;

            self.requestData(month, year, dataset.color);

        });
    };

    tool.timeseriesParseData = function ( ds_name ) {

        var self = this;
        //var datasets = self.chart.timeseries.datasets;
        var datasets = self.configuration.datasets;
        var ds = datasets[ds_name], id = self.dom_target;

        // is there data?

        if( typeof(ds)==="undefined"){
            return;
        }
        if( ds.data.length > 0 ){

            var colY = ds.colY,
                colX = "date_time";

            var parse = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse,
                month_format = d3.time.format("%B - %Y"),
                end_month, end_year;

            // parse date and convert csv source to numerical values
            ds.data.forEach(function (d) {
                d[colX] = parse(d[colX]);
                d[colY] = +d[colY];
            });

            // find min and max dates
            var ts_min_date = d3.min(ds.data, function (d) {return d[colX];});
            var ts_max_date = d3.max(ds.data, function (d) {return d[colX];});

            // adjust end date for timeseries request to include the entire day
            if ( ts_min_date.getMonth() == 12 ) {
                end_month = 1;
                end_year = ts_min_date.getFullYear() + 1;
            }
            else {
                end_month = ts_min_date.getMonth() + 1;
                end_year = ts_min_date.getFullYear();
            }

            // set mean and standard deviation of data
            ds.mean = ( d3.sum(ds.data, function (d) { return d[colY];}) / ds.data.length);
            
            //ds.stdev = ( d3.values( ds.data ).stdev( colY ) );
            ds.stdev = EduVis.utility.stdev(d3.values( ds.data ), colY)



            // calculate various date properties
            ds.dates = {
                "month":month_format(ts_min_date),
                "range_begin":new Date(ts_min_date.getFullYear(), ts_max_date.getMonth(), 1),
                "range_end":new Date(end_year, end_month, 1),
                "month_days":new Date(ts_min_date.getFullYear(), ts_min_date.getMonth() + 1, 0).getDate()
            };

            ds.isDrawReady = true;
            ds.hasData = true;

            // if dataset is set to visible, add it
            if ( ds.isVisible ) {

                // update chart extents
                // todo: check if this is even necessary at this point.. since we're not drawing it yet
                self.updateExtentsY(
                    d3.min( ds.data, function ( d ) { return d[ colY ]; }),
                    d3.max( ds.data, function ( d ) { return d[ colY ]; })
                );
            }

            self.timeseriesAdd( ds_name );
            // replaced with refresh
            //self.legendAdd( ds_name );

        }

        self.legendRefresh();
    };

    tool.timeseriesAdd = function (ds_name) {

        var self = this,
            //ds = self.chart.timeseries.datasets[ds_name],
            config = self.configuration,
            ds = config.datasets[ds_name],
            extents = self.chart.timeseries.extents,
            g = self.layout.chart,
            layout = self.layout,
            data = ds.data,
            dates = ds.dates,
            mean = ds.mean,
            colX = "date_time",
            colY = ds.colY,
            tooltip = self.chart.tooltip,
            units = self.observations[ds.observation].units,
            id = self.dom_target,
            scaled_width = ( (layout.chart.width-100) / 31) * dates.month_days,
            line_x = d3.time.scale().range( [ 0, scaled_width ] ).domain( [ dates.range_begin, dates.range_end ]),
            line_y = self.chart.timeseries.y;

        // update extents for y
        line_y.domain( self.bufferData( [ extents.y.min, extents.y.max ] ) );

        var line = d3.svg.line()
            //.interpolate("monotone")
            .x(function (d) {return line_x(d[colX]);})
            .y(function (d) {return line_y(d[colY]);});

        var meanline = d3.svg.line()
            //.interpolate("monotone")
            .x(function (d) {return line_x(d[colX]);})
            .y(function () {return line_y( mean );});

        console.log("SVG MEAN LINE: " + ds_name);

        var svg_container = d3.select("#" +  id + "-timeseries-g")
            .append("svg:g")
            .style("display", ds.isVisible ? "block":"none")
            .attr("id", id + "-svg-g-" + ds_name);

        svg_container
            .append("svg:path")
            .attr("id",  id + "-svg_" + ds_name)
            .attr("class", "svg_timeseries")
            .attr("d", line( data ) )
            .style("stroke", ds.color)
            .style("fill", "none")
            .on( "mouseover", function () {
                return tooltip.style( "visibility", "visible" )
                    .text( dates.month )
                    .style('background-color', '#FFFFFF')
                    .style("padding", "3px")
                    .style("border", "1px solid #333333");
            })
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 10) + "px")
                    .style("left", (d3.event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                return tooltip.style( "visibility", "hidden" );
            });

        //todo: move meanline paths to a shared svg g.. toggle g for mean lines
        var lineMean = svg_container
            .append("svg:g")
            .attr("id",id + "-svg-mean-"+ ds_name);

        lineMean.append("svg:path")
            .attr("id",  id + "-svgmean-blank-" + ds_name)
            .attr("class", "svg_mean")
            .attr( "d", meanline( data ) )
            .style( "stroke", "#fff" )
            .style( "stroke-width", 3 )
            .style( "visibility", config.mean_lines)
            .on( "mouseover", function ( ) {
                return tooltip
                    .style("visibility", "visible")
                    .style('background-color', '#FFFFFF')
                    .style("padding", "3px")
                    .style("border", "1px solid #333333")
                    .html( dates.month + " mean: <b>" + self.chart.formats.d_format( mean ) + units + "</b>");

            })
            .on( "mousemove", function ( ) {
                return tooltip
                    .style( "top", ( d3.event.pageY - 10 ) + "px" )
                    .style("left", ( d3.event.pageX + 10 ) + "px" );
            })
            .on( "mouseout", function ( ) {
                return tooltip.style( "visibility", "hidden" );
            });

        lineMean.append("svg:path")
            .attr("id",  id + "-svgmean_" + ds_name)
            .attr("class", "svg_mean")
            .attr( "d", meanline( data ) )
            .style( "stroke", ds.color )
            .style( "stroke-width", 2 )
            .style( "stroke-dasharray", "9, 5" )
            .style( "visibility", config.mean_lines)
            .on( "mouseover", function ( ) {
                return tooltip
                    .style("visibility", "visible")
                    .style('background-color', '#FFFFFF')
                    .style("padding", "3px")
                    .style("border", "1px solid #333333")
                    .html( dates.month + " mean: <b>" + self.chart.formats.d_format( mean ) + units + "</b>");

            })
            .on( "mousemove", function ( ) {
                return tooltip
                    .style( "top", ( d3.event.pageY - 10 ) + "px" )
                    .style("left", ( d3.event.pageX + 10 ) + "px" );
            })
            .on( "mouseout", function ( ) {
                return tooltip.style( "visibility", "hidden" );
            });

        var date_format = d3.time.format("%m/%d/%Y-%H:%M");

        //todo: dateformat change.. logged in JIRA: issue 96

        self.chart.tooltips = svg_container
            .append("svg:g")
            .attr("id",  id + "-svg_circles_" + ds_name )
            .selectAll( "circle.area" )
            .data( data )
            .enter()
            .append ("circle" )
            .attr( "class", "area circle_" + ds_name )
            .attr("title", function (d) {
                return d[colY];
            })
            .attr("cx", function (d) {
                return line_x(d[colX]);
            })
            .attr("cy", function (d) {
                return line_y(d[colY]);
            })
            .attr("r", 3.5)
            .style("fill", "#FFFFFF")
            .style("stroke", ds.color)
            .style("stroke-width", 2)
            .on("mouseover", function (d) {
                return tooltip.style("visibility", "visible")
                    .html(date_format(d[colX]) + " - <b>" + self.chart.formats.d_format(d[colY]) + units + "</b>")
                    .style('background-color', '#FFFFFF')
                    .style("padding", "3px")
                    .style("border", "1px solid #333333");
            }
        )
            .on("mousemove", function () {
                return tooltip.style("top", (d3.event.pageY - 10) + "px")
                    .style("left", (d3.event.pageX + 10) + "px");
            }
        )
            .on("mouseout", function () {
                return tooltip.style("visibility", "hidden");
            }
        );

        ds.isGraphed = true;

        self.redrawY( );

        $("#"+ id + "-img_loading_data").hide();
    };

// LEGEND

    tool.legendRefresh = function ( ) {

        var self = this,
            //datasets = self.chart.timeseries.datasets,
            datasets = self.configuration.datasets,
            id = self.dom_target;

        $("#" + id + " .monthy-stats").remove();

        $.each( datasets, function ( ds_name, ds ) {

            var d_mean = "---",
                d_stdev = "---",
                color = ds.color;

            if(ds.hasData){

                d_mean = self.chart.formats.d_format( ds.mean );
                d_stdev = self.chart.formats.d_format( ds.stdev );
            }

            $("#"+ id + "-legend-stats").append(

                $("<div></div>")
                    .attr("id",  id + "-stats_legend_" + ds_name)
                    .addClass("monthy-stats row-fluid hover-pointer")
                    .on("click", function () {

                        if (ds.isVisible){

                            // dataset is visible.. now hide the svg group and remove fill of legend svg circle

                            $( "#" + id + "-svg-g-" + ds_name).css( "display", "none" );
                            $( "#" + id + "-svg_legend_toggle_" + ds_name).attr( "fill", "none" );

                            ds.isVisible = false;

                        }
                        else {
                            //dataset is hidden.. now display svg group and fill the legend svg circle

                            $( "#" + id + "-svg-g-" + ds_name).css( "display", "block" );
                            $( "#" + id + "-svg_legend_toggle_" + ds_name).attr( "fill", color );

                            ds.isVisible = true;
                        }

                        self.redrawY();

                    })
                    .append( $("<div></div>").addClass( "span2" ).attr( "id", id + "-stats_svg_" + ds_name ) )
                    .append( $("<div></div>").addClass( "span4 monthYear" ).html( ds_name.replace("_", " - ") ) )
                    .append( $("<div></div>").addClass( "span2 mean" ).html( d_mean ) )
                    .append( $("<div></div>").addClass( "span2 stdev" ).html( d_stdev ) )
                    .append( $("<div></div>").addClass( "span2" )
                    .append(
                    $("<i></i>")
                        .addClass("icon icon-trash hover-cursor-crossout")
                        .attr("title","Click trash can to remove month")
                        .on("click",
                        function(evt){
                            // do not let other events trigger
                            evt.stopPropagation();
                            self.removeDataset(ds_name);
                        }
                    )
                )
                )
            );

            if (ds.hasData){

                d3.select("#"+ id + "-stats_svg_" + ds_name )
                    .append( "svg" )
                    .attr( "width", "20" )
                    .attr( "height", "20" )
                    .append( "circle" )
                    .attr( "id", id + "-svg_legend_toggle_" + ds_name )
                    .attr( "cx", 10 )
                    .attr( "cy", 8 )
                    .attr( "r", 6 )
                    .attr( "stroke", color )
                    .attr( "stroke-width", "2" )
                    .attr( "fill", ds.isVisible ? color : "none" );

            }
            else{

                $("#"+ id + "-stats_svg_" + ds_name).html("NA");
                $("#" + id + "-stats_legend_" + ds_name).unbind('click');
            }

        });

        self.legendUpdate();
    };

    tool.legendUpdate = function ( sortToggle ) {
        var self = this,
            id = self.dom_target,
            legendSorting = self.chart.options.legendSorting,
            statsDivId = id + "-stats_legend_",
            month_years = [];

        $('div[id^="'+statsDivId+'"]').each( function( i, el ){

                var elementId = el.getAttribute("id"),
                    month_year_str = elementId.substring( elementId.lastIndexOf( "_" ) - 4);

                month_years[i] = month_year_str.split("_");
            }
        );

        // is this a resorting from click of month header? if so, toggle sorting
        if( typeof( sortToggle ) !== "undefined" ){

            console.log("toggled??? " + legendSorting);

            legendSorting = (legendSorting == "ascending" ? "descending" : "ascending");
            console.log("toggled!!! " + legendSorting);
        }

        if ( legendSorting == "ascending") {
            month_years.sort( );
            console.log("sorting ascending");
            console.log("month years ascending", month_years);

        }
        else {
            month_years.sort(  );
            console.log("sorting descending");
            console.log("month years descending", month_years);
        }

        for(var x = 0; x < month_years.length; x++){

            var month_year = month_years[x][0]+"_"+month_years[x][1];

            $("#" + id + "-legend-stats").first().append(
                $("#" + statsDivId + month_year)
                //    .css("background-color","yellow")
            );

        }
    };

// relculation and redraw
    tool.recalculateExtents = function(){

        var self = this,
            //datasets = self.chart.timeseries.datasets,
            datasets = self.configuration.datasets,
            extents = self.chart.timeseries.extents;

        extents.y = {};

        for ( var dataset in datasets ) {

            var colY = datasets[dataset].colY;

            if( datasets[dataset].isVisible && datasets[dataset].hasData) {

                console.log("only updating extent for dataset: ", dataset);

                self.updateExtentsY(
                    d3.min( datasets[dataset].data, function ( d ) { return d[ colY ]; }),
                    d3.max( datasets[dataset].data, function ( d ) { return d[ colY ]; })
                );
            }
        }
    };

    tool.updateExtentsY = function( yMin, yMax){

        var self = this, extents = self.chart.timeseries.extents;

        if (typeof (extents.y.min) === "undefined") {
            extents.y.min = yMin;
            extents.y.max = yMax;
        }

        else {
            if ( yMin < extents.y.min ) {
                extents.y.min = yMin;
            }
            if ( yMax > extents.y.max ) {
                extents.y.max = yMax;
            }
        }
    };

    tool.redrawY = function () {

        var self = this;

        var g = self.layout.chart,
            extents = self.chart.timeseries.extents,
            //datasets = self.chart.timeseries.datasets,
            colX = "date_time", yAxis,
            id = self.dom_target,
            config = self.configuration,
            datasets = config.datasets;

        //update y axis using global y scale
        self.recalculateExtents();

        for (var ds_name in datasets) {

            var ds = datasets[ds_name];

            if ( ds.isDrawReady && ds.isVisible) { //&& dset.isVisible

                console.log("dataset", ds_name, "is visible", ds.isVisible);

                var line_y = self.chart.timeseries.y,
                    colY = ds.colY;

                var scaled_width = ( ( g.width - 100 ) / 31) * ds.dates.month_days;

                //var line_x = d3.time.scale().range([g.margin.left, scaled_width]).domain([dset.dates.range_begin, dset.dates.range_end]);
                var line_x = d3.time.scale()
                    .range( [0, scaled_width])
                    .domain( [ds.dates.range_begin, ds.dates.range_end] );

                // update domain for current line with min and max across datasets
                line_y.domain( self.bufferData( [ extents.y.min, extents.y.max ] ) );

                // line to transition to
                var newline = d3.svg.line()
                    // .interpolate("monotone")
                    .x(function (d) {
                        return line_x( d[ colX ] );
                    })
                    .y(function (d) {
                        return line_y( d[ colY ] );
                    });

                var meanline = d3.svg.line()
                    .x(function (d) {
                        return line_x( d[colX] );
                    })
                    .y(function () {
                        return line_y( ds.mean );
                    });

                // transition lines
                var newpath = d3.selectAll("#" +  id + "-svg_" + ds_name)
                    .transition()
                    .duration(750)
                    .attr("d", newline( ds.data ));

                // only transition Y!!!
                var newcircles = d3.selectAll("#" + id + " .circle_" + ds_name)
                    .data( ds.data )
                    .transition()
                    .duration(750)
                    .attr("cy", function (d) {
                        return line_y( d[colY] );
                    });

                // new mean line..
                var newmeanlines = d3.selectAll("#" +  id + "-svgmean_" + ds_name)
                    .style( "visibility", config.mean_lines )
                    .data( ds.data )
                    .transition()
                    .duration(750)
                    .attr("d", meanline(ds.data));

                var newmeanlines2 = d3.selectAll("#" +  id + "-svgmean-blank-" + ds_name)
                    .style( "visibility", config.mean_lines )
                    .data( ds.data )
                    .transition()
                    .duration(750)
                    .attr("d", meanline( ds.data ));

                yAxis = d3.svg.axis( )
                    .scale( line_y )
                    .ticks( 8 )
                    .tickFormat(d3.format("0.0") )
                    .tickSubdivide( true )
                    .orient( "left" );

                d3.select("#" + id + "-dynamic_y")
                    .transition()
                    .duration(750)
                    .call( yAxis )
                    .attr("fill", "none")
                    .attr("stroke", "#000000")
                    .attr("shape-rendering", "crispEdges");
            }
        }
    };

    tool.toggleMeanLines = function ( ) {
        var self = this,
            //datasets = self.chart.timeseries.datasets,
            datasets = self.configuration.datasets,
            id = self.dom_target

        if ( $('#' +  id + '-ctrl-checkbox-mean-lines').is(':checked')) {
            for( var ds_name in datasets ){
                    $("#" + id + "-svgmean_" + ds_name).css( "visibility", "visible");
                    $("#" + id + "-svgmean-blank-" + ds_name).css( "visibility", "visible");
            }
        }
        else {
            for( var ds_name in datasets ){
                    $("#" + id + "-svgmean_" + ds_name).css( "visibility", "hidden");
                    $("#" + id + "-svgmean-blank-" + ds_name).css( "visibility", "hidden");
            }
        }
    };

// REQUESTS
    tool.requestData = function (month, year, color) {

        console.log("Loading CSV....");

        var self = this,
            id = self.dom_target,
            config = self.configuration;

        $("#"+ id + "-img_loading_data").show();

        var ds_name = year + '_' + month;

        var loadData = false;

        if ( typeof(config.datasets[ds_name]) === "undefined") {
            loadData = true;
            config.datasets[ds_name] = { isLoaded : false };
        }
        else
        {
            loadData = config.datasets[ds_name].isLoaded ? false : true;
        }

        if( loadData ){

            var station = $("#" +  id + "-ctrl-dropdown-station").val(),
                observation = $("#" +  id + "-ctrl-dropdown-observation").val(),
                nextDate = new Date(year, month, 1),
                nextMonth = nextDate.getMonth() + 1;

            if (nextMonth < 10) { nextMonth = "0" + nextMonth; }

            var request_url = EduVis.ioos.requestUrlTimeseriesDate(
                station,
                observation,
                {
                    dateStart:year + "-" + month + "-01",
                    dateEnd:nextDate.getFullYear() + "-" + nextMonth + "-01"
                }
            );

            // request CSV data, send response to callback function
            d3.csv(request_url, function (ts_data) {

                // todo:check length here to report empty dataset?

                $.extend(self.configuration.datasets[ds_name],
                    {
                        data        : ts_data,
                        observation : observation,
                        colY        : self.observations[observation].column,
                        month       : month,
                        year        : year,
                        station     : station,
                        color       : color,
                        isDrawReady : false,
                        isVisible   : true,
                        hasData     : false,
                        isLoaded    : true
                    });

                self.timeseriesParseData( ds_name );

            });
        }

        else {
            alert("This month is already in your list. Please choose another Month and/or year.");

            $("#"+ id + "-csv_loading").hide();
            $("#"+ id + "-img_loading_data").hide();
        }
    };

    tool.bufferData = function (d) {

        var min = d[0], max = d[1];
        var buffer = (max - min) * 0.05;
        //CONSOLE LOG//console.log(min + "--" + max + " buffer:" + buffer)
        return [min - buffer, max + buffer];
    };


    tool.updateStationAndObservation = function () {

        var self = this, id = self.dom_target,
            observation = $("#" + id + "-ctrl-dropdown-observation").val(),
            station = $("#" + id + "-ctrl-dropdown-station").val(),
            //datasets = self.chart.timeseries.datasets;
            datasets = self.configuration.datasets;

        self.chart.timeseries.extents = {
            x:{},
            y:{}
        };

        for (var ds_name in datasets) {

            var year = datasets[ds_name].year,
                month = datasets[ds_name].month,
                nextDate = new Date(year, month, 1),
                nextMonth = nextDate.getMonth() + 1;
                //current_property = datasets[ds_name].observation,

            if (nextMonth < 10) nextMonth = "0" + nextMonth;

            var url = EduVis.ioos.requestUrlTimeseriesDate(
                station,
                observation,
                {
                    dateStart:year + "-" + month + "-01",
                    dateEnd:nextDate.getFullYear( ) + "-" + nextMonth + "-01"
                }
            );

            // set all dataset properties
            datasets[ds_name].colY = self.observations[observation].column;
            datasets[ds_name].url = url;
            datasets[ds_name].isDrawReady = false;
            datasets[ds_name].hasData = false;
            datasets[ds_name].data = null;
            datasets[ds_name].observation = observation;

            // remove all svg and legend items for this dataset
            $("#" + id + "-svg-g-" + ds_name).remove();

            // set the title and the y-axis label
            d3.select("#" + id + "-chart-label-title").text(self.observations[observation].label + " at " + self.stations[station].label);
            d3.select("#" + id + "-chart-label-yAxis").text(self.observations[observation].label);

            d3.csv( datasets[ds_name].url, function (ts_data) {

                if (ts_data.length > 0) {

                    console.log("TS_DATA",ts_data);

                    var datetime = ts_data[0]["date_time"].substring(0, 7),
                        year_month = datetime.split("-"),
                        ds_name = year_month[0] + "_" + year_month[1];

                    datasets[ds_name].data = ts_data;

                }
                self.timeseriesParseData( ds_name );

                    console.log( "DATASET in CSV response ",ds_name );
            });
        }
    };

    tool.removeDataset = function ( datasetName ){

        var self = this,
            id = self.dom_target,
            datasets = self.configuration.datasets;

        // remove all elements from dom.. used array for simple additions
        [
            "-stats_legend_",
            "-svg_",
            "-svgmean_",
            "-svgmean-blank-",
            "-svg_circles_",
            "-svg_legend_toggle_",
            "-svg-g-"
        ].forEach( function( element ){

            $( "#" + id + element + datasetName ).remove();

        });

        delete datasets[datasetName];

        console.log("DELETE", "delete datasets[datasetName] ", datasets[datasetName]);

        self.redrawY();
    };

    // configuration updates
    tool.customizationUpdate = function () {
        // this function will update the config file which is used for subsequent calls and lookups
        var self = this, 
            id = self.dom_target, 
            config = self.configuration;

        config.station = $( "#" + id + "-ctrl-dropdown-station" ).val( );
        config.observation = $( "#" + id + "-ctrl-dropdown-observation" ).val( );
        config.mean_lines = $( "#" + id + "-ctrl-checkbox-mean-lines" ).is(":checked") ? "visible" : "hidden";

    };

    tool.init = function() {

        // todo: include instance in call
        console.log(" ... template init..... ", this)
        this.NDBC_Month_Comparator(this.dom_target);

    };

    // extend base object with tool.. need to be able to leave options out of tool configuration file.
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
    