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

        "name" : "Advanced_Glider_Profile_Explorer",
        "description" : "Advanced Glider Profile Explorer",
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
                    "name" : "d3",
                    "resource_path" : "resources/js/",
                    "resource_file_name" : "d3.v3.min.js",
                    "global_reference" : "d3"
                },
                {
                    "name" : "jquery-1.9.1",
                    "resource_path" : "resources/js/",
                    "resource_file_name" : "jquery-1.9.1.min.js",
                    "dependsOn" : []
                },
                {
                    "name" : "jquery-ui",
                    "resource_path" : "resources/js/",
                    "resource_file_name" : "jquery-ui-1.10.1.custom.min.js",
                    "dependsOn" : ["jquery-1.9.1"]
                },
                {
                    "name" : "bootstrap",
                    "resource_path" : "resources/js/",
                    "resource_file_name" : "bootstrap.min.js",
                    "dependsOn":["jquery-ui"]
                },
                {
                    "name" : "bootstrap-colorpicker",
                    "resource_path" : "resources/js/",
                     "resource_file_name" : "bootstrap-colorpicker.js",
                    "dependsOn":["bootstrap"]
                }
            ],

            "scripts_external" : [
                {
                    "name" : "d3",
                    "url" : "http://d3js.org/d3.v3.min.js",
                    "global_reference" : "d3"
                }
                //,
                // {
                //     "name" : "arcgis_jsapi",
                //     "url":'http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.3compact',
                //     "dependsOn":[]
                // },
            ],

            "stylesheets_local" : [
                {
                    "name" : "toolstyle",
                    "src" : "tools/Glider_Profile_Explorer/Glider_Profile_Explorer.css"
                },
                {
                    "name" : "jquery-ui-smoothness",
                    "src" : "resources/css/smoothness/jquery-ui-1.10.1.custom.min.css"
                },
                {
                    "name" : "bootstrap-css",
                    "src" : "resources/css/bootstrap.min.css"
                },
            ],

            "stylesheets_external" : [
                {
                    "name" : "jquery-ui-css",
                    "src" : "http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"
                }
            ],

            "datasets" : [] // in case we being to support additional local resource files
            
        },

        "configuration" : {
            "title":"EV TOOL 4",
            "subtitle":"Advanced Glider Profile Explorer",
            "deployment":"221",
            "profile_id":"1",

            //"observationA":"sea_water_temperature",
            //"observationB":"sea_water_salinity",

            "observationA":{
                "observation" : "tempwat",
                //"default_value":self.settings.observationA,
                "options":{}
            },
            "observationB":{
                "observation" : "pracsal",
                //"default_value":self.settings.observationB,
                "options":{}
            }
        },

        "controls" : {

           "deployment" : {
                "type" : "textbox",
                "label" : "Deployment ID",
                "tooltip" : "Enter the default deployment id.",
                "default_value" : "221"
            }
        },
        "data" : {},
        "target_div" : "Glider_Profile_Explorer",
        "tools" : {},

        "settings" : {
            "domID": "Glider_Profile_Explorer",
          
            "datasets":{},
            "observations" : {

                "tempwat"   : {
                    "name"   : "Seawater Temperature",
                    "label"  : "Seawater Temperature (C)",
                    "column" : "sea_water_temperature (C)",
                    "units"  : "&deg;C",
                    "units2" : "Degrees Celcius"
                },
                "pracsal"      : {
                    "name"   : "Seawater Salinity",
                    "label"  : "Seawater Salinity",
                    "column" : "sea_water_salinity (psu)",
                    "units"  : "",
                    "units2" : ""
                },
                "density"       : {
                    "name"   : "Seawater Density",
                    "label"  : "Seawater Density (kg/m^3)",
                    "column" : "sea_water_density",
                    "units"  : "(kg/m^3)",
                    "units2" : "kg/m^3"
                },
                "cdomflo"  : {
                    "name"   : "CDOM",
                    "label"  : "CDOM (ppb)",
                    "column" : "sci_bbfl2s_cdom_scaled",
                    "units"  : "(ppb)",
                    "units2" : "ppb"
                },
                "chlaflo" : {
                    "name"   : "Chlorophyll",
                    "label"  : "Chlorophyll (µg/L)",
                    "column" : "sci_bbfl2s_chlor_scaled",
                    "units"  : "(µg/L)",
                    "units2" : "µg/L"
                }

            },
            "observationA" : {
                "observation" : "tempwat",
                "options" : {}
            },
            "observationB" : {
                "observation" : "pracsal",
                "options" : {}
            }
        }


    };

    tool.Advanced_Glider_Profile_Explorer = function( _target_div ){

        // reference data here
//        var target_div = "#" + _target_div || tool.target_div;

        var self = this, 
            settings = self.settings;

        settings.formats = {
            "tooltip_num" : d3.format("g"),
            "tooltip_date" : d3.time.format("%Y-%m-%d %H:%M %Z"),
            "obsdate" : d3.time.format("%Y-%m-%dT%H:%M:%SZ"),
            "dateDisplay" : d3.time.format("%Y-%m-%d %H:%M %Z")
        };

        settings.scales = {
            "datetime":{
                "hours":d3.time.scale().tickFormat("%H:M"),
                "days":d3.time.scale().tickFormat("%d"),
                "months":d3.time.scale().tickFormat("%m/%y")
            }
        };

        this.settings.deployment = this.configuration.deployment;
        this.settings.profile_id = this.configuration.profile_id;


        /***************************************/
        // SETTINGS - Parameters`
        /***************************************/


        // set the control observation dropdowns
        $.each( self.settings.observations, function( i, observation ){

            self.settings.observationA.options[i]={
                "name": observation.name,
                "value":i
            }

            self.settings.observationB.options[i]={
                "name": observation.name,
                "value":i
            }

        });

        // draw chart
        this.uiToolInterface();

        // draw ALL UI CONTROLS
        this.uiControls();

        // retrieve deployment information
        this.getDeployments( this.settings.deployment );

        // retrieve track information for the default deployment
        this.getTrack( this.settings.deployment, this.settings.profile_id );

    },

    tool.init = function() {

        // todo: include instance in call
        
        this.Advanced_Glider_Profile_Explorer(this.target_div);

    };

    tool.uiToolInterface = function () {

        var self = this,
            settings = self.settings, 
            id = settings.domID,

            container = settings.container,
            chart = settings.chart,
            controls = settings.controls,
            config = self.configuration,
            chart_title = "",
            ui = settings.ui = {};

        ui.container = {};

        ui.container.div = $("<div></div>")
            .attr("id",id + "tool-container")
            .css({
                "border":"2px solid #666666",
                "-moz-border-radius": "5px",
                "border-radius": "5px"

            })
            .addClass("container-fluid")
            .append(
                $("<div></div>")
                    .addClass("row-fluid")
                    .append(
                    $("<div></div>")
                        .addClass("span12")
                        .attr("id", id + "-title")
                        .append(
                        $("<h2></h2>").html("Advanced Glider Profile Explorer").css("border-bottom","2px solid #CCCCCC")
                    )
                )
            )
            .append(
                $("<div></div>")
                    .attr("id",id+"-chartsRow")
                    .css({
                        "height":"400px",
                        "margin-top":"6px"
                    })
                    .addClass("row-fluid")
                    .append(

                    //
                    // PROFILES DIV
                    //

                    $("<div></div>")
                        .attr("id", id + "-chart-profiles")
                        .addClass("span7 ev-chart")
                        .css({
                            //"border":"2px solid #CCCCCC",
                            //"-moz-border-radius": "5px",
                            //"border-radius": "5px",
                            "padding":"0px"
                        })
                )
                .append(

                    //
                    // SCATTERPLOT DIV
                    //

                    $("<div></div>")
                        .attr("id", id + "-chart-scatterplot")
                        .addClass("span5 ev-chart")
                        .css({
                            //"border":"2px solid #CCCCCC",
                            //"-moz-border-radius": "5px",
                            //"border-radius": "5px",
                            "padding":"3px"
                        })
                )
            )
            .append(
                $("<div></div>")
                    .addClass("row-fluid")
                    .append(
                    $("<div></div>").addClass("span7").attr("id", id + "-control-slider")
                )
                    .append(
                    $("<div></div>").addClass("span5").attr("id", id + "-profile-info")
                )
        );

        // add primary tool container to dom to obtain dimenions
        $("#"+id).append(ui.container.div);

        //tooltips
        ui.tooltips = $("<div></div>")
            .attr("id", id + "-tooltip")
            .css({"position":"absolute", "z-index":"10","visibility":"hidden"})
            .text("");
        ui.container.div.append(ui.tooltips);


        // now that container has been placed in the dom, we can calculate the available space
        self.userInterfaceDimensions();

        //
        // PROFILE CHARTS
        //

        var props = ui.container.properties,
            charts = ui.charts,

        // Chart A.. Profile Chart on left
        // chart B.. Profile Chart in middle
        // Chart C.. Scatterplot chart

            profiles = charts.profiles,
            scatterplots = charts.scatterplot,
            chartA = profiles.a = {},
            chartB = profiles.b = {},
            chartC = scatterplots.a = {},

        // get ui placeholder div for profile charts at left
            chartProfiles = d3.select("#" + id + "-chart-profiles");

        // Profile Chart A containers for svg, svg:path, svg:g, svg:g.axisX, svg:g.axisY, and svg:rect

        chartA.axisY = chartProfiles.append("svg")
            .attr("id", id + "-chartProfileLabel-svg")
            .attr("width", props.chartAxisYLabelWidth)
            .attr("height", props.chartProfilesSvgHeight)
            .append("svg:text")
            .attr("id",id+"-profiles-label")
            .attr("transform","translate(0," + props.chartProfilesSvgHeight /2 + ") rotate(270)")
            .attr("x",0)
            .attr("y", props.chartAxisYLabelWidth/2)
            .attr("fill","purple")
            .attr("text-anchor","middle")
            .text("Depth (m)");

        chartA.svg = chartProfiles.append("svg")
            .attr("id", id + "-chartA-svg")
            .attr("width", props.chartProfilesWidthA)
            .attr("height", props.chartAreaHeight);

        //add axis
        // translate svg path % of width.. include minimum..
        // calculate

        chartA.svgAxisX = chartA.svg.append("svg:g")
            .attr("id",id + "-chartA-AxisX")
            .attr("width", props.chartProfilesSvgWidth)
            .attr("height", props.chartSvgAxisLabelXHeight)
            .attr("transform","translate(" + props.chartSvgAxisYWidth + "," + props.chartProfilesSvgHeight + ")");

        chartA.svgAxisY = chartA.svg.append("svg:g")
            .attr("id",id + "-chartA-AxisY")
            .attr("width", props.chartSvgAxisYWidth)
            .attr("height", props.chartProfilesSvgHeight)
            .attr("transform","translate(" + props.chartSvgAxisYWidth + ",0)");

        // height of y axis area

        chartA.svgPath  = chartA.svg.append("svg:path")
            .attr("width", props.chartProfilesSvgWidth) // -4
            .attr("height", props.chartProfilesSvgHeight)
            .attr("transform", "translate(" + props.chartSvgAxisYWidth + "," + 0 + ")")
            .attr("id", id + "-profileA-svg-path")
            .attr("class", "svg-path")
            .attr("stroke-width",2)
            .attr("stroke", "#B94A48")
            .attr("fill", "none");

        chartA.svgSymbols = chartA.svg.append("svg:g")
            .attr("id", id + "-profileA-svg-symbols")
            .attr("width",props.chartProfilesSvgWidth)
            .attr("height",props.chartProfilesSvgHeight)
            .attr("transform", "translate(" + props.chartSvgAxisYWidth + "," + 0 + ")");

        // add the brush
        chartA.xyBrush = chartA.svg.append("g")
            .attr("class", "xy brush");

        // add the chart border
        chartA.svg.append("rect")
            .attr("width",props.chartProfilesSvgWidth) // -4
            .attr("height",props.chartProfilesSvgHeight)
            .attr("transform", "translate(" + props.chartSvgAxisYWidth + "," + 0 + ")")
            .attr("stroke","#000000")
            .attr("stroke-width",1)
            .attr("fill","none");

        // Profile Chart B containers for svg, svg:path, svg:g, and svg:rect
        chartB.svg = chartProfiles.append("svg")
            .attr("id", id + "-chartB-svg")
            .attr("width", props.chartProfilesWidthB)
            .attr("height", props.chartAreaHeight);

        chartB.svgAxisY = chartB.svg.append("svg:g")
            .attr("id",id + "-chartB-AxisY")
            .attr("width", props.chartSvgAxisYWidth)
            .attr("height", props.chartProfilesSvgHeight)
           // .attr("transform","translate(" + props.chartSvgAxisYWidth + ",0)");

        chartB.svgAxisX = chartB.svg.append("svg:g")
            .attr("id",id + "-chartB-AxisX")
            .attr("width", props.chartProfilesSvgWidth)
            .attr("height", props.chartSvgAxisLabelXHeight)
            //.attr("transform","translate(" + props.chartSvgAxisYWidth + "," + props.chartProfilesSvgHeight + ")");
            .attr("transform","translate(" + props.chartSvgAxisYWidth/2 + "," + props.chartProfilesSvgHeight + ")");

        chartB.svgPath = chartB.svg.append("svg:path")
            .attr("width", props.chartProfilesSvgWidth)
            .attr("height", props.chartProfilesSvgHeight)
           // .attr("transform", "translate(" + props.chartSvgAxisYWidth + "," + 0 + ")")
            .attr("transform", "translate(" + props.chartSvgAxisYWidth/2 + "," + 0 + ")")
            .attr("id", id + "-profileB-svg-path")
            .attr("class", "svg-path")
            .attr("stroke-width",2)
            .attr("stroke", "#B94A48")
            .attr("fill", "none");

        chartB.svgSymbols = chartB.svg.append("svg:g")
            .attr("id", id + "-profileB-svg-symbols")
            .attr("width",props.chartProfilesSvgWidth)
            .attr("height",props.chartProfilesSvgHeight)
            .attr("transform", "translate(" + props.chartSvgAxisYWidth/2 + "," + 0 + ")");
            //.attr("transform", "translate(" + props.chartSvgAxisYWidth + "," + 0 + ")");

        chartB.svg.append("rect")
            .attr("width",props.chartProfilesSvgWidth)
            .attr("height",props.chartProfilesSvgHeight)
            //.attr("transform", "translate(" + props.chartSvgAxisYWidth + "," + 0 + ")")
            .attr("transform", "translate(" + props.chartSvgAxisYWidth/2 + "," + 0 + ")")
            .attr("stroke","#000000")
            .attr("stroke-width",1)
            .attr("fill","none");

        //
        // Scatterplot Chart Container
        //

        var chartScatterplot =  d3.select("#" + id + "-chart-scatterplot");

        chartC.axisY = chartScatterplot.append("svg")
            .attr("id", id + "-chart-scatterplot-svg-label")
            .attr("width", props.chartAxisYLabelWidth)
            .attr("height", props.chartScatterPlotSvgHeight)
            .append("svg:text")
            .attr("id",id+"-scatterplot-label-y")
            .attr("transform","translate(0,"+ props.chartScatterPlotSvgHeight/2 +") rotate(270)")
            .attr("x",0)
            .attr("y", props.chartAxisYLabelWidth/2)
            .attr("fill","purple")
            .attr("text-anchor","middle")
            .text(settings.observations[settings.observationA.observation].label);

        chartC.svg = chartScatterplot.append("svg")
            .attr("id", id + "-scatterplot-svg")
            .attr("width", props.chartScatterPlotSvgWidth)
            .attr("height", props.chartAreaHeight)


        chartC.svgAxisY = chartC.svg.append("svg:g")
            .attr("id",id + "-scatterplot-AxisY")
            .attr("width", props.chartScatterPlotSvgAxisYWidth)
            .attr("height", props.chartScatterPlotSvgHeight)

        chartC.svgAxisX = chartC.svg.append("svg:g")
            .attr("id",id + "-scatterplot-AxisX")
            .attr("width", props.chartScatterPlotSvgWidth)
            .attr("height", props.chartSvgAxisLabelXHeight)
            .attr("transform","translate(" + props.chartScatterPlotSvgAxisYWidth + "," + props.chartProfilesSvgHeight + ")");

        chartC.svgChart = chartC.svg.append("svg:g")
            .attr("width", props.chartScatterPlotSvgWidth)
            .attr("height", props.chartScatterPlotSvgHeight)
            .attr("transform","translate(" + props.chartScatterPlotSvgAxisYWidth + ",0)");

        chartC.svgPath = chartC.svgChart.append("svg:path")
            .attr("width", props.chartScatterPlotSvgWidth)
            .attr("height", props.chartScatterPlotSvgHeight)
           // .attr("transform", "translate(" + props.chartScatterPlotSvgAxisYWidth + "," + 0 + ")")
            .attr("id", id + "-scatterplot-svg-path")
            .attr("class", "svg-path")
            .attr("stroke-width",2)
            .attr("stroke", "#B94A48")
            .attr("fill", "none");

        chartC.svgPathRegression = chartC.svgChart.append("svg:path")
            .attr("width", props.chartScatterPlotSvgWidth)
            .attr("height", props.chartScatterPlotSvgHeight)
           // .attr("transform", "translate(" + props.chartScatterPlotSvgAxisYWidth + "," + 0 + ")")
            .attr("id", id + "-scatterplot-svg-regression")
            .attr("class", "svg-path")
            .attr("stroke-width",2)
            .attr("stroke", "#B94A48")
            .attr("fill", "none");

        chartC.svgSymbols = chartC.svgChart.append("svg:g")
            .attr("id", id + "-scatterplot-svg-symbols")
            .attr("width", props.chartScatterPlotSvgWidth)
            .attr("height", props.chartScatterPlotSvgHeight)
           // .attr("transform", "translate(" + props.chartScatterPlotSvgAxisYWidth + "," + 0 + ")")

        // CONTROLS

        var chartProfilesControls = chartProfiles.append("div")
            .attr("id", id + "-chart-profile-controls")
           // .style("background-color","#FFF")
            .style("height",props.chartFooterHeight + "px")
            .style("width", props.chartProfilesWidth + "px")
            //.style("margin-left",props.chartAxisYLabelWidth + "px")
            .append("div").attr("class","container-fluid")
            .append("div").attr("class","row-fluid");

        // append div for observation A dropdown
        chartProfilesControls
            .append("div")
            .attr("id",id+"-control-dropdown-observationA")
            .attr("class","span6")
            .style("text-align","center");

        // append div for observation A dropdown
        chartProfilesControls
            .append("div")
            .attr("id",id+"-control-dropdown-observationB")
            .attr("class","span6")
            .style("text-align","center");

        var chartScatterplotControls = chartScatterplot.append("div")
            .attr("id", id + "-scatterplot-controls")
           // .style("background-color","#FFF")
            .style("height",props.chartFooterHeight + "px")
            .style("width", props.chartScatterPlotWidth - props.chartAxisYLabelWidth + "px") // ?chartScatterPlotSvgWidth
            .style("margin-left", props.chartAxisYLabelWidth + "px")
            .append("div").attr("class","container-fluid")
            .append("div").attr("class","row-fluid");

        // x axis label

        // append div for observation A dropdown
        chartScatterplotControls
            .append("div")
            .attr("id",id+"-scatterplot-label-x")
            .attr("class","span12 axis-label")
            .style("text-align","center");

        //todo: incorporate margins in chart area div

    };

    tool.userInterfaceDimensions = function ( ) {

        // calculate the dimensions for all ui elements
        var self = this,
            settings = self.settings,
            ui = settings.ui,
            id = settings.domID;

        var container = ui.container,
            charts = ui.charts = {},

            props = container.properties = {};

        // axis label
        props.chartSvgAxisLabelXHeight = 30;
        props.chartSvgAxisLabelYWidth = 30;

        // chartSvgAxis: axis height for x axis, width for y axis
        props.chartSvgAxisXHeight = 30;
        props.chartSvgAxisYWidth = 30;

        props.chartScatterPlotSvgAxisYWidth = 60;

        // chart margins
        props.chartMargins = {top:5,right:5,bottom:20,left:5};

        // get width of tool container dom element
        props.width = $(container.div).width();

        // get height and widths of row and charts
        props.chartRowHeight = $("#"+id+"-chartsRow").height();
        props.chartProfilesWidth = $("#" + id + "-chart-profiles").width();
        props.chartScatterPlotWidth = $("#" + id + "-chart-scatterplot").width();

        props.chartAxisYLabelWidth = 30;
        props.chartFooterHeight = 30;

        // chartAreaHeight: overall width including axis label, axis, and graph
        props.chartAreaHeight = props.chartRowHeight - props.chartMargins.top - props.chartMargins.bottom;
        //props.chartAreaWidth = props.width - props.chartAxisYLabelWidth - 8;

        props.chartProfilesWidthA =
        props.chartProfilesWidthB = (( props.chartProfilesWidth - props.chartAxisYLabelWidth) / 2) - 30;

        props.chartProfilesSvgHeight = props.chartAreaHeight - props.chartSvgAxisXHeight;
        props.chartProfilesSvgWidth = props.chartProfilesWidthA  - props.chartSvgAxisYWidth;

        //props.chartScatterPlotSvgWidth = props.chartScatterPlotWidth - props.chartAxisYLabelWidth - props.chartSvgAxisYWidth;
        props.chartScatterPlotSvgWidth = props.chartScatterPlotWidth - props.chartSvgAxisYWidth;
        props.chartScatterPlotSvgHeight = props.chartAreaHeight  -  props.chartSvgAxisXHeight;

        //props.chartSvgAxisXHeight

        props.chartProfilesMargins = {top : 0, right : 0, bottom : 0, left : 0};
        props.chartScatterPlotMargins = {top : 5, right : 5, bottom : 5, left : 5};

        props.chartProfilesTickCount =  Math.floor(props.chartProfilesSvgWidth / 50) - 1;
        props.chartScatterPlotTickCount = Math.floor(props.chartScatterPlotSvgWidth / 50);

        charts.profiles = {};
        charts.scatterplot = {};

    }

    tool.uiControls = function () {

        var self = this,
            settings = self.settings,
            id = settings.domID,
            config = self.configuration,
            ui = settings.ui,
            controls = ui.controls = {};

        controls.ctrlDeplymentInfo = $("<div></div>")

            .append(

            $("<div></div>")
                .append(
                $('<h3 class="page-header"></h3>')
                    .css({"padding-bottom":"0","margin":"0"})
                    .html("Glider Deployment:  ")
                    .append(
                    $("<small></small>")
                        .addClass("attribute")
                        .attr("id",id+"-deployment-info-name")
                )
            )
                .append(
                $("<h5></h5>")
                    .html("Start Time: ")
                    .append(
                    $("<span></span>")
                        .addClass("attribute")
                        .attr("id",id+"-deployment-info-start-time")
                )

            )
                .append(
                $("<h5></h5>")
                    .html("End Time: ")
                    .append(
                    $("<span></span>")
                        .addClass("attribute")
                        .attr("id",id+"-deployment-info-end-time")
                )

            )
    //                .append(
    //                        $("<h5></h5>")
    //                            .html("Profile Count: ")
    //                            .append(
    //                                $("<span></span>")
    //                                    .addClass("attribute")
    //                                    .attr("id",id+"deployment-info-profile-count")
    //                            )
    //                )
        );

        controls.ctrlProfileSelection = $("<div></div>")
            .css({"padding":"0","margin":"14px 0"})
            .addClass("container-fluid")
            .append(

            $("<div></div>")
                .addClass("row-fluid")
                .append(
                $("<div></div>")
                    .addClass("span2")
                    .append(
                    $("<li></li>")
                        .addClass("pager previous")
                        .append(
                        $("<a></a>")
                            .html('<i class="icon-arrow-left"></i>')
                            .on("click",function(){

                                var slider = $("#"+ self.settings.domID+"-control-profile-slider");
                                var val = slider.slider("option","value");

                                if ( val != slider.slider("option","min") ){
                                    slider.slider("value", +val - 1 );
                                }
                            })
                    )
                )
            )

                .append(
                $("<div></div>")
                    .addClass("span8")
                    .append(
                    $("<div></div>")

                        .attr("id",id+"-control-profile-slider")
                        .slider({
                            slide: function(event, ui) {
                                // CONSOLE-OFF console.log("here we can possibly highlight the profile as we slide across")
                                //$("#" + id + "profile-selection").html(
                                $("#" + id + "-profile-info-id").html(
                                    //self.settings.datasets[config.deployment].profiles[ui.value].profile_id
                                    ui.value
                                );

                            },
                            change: function(event, ui) {

                                self.slideProfile(ui.value - 1);
                            }
                        })
                )
                    .append(
                    $("<div></div>")
                        .css({"float":"left","font-weight":"bold"})
                        .html("1")
                )
                    .append(
                    $("<div></div>")
                        .attr("id", id + "-deployment-info-profile-count")
                        .css({"float":"right","font-weight":"bold"})
                        .html("&nbsp;")
                )
            )
                .append(
                $("<div></div>")
                    .addClass("span2")
                    .append(
                    $("<li></li>")
                        .addClass("pager next")
                        .append(
                        $("<a></a>")
                            //.attr("href","#")
                            .html('<i class="icon-arrow-right"></i>')
                            .on("click",function(){

                                var slider = $("#"+ self.settings.domID+"-control-profile-slider");
                                var val = slider.slider("option","value");

                                if ( val != slider.slider("option","max")){
                                    slider.slider("value", +val + 1 );
                                }
                            })
                    )
                )
            )
        );

        controls.ctrlProfileInfo = $("<div></div>")
            .css({"margin-top":"12px","padding":"0","margin":"0"})
            .addClass("container-fluid")
            .append(

            $("<div></div>")
                .addClass("row-fluid")
                .append(

                $("<div></div>")
                    .addClass("span2 profile-info-box")
                    .css("text-align","center")
                    .html("<h3>Profile</h3>")
                    .append(
                    $("<h2></h2>")
                        .attr("id", id + "-profile-info-id")
                )
            )
                .append(

                $("<div></div>")
                    .addClass("span4 profile-info-box")
                    //.css("text-align","right")
                    .html(
                        '<div style="text-align:center" id="' + id + '-profile-info-lat"></div>' +
                        '<div style="text-align:center" id="' + id + '-profile-info-long"></div>'
                    )

            )
                .append(

                $("<div></div>")
                    .addClass("span3 profile-info-box")
                    .css("text-align","center")
                    .html('<h3>Direction</h3>'+
                    '<div><img id="'+id+'-profile-info-direction" /></div>')
            )
                .append(

                $("<div></div>")
                    .addClass("span3 profile-info-box")
                    .css("text-align","center")
                    .html('<h3>Date</h3>'+
                    '<div><span id="'+id+'-profile-info-date"></span></div>')
            )
        );

        controls.ctrlDropdownObservationsSelectA = $("<select></select>")
            //.attr("id",id+"dd-observations")
            .change(function(a){

                self.customizationUpdate();

                self.transitionChartProfile("a", $(this).val() );

                self.transitionChartScatterplot("a");

            });

        controls.ctrlDropdownObservationsSelectB = $("<select></select>")
            //.attr("id",id+"dd-observations")
            .change(function(a){

                self.customizationUpdate();

                self.transitionChartProfile("b", $(this).val() );

                self.transitionChartScatterplot("a");

            });

        self.updateDropdownObservations();

        $("#" + id+ "-profile-info")
            .append(controls.ctrlProfileInfo);

        $("#" + id+ "-control-slider")
            .append(controls.ctrlProfileSelection);

        $("#" + id+ "-control-dropdown-observationA")
            .append(controls.ctrlDropdownObservationsSelectA);

        $("#" + id+ "-control-dropdown-observationB")
            .append(controls.ctrlDropdownObservationsSelectB);

    };

    tool.getDeployments = function (deploymentId){

    //    http://epe.marine.rutgers.edu/visualization/proxy_glider.php?request=getdeployments
    //
    //        id,name,start_time,end_time,casts
    //        246,"RU07 MURI/OOI",2011-12-14T17:11:00Z,2012-01-07T14:47:00Z,1651

        var self = this, 
            settings = self.settings,
            id = settings.domID, 
            config = self.configuration;

        var url = "http://epe.marine.rutgers.edu/visualization/proxy_glider.php?request=getdeployments";

        d3.csv( url, function ( data) {

            var datasets = self.settings.datasets;
            datasets["deployment"] = {};

            var deployDS = datasets["deployment"];

            console.log("....DEPLOY DATASET.... ->  deployDS -> ", data)
            data.forEach(function (d){

                //id,start_time,end_time,glider_id,name
                if( d.id == self.settings.deployment ){
                    deployDS.name = d.name
                    deployDS.start_time = self.settings.formats.obsdate.parse(d.start_time);
                    deployDS.end_time = self.settings.formats.obsdate.parse(d.end_time);
                    deployDS.glider_id = d.glider_id;
                }
                console.log("dddddddddddddd",d);
            });
        });

    };
    tool.displayInfoDeployment = function ( ){

        var self = this,
            settings = self.settings,
            formats = settings.formats,
            id = settings.domID,
            //deployDS = settings.datasets.deployment;
            deployDS = settings.datasets[settings.deployment];

        $("#" + id + "-deployment-info-name").html(deployDS.name);
        $("#" + id + "-deployment-info-profile-count").html(deployDS.profileCount);
       // $("#" + id + "-deployment-info-start-time").html(formats.dateDisplay(deployDS.start_time));
        //$("#" + id + "-deployment-info-end-time").html(formats.dateDisplay(deployDS.end_time));
        console.log("FORMATS --> ", settings.formats.dateDisplay)

    };

    tool.getTrack = function ( deploymentId, profileId ){

        var self = this,
            url = "http://epe.marine.rutgers.edu/visualization/proxy_glider.php?request=gettrack&deploymentid=" + deploymentId;

        d3.csv( url, function (data) {

            // CONSOLE-OFF console.log( "get track csv call data: " , data)

            if( data.length > 0){

                var datasets = self.settings.datasets;
                datasets[deploymentId] = {};

                var dateParse = self.settings.formats.obsdate;

                console.log("... DATASET ... ->", data);



                data.forEach(function(d){

                    if( d.direction == "d" ){
                        d.direction = "Down";
                    }
                    else{
                        d.direction = "Up";
                    }

                    d["longitude"] = +d["longitude"];
                    d["latitude"] = +d["latitude"];
                    d["obsdate"] = dateParse.parse(d["obsdate"]);

                });

                datasets[deploymentId].profiles = data;

                datasets.deployment.profileCount = data.length;

                self.displayInfoDeployment();

                self.setSlider( data.length );

                self.getCast( self.settings.deployment, self.settings.profile_id  );

            }
        });
    };

    tool.getCast = function (deploymentId, profileId, profilePosition){

        var self = this,
            id = self.settings.domID,
            url = "http://epe.marine.rutgers.edu/visualization/proxy_glider.php?request=getcast&deploymentid=" + deploymentId + "&castid=" + profileId;

        d3.csv( url, function ( data) {

            var datasets = self.settings.datasets;

            // CONSOLE-OFF console.log("deployment",deploymentId,"profile",profileId, "data",data)

            data.forEach( function ( d ) {
                d["depth"] = +d["depth"];
                d.obsdate = self.settings.formats.obsdate.parse(d.obsdate);

            });

            //datasets[deploymentId][profileId] = {
            datasets[deploymentId][profilePosition] = {
                data:data
            };

            self.transitionChartProfile("a",self.settings.observationA.observation);
            self.transitionChartProfile("b",self.settings.observationB.observation);

            self.transitionChartScatterplot("a");

        });
    };

    tool.displayInfoCast = function ( profileIndex, cast ){

        var self = this, id = self.settings.domID, imgDirection;

        $("#" + id + "-profile-info-id")
            .html(profileIndex + 1);

        $("#" + id + "-profile-info-lat")
            .html(EduVis.formats.lat(cast.latitude));

        $("#" + id + "-profile-info-long")
            .html(EduVis.formats.lng(cast.longitude));

        $("#" + id + "-profile-info-direction")
            .attr("src", "http://epe.marine.rutgers.edu/visualization/img/gliderDirection" + cast.direction + "32.png");

        $("#" + id + "-profile-info-date").html(self.settings.formats.dateDisplay(cast.obsdate));

    }

    tool.getProfileKey = function ( profileId ){

        var self = this, ds = self.settings.datasets[self.settings.deployment].profiles;

        for( var i = 1; i <= ds.length; i++ ){
            if(+ds[i]["profile_id"] == profileId)
                return i;
        }
    };

    tool.setSlider = function ( profileCount ) {
        var self=this;
        $("#"+ self.settings.domID+"-control-profile-slider").slider(
            {
                min: 1,
                max: profileCount,
                value:self.settings.profile_id
            }
        );
    };

    tool.slideProfile = function ( profileIndex ) {

        var self = this, 
            settings = self.settings,
            config = self.configuration,
            deployment = settings.deployment,

            //profile = self.settings.datasets.deployment.profiles[profileIndex];
            profile = self.settings.datasets[deployment].profiles[profileIndex];

        settings.profile_id = profileIndex;

        self.displayInfoCast( profileIndex, profile );

        self.getCast(deployment, profile.profile_id, profileIndex);

    };

    tool.parseCastData = function ( deploymentId, profileId, observation) {

        var self = this,
            ds = self.settings.datasets[deploymentId][profileId];

        ds.data.forEach( function ( d ) {
            d[observation] = +d[observation];

        });
    };

    tool.getProfilePrevNext = function ( profileId, prevNext ){

        //todo: get next profile of particular type when only one is shown on map. next or or next down...
        var self = this,
            settings = self.settings,

        // doesn't matter which direction current profile is.. we only care about what is visible on the map

        // get the array key of current profile
            key = self.getProfileKey(profileId),

        // find which one is visible
            lookingForDirection = "Up",

        // find visibilities of graphics layers?

            ds = settings.datasets[settings.deployment].profiles;

        if( prevNext == "previous"){

            for( var i = key; i >= 0; i-- ){
                if(+ds[i]["direction"] == lookingForDirection)
                    return i;
            }
        }

        if( prevNext == "next"){

            for( var i = key; i < ds.length ; i++ ){
                if(+ds[i]["direction"] == lookingForDirection)
                    return i;
            }
        }

    };

    tool.transitionChartProfile = function ( profileChart, observation ){

        var self = this,
            settings = self.settings,
            datasets = settings.datasets,
            config = self.configuration,
            obs = settings.observations[observation],
            units = obs.units,
            colX = observation,
            colY = "depth",
            id = settings.domID,
            ds = datasets[settings.deployment][settings.profile_id],
            ui = settings.ui;

        self.parseCastData( settings.deployment, settings.profile_id, observation );

        var chart = ui.charts.profiles[profileChart],
            chartPath = chart.svgPath,
            chartSymbols = chart.svgSymbols,
            xAxis = chart.svgAxisX,
            yAxis = chart.svgAxisY;

        var width = ui.container.properties.chartProfilesSvgWidth,
            height = ui.container.properties.chartProfilesSvgHeight;

        var extentX = d3.extent(ds.data,function(d){return d[colX];}),
            extentY = d3.extent(ds.data,function(d){return d[colY];}),
            lineX = d3.scale.linear()
                .range([0, width])
                .domain(extentX),
            lineY = d3.scale.linear()
                .range([0, height])
                .domain(extentY),
            axisX =  d3.svg.axis()
                .scale(lineX)
               .ticks(ui.container.properties.chartProfilesTickCount),

            axisY = d3.svg.axis()
                .scale(lineY)
                .orient("left"),
            line = d3.svg.line()
                .x(function (d) {return lineX(d[colX]);})
                .y(function (d) {return lineY(d[colY]);});

        chartPath
            .transition().duration(1000)
            .attr("d", line(ds.data));

        xAxis.call(axisX);

        if(profileChart == "a"){
            yAxis.call(axisY);
        }

        var symbols = chartSymbols
            .selectAll("circle").data(ds.data);

        symbols
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("fill", "#FFFFFF")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2);

        symbols.transition().duration(1000)
            .attr("cx", function(d) { return lineX(d[colX]); })
            .attr("cy", function(d) { return lineY(d[colY]); })
            .attr("stroke","steelblue");

        symbols.exit().remove();

        symbols
            .on("mouseover", function(d){self.chartProfileMouseOver(d,colX,colY,units);})
            .on("mousemove", function(d){self.chartMousemove();})
            .on("mouseout", function(d){self.chartMouseout();});

        d3.select("#" + self.settings.domID + "chart-x-axis-label")
            .text(obs.label);


    };

    tool.profileBrush = function(profileChart, observation){

        var  self = this,
            settings = self.settings,
            datasets = settings.datasets,
            config = self.configuration,
            obs = self.settings.observations[observation],
            units = obs.units,
            colX = observation,
            colY = "depth",
            id = settings.domID,
            ds = settings.datasets[settings.deployment][settings.profile_id],
            ui = settings.ui;

        self.d_context.append("g")
            .attr("class", "x brush")
            .call(self.chart.brush)
            .selectAll("rect").attr("y", -6)
            .attr("height", self.chart.layout.context.height + 7);

    };

    tool.transitionChartScatterplot = function ( scatterChart ){

        var self = this,
            settings = self.settings,
            datasets = settings.datasets,
            config = self.configuration,
            obsA = settings.observationA.observation,
            obsB = settings.observationB.observation,
            obsObjA = settings.observations[obsA],
            obsObjB = settings.observations[obsB],
            unitsA = obsObjA.units,
            unitsB = obsObjB.units,
            colX = obsB,
            colY = obsA,
            ds = settings.datasets[settings.deployment][settings.profile_id],
            id = self.settings.domID,
            ui = self.settings.ui;

        var scatterplots = ui.charts.scatterplot;
        var chart = scatterplots[scatterChart],
            chartPath =  chart.svgPath,
            chartSymbols = chart.svgSymbols,
            chartRegression = chart.svgPathRegression,

            xAxis = chart.svgAxisX,
            yAxis = chart.svgAxisY;

        var width = ui.container.properties.chartScatterPlotSvgWidth,
            height = ui.container.properties.chartScatterPlotSvgHeight;

        var extentX = d3.extent(ds.data,function(d){return d[colX];}),
            extentY = d3.extent(ds.data,function(d){return d[colY];}),
            lineX = d3.scale.linear()
                .range([0, width])
                .domain(extentX),
            lineY = d3.scale.linear()
                .range([ height,0])
                .domain(extentY),
            axisX =  d3.svg.axis()
                .scale(lineX)
                .orient("bottom")
                .ticks(ui.container.properties.chartScatterPlotTickCount),
            axisY = d3.svg.axis()
                .scale(lineY)
                .orient("left"),
            line = d3.svg.line()
                .x(function (d) {return lineX(d[colX]);})
                .y(function (d) {return lineY(d[colY]);});

    //    chartPath
    //        .transition().duration(1000)
    //        .attr("d", line(ds.data))

        var symbols = chartSymbols
            .selectAll("circle").data(ds.data);

        symbols
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("fill", "#FFFFFF")
            .attr("stroke", "orange")
            .attr("stroke-width", 1);

        symbols.transition().duration(1000)
            .attr("cx", function(d) { return lineX(d[colX]); })
            .attr("cy", function(d) { return lineY(d[colY]); })
            .attr("stroke","orange");

        xAxis.call(axisX);
        yAxis.call(axisY);

        symbols.exit().remove();

        symbols
            .on("mouseover", function(d){self.chartScatterplotMouseOver(d,colX,colY,unitsA,unitsB);})
            .on("mousemove", function(d){self.chartMousemove();})
            .on("mouseout", function(d){self.chartMouseout();});


        var xData = [], yData = [], points = [];

        $.each(ds.data,function(i,d){
            xData.push(d[obsB]);
            yData.push(d[obsA]);

            //console.log("d",d)
        });

        var reg = scatterplots.regression = {};

        //reg.extentX = d3.extent(ds.data, function (d) { return d[colX]; });

        reg.extentY1 = d3.extent(ds.data, function (d) { return d[obsA]; });
        reg.extentY2 = d3.extent(ds.data, function (d) { return d[obsB]; });

        reg.linResult = EduVis.utility.linReg(xData,yData);

        points[0] = {
            x:reg.extentY2[0],
            y:(reg.linResult.slope * reg.extentY2[1]) + reg.linResult.intercept
        };
        points[1] = {
            x:reg.extentY2[1],
            y:(reg.linResult.slope * reg.extentY2[0]) + reg.linResult.intercept
        };

        reg.linRegPoints = points;

        var line_lr_x = d3.scale.linear().range([0,width ]).domain(reg.extentY2);//.domain([points[0].x,points[1].x]);
        var line_lr_y = d3.scale.linear().range([0,height ]).domain(reg.extentY1);//.domain([points[0].y,points[1].y]);
        var line_lr = d3.svg.line()
            .x(function (d) {return line_lr_x(d.x);})
            .y(function (d) {return line_lr_y(d.y);});

        // console.log("Points A and B. for linear regression model", point_a,point_b);

        console.log("points",reg.linRegPoints);

        chartRegression.transition()
            .delay(1500).duration(1000)
            .attr("d", line_lr(reg.linRegPoints));

        $("#"+id+"-scatterplot-label-x").text(obsObjB.label);
        $("#"+id+"-scatterplot-label-y").text(obsObjA.label);

        ds.isGraphed = true;

        //$("#" + id + "img_loading_data").hide();

    };

    tool.customizationUpdate = function ( ) {
        // this function will update the config file which is used for subsequent calls and lookups
        var self = this,
            settings = self.settings,
            id = settings.domID,
            controls = settings.ui.controls,
            config = self.configuration;

        // todo: update config for EV
        config.observationA.observation = controls.ctrlDropdownObservationsSelectA.val();
        config.observationB.observation = controls.ctrlDropdownObservationsSelectB.val();

        settings.observationA.observation = controls.ctrlDropdownObservationsSelectA.val();
        settings.observationB.observation = controls.ctrlDropdownObservationsSelectB.val();


    };

    tool.chartProfileMouseOver = function (d,colX,colY,units) {
        var self = this, formats = self.settings.formats;

        return self.settings.ui.tooltips
            .css("visibility", "visible")
            .attr("class","label label-info" )
            .html(
            "Date: " + formats.tooltip_date(d.obsdate) + "<br />" +
                "Depth: " + d[colY] + " m <br />" +
                self.settings.observations[colX].name + ": " + formats.tooltip_num( d[colX]) + units + "</b>");

    };

    tool.chartScatterplotMouseOver = function (d,colX,colY,unitsA,unitsB) {
        var self = this,
            formats = self.settings.formats;

        return self.settings.ui.tooltips
            .css("visibility", "visible")
            .addClass("label label-info")
            .html(
            "Date: " + formats.tooltip_date(d.obsdate) + "<br />" +
                "Depth: " + d["depth"] + " m <br />" +
                self.settings.observations[colX].name + ": " + formats.tooltip_num(d[colX]) + unitsA + "</b><br />" +
                self.settings.observations[colY].name + ": " + formats.tooltip_num(d[colY]) + unitsB + "</b>");

    };

    tool.chartMousemove = function () {

        var self = this;

        return self.settings.ui.tooltips
            .css("top", (d3.event.pageY - 10) + "px")
            .css("left", (d3.event.pageX + 10) + "px");

        //todo: this is not working in older versions of firefox. might need to convert to d3.mouse

    };

    tool.chartMouseout = function () {

        var self = this;

        return self.settings.ui.tooltips
            .css("visibility", "hidden");
    };

    tool.updateDropdownObservations = function( a ){

        var self = this,
            settings = self.settings,
            id = "#"+ settings.domID,
            config = self.configuration,
            controls = settings.ui.controls,
            observations = settings.observations,
            obsA = settings.observationA,
            obsB = settings.observationB;

        controls.ctrlDropdownObservationsSelectA.children().remove();
        controls.ctrlDropdownObservationsSelectB.children().remove();

        $.each(settings.observations, function (observation) {

            controls.ctrlDropdownObservationsSelectA
                .append( new Option(observations[observation].label, observation) );

            controls.ctrlDropdownObservationsSelectB
                .append( new Option(observations[observation].label, observation) );

        });

        controls.ctrlDropdownObservationsSelectA.val(obsA.observation);
        controls.ctrlDropdownObservationsSelectB.val(obsB.observation);

        controls.ctrlDropdownObservationsSelectA
            .filter('option[value="' + obsB.observation + '"]').remove();

        controls.ctrlDropdownObservationsSelectB
            .filter('option[value="' + obsA.observation + '"]').remove();

        //$("#" + id + '-control-dropdown-observationA > option[value="' + controls.ctrlDrop.val() + '"]').remove();

    };


    // extend base object with tool.. need to be able to leave options out of tool configuration file.
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));



/*
    Ocean Observatories Initiative
    Education & Public Engagement Implementing Organization

    Name: EV4 Advanced Glider Profile Explorer
    Description: 
    Version: 0.2.2
    Revision Date: 2/22/2013
    Author: Michael Mills
    Author URL: http://marine.rutgers.edu/~mmills/
    Function Name: EV4_Advanced_Glider_Profile_Explorer
    Help File: 
*/

/*

Developers  To DO:

 chartProfiles

 chartScatterplot
 svg container
 svg y axis label
 svg scatterplot

 Notes:

*/