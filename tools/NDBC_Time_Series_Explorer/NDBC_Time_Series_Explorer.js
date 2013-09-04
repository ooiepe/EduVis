/*  *  *  *  *  *  *  *
*
* Time Series Explorer
*
*/

(function (eduVis) {

    "use strict";
    
    var tool = {

        "name" : "NDBC_Time_Series_Explorer",
        "description" : "A Time Series Explorer for NDBC Bouy Data.",
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

        	"local_resource_path" : "",

            "scripts_local" : [

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
                    "src" : "tools/NDBC_Time_Series_Explorer/NDBC_Time_Series_Explorer.css"
                }
            ],

            "stylesheets_external" : [
                {
                    "name" : "jquery-ui-css",
                    "src" : "http://code.jquery.com/ui/1.9.2/themes/base/jquery-ui.css"
                },
                {
	                "name" : "bootstrap-css",
	                "src" : "resources/css/bootstrap.min.css"
	            },
            ],

            "datasets" : [] // in case we being to support additional local resource files
            
        },

        "configuration" : {
        	
        	"title" : "EV TOOL 2",
	        "subtitle" : "Time Series Explorer",
	        "station_list" : "44025|LONG ISLAND 33\n44027|Jonesport, Maine",
	        "date_start" : "2010-01-01",
	        "date_end" : "2010-01-14",
	        "station1" : "44025",
	        "param1" : "sea_water_salinity",
	        "station2" : "44027",
	        "param2" : "sea_water_temperature"
        },

        "controls" : {
	        
	        "station_list": {
	            "type" : "textarea",
	            "label" : "Station List",
	            "tooltip" : "Enter a list of NDBC stations in the format: <br><em>BuoyID|Label Name</em><br>Use a new line for each station.",
	            "default_value" : "44025|LONG ISLAND 33\n44027|Jonesport, Maine"
	            //"default_value" : this.tool.configuration.custom.station_list
	        }

        },
        "data" : {
        	"stations" : {},
        	"parameters" : {}

        },
        "tools" : {},

    };

    tool.NDBC_Time_Series_Explorer = function(){

        // reference data here
      	      	
      	this.setup_parameters();

      	this.interface();

      	this.draw();

    },

    tool.setup_parameters = function(){

    	var self = this;

	    self.data.parameters = EduVis.ioos.getObservationObj(
	        [
	            "sea_water_temperature",
	            "sea_water_salinity",
	            "air_temperature",
	            "air_pressure_at_sea_level",
	            "waves",
	            "winds"
	        ]
	    );
	    //console.log("Params->", self.data.parameters)

    },

    tool.interface = function(){

    	var self = this, 
    		id = self.dom_target;

    	self.chart = {
	        layout: {
	            container: {
	                margin: {
	                    top: 10,
	                    right: 20,
	                    bottom: 10,
	                    left: 10
	                },
	                width:  700,  //960
	                height: 500
	            },
	            legend: {
	                margin: {
	                    top: 10,
	                    right: 20,
	                    bottom: 0,
	                    left: 200
	                }

	            },
	            focus: {
	                margin: {
	                    top: 40,
	                    right: 40,
	                    bottom: 100,
	                    left: 60
	                }

	            },
	            context: {
	                margin: {
	                    top: 430,
	                    right: 40,
	                    bottom: 20,
	                    left: 60
	                }
	            }
	        }
	    };

	    var uiContainer = $("<div></div>")
	        .addClass("container-fluid");

	    uiContainer.append(
	        $("<div></div>")
	            .addClass("row-fluid")
	            .append(
	                $("<div></div>").addClass("span12 kill-margin")
	                    .attr("id", id + "-tool-container")
	            )
	        );

	    // add tool container to obtain  dimensions
	    $("#" + id).append( uiContainer );

	    self.chart.layout.container.width = $("#" + id + "-tool-container").width();


    },

    tool.draw = function(){

		var self = this,
			configCustom = self.configuration, 
	    	id = self.dom_target,
	    	stations = self.data.stations,
	    	chart_layout = self.chart.layout,
	    	container = chart_layout.container;

	    console.log("DRAW CONFIG:", configCustom)

	    $.each(configCustom.station_list.split("\n"), function (index,station) {
	        var parts = station.split("|"),
	        	station_id = parts[0],
	        	station_name = parts[1];

	        stations[station_id] = {};
	        stations[station_id].name = station_name;
	        stations[station_id].label = station_name + " (" + station_id + ")";
	    });

	    self.dateFormats = {
	        hours: d3.time.format("%H:M"),
	        days: d3.time.format("%d"),
	        months: d3.time.format("%m/%y"),
	        tooltip: d3.time.format("%Y-%m-%d %H:%M %Z"),
	        context: d3.time.format("%m-%d"),
	        data_source: d3.time.format("%Y-%m-%dT%H:%M:%SZ")
	    }

	    self.dateScales = {
	        // ticks(d3.time.minutes, 15)
	        hours: d3.time.scale().tickFormat("%H:M"),
	        days: d3.time.scale().tickFormat("%d"),
	        months: d3.time.scale().tickFormat("%m/%y"),
	        tooltip: d3.time.scale().tickFormat("%Y-%m-%d %H:%M %Z"),
	        context: d3.time.scale().tickFormat("%m-%d")

	    }

	    chart_layout.legend.margin.left = container.width / 2 - (container.width / 8);

	    container.width_m = container.width - container.margin.left - container.margin.right;
	    container.height_m = container.height - container.margin.top - container.margin.bottom;

	    chart_layout.context.height = container.height_m - chart_layout.context.margin.top - chart_layout.context.margin.bottom;
	    chart_layout.context.width = container.width_m - chart_layout.context.margin.left - chart_layout.context.margin.right;

	    chart_layout.focus.height = container.height_m - chart_layout.focus.margin.top - chart_layout.focus.margin.bottom;
	    chart_layout.focus.width = container.width_m - chart_layout.focus.margin.left - chart_layout.focus.margin.right;

	    self.chart.focus = {

	        param1: {
	            x: d3.time.scale().range([0, self.chart.layout.focus.width]),
	            y: d3.scale.linear().range([self.chart.layout.focus.height - 7, 7])
	        },
	        param2: {
	            x: d3.time.scale().range([0, self.chart.layout.focus.width]),
	            y: d3.scale.linear().range([self.chart.layout.focus.height - 7, 7])
	        }
	    };

	    self.chart.context = {
	        param1: {
	            x: d3.time.scale().range([0, self.chart.layout.context.width]),
	            y: d3.scale.linear().range([self.chart.layout.context.height, 0])
	        },
	        param2: {
	            x: d3.time.scale().range([0, self.chart.layout.context.width]),
	            y: d3.scale.linear().range([self.chart.layout.context.height, 0])
	        }
	    };

	    self.chart.context.axis = {
	        param1: {
	            x: d3.svg.axis().scale(self.chart.context.param1.x).orient("bottom"),
	            y: d3.svg.axis().scale(self.chart.context.param1.y).orient("left")
	        },
	        param2: {
	            x: d3.svg.axis().scale(self.chart.context.param2.x).orient("bottom"),
	            y: d3.svg.axis().scale(self.chart.context.param2.y).orient("right")
	        }
	    };

	    self.chart.focus.axis = {
	        param1: {
	            x: d3.svg.axis().scale(self.chart.focus.param1.x).orient("bottom"),
	            //.tickFormat(d3.time.format("%m/%d")
	            y: d3.svg.axis().scale(self.chart.focus.param1.y).orient("left")
	        },
	        param2: {
	            x: d3.svg.axis().scale(self.chart.focus.param2.x).orient("bottom"),
	            y: d3.svg.axis().scale(self.chart.focus.param2.y).orient("right")
	        }
	    };

	    self.chart.timeseries = {
	        datasets: {
	            param1: {
	                isDrawReady: false,
	                extents: {}
	            },
	            param2: {
	                isDrawReady: false,
	                extents: {}
	            }
	        },
	        extents: {
	            x: {
	                min: null,
	                max: null
	            },
	            y: {
	                min: null,
	                max: null
	            }
	        },
	        areParamsSame: function () {
	            if (self.chart.timeseries.datasets.param1.column == self.chart.timeseries.datasets.param2.column) return true;
	            else return false;
	        }

	    };

	    // set the defaults based on the configuration provided

	    self.chart.timeseries.datasets.param1.column = configCustom.param1;
	    self.chart.timeseries.datasets.param2.column = configCustom.param2;

	    self.chart.timeseries.datasets.param1.visible = true;
	    self.chart.timeseries.datasets.param2.visible = true;

	    // create the brush function event handler for the one of the parameters in the context.
	    self.chart.brush = d3.svg.brush()
	    	.x(self.chart.context.param1.x)
	    	.on("brush", brush);

	    self.chart.tooltip = d3.select("#"+self.dom_target)
	        .append("div").style("position", "absolute")
	        .style("z-index", "10")
	        .style("visibility", "hidden")
	        .style('background-color', '#FFFFFF')
	        .style("padding", "3px")
	        .style("border", "1px solid #333333")
	        .text("");

	    self.chart.tooltip2 = d3.select("#"+self.dom_target)
	        .append("div")
	        .style("position", "absolute")
	        .style("z-index", "10")
	        .style("visibility", "hidden")
	        .style('background-color', '#FFFFFF')
	        .style("padding", "3px")
	        .style("border", "1px solid #333333")
	        .text("");

	    var ctrl_dd_station1 = EduVis.controls.create(this, "-ctrl-dataset-dropdown-station1",
	        {
	            "type": "dropdown",
	            "label": "Station",
	            "tooltip": "Select a Buoy from the options provided.",
	            "description": "Select a Buoy",
	            "default_value": configCustom.station1,
	            "options": dd_options_stations()
	        });
	    //    interpolations:
	    //        linear
	    //        step-before
	    //        step-after
	    //        basis
	    //        basis-open
	    //        basis-closed
	    //        bundle
	    //        cardinal
	    //        cardinal-open
	    //        cardinal-closed
	    //        monotone


	    // needs references to cols by parameter here
	    self.chart.context.param1.path = d3.svg.line()
	        .interpolate("linear")
	        .x(function (d) {return self.chart.context.param1.x(d["date_time"]);})
	        .y(function (d) {return self.chart.context.param1.y(d[self.chart.timeseries.datasets.param1.column]);});

	    self.chart.context.param2.path = d3.svg.line()
	        .interpolate("linear")
	        .x(function (d) {return self.chart.context.param2.x(d["date_time"]);})
	        .y(function (d) {return self.chart.context.param2.y(d[self.chart.timeseries.datasets.param2.column]);});

	    self.chart.focus.param1.path = d3.svg.line()
	        .interpolate("linear")
	        .x(function (d) {return self.chart.focus.param1.x(d.date_time);})
	        .y(function (d) {return self.chart.focus.param1.y(d[self.chart.timeseries.datasets.param1.column]);});

	    self.chart.focus.param2.path = d3.svg.line()
	        .interpolate("linear")
	        .x(function (d) {return self.chart.focus.param2.x(d.date_time);})
	        .y(function (d) {return self.chart.focus.param2.y(d[self.chart.timeseries.datasets.param2.column]);});


	    self.tool_container = d3.select("#" + id + "-tool-container");

	    // loading div.. append it to the tool container
	    self.d_loading = self.tool_container.append("div")
	        .attr("id", id + "-div-loading")
	        .style("z-index", "100")
	        .style("float", "left")
	        .style("position", "absolute")
	        .style("width", self.chart.layout.container.width + "px")
	        .style("height", self.chart.layout.container.height + "px")
	        .style("opacity", ".8")
	        .style("background-color", "#CCCCCC")
	        .style("visibility", "hidden").append("div").append("img")
	        .attr("src", "http://epe.marine.rutgers.edu/visualization/img/chart_loading.gif")
	        .attr("alt", "LOADING....")
	        .style("position", "absolute")
	        .style("top", (self.chart.layout.container.height) / 2 - 20 + "px")
	        .style("left", (self.chart.layout.container.width / 2) - 30 + "px")

	    //TODO: set dimensions for modal to appear centered on chart, not on container div

	    // add modal div for dates
	    self.tool_container.append("div")
	        .attr("id", id + "-modal-dates")
	        .attr("class", "modal hide fade").html('<div class="modal-header">' +
	        '        <button class="close" data-dismiss="modal">×</button>' +
	        '        <h3>Date Selection</h3>' + '</div>' + '<div id="'+id+'-modal-body-dates" class="modal-body">' +
	        '        </div>' + '<div id="'+id+'-modal-footer-dates" class="modal-footer">' +
	        '       <a class="btn btn-primary vis_update">Update Visualization</a>' + '</div>');

	    // add modal div for params
	    self.tool_container.append("div")
	        .attr("id", id + "-modal-params")
	        .attr("class", "modal hide fade").html('<div class="modal-header">' +
	        '        <button class="close" data-dismiss="modal">×</button>' +
	        '        <h3>Parameter Selection</h3>' +
	        '        </div>' + '<div id="'+id+'-modal-body-params" class="modal-body">' +
	        '        <p>Select Stations and Parameters.</p>' +
	        '        </div>' + '<div id="'+id+'-modal-footer-params" class="modal-footer">' +
	        '       <a class="btn btn-primary vis_update">Update Visualization</a>' + '</div>');

	    // add the dom elements
	    self.svg = self.tool_container.append("svg")
	        .attr("id", id + "-svg_main")
	        .attr("width", self.chart.layout.container.width + self.chart.layout.container.margin.left + self.chart.layout.container.margin.right)
	        .attr("height", self.chart.layout.container.height + self.chart.layout.container.margin.top + self.chart.layout.container.margin.bottom);

	    self.svg.append("defs")
	        .append("clipPath")
	        	.attr("id", id + "-clip")
	        .append("rect")
	        	.attr("width", self.chart.layout.focus.width)
	        .attr("height", self.chart.layout.focus.height);

	    self.d_legend = self.svg.append("g")
	        .attr("id", id + "-legend")
	        .attr("transform", "translate(" + self.chart.layout.legend.margin.left + "," + self.chart.layout.legend.margin.top + ")");

	    self.d_legend_station1 = self.d_legend
	        .append("svg:g")
	        .attr("id", id + "-legend-g1")
	        .attr("class", "legend")
	        .attr("fill", "#FFF")
	        .on("mouseover",function(){

	            $("#" + id + "-legend-station1-edit").show();
	        })
	        .on("click", function (d) {
	            self.station_toggle(id, "station1")
	        })

	    self.d_legend_station1.append("svg:rect")
	        .attr("width", 220)
	        .attr("height", 20)
	        .attr("x", 70)
	        .attr("y", -18)
	        .attr("fill","#F8F8F8")

	    self.d_legend_station1.append("svg:circle")
	        .attr("id", id + "-legend-station1-circle")
	        .attr("class", "legend_station")
	        .style("stroke", "red")
	        .style("fill", "red")
	        .attr("cx", "100")
	        .attr("cy", "0")
	        .attr("r", "6")

	    self.d_legend_station1.append("svg:text")
	        .attr("id", id + "-legend-station1-text")
	        .style("fill", "#000")
	        .text(self.data.stations[self.configuration.station1].name)
	        .attr("x", "115")
	        .attr("y", "2")

	    self.d_legend_station2 = self.d_legend
	    	.append("g")
			.attr("id", id + "-legend-g2")
	        .attr("class", "legend")
	        .attr("fill", "#FFF")
	        .on("click", function (d) {
	            self.station_toggle(id, "station2")

	            // station toggle with id?
	        });


	    self.d_legend_station2.append("svg:circle")
	        .attr("id", id + "-legend-station2-circle")
	        .attr("class", "legend_station")
	        .style("stroke", "steelblue")
	        .style("fill", "steelblue")
	        .attr("cx", "300")
	        .attr("cy", "0")
	        .attr("r", "6")

	    self.d_legend_station2.append("g").append("svg:text")
	        .attr("id", id + "-legend-station2-text")
	        .attr("fill", "#000")
	        .text(self.data.stations[self.configuration.station2].name)
	        .attr("x", "315")
	        .attr("y", "2")

	    // Y AXIS LABELS
	    self.d_label_y_left = self.svg.append("g")
	        .attr("id", id + "-label-y-left")
	        .attr("transform", " translate(10," + (self.chart.layout.container.height / 2) + ") rotate(-90 0 0) ");

	    self.d_label_y_left.append("svg:text")
	        .attr("id", id + "-label-y-left-text")
	        .attr("fill", "red")
	        .attr("x", "0")
	        .attr("y", "4")
	        .text(self.data.parameters[configCustom.param1].label);

	    self.d_label_y_right = self.svg.append("g")
	        .attr("id", id + "-label-y-right")
	        .attr("transform", " translate(" + (+(self.chart.layout.container.width) - 20) + "," + (self.chart.layout.container.height / 2) + ") rotate(-90 0 0) ");

	    self.d_label_y_right.append("svg:text")
	        .attr("id", id + "-label-y-right-text")
	        .attr("fill", "steelblue")
	        .attr("x", "0")
	        .attr("y", "4")
	        .text(self.data.parameters[configCustom.param2].label);

	    self.d_context = self.svg.append("g")
	        .attr("id", id + "-context-g")
	        .attr("transform", "translate(" + self.chart.layout.context.margin.left + "," + self.chart.layout.context.margin.top + ")")

	    self.d_context.append("line")
	        .attr("x1", "0")
	        .attr("y1", "-7")
	        .attr("x2", "0")
	        .attr("y2", self.chart.layout.context.height)
	        .attr("stroke", "#000")
	        .attr("stroke-width", "1")
	        .attr("shape-rendering", "crispEdges");

	    self.d_focus = self.svg.append("g")
	        .attr("id", id + "-focus-g")
	        .attr("transform", "translate(" + self.chart.layout.focus.margin.left + "," + self.chart.layout.focus.margin.top + ")");


	    self.tool_container.append("div")
	        .attr("id", id + "-controls-div")
	        .style("width", self.chart.layout.container.width + "px")

	    var url1 = EduVis.ioos.requestUrlTimeseriesDate(
	        configCustom.station1,
	        configCustom.param1,
	        {
	            dateStart:configCustom.date_start,
	            dateEnd:configCustom.date_end
	        }
	    );

	    var url2 = EduVis.ioos.requestUrlTimeseriesDate(
	        configCustom.station2,
	        configCustom.param2,
	        {
	            dateStart:configCustom.date_start,
	            dateEnd:configCustom.date_end
	        }
	    );

	    d3.csv(url1, function (data) {

	        // get data length, if not >= 1 then throw flag
	        if (data.length === 0) {
	            
	            self.notify_nodata("param1");

	        } else {

	            //reference to param1 column
	            var colY = self.data.parameters[configCustom.param1].column,
	                units = self.data.parameters[configCustom.param1].units;

	            data.forEach(function (d) {
	                d["date_time"] = EduVis.formats.getFormatDate("data_source").parse(d.date_time);
	                d[colY] = +d[colY];
	            });

	            var ds = self.chart.timeseries.datasets["param1"];
	            ds.column = colY;
	            ds.units = units;
	            ds.data = data;
	            ds.isDrawReady = true;

	            self.review_data("init");
	        }

	    });

	    d3.csv(url2, function (data) {


	        if ( data.length === 0) {

	            self.notify_nodata("param2");

	        } else {

	            var colY = self.data.parameters[configCustom.param2].column,
	                units = self.data.parameters[configCustom.param2].units;

	            data.forEach(function (d) {
	                d["date_time"] = EduVis.formats.getFormatDate("data_source").parse(d.date_time);
	                d[colY] = +d[colY];
	            });

	            var ds = self.chart.timeseries.datasets["param2"];
	            ds.column = colY;
	            ds.units = units;
	            ds.data = data;
	            ds.isDrawReady = true;

	            self.review_data("init");
	        }
	    });

	    //TODO: body will be replaced controls div id
	    var ctrl_dates_btn = $("<a></a>").attr({
	        id: id + "-btn_dates"
	    })
	        .addClass("btn btn-primary")
	        .css("margin-right", "20px")
	        .attr("data-toggle", "modal")
	        .attr("href", "#" + id + "-modal-dates")
	        .html("Change Date Range");

	    var ctrl_datasets_btn = $("<a></a>").attr({
	        id: id + "-btn_datasets"
	    }).addClass("btn btn-primary")
	        .attr("data-toggle", "modal")
	        .attr("href", "#" + id + "-modal-params")
	        .html("Change Datasets");

	    var controls_div = $("<div></div>").attr({
	        id: id + "-control_buttons",
	        "align": "center"
	    })
	    	.append(ctrl_dates_btn)
	    	.append(ctrl_datasets_btn)
	    	.appendTo("#" + id + "-controls-div");

	    var ctrl_date_start = EduVis.controls.create(self,"ctrl-datepicker-date-start", {
	        "type": "datepicker",
	        "label": "Start Date",
	        "tooltip": "",
	        "description": "Enter or select the Time Series Start Date (yyyy-mm-dd)",
	        "default_value": configCustom.date_start,
	        "validation": {
	            "type": "datetime",
	            "format": "yyyy-mm-dd"
	        }
	    });

	    var ctrl_date_end = EduVis.controls.create(self,"ctrl-datepicker-date-end", {
	        "type": "datepicker",
	        "label": "End Date",
	        "tooltip": "",
	        "description": "Enter or select the Time Series End Date (yyyy-mm-dd)",
	        "default_value": configCustom.date_end,
	        "validation": {
	            "type": "datetime",
	            "format": "yyyy-mm-dd"
	        }
	    });

	    var ctrl_window_dates = $("<div></div>")
	        .append(ctrl_date_start)
	        .append(ctrl_date_end)
	        .appendTo("#" + id + "-modal-body-dates");

	    //this.controls.ctrl_dd_station1 = EduVis.controls.create(self,"ctrl-dataset-dropdown-station1",
	    var ctrl_dd_station1 = EduVis.controls.create(self,"ctrl-dataset-dropdown-station1",

	        {
	            "type": "dropdown",
	            "label": "Station",
	            "tooltip": "Select a Buoy from the options provided.",
	            "description": "Select a Buoy",
	            "default_value": configCustom.station1,
	            "options": dd_options_stations()
	        });

	    var ctrl_dd_station2 = EduVis.controls.create(self,"ctrl-dataset-dropdown-station2",

	        {
	            "type": "dropdown",
	            "label": "Station",
	            "tooltip": "Select a Buoy from the options provided.",
	            "description": "Select a Buoy",
	            "default_value": configCustom.station2,
	            "options": dd_options_stations()
	        });

	    var ctrl_dd_param1 = EduVis.controls.create(self,"ctrl-dataset-dropdown-param1",

	        {
	            "type": "dropdown",
	            "label": "Parameter",
	            "tooltip": "Select a Parameter from the options provided.",
	            "description": "Select a Parameter",
	            "default_value": configCustom.param1,
	            "options": dd_options_parameters()
	        });

	    var ctrl_dd_param2 = EduVis.controls.create(self,"ctrl-dataset-dropdown-param2",

	        {
	            "type": "dropdown",
	            "label": "Parameter",
	            "tooltip": "Select a Parameter from the options provided.",
	            "description": "Select a Parameter",
	            "default_value": configCustom.param2,
	            "options": dd_options_parameters(),
	            "nolabel": true
	        });

	    var ctrl_window_datasets = $("<div></div>").addClass('container-fluid')

	    	.append(

	        	$('<div class="row-fluid"></div>')
		            .attr({
		                id: id + "-param1"
		            })
		            .append($(ctrl_dd_station1))
		            .append($(ctrl_dd_param1))
            )
	        .append(
		        $('<div class="row-fluid"></div>')
		            .attr({
		                id: id + "-param2"
		            })
		            .append($(ctrl_dd_station2))
		            .append($(ctrl_dd_param2))
		    )
	        .appendTo("#" + id + "-modal-body-params");

	    // add click events for visualization update buttons
	    $('.vis_update').on('click', function (a) {

	        // show the loading div with transparent overlay
	        $("#" + id + "-div-loading").css("visibility", "visible");

	        self.chart_datasets_update();
	        $(".modal").modal("hide");
	    });

	    // populate the drop down options for parameters
	    function dd_options_parameters() {
	        
	    	console.log("dd_options_parameters");

	        var options = [],
	        params = self.data.parameters;

	        $.each(params, function (param) {
	            options.push({
	                name: params[param].label,
	                value: param
	            })
	        });

	        return options;
	    }

	    // populate the drop down options for stations
	    function dd_options_stations() {

			console.log("dd_options_stations", self);
	        var options = [];

	        $.each(self.data.stations, function (station) {
	            options.push({
	                name: self.data.stations[station].name,
	                value: station
	            })
	        });
	        return options;
	    }

	    // brush function for selecting focus area in the context section

	    function brush(){

	    	console.log(".....Brush....this -->..", this);
	    	
	    	// var id = self.dom_target;
	    	// TODO: dynamic date scaling functions

	        // hour, day, month
	        // --> https://github.com/mbostock/d3/wiki/Time-Scales
	        // Date Ticks --> http://bl.ocks.org/1071269
	        //var config_custom = self.chart.timeseries.config.custom;
	        var configCustom = self.configuration;

	        var colY1 = self.data.parameters[configCustom.param1].column,
	            colY2 = self.data.parameters[configCustom.param2].column;

	        // set domain from context brush
	        self.chart.focus["param1"].x.domain(self.chart.brush.empty() ? self.chart.context["param1"].x.domain() : self.chart.brush.extent());
	        self.chart.focus["param2"].x.domain(self.chart.brush.empty() ? self.chart.context["param2"].x.domain() : self.chart.brush.extent());

	        // update visible path area
	        self.d_focus.select("#" + id + "-path-focus-param1")
	        	.attr("d", self.chart.focus["param1"].path);

	        self.d_focus.select("#" + id + "-path-focus-param2")
	        	.attr("d", self.chart.focus["param2"].path);

	        // update all circle positions for param1
	        var brush1_update = d3.select("#" + id + "-datapoints-param1")
	            .selectAll("path")
	            .data(self.chart.timeseries.datasets["param1"].data)
	            .attr("transform", function (d) {
	                return "translate(" + self.chart.focus["param1"].x(d.date_time) + "," + self.chart.focus["param1"].y(d[colY1]) + ")";
	            })
	            .attr("d", d3.svg.symbol().type("circle"))

	        var brush2_update = d3.select("#" + id + "-datapoints-param2")
	            .selectAll("path")
	            .data(self.chart.timeseries.datasets["param2"].data)
	            .attr("transform", function (d) {
	                return "translate(" + self.chart.focus["param2"].x(d.date_time) + "," + self.chart.focus["param2"].y(d[colY2]) + ")";
	            })
	            .attr("d", d3.svg.symbol().type("triangle-up"))

	        // update the focus axis based on area brushed
	        self.d_focus.selectAll(".x.axis")
	            .call(self.chart.focus.axis["param1"].x);

	    };
   

		EduVis.tool.load_complete(self);

    },

    tool.init = function() {

        // todo: include instance in call
        
        this.NDBC_Time_Series_Explorer(this.dom_target);

    },

    tool.chart_datasets_update = function () {

	    console.log("... UPDATE DATASETS ... ");


	    var self = this,
	    id = self.dom_target;

		console.log("config", self.configuration);



	    var configCustom = self.configuration,
	        ds1 = self.chart.timeseries.datasets["param1"],
	        ds2 = self.chart.timeseries.datasets["param2"];

	    // zero out domains
	    self.chart.timeseries.extents.x = {};
	    self.chart.timeseries.extents.y = {};

	    ds1.extents = {};
	    ds2.extents = {};

	    // we can compare the configs to determine what kind of updates are necessary

	    var url1 = EduVis.ioos.requestUrlTimeseriesDate(
	        configCustom.station1,
	        configCustom.param1,
	        {
	            dateStart:configCustom.date_start,
	            dateEnd:configCustom.date_end
	        }
	    );

	    var url2 = EduVis.ioos.requestUrlTimeseriesDate(
	        configCustom.station2,
	        configCustom.param2,
	        {
	            dateStart:configCustom.date_start,
	            dateEnd:configCustom.date_end
	        }
	    );

	    ds1.isDrawReady = false;
	    ds2.isDrawReady = false;

	    // now make the date updates if they have changed.
	    d3.csv(url1, function (data) {

	        if (data.length === 0) {

	            // need a reference to parameter
	            self.notify_nodata("param1");

	        } else {

	            var colY = self.data.parameters[self.configuration.param1].column,
	                units = self.data.parameters[self.configuration.param1].units;

	            data.forEach(function (d) {
	                d["date_time"] = EduVis.formats.getFormatDate("data_source").parse(d.date_time);
	                d[colY] = +d[colY];
	            });

	            var ds = self.chart.timeseries.datasets["param1"];
	            ds.column = colY;
	            ds.units = units;
	            ds.data = data;
	            ds.isDrawReady = true;
	            ds.extents = {};

	            console.log("Parameter 1")
	            console.log("Column: " + colY);
	            console.log("isDrawReady: " + ds.isDrawReady.toString());


	            self.review_data("update");
	        }
	    });

	    d3.csv(url2, function (data) {

	        if (data.length === 0) {
	            self.notify_nodata("param2");

	        } else {

	            var colY = self.data.parameters[configCustom.param2].column,
	                units = self.data.parameters[configCustom.param2].units;

	            data.forEach(function (d) {
	                d["date_time"] = EduVis.formats.getFormatDate("data_source").parse(d.date_time);
	                d[colY] = +d[colY];
	            });

	            var ds = self.chart.timeseries.datasets["param2"];
	            ds.column = colY;
	            ds.units = units;
	            ds.data = data;
	            ds.isDrawReady = true;
	            ds.extents = {};

	            // console.log("Parameter 2")
	            // console.log("Column: " + colY);
	            // console.log("isDrawReady: " + ds.isDrawReady.toString());
	            self.review_data("update");
	        }
	    });

	},
	tool.review_data = function (funct) {

	    var self = this;
	    var ts = self.chart.timeseries,
	    	id = self.dom_target;

	    var ds1 = ts.datasets["param1"],
	        ds2 = ts.datasets["param2"];

	    var focus1 = self.chart.focus["param1"],
	        context1 = self.chart.context["param1"],
	        focus2 = self.chart.focus["param2"],
	        context2 = self.chart.context["param2"];

	    if (ds1.isDrawReady && ds2.isDrawReady) {

	        // its time to draw, so calculate the extents and set the global x extents

	        // console.log('calculating global extents....');
	        self.calc_extents();

	        // console.log('calculating x extents....');
	        self.calc_x_extents();

	        var ext = ts.extents,
	            ext1 = ds1.extents,
	            ext2 = ds2.extents;

	        console.log("Are the parameters the same? .... " + ts.areParamsSame().toString())
	        if (ts.areParamsSame()) {

	            console.log('calculating y extents....');
	            self.calc_y_extents();
	            console.log(ext);

	            focus1.y.domain([ext.y.min, ext.y.max]);
	            focus2.y.domain([ext.y.min, ext.y.max]);

	            context1.y.domain([ext.y.min, ext.y.max]);
	            context2.y.domain([ext.y.min, ext.y.max]);
	        } else {

	            // console.log("COLUMNS: " + ds1.column + '-' + ds2.column);

	            // parameters are different, calculate the respective extents
	            context1.y.domain([ext1.y.min, ext1.y.max]);
	            focus1.y.domain([ext1.y.min, ext1.y.max]);

	            context2.y.domain([ext2.y.min, ext2.y.max]);
	            focus2.y.domain([ext2.y.min, ext2.y.max]);
	        }

	        context1.x.domain([ext.x.min, ext.x.max]);
	        focus1.x.domain([ext.x.min, ext.x.max]);
	        context2.x.domain([ext.x.min, ext.x.max]);
	        focus2.x.domain([ext.x.min, ext.x.max]);

	        if (funct == "init") {
	            // now transition the paths to the new data
	            self.add_data("param2");
	            self.add_data("param1");

	        } else {

	            $("#" + id + "-div-loading").css("visibility", "hidden");

	            self.transition_data("param2");
	            self.transition_data("param1");

	        }
	    }
	},
	tool.calc_y_extents = function () {

	    var self = this;
	    var ts = self.chart.timeseries;

	    var ext = ts.extents,
	        ext1 = ts.datasets["param1"].extents,
	        ext2 = ts.datasets["param2"].extents,
	        minY, maxY;

	    if (ext1.y.min < ext2.y.min) {
	        minY = ext1.y.min;
	    } else {
	        minY = ext2.y.min;
	    }
	    if (ext1.y.max > ext2.y.max) {
	        maxY = ext1.y.max;
	    } else {
	        maxY = ext2.y.max;
	    }

	    ext.y = {
	        min: minY,
	        max: maxY
	    }

	},
	tool.calc_x_extents = function () {

	    var self = this;
	    var ts = self.chart.timeseries,
	        minX, maxX;

	    var ext = ts.extents,
	        ext1 = ts.datasets["param1"].extents,
	        ext2 = ts.datasets["param2"].extents;

	    if (ext1.x.min < ext2.x.min) {
	        minX = ext1.x.min;
	    } else {
	        minX = ext2.x.min;
	    }
	    if (ext1.x.max > ext2.x.max) {
	        maxX = ext1.x.max;
	    } else {
	        maxX = ext2.x.max;
	    }

	    ext.x = {
	        min: minX,
	        max: maxX
	    }
	},

	tool.calc_extents = function () {

	    // this function will calculate the min and max values across two datasets when param1 = param2
	    // allows for the datasets to share the same y axis
	    var self = this;
	    var ds1 = self.chart.timeseries.datasets["param1"];
	    var ds2 = self.chart.timeseries.datasets["param2"];
	    console.log("CALC_EXTENTS()")
	    console.log("COLUMN 1: " + ds1.column)
	    console.log("COLUMN 2: " + ds2.column)

	    var xmin = d3.min(ds1.data, function (d) { return d["date_time"];}),
	        xmax = d3.max(ds1.data, function (d) {return d["date_time"];}),
	        ymin = d3.min(ds1.data, function (d) {return d[ds1.column];}),
	        ymax = d3.max(ds1.data, function (d) {return d[ds1.column];});

	    ds1.extents = {
	        x: {
	            min: xmin,
	            max: xmax
	        },
	        y: {
	            min: ymin,
	            max: ymax
	        }
	    }

	    xmin = d3.min(ds2.data, function (d) {return d["date_time"];});
	    xmax = d3.max(ds2.data, function (d) {return d["date_time"];});
	    ymin = d3.min(ds2.data, function (d) {return d[ds2.column];});
	    ymax = d3.max(ds2.data, function (d) {return d[ds2.column];});

	    ds2.extents = {
	        x: {
	            min: xmin,
	            max: xmax
	        },
	        y: {
	            min: ymin,
	            max: ymax
	        }
	    }
	},
	tool.add_data = function (param) {

	    var self = this,
	    	id = self.dom_target;

	    var dataset = self.chart.timeseries.datasets[param];

	    var data = dataset.data,
	        config_custom = self.configuration;

	    var colY = dataset.column,
	        units = dataset.units;

	    var focus = self.chart.focus[param],
	        context = self.chart.context[param],
	        focus_axis = self.chart.focus.axis[param],
	        context_axis = self.chart.context.axis[param];

	    // append the path for the current parameter
	    self.d_focus.append("path")
	        .data([data])
	        .attr("id", id + "-path-focus-" + param)
	        .style("stroke", (param == "param1") ? "red" : "steelblue")
	        .style("stroke-width", "4px")
	        .attr("class", "path-focus")
	        .attr("clip-path", "url(#"+id+"-clip)")
	        .attr("d", focus.path);

	    // append the context path for the current parameter
	    self.d_context.append("path")
	        .attr("id", id + "-path-context-" + param)
	        .attr("class", "path-context")
	        .style("stroke", (param == "param1") ? "red" : "steelblue")
	        .data([data]).attr("d", context.path);

	    self.d_focus.append("svg:g")
	        .attr("id", id + "-datapoints-" + param)
	        .attr("clip-path", "url(#"+id+"-clip)")
	        .selectAll("path").data(data)
	        .enter()
	        .append("path")
	        .attr("class", "dp-" + (param == "param1") ? "circle" : "triangle-up")
	        .attr("fill", (param == "param1") ? "red" : "steelblue")
	        .attr("transform", function (d) {
	            return "translate(" + focus.x(d.date_time) + "," + focus.y(d[colY]) + ")";
	        })
	        .attr("d", d3.svg.symbol().type((param == "param1") ? "circle" : "triangle-up"))
	        .on("mouseover", function (d) {
	            return self.chart.tooltip.style("visibility", "visible")
	                .html(EduVis.formats.getFormatDate("tooltip")(d["date_time"]) + " - <b>" + d[colY] + " " + units + "</b>")
	        }).on("mousemove", function () {
	            return self.chart.tooltip.style("top", (d3.event.pageY - 10) + "px")
	                .style("left", (d3.event.pageX + 10) + "px");
	        }).on("mouseout", function () {
	            return self.chart.tooltip.style("visibility", "hidden");
	        });

	    if (param == "param1") {

	        // append the focus area x axis, we only need one
	        self.d_focus.append("g")
	            .attr("class", "x axis")
	            .attr("id", id + "-path-focus-axis-" + param)
	            .attr("transform", "translate(0," + self.chart.layout.focus.height + ")")
	            .call(focus_axis.x);

	        // append the context area x axis
	        self.d_context.append("g")
	            .attr("class", "x axis")
	            .attr("id", id + "-path-context-axis-" + param)
	            .attr("transform", "translate(0," + self.chart.layout.context.height + ")")
	            .call(context_axis.x);

	        // append the left axis if it is param1
	        self.d_focus.append("g")
	            .attr("id", id + "-y-axis-left")
	            .attr("class", "y axis-left")
	            .call(focus_axis.y);
	    } else {

	        // append the right axis if it is param2
	        self.d_focus.append("g")
	            .attr("id", id + "-y-axis-right")
	            .attr("class", "y axis-right")
	            .attr("transform", "translate(" + self.chart.layout.focus.width + ",0)")
	            .call(focus_axis.y);
	    }

	    // add the brush
	    self.d_context.append("g")
	        .attr("class", "x brush")
	        .call(self.chart.brush)
	        .selectAll("rect").attr("y", -6)
	        .attr("height", self.chart.layout.context.height + 7);

	},
	tool.transition_data = function (param) {
	    var self = this,
	    	dataset = self.chart.timeseries.datasets[param],
	    	config_custom = self.configuration;

	    //console.log("Param: " + param);
	    //console.log("Parameter: " + config_custom[param]);
	    //console.log("Column: " + self.data.parameters[config_custom[param]].column);

	    var colY = dataset.column,
	        units = dataset.units,
	        id = self.dom_target;

	    var data = dataset.data,
	        focus = self.chart.focus[param],
	        context = self.chart.context[param],

	        focus_axis = self.chart.focus.axis[param],
	        context_axis = self.chart.context.axis[param];

	    console.log("Y EXTENTS...")
	    console.log(focus.y.domain());
	    console.log(dataset.extents)

	    // transition the focus path
	    var focus_transition = d3.select("#"+ id + "-path-focus-" + param)
	        .data([data])
	        .transition()
	        .duration(2000)
	        .attr("d", focus.path);

	    // check if its param 1 or 2
	    if (param == "param1") {

	        // transition the y axis
	        var y_axis_transition = d3.select("#" + id + "-y-axis-left")
	            .data([data])
	            .transition()
	            .call(focus_axis.y);

	        //update the y axis label
	        d3.select("#" + id + "-label-y-left-text")
	            .transition()
	            .text(self.data.parameters[config_custom.param1].label);

	        // update the station label text for station 1
	        d3.select("#" + id + "-legend-station1-text")
	            .transition()
	            .text(self.data.stations[config_custom.station1].name);

	    } else {

	        // transition the y axis
	        var y_axis_transition = d3.select("#" + id + "-y-axis-right")
	            .data([data])
	            .transition()
	            .call(focus_axis.y);

	        // update the y axis text
	        d3.select("#" + id + "-label-y-right-text")
	            .transition()
	            .text(self.data.parameters[config_custom.param2].label)

	        // update the y axis label
	        d3.select("#" + id + "-legend-station2-text")
	            .transition()
	            .text(self.data.stations[config_custom.station2].name)

	    }

	    //console.log("... Transition on #path-context-"+param + " ....");

	    // transition the context path for the current param
	    d3.select("#" + id + "-path-context-" + param).data([data])
	        //       .transition()
	        //           .duration(2000)
	        .attr("d", context.path);

	    // update the x axis - only need to do this once
	    if (param == "param1") {

	        // transition the context axis
	        d3.select("#" + id + "-path-context-axis-param1")
	            .data(data)
	            .transition()
	            .call(context_axis.x);

	        // transition the focus axis
	        d3.select("#" + id + "-path-focus-axis-param1")
	            .data(data)
	            .transition()
	            .call(focus_axis.x);
	    }

	    var datapoints_update = d3.select("#" + id + "-datapoints-" + param)
	        .selectAll("path")
	        .data(data);

	    datapoints_update
	        .transition()
	        .attr("transform", function (d) {
	            return "translate(" + focus.x(d.date_time) + "," + focus.y(d[colY]) + ")";
	        })
	        .attr("d", d3.svg.symbol().type((param == "param1") ? "circle" : "triangle-up"))

	    datapoints_update
	        .enter()
	        .append("path")
	        .attr("class", "dp-" + (param == "param1") ? "circle" : "triangle")
	        .attr("fill", (param == "param1") ? "red" : "steelblue")
	        .attr("transform", function (d) {
	            return "translate(" + focus.x(d.date_time) + "," + focus.y(d[colY]) + ")";
	        })
	        .attr("d", d3.svg.symbol().type((param == "param1") ? "circle" : "triangle-up"))

	    datapoints_update.exit()
	        .remove();

	    // add mouseovers to all paths
	    d3.select("#" + id + "-datapoints-" + param).selectAll("path")
	        .data(data)
	        .on("mouseover", function (d) {
	            return self.chart.tooltip.style("visibility", "visible")
	                .html(EduVis.formats.getFormatDate("tooltip")(d["date_time"]) + " - <b>" + d[colY] + " " + units + "</b>")
	        })
	        .on("mousemove", function () {
	            return self.chart.tooltip.style("top", (d3.event.pageY - 10) + "px")
	                .style("left", (d3.event.pageX + 10) + "px");
	        }).on("mouseout", function () {
	            return self.chart.tooltip
	                .style("visibility", "hidden");
	        });

	},
	tool.customization_update = function () {

	    // this function will update the config file which is used for subsequent calls and lookups
	    var self = this,
	        config = self.configuration,
	        id = self.dom_target; // .custom

	    config.date_start = $("#" + id + "-ctrl-datepicker-date-start").val();
	    config.date_end = $("#" + id + "-ctrl-datepicker-date-end").val();

	    config.param1 = $("#" + id + "-ctrl-dataset-dropdown-param1").val();
	    config.param2 = $("#" + id + "-ctrl-dataset-dropdown-param2").val();

	    config.station1 = $("#" + id + "-ctrl-dataset-dropdown-station1").val();
	    config.station2 =  $("#" + id + "-ctrl-dataset-dropdown-station2").val();

	    //todo: should only update the current parameter, not all

	},
	tool.station_toggle = function (element, station) {

	    // this function will toggle the visibility of the paths when the user clicks the station in the legend

	    console.log(".......STATION TOGGLE.......");
	    console.log(station, element);

	    var self = this,
	    	id = element;
	    	//id = element;

	    if (station == "station1") {

	        // test current visibility
	        if (self.chart.timeseries.datasets.param1.visible == true) {
	            self.chart.timeseries.datasets.param1.visible = false;

	            // transition the style to white, indicating that it is now off
	            d3.select("#" + id + "-legend-station1-circle").style("fill", "#FFF");

	            // hide the path
	            d3.select("#" + id + "-path-focus-param1")
	            	.style("visibility", "hidden");

	            //d3.select(".datapoints-param1").selectAll("path").style("visibility", "hidden");
	            d3.select("#" + id + "-datapoints-param1")
	            	.selectAll("path").style("visibility", "hidden");
	            

	        } else {

	            self.chart.timeseries.datasets.param1.visible = true;

	            // transition the style to red indicating that it is now on
	            d3.select("#" + id + "-legend-station1-circle")
	            	.style("fill", "red");

	            // make the path visible
	            d3.select("#" + id + "-path-focus-param1")
	            	.style("visibility", "visible")

	            // todo.. need parent selection
	            d3.select("#" + id + "-datapoints-param1")
	            	.selectAll("path").style("visibility", "visible");
	        }
	    } else {
	        if (self.chart.timeseries.datasets.param2.visible == true) {
	            self.chart.timeseries.datasets.param2.visible = false;

	            d3.select("#" + id + "-legend-station2-circle")
	                .style("fill", "#FFFFFF");

	            d3.select("#" + id + "-path-focus-param2")
	                .style("visibility", "hidden")

	            d3.select("#" + id + "-datapoints-param2")
	                .selectAll("path")
	                .style("visibility", "hidden");

	        } else {

	            self.chart.timeseries.datasets.param2.visible = true;

	            d3.select("#" + id + "-legend-station2-circle")
	                .style("fill", "steelblue");

	            d3.select("#" + id + "-path-focus-param2")
	                .style("visibility", "visible")

	            d3.select("#" + id + "-datapoints-param2")
	                .selectAll("path").style("visibility", "visible");
	        }
	    }

	}
	tool.notify_nodata = function (param) {

	    //todo: ioosSOS general notification / routine for dealing with empty datasets

	    var self = this;
	    var config_custom = self.configuration;

	    //var num = (param == "param1" ? "1" : "2");

	    alert("No data was returned for the Station, Parameter, and Date Range you selected.\n\n" + 
	    	"Please adjust the Station, Parameters, or Date Range to request new data.");

	    //    alert(
	    //            "No " + 'self.data.parameters[config_custom["param"+num]].name' + " data is available for " + self.stations["station"+num].name + "\n for the date range provided.\n\n" +
	    //                    "Please adjust the Station, Parameters, or Date Range to request new data."
	    //    );
	};

    // extend base object with tool.. need to be able to leave options out of tool configuration file.
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
