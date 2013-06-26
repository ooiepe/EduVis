/*
    Ocean Observatories Initiative
    Education & Public Engagement Implementing Organization

    Name: EV0 NDBC Time Series Chart
    Description: A Simple Time Series Chart
    Version: 1.0.1
    Revision Date: 2/21/2012
    Author: Michael Mills & Sage Lichtenwalner
    Author URL: 
    Function Name: EV0_NDBC_Time_Series
    Help File: 

*/

/*  *  *  *  *  *  *  *
* 
*   D E V   N O T E S 
*   
*
/*  *  *  *  *  *  *  *
*
* NDBC_Time_Series
*
*/

(function (eduVis) {

    "use strict";
    //var tool = EduVis.tool.template;

    //console.log("tool template", tool);

    var tool = {

        "name" : "NDBC_Time_Series",
        "description" : "NDBC Time Series",
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
                    "global_reference" : "d3",
                    "attributes" : {
                        "charset" : "utf-8"
                    }
                },
                {
                    "name": "jquery-ui",
                    "url":"http://code.jquery.com/ui/1.9.2/jquery-ui.js",
                    "global_reference" : "d3",
                    "dependsOn":["jquery"]
                }

            ],

            "stylesheets_local" : [
                {
                    "name" : "toolstyle",
                    "src" : "tools/Template/Template.css"
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

            "title" : "Buoy 44025: Sea Water Temperature",
            "subtitle" : "January 2012",
            "station_id" : "44025",
            "start_date" : "2012-01-02",
            "end_date" : "2012-02-01",
            "color" : "#6699CC"
        },
        "controls" : {

            "station_id" : {
                "type":"textbox",
                "label":"NDBC Buoy",
                "tooltip":"Enter an NDBC buoy id.",
                "default_value":"44025"
            },
            "start_date" : {
                "type":"datepicker",
                "label":"Start Date",
                "tooltip":"Enter or select the starting date for your graph in the format: yyyy-mm-dd.",
                "default_value":"2012-01-02",
                "validation":{
                    "type":"datetime",
                    "format":"yyyy-mm-dd"
                }
            },
            "end_date" : {
                "type":"datepicker",
                "label":"End Date",
                "tooltip":"Enter or select the ending date for your graph in the format: yyyy-mm-dd",
                "default_value":"2012-01-31",
                "validation":{
                    "type":"datetime",
                    "format":"yyyy-mm-dd"
                }
            },
            "color" : {
                "type":"colorpicker",
                "label":"Line Color",
                "tooltip":"Select a hexidecimal line color for your graph.",
                "default_value":"#6699CC",
                "validation":{
                    "type":"hexcolor"
                }
            }
        },
        "data" : {},
        "target_div" : "DIV1",
        "tools" : {},
        "datasource" : {
            "agency" : "IOOS",
            "parameter" : "sea_water_temperature",
            "metadata":{
                "name" : "Sea Water Temperature",
                "qParam" : "sea_water_temperature",
                "column" : "sea_water_temperature (C)",
                "units" : "&deg; C",
                "units2" : "Degrees Celcius"
            }
        },

        loadingDiv : function(){
            // Create a load
            var self = this;
            $('#'+this.dom_target)
                .html('HELLO.<img id="loading_DOMID_" src="http://epe.marine.rutgers.edu/visualization/img/loading_a.gif" alt="Loading..."/>');
        },
        parse_dataset : function(){
            
            var self = this;

            // build data querystring
            var csvUrl = EduVis.ioos.requestUrlTimeseriesDate(
                self.configuration.station_id,
                self.datasource.metadata.qParam,
                {
                 //   dateStart : self.configuration.custom.start_date,
                 //   dateEnd : self.configuration.custom.end_date

                    dateStart : self.configuration.start_date,
                    dateEnd : self.configuration.end_date
                }
            );

            console.log("Requesting CSV: " + csvUrl)

            d3.csv(csvUrl, function(ts_data){

                console.log("CSV Loaded.. ts_data -->", ts_data);

                var parse = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse,
                    month_format = d3.time.format("%B - %Y"),
                    end_month, end_year,
                    colX = "date_time",
                    colY = self.datasource.metadata.column;

                // check to see if there is any data, besides headers.. -> empty dataset
                if(ts_data.length == 0)
                {
                    alert("Your request returned an empty dataset. ");
                }
                else{
                    console.log("Parsing Data..");
                    // parse date and convert csv source to numerical values

                    ts_data.forEach(function(d) {
                        d[colX] = parse(d[colX]);
                        d[colY] = +d[colY];
                    });

                    // find min and max for x and y colums
                    var minX = d3.min(ts_data,function(d){return d[colX];}),
                        maxX = d3.max(ts_data,function(d){return d[colX];}),
                        minY = d3.min(ts_data,function(d){return d[colY];}),
                        maxY = d3.max(ts_data,function(d){return d[colY];}),

                    // test for min and max Ys across datasets and maintain such
                        gd = self.graph.domain,
                        gdYmin = gd.y.min,
                        gdYmax = gd.y.max,
                        gdXmin = gd.x.min,
                        gdXmax = gd.x.max;

                    if(!gdYmin){
                        gd.y.min = minY;
                        gd.y.max = maxY;
                    }
                    else{
                        if(gdYmin > minY){ gd.y.min = minY;}
                        if(gdYmax < maxY){ gd.y.max = maxY;}
                    }

                    // test for min and max Ys across datasets and maintain such
                    if(!gdXmin){
                        gd.x.min = minX;
                        gd.x.max = maxX;
                    }
                    else{
                        if(gdXmin > minX){ gd.x.min = minX;}
                        if(gdXmax < maxX){ gd.x.max = maxX;}
                    }

                    // save reference of data in datasets object
                    self.dataset = {
                        isLoaded:true,
                        columns : {
                            x : colX,
                            y : colY
                        },
                        data : ts_data,
                        dates : {
                            month : month_format(minX),
                            range_begin : new Date(minX.getFullYear(), minX.getMonth(), 1),
                            range_end : new Date(end_year, end_month, 1),
                            month_days : new Date(minX.getFullYear(),minX.getMonth()+1,0).getDate()
                        },
                        extents : {
                            y : d3.extent(ts_data,function(d){return d[colY];})
                        },
                        mean : (d3.sum(ts_data, function(d){return d[colY];}) / ts_data.length),
                        stddev : EduVis.utility.stdev(d3.values(ts_data), colY)
                    };

                    // log to console for debugging
                    console.log("CVS Parsed...", self);

                    self.draw();
                }
            });
        },

        //todo: rename draw with createToolChart?
        
        draw : function(){

            //console.log("self", self);

            var self = this;
            var domain = self.graph.domain;

            // set up basic graph elements
            var margin = {top: 10, right: 10, bottom: 30, left: 40},

                width = 580 - margin.left - margin.right,
                height = 260 - margin.top - margin.bottom,

                date_time_parse = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse,

                x = d3.time.scale()
                    .range([0, width])
                    .domain([domain.x.min,domain.x.max]),
                y = d3.scale.linear()
                    .range([height, 0])
                    .domain([domain.y.min,domain.y.max]),

                xAxis = d3.svg.axis()
                    .scale(x)
                    .ticks(8)
                    .tickSubdivide(true)
                    .orient("bottom"),
                yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

            var svg = d3.select("#"+self.dom_target).append("svg")
                .attr("id","container_" + self.dom_target)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            svg.append("defs").append("clipPath")
                .attr("id", "clip_" + self.dom_target)
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            var focus = svg.append("g")
                .attr("id","focusgraph_"+self.dom_target)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            focus.append("g")
                .attr("class", "x axis")
                //  .style("fill","none")
        //      .style("stroke","#000")
        //      .style("shape-rendering","crispedges")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "y axis")
        //      .style("fill","#000")
        //      .style("stroke","#000")
        //      .style("shape-rendering","crispedges")
                .call(yAxis);

            console.log('now get csv for each dataset', self.dataset)

            var colX = self.dataset.columns.x;
            var colY = self.dataset.columns.y;

            var d = self.dataset.data;

            var line = d3.svg.line()
                .interpolate("linear")
                .x(function(d) { return x(d[colX]); })
                .y(function(d) { return y(d[colY]); })

            focus.append("path")
                .data([d])
                .attr("clip-path", "url(#clip_"+ self.dom_target + ")")
                .attr("d", line)
                .style("fill","none")
                .style("stroke", self.configuration.color)
                .style("stroke-width","2");

           // $("#loading_" + self.target_div).hide();
           
           EduVis.tool.load_complete(this);
        }
    };

    tool.NDBC_Time_Series = function( ){

        var self = this;

        // Default Configuration


        // Datasource Configuration
        
        // an empty object where datasets should be placed
        self.dataset = {};

        // boolean to check is the object is ready to be drawn
        self.isDrawReady = false;

        // graph specific properties
        self.graph = {
            domain:{
                y:{
                    min:null,
                    max:null
                },
                x:{
                    min:null,
                    max:null
                }
            },
            range:{
                y:{
                    min:null,
                    max:null
                }
            }
        }

        // self.tool = {
        //     domID: _target_div, //self.evtool.domToolID(domId),
        //     configuration:{
        //         defaultConfig:self.configuration,
        //         custom:self.configuration
        //     }
        // };

        // Create placeholder loading image
        //self.loadingDiv();

        // do configuration overrides exist? if so, parse overrides
        //this.evtool.configurationParse( self.tool.configuration.custom, customToolConfiguration );

        // parse dataset and draw graph
        self.parse_dataset();

        

    },

    tool.init = function() {

        // todo: include instance in call
        
        this.NDBC_Time_Series();

    };

    // extend base object with tool.. need to be able to leave options out of tool configuration file.
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
