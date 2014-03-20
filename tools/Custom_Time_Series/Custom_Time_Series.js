/**
 * OOI EPE - Custom Time Series (CTS)
 * Revised 3/20/2014
 * Written by Sage Lichtenwalner
 */
// CSV to JSON Converters
// http://jsfiddle.net/sturtevant/AZFvQ/
// http://www.jqueryscript.net/other/Creating-A-CSV-To-JSON-Data-Converter-with-jQuery-Parse-Plugin.html
// https://github.com/adamschoenemann/CSV-to-JSON-convert/blob/master/csv_to_json.js
(function (eduVis) {
    "use strict";
    var tool = {
        "name" : "Custom_Time_Series",
        "version" : "0.1",
        "description" : "This tool allows you to create an interactive time series graph of your own CSV data.",
        "authors" : [
            {
                "name" : "Sage Lichtenwalner",
                "association" : "Rutgers University",
                "url" : "http://rucool.marine.rutgers.edu"
            },
            {
                "name" : "Michael Mills",
                "association" : "Rutgers University",
                "url" : "http://rucool.marine.rutgers.edu"
            }
        ],
        "resources" : {
          "tool":{
            "scripts" : [
              {
                "name" : "d3",
                "url" : "http://d3js.org/d3.v3.js",
                "global_reference" : "d3",
                "attributes" : {
                    "charset" : "utf-8"
                }
              }
            ],
            "stylesheets" : []
          },
          "controls":{
            "scripts" : [
              {
                 "name" : "js/bootstrap-colorpicker.js",
                 "url" : "js/bootstrap-colorpicker.js"
              }
            ],
            "stylesheets" : [
              {
                 "name" : "css/bootstrap-colorpicker.css",
                 "src" : "css/bootstrap-colorpicker.css"
              }
            ]
          }
        },
        // Default tool configuration
        "configuration" : {
          "dataset" : [
            {"date":"2013-01-01T00:00:00Z","air temperature":"27.4","water temperature":"16.4"},
            {"date":"2013-01-10T00:06:00Z","air temperature":"27.3","water temperature":"16.6"},
            {"date":"2013-01-20T00:12:00Z","air temperature":"27.2","water temperature":"16.8"},
            {"date":"2013-02-01T00:18:00Z","air temperature":"27.2","water temperature":"16.9"},
            {"date":"2013-02-10T00:24:00Z","air temperature":"27.1","water temperature":"17"},
            {"date":"2013-02-20T00:30:00Z","air temperature":"27.1","water temperature":"17.1"},
            {"date":"2013-03-01T00:36:00Z","air temperature":"27","water temperature":"17.1"},
            {"date":"2013-03-10T00:42:00Z","air temperature":"26.9","water temperature":"17.2"},
            {"date":"2013-03-20T00:48:00Z","air temperature":"26.8","water temperature":"17.2"},
            {"date":"2013-04-01T00:54:00Z","air temperature":"26.6","water temperature":"17.3"},
            {"date":"2013-04-10T01:00:00Z","air temperature":"26.4","water temperature":"17.4"}
          ],
          "title" : "Example Data",
          "parameter" : "water temperature",
          "color" : "#a33333",
          "delimiter":"tab"
        },
        "graph" : {}
    };
    
    /**
     * Initialize tool
     * Called automatically by EduVis
     */
    tool.init_tool = function(_target) {
      this.setup(this.dom_target);
      this.draw();
      EduVis.tool.load_complete(this);
    };
    

    /**
     * Initial setup of visualization tool
     * Called by init_tool
     */
    tool.setup = function( _target ){
      var g = this.graph;

      g.margin = {top: 26, right: 25, bottom: 40, left: 60};
      g.width = 840 - g.margin.left - g.margin.right;
      g.height = 400 - g.margin.top - g.margin.bottom;
      
      g.parseDate = d3.time.format.iso.parse;
      
      g.x = d3.time.scale.utc().range([0, g.width]);
      g.y = d3.scale.linear().range([g.height, 0]);
      
      g.xAxis = d3.svg.axis().scale(g.x).orient("bottom").ticks(12).tickSize(5,0,0);
      g.yAxis = d3.svg.axis().scale(g.y).orient("left").tickSize(-g.width,0,0);
      
      g.svg = d3.select("#"+_target).append("svg")
        .attr("id",_target+"_svggraph")
        .attr("width", g.width + g.margin.left + g.margin.right)
        .attr("height", g.height + g.margin.top + g.margin.bottom)
        .style("font-size","11px")
        .style("font-family","Tahoma, Geneva, sans-serif");
      
      g.svg.append("defs").append("clipPath")
          .attr("id", _target+"_clip")
        .append("rect")
          .attr("width", g.width)
          .attr("height", g.height);
      
      g.focus = g.svg.append("g")
          .attr("transform", "translate(" + g.margin.left + "," + g.margin.top + ")");

      g.focus.append("g")
        .attr("id", _target+"_xAxis")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + g.height + ")")
        .call(g.xAxis);
        
      g.focus.append("g")
        .attr("id", _target+"_yAxis")
        .attr("class", "y axis")
        .call(g.yAxis);
      
      g.focus.append("path")
        //.datum(data)
        .attr("class", "line")
        .attr("d", g.line1)
        .style("fill","none")
        .style("stroke",tool.configuration.color)
        .style("stroke-width","2px");

      g.line1 = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return g.x(d.date); })
        .y(function(d) { return g.y(d.data); });
      
      g.title = g.svg.append("text")
        .attr("class", "gtitle")
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .attr("y", 0)
        .attr("dy", ".75em")
        .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (0) + ") ")
        .text( tool.configuration.title );
      
      g.ylabel = g.svg.append("text")
        .attr("id", _target+"_ylabel")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        //.style("fill", "#999")
        .attr("y", 0)
        .attr("dy", "1em")
        .attr("transform", "translate(" + (0) + "," + (g.height/2+g.margin.top) + "), rotate(-90)")
        .text( tool.configuration.parameter);

      g.xlabel = g.svg.append("text")
        .attr("id", _target+"_xlabel")
        .attr("class", "glabel")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width/2+g.margin.left) + "," + (g.height+g.margin.top+g.margin.bottom) + "), rotate(0)")
        .text( "Date Range");

      g.stats = g.svg.append("text")
        .attr("id", _target+"_stats")
        .attr("class", "glabel")
        .attr("text-anchor", "end")
        .style("font-size", "11px")
        .attr("dy", "-6px")
        .attr("transform", "translate(" + (g.width+g.margin.left) + "," + (g.margin.top) + "), rotate(0)")
        .text( "Statistics");

      tool.createDropdown(_target);
      tool.updateDropdown();

    };
    

    /**
     * Draw first dataset following initial tool setup 
     * Called by init_tool and graph_update_parameter
     */
    tool.draw = function() {
      if(typeof tool.configuration.dataset !== "undefined"){
        tool.updategraph();  
      } else {
        if(typeof error !== "undefined"){
          alert('Bad data! (draw)');
        }
      }
    };
    

    /**
     * Update visualization with new data
     * Called by draw
     */    
    tool.updategraph = function() {
      var g = this.graph;  
      var dataset = tool.configuration.dataset;
      var data = [];
      
      if(dataset.length === 0){
        alert('Bad data! (updategraph)');
      } else {
      
        // Parse data
        var cols = d3.entries(dataset[0]);
        dataset.forEach(function(d,k) {
          data[k] = { "date" : g.parseDate(d[cols[0].key]), "data" : +d[tool.configuration.parameter] };
        }); 

        // Update x and y domains
        g.x.domain(d3.extent(data, (function(d) { return d.date; })));
        g.y.domain(d3.extent(data, (function(d) { return d.data; }))).nice();
        
        // Update the graph
        g.svg.selectAll("path.line")
          .data([data])
          .transition()
          .duration(1500)
          .ease("linear")
          .attr("d", g.line1)
          .style("stroke",tool.configuration.color);
          
        g.title.text( this.configuration.title );
        g.ylabel.text( this.configuration.parameter );
        var datelimits = g.x.domain();
        g.xlabel.text(d3.time.format.utc("%B %e, %Y")(datelimits[0]) + " to " + d3.time.format.utc("%B %e, %Y")(datelimits[1]));
        var stats = tool.average(data);
        g.stats.text("Mean: " + d3.round(stats.mean,2) + " / StDev: " + d3.round(stats.deviation,2) );
        
        // Update x and y axis 
        d3.select("#"+tool.dom_target+"_yAxis").call(g.yAxis);
        d3.select("#"+tool.dom_target+"_xAxis").call(g.xAxis);
        
        d3.selectAll('.axis line, .axis path')
          //.style("shape-rendering","crispEdges")
          .style("fill","none")
          .style("stroke","#999")
          .style("stroke-width","1px");
        d3.selectAll('.y.axis line')
          .style("stroke-opacity",".4");
        
      }
    };
    

    /**
     * Generate parameter pulldown
     * Called by setup
     */
    tool.createDropdown = function(_target){
     
      var tool_controls = $("<div/>")
        .css({
          "text-align" : "center",
          "height" : "50px"
        })
        .append(
          $("<div/>")
            .attr({
              "id": _target+"_tool-dropdowns"
            })
            .append("Select a Parameter: ")
            .append(
              $("<select></select>")
              .attr({
                "id" : _target + "_select-parameters"
              })
              .on("change", function(evt){
                tool.graph_update_parameter(evt.target.value);
              })
            )
        )
        .appendTo(
          $("#"+_target)
        );

    };

    /**
     * Update pulldown to match config
     * Called by setup
     */
    tool.updateDropdown = function(){

      var config = tool.configuration,
          options = [],
          cols = d3.entries(config.dataset[0]);

      // Clear the current list
      $("#"+tool.dom_target+"_select-parameters").empty();

      // Build a new list of parameters
      $.each(cols, function(k,d){
        var option = $("<option/>")
          .attr({
            "value": d.key
          })
          .html(
            d.key
          );
        if(k>0) {
          options.push(option);
        }
      });

      // Add all the options from the options array to the select
      $("#"+tool.dom_target+"_select-parameters")
        .append(options);

      // Select choosen parameter, if value isn't in list, choose first one      
      if($("#"+tool.dom_target+"_select-parameters option[value='" + config.parameter + "']").val() === undefined){
        $("#"+tool.dom_target+"_select-parameters option:first")
        .prop("selected", "selected");
        config.parameter = $("#"+tool.dom_target+"_select-parameters").val();
      } else {
        $("#"+tool.dom_target+"_select-parameters")
        .val(config.parameter);
      }
    };
    

    /**
     * Update graph and config when parameter pulldown is changed 
     */
    tool.graph_update_parameter = function(parameter){
        tool.configuration.parameter = parameter;
        tool.draw();
    };
    
    
    /**
     * Calculates general statistics on data
     * Called by updategraph
     * This should be replaced by d3.deviation and other related functions when (if?) implemented.
     */
    tool.average = function(data) {
      var a = [];
      data.forEach(function(d) {
        a.push(d.data);
      });
      var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
      for(var m, s = 0, l = t; l--; s += a[l]);
      for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
      return r.deviation = Math.sqrt(r.variance = s / t), r;
    };


    /**
     * Initial setup of tool configuration panel
     * Called automatically by EduVis when edit is enabled
     */
    tool.init_controls = function(){
       
      var controlDom = $("<div/>",{"id": "control-panel"});

      var control_html = $("<div/>", {
        "id" : "controls"
      });
      
      var control_title = $("<div/>", {
          "id":"control-title-div"
      })
      .append(
        $("<label />")
        .attr({
            'title':  "Graph Title"
        })
        .html("<b>Graph Title<b>")
      )
      .append(
        $("<input />")
        .attr({
          "id": "control-title",
          "name":"control-title",
          "type": "text"
        })
        .val(tool.configuration.title)
      )
      .append(
          //$("<p>Enter your custom graph title here.</p>")
          //.css({"border-bottom":"1px solid #CCCCCC"})
      );

      var control_dataset = $("<div/>", {
          "id":"control-dataset-div"
      })
      .append(
        $("<label />")
        .attr({
            'title':  "Data"
        })
        .html("<b>Data<b>")
      )
      .append(
          $("<p><em>Please enter your own timeseries data here, using either a comma (csv) or tab (tsv) separated format, selecting the approrpiate delimiter below.  Your dataset must include date/time as the first column in the format yyyy-mm-dd or yyyy-mm-ddThh:mm:ssZ.  In Excel, you can use these date strings as custom cell formats. You must also include a header row with the names of each column.</em></p>")
          //.css({"width":"600px","height":"400px"})
      )
      .append(
        $("<textarea />")
        .attr({
          "id": "control-dataset",
          "name":"control-dataset",
          "cols":100,
          "rows":15
        })
        .val(this.json2csv(tool.configuration.dataset))
      );
      

      var control_delimiter = $("<div/>", {
          "id":"control-delimiter-div"
      })
      .append(
        $("<label />")
        .attr({
            'title':  "Delimiter"
        })
        .html("<b>Delimiter<b>")
      )
      .append(
        $("<select></select>")
        .attr({
          "id": "control-delimiter",
          "name":"control-delimiter"
        })
        .append($("<option></option>")
          .attr({"value": "comma"})
          .html("Comma (csv)")
        )
        .append($("<option></option>")
          .attr({"value": "tab"})
          .html("Tab (tsv)")
        )
        .val(tool.configuration.delimiter)
      );

      var control_color = $("<div/>", {
          "id":"control-color-div"
      })
      .append(
        $("<label />")
        .attr({
            'title':  "Line Color"
        })
        .html("<b>Line Color<b>")
      )
      .append(
        $("<input />")
        .attr({
          "id": "control-color",
          "name":"control-color",
          "type": "text"
        })
        .val(tool.configuration.color)
        .colorpicker()
      )
      .append(
          //$("<p>Enter your custom graph title here.</p>")
          //.css({"border-bottom":"1px solid #CCCCCC"})
      );

      var control_apply = $("<div/>", {
          "id":"control-apply-div"
      })
      .append(
        $("<a/>", {
          "type":"button",
          "class":"btn btn-medium"
        })
        .css({
          //"width": "12em"
        })
        .html("Apply")
        .on("click",function(){
          var config = tool.configuration;
          var data=[];
          var tab = $("#control-delimiter").val();
          if (tab === "tab") {
            data = d3.tsv.parse($("#control-dataset").val());          
          } else if (tab === "comma") {
            data = d3.csv.parse($("#control-dataset").val());
          }
          if (data.length>1500) {
            alert('Your data array must contain less than 1,500 rows.');
          } else if (data.length>1) {
            config.title = $("#control-title").val();
            config.dataset = data; 
            config.delimiter = tab;
            config.color = $("#control-color").val();
          } else {
            alert('There was an problem processing your data. Please make sure to include a header row and at least 2 rows of data.');
          }
          tool.updateDropdown();
          tool.draw();
        })
      );

      control_html
        .append(control_title)
        .append(control_dataset)
        .append(control_delimiter)
        .append(control_color)
        .append(control_apply);

      controlDom
        .append(control_html)
        .appendTo("#vistool-controls");

    };

    tool.json2csv = function (objArray) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str = '';
      var line = '';
      var head = array[0];
      var delim = (tool.configuration.delimiter==="tab") ? "\t" : ",";
      for (var index in array[0]) {
          line += index + delim;
      }    
      line = line.slice(0, -1);
      str += line + '\r\n';
      for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
          line += array[i][index] + delim;
        }
        line = line.slice(0, -1);
        str += line + '\r\n';
      }
      return str;    
    }



    // extend base object with tool..
    EduVis.tool.tools[tool.name] = tool;

}(EduVis));
