/**
 * Glider Dataset Chooser - Rutgers Version
 *   for use with the Glider Profile Explorer (GPE) - Rutgers Version
 * Revised 2/10/2015
 * Written by Michael Mills and Sage Lichtenwalner
*/
(function (eduVis) {
  "use strict";
  var parent_tool,
  control = {
    "name":"Glider_Dataset_Chooser_RU",
    "version" : "0.1",
    "description" : "This tool allows users to browse and select Glider Datasets from the Rutgers Erddap server.",
    "config_controls" : {
      'institution':'Rutgers University', 
      'glider':'ru01', 
      'dataset_id':'ru01-20140104T1621',
      'date_start':'2014-01-04',
      'date_end':'2014-01-16',
      'title':'RU01 January 2014'
    },
    "initial_config" : {},
    "datasets":{}
  };


  /**
   * Initialize tool
   * Called automatically by EduVis
   */
  control.init = function (_parent_tool) {
    control.parent_tool = _parent_tool;
     
    $.get(EduVis.Environment.getPathTools() + control.parent_tool.name + "/templates/" + 'Glider_Dataset_Chooser_RU.mst', function(template) {
      var rendered = Mustache.render(template);
      $('#vistool-controls').html(rendered);
  
      // Merge in default configuration from parent tool (or instance)
      $.extend(true,control.config_controls,control.parent_tool.configuration);
      $.extend(true,control.initial_config,control.parent_tool.configuration);

      control.iso_parse = d3.time.format.iso.parse;
      control.date_format_ymd = d3.time.format.utc("%Y-%m-%d");
      control.date_range_format = d3.time.format.utc("%Y-%m-%d-%H-%M-%S");

      control.setup_apply();
      control.setup_datepickers();
      control.setup_map();
      control.load_datasets();
    });
  };


  /**
   * setup_apply
   * Called by init
   */
  control.setup_apply = function () {
    // Add action to apply button
    $("#apply-btn")
      .on('click', control.apply_button_press);
    
    // Add hidden checkmark  
    $("#ui-config-apply")
      .append(
        $('<img src="'+ EduVis.Environment.getPathTools() + control.parent_tool.name + '/img/check_green.png"' + ' id="apply-check" style="display:none" />')
      );

    // Add action to revert button
    $("#revert-btn")
      .on('click', control.revert_button_press);
    
  };
  
  
  /**
   * setup_datepickers
   * Called by init
   */
  control.setup_datepickers = function () {
    $("#config-date_start")
      .addClass('datepicker')
      .datepicker({
        "dateFormat": "yy-mm-dd",
        "changeMonth": true,
        "changeYear": true,
        "defaultDate": control.config_controls.date_start,
        "onClose" : function (d,i) {
          var sdate = $("#config-date_start").datepicker('getDate'),
          edate = $("#config-date_end").datepicker('getDate');
          if ( sdate >= edate ){
            sdate.setDate(sdate.getDate()+1);
            $("#config-date_end").datepicker('setDate',sdate);
          }
          control.update_slider();
          control.apply_button_status('modified');
        }
      })
      .val(control.config_controls.date_start);
    $("#config-date_end")
      .addClass('datepicker')
      .datepicker({
        "dateFormat": "yy-mm-dd",
        "changeMonth": true,
        "changeYear": true,
        "defaultDate": control.config_controls.date_end,
        "onClose" : function (d,i) {
          var sdate = $("#config-date_start").datepicker('getDate'),
          edate = $("#config-date_end").datepicker('getDate');
          if ( sdate >= edate ){
            edate.setDate(edate.getDate()-1);
            $("#config-date_start").datepicker('setDate',edate);
          }
          control.update_slider();
          control.apply_button_status('modified');
        }
      })
      .val(control.config_controls.date_end);
  };


  /**
   * setup_map
   * Called by init
   */
  control.setup_map = function () {
    // add the leaflet map config control
    control.leaflet_map = {
      "map" : L.map('ui-config-map', {
        "center": [38.5,-78.2],
        "zoom": 3
        // ,noWrap : true
      })
    };
  
    // define the ocean basemap layer and add it ot the map tool control
    control.leaflet_map.oceanBasemap_layer = new L.TileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}",{
      maxZoom: 12,
      attribution: 'Tile Layer: &copy; Esri'
    }).addTo(control.leaflet_map.map);
  
    // define the full track polyline and add it ot the map
    control.leaflet_map.poly_line_track = L.polyline(
      [],
      {color: 'white'} // /todo: add transparancy
    )
    .addTo(control.leaflet_map.map);
  
    // define the selected portion polyline and add it to the map
    control.leaflet_map.poly_line_selected = L.polyline(
      [],
      {color: 'blue'} // /todo: add transparancy
    )
    .addTo(control.leaflet_map.map);
  
    // add event handlers to the map
    control.leaflet_map.map.on({
      "zoomend" : function (e) {
        // When zoom level changes set the style of the profile markers
        if (this.getZoom() >= 9) {
          if (typeof control.leaflet_map.track_full_L_geoJson !== "undefined") {
            // set the opacity, fill, and radius
            control.leaflet_map.track_full_L_geoJson
            .setStyle({
              "fillOpacity":1,
              "opacity":1,
              "radius":3
            });
          }
        } else {
          if (typeof control.leaflet_map.track_full_L_geoJson !== "undefined") {
            control.leaflet_map.track_full_L_geoJson
            .setStyle({
              "fillOpacity":0,
              "opacity":0,
              "radius":3
            });
          }
        }
      }
    });
    //control.ui_control_dataset_id.trigger("change");
  };


  /**
   * load_datasets
   * Called by init
   */
  control.load_datasets = function () {
    // list of erddap variables that we are interested in
    var erddap_variables = ["datasetID","institution","minLongitude","maxLongitude","minLatitude","maxLatitude","minTime","maxTime"],
    url = 'http://erddap.marine.rutgers.edu/erddap/tabledap/allDatasets.json?' + 
              erddap_variables.join(',') + 
              '&cdm_data_type="TrajectoryProfile"'; //+'&institution="OOI"';

    $.getJSON(url, function (json) {

      var ds = json, datasets = [],
      ci = 0,
      clen = ds.table.columnNames.length;

      function getColumnKey(columnValue) {
        for (ci = 0; ci < clen; ci++) {
          if (ds.table.columnNames[ci] === columnValue) {return ci;}
        }
        return -1;
      }

      function getRowValue(row, columnValue) {
        var columnKey = getColumnKey(columnValue),
        rowValue = ds.table.rows[row][columnKey];
        return rowValue;
      }

      // build the datasets object
      $.each(ds.table.rows, function (i, row) {
        var dset = {};
        $.each(erddap_variables, function (x, v) {
          dset[v] = getRowValue(i, v);
        });
        datasets.push(dset);
      });

      datasets = d3.nest()
        .key(function(d) { return d.institution; })
        .sortKeys(d3.ascending)
        .key(function(d) { return d.datasetID.substring(0,d.datasetID.lastIndexOf('-')); })
        .sortKeys(d3.ascending)
        .entries(datasets);
      // save datasets object for later reference
      control.datasets = datasets;
      
      control.populate_arrays();
    });
  };


  /**
   * populate_arrays
   * Called by load_datasets
   */
  control.populate_arrays = function () {
    $("#config-institution").children().remove();
    var datasets = control.datasets;
    $.each(datasets, function (i,dset) {
      $("#config-institution")
        .append(
          $("<option>")
            .attr("value",dset.key)
            .html(dset.key)
          );
    });
    // Set the default seleted options for each dropdown
    $("#config-institution")
      .val(control.config_controls.institution)
      .on('change', control.update_gliders);

    control.update_gliders();
    $("#config-glider")
      .val(control.config_controls.glider)
      .on('change', control.update_deployments);

    control.update_deployments();
    $("#config-deployment")
      .val(control.config_controls.dataset_id)
      .on('change', control.update_deployment);

    control.update_deployment();
   };


  /**
   * update_gliders
   * Called by populate_arrays and when config-institution is changed
   */
  control.update_gliders = function () {
    $("#config-glider").children().remove();
    $("#config-glider").append($("<option>").attr("value",'').html('(choose one)'));   
    var datasets = control.datasets;
    var gliders = datasets.find(function(d) {return d.key==$("#config-institution").val();});
    $.each(gliders.values, function (i,dset) {
      $("#config-glider")
        .append(
          $("<option>")
            .attr("value",dset.key)
            .html(dset.key)
          );
    });
    $("#config-deployment").children().remove();
    $("#config-deployment").append($("<option>").attr("value",'').html('Choose a Glider'));   
    //control.update_deployments(); // This causes a logic error, call from populate_arrays directly
  };


  /**
   * update_deployments
   * Called by populate_arrays and when config-glider is changed
   */
  control.update_deployments = function () {
    $("#config-deployment").children().remove();
    $("#config-deployment").append($("<option>").attr("value",'').html('(choose one)'));   
    var datasets = control.datasets;
    var institution = $("#config-institution").val();
    var glider = $("#config-glider").val();
    if (institution.length>0 && glider.length>0) {
      var gliders = datasets.find(function(d) {return d.key==institution;});
      var deployments = gliders.values.find(function(d) {return d.key==glider;});
      $.each(deployments.values, function (i,dset) {
        
        var did = dset.datasetID.substring(dset.datasetID.lastIndexOf('-')+1),
        date_format1 = d3.time.format.utc("%Y%m%dT%H%M"),
        date_format2 = d3.time.format.utc("%Y-%m-%d %H:%M"),
        ddate = date_format1.parse(did);
        
        $("#config-deployment")
          .append(
            $("<option>")
              .attr("value",dset.datasetID)
              .html(date_format2(ddate))
            );
      });
    }
  };


  /**
   * update_deployment
   * Called by populate_arrays and when the deployment pulldown is changed
   */
  control.update_deployment = function () {

    var datasets = control.datasets;
    var institution = $("#config-institution").val();
    var glider = $("#config-glider").val();
    var deployment_id = $("#config-deployment").val();
    if (institution.length>0 && glider.length>0 && deployment_id.length>0) {
      var gliders = datasets.find(function(d) {return d.key==institution;});
      var deployments = gliders.values.find(function(d) {return d.key==glider;});
      var deployment = deployments.values.find(function(d) {return d.datasetID==deployment_id;});
    }
    if (typeof deployment != 'undefined') {
      control.deployment = deployment;
      //console.log('deployment',deployment);

      $("#config-title")
        .val('Deployment: ' + deployment.datasetID)
        .on('change',control.apply_button_status('modified'));
        
      var range = control.deployment_date_range();
            
      // set the date picker start and end range restrictions
      $("#config-date_start")
        .datepicker("option", {"minDate":control.date_format_ymd(range.start),"maxDate":control.date_format_ymd(range.end)});
      $("#config-date_end")
        .datepicker("option", {"minDate":control.date_format_ymd(range.start),"maxDate":control.date_format_ymd(range.end)});
        
      // Update datepicker dates, only if this is a newly specified deployment
      if (deployment.datasetID != control.config_controls.dataset_id) {
        $("#config-date_start").val(control.date_format_ymd(range.start));  
        $("#config-date_end").val(control.date_format_ymd(range.end));          
      } else {
        $("#config-date_start").val(control.config_controls.date_start);  
        $("#config-date_end").val(control.config_controls.date_end);        
      }
        
      control.update_slider();
      control.update_map();
      control.apply_button_status('modified');
    }
  };


  /**
   * deployment_date_range
   * Rounds the date range limits for the current deployment
   */
  control.deployment_date_range = function () {
    var date_start = control.iso_parse(control.deployment.minTime),
    date_end       = control.iso_parse(control.deployment.maxTime),
    range = {}; 

    date_start = control.date_format_ymd.parse(control.date_format_ymd(date_start));
    date_end   = control.date_format_ymd.parse(control.date_format_ymd(date_end));
    date_end.setDate(date_end.getDate()+1);

    range.start = date_start;
    range.end = date_end;
    return range;
  };



  /**
   * update_map
   * Called by update_deployment
   */
  control.update_map = function () {
    // zoom to the track bounds (southwest, northeast) obtained from datasets query
    control.leaflet_map.map.fitBounds([
      [control.deployment.minLatitude, control.deployment.minLongitude],
      [control.deployment.maxLatitude, control.deployment.maxLongitude]
    ]);

    // query json object of dataset
    $.getJSON( "http://erddap.marine.rutgers.edu/erddap/tabledap/" + control.deployment.datasetID + ".geoJson?profile_id,time,latitude,longitude",
    function (geodata) {

      //console.log("track data returned...",geodata);

      var config_mapObj = control.leaflet_map;

      // save the track geojson for later reference - primarily the config slider
      config_mapObj.track_full_geojson = geodata;

      // create arrays to hold the profile locations and selected profile locations
      var poly_coords = [],
      poly_coords_selected = [];

      // remove geoJson point layer if its already on the map
      if (typeof config_mapObj.track_full_L_geoJson !== "undefined") {
        config_mapObj.map.removeLayer(config_mapObj.track_full_L_geoJson);
      }

      // Create Leaflet geoJson object for the points of the glider track
      config_mapObj.track_full_L_geoJson = L.geoJson(geodata,{
        onEachFeature: function (location, location_feature) {
          var featureMouseOut = function (feat) {
            console.log(feat.options);
            var f = feat.options;
            feat.setStyle({
              "fillOpacity":0,
              "opacity":0,
              "radius":0
            });
          };
          var featureMouseOutTimer;
          location_feature.on({
            // Track Mouse Hover Event
            "mouseover": function (e) {
              // todo- this can be another style setting in map settings to make it easy for future updates
              var opts = this.options,
              self = this;
              // Save current style to be reapplied after mouse out
              var currentStyle = {
                "fillOpacity": opts.fillOpacity,
                "opacity": opts.opacity,
                "radius": opts.radius
              };
              // Set mouse out even after mouse over occurs to maintain styles
              this.on({
                "mouseout" : function () {
                  setTimeout(function () {self.setStyle(currentStyle);},1000);
                }
              });
              // set the opacity, fill, and radius
              this.setStyle({
                "fillOpacity":1,
                "opacity":1,
                "radius":6
              });
            },
            "click": function (e) {
              var date_start = control.date_format_ymd.parse($("#config-date_start").val()),
              date_end = control.date_format_ymd.parse($("#config-date_end").val()),
              props = e.target.feature.properties,
              profile_date = props.time.substring(0,10),
              profile_time = control.iso_parse(props.time),
              latlng = this.getLatLng(),
              content = '<div style="margin:8px; min-width:240px">' +
              '<div style="float:left;">' + props.time +"</div>" +
              '<div style="text-align:right">Profile #: ' + props.profile_id +"</div>" +
              "<div>Location: " + d3.round(latlng.lat,3) + " N " + d3.round(latlng.lng,3)+" W</div>"+
              '</div><div style="padding:14px;">';

              // build button based on current selection and glider track date range
              if (profile_time <= date_start) {
                content += '<a id="track_profile_set_start" data-attr-date="'+ profile_date +'" class="btn">Set as <b>Start Date</b></a>';
              } else if (profile_time <= date_end) {
                content += '<a id="track_profile_set_start" data-attr-date="'+ profile_date +'" class="btn">Set as <b>Start Date</b></a>' + '<a id="track_profile_set_end" data-attr-date="'+ profile_date +'" class="btn">Set as <b>End Date</b>.</a>';
              } else{
                content += '<a id="track_profile_set_end" data-attr-date="'+ profile_date +'" class="btn">Set as <b>End Date</b>.</a>';
              }
              content += "</div>";

              // create pop up and add it to the map
              var popup = L.popup()
              .setLatLng(e.target._latlng)
              .setContent(content)
              .openOn(config_mapObj.map);

              $("#track_profile_set_start").on("click",function (e) {
                //console.log('click start date',$(this).attr("data-attr-date"))
                $("#config-date_start").val($(this).attr("data-attr-date"));
                control.update_slider();
                control.apply_button_status('modified');
              });

              $("#track_profile_set_end").on("click",function (e) {
                //console.log('click end date',$(this).attr("data-attr-date"))
                $("#config-date_end").val($(this).attr("data-attr-date"));
                control.update_slider();
                control.apply_button_status('modified');
              });
            }
          });

          poly_coords.push(L.latLng(location.geometry.coordinates[1],location.geometry.coordinates[0]));

        },
        pointToLayer: function (location, latlng) {
          return L.circleMarker(
            latlng,
            {
              radius: 3,
              //fillColor: "#ff0000",
              fillColor: "#ff0000",
              color: "#000",
              weight: 1,
              opacity: 0,
              fillOpacity: 0
            }
          );
        }
      });

      // set the selected L geoJson in the control map object for later reference
      // can be set to local value for memory savings if necessary
      var date_start = control.date_format_ymd.parse($("#config-date_start").val()),
      date_end = control.date_format_ymd.parse($("#config-date_end").val());

      config_mapObj.track_selected_L_geoJson = L.geoJson(geodata,{
        onEachFeature: function (location, location_feature) {
          var date_compare = control.iso_parse(location.properties.time.substring(0,10));
          if ((date_compare >= date_start ) && (date_compare <= date_end)) {
            poly_coords_selected.push(L.latLng(location.geometry.coordinates[1],location.geometry.coordinates[0]));
          }
        }
      });

      // add points
      config_mapObj.map.addLayer(config_mapObj.track_full_L_geoJson);

      // update the poly line full track
      config_mapObj.poly_line_track.setLatLngs(poly_coords);

      // update the poly line selection track
      config_mapObj.poly_line_selected.setLatLngs(poly_coords_selected);

      // zoom the bounds of the track
      //config_mapObj.map.fitBounds(config_mapObj.poly_line_track.getBounds());
    });

  };


  /**
   * update_slider
   * Called by datepickers, map popups, and update_deployment
   */
  control.update_slider = function () {
    $("#ui-config-dateRange-svg").remove();

    var margin = {top: 8, right: 40, bottom: 20, left: 40},
    width = 700 - margin.left - margin.right,
    height = 58 - margin.top - margin.bottom;

    var range = control.deployment_date_range(),
    date_start = range.start,
    date_end       = range.end, 
    range_start    = control.date_format_ymd.parse($("#config-date_start").val()), 
    range_end      = control.date_format_ymd.parse($("#config-date_end").val());
    //console.log("Dates: ", date_start, date_end, range_start, range_end);

    var range_date_start = range_start || date_start,
    range_date_end = range_end || date_end;
    //console.log("Ranges: ", range_date_start, range_date_end);

    var x = d3.time.scale.utc()
    .range([0, width])
    .domain([date_start, date_end]);

    // set the extent to the selected range within the full range
    var brush = d3.svg.brush()
    .x(x)
    .extent([range_date_start, range_date_end])
    .on("brushstart", brushstart)
    .on("brush", brushmove)
    .on("brushend", brushend);

    var arc = d3.svg.arc()
    .outerRadius(height / 2)
    .startAngle(0)
    .endAngle(function (d, i) {
      return i ? -Math.PI : Math.PI;
    });

    var svg = d3.select("#ui-config-dateRange").append("svg")
    .attr("id","ui-config-dateRange-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tick_interpolate = d3.interpolate(date_start, date_end);
    var dd = [0, .2, .4, .6, .8, 1].map(function (a) {
      return control.iso_parse(tick_interpolate(a));
    });

    var brushg = svg.append("g")
    .attr("class", "brush")
    .call(brush);

    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(
      d3.svg.axis().scale(x)
      .orient("bottom")
      .tickValues(dd)
      .tickFormat(control.date_format_ymd)
    );

    brushg.selectAll (".resize").append ("path")
    .attr ("transform", "translate(0," + height / 2 + ")")
    .attr ("d", arc);

    brushg.selectAll ("rect")
    .attr ("height", height);

    brushstart();
    brushmove();

    control.config_controls.brush = brush;

    function brushstart () {
      svg.classed("selecting", true);
    }

    function brushmove () {
      var s = brush.extent();
      $("#config-date_start").val(control.date_format_ymd(s[0]));
      $("#config-date_end").val(control.date_format_ymd(s[1]));
      // limit execution does not seem to have an effect
      L.Util.limitExecByInterval(control.poly_track_selected_update(s[0], s[1]), 1000, this);
    }

    function brushend () {
      svg.classed ("selecting", !d3.event.target.empty());
      control.apply_button_status('modified');
    }

  };


  /**
   * poly_track_selected_update
   * Called by brushmove
   */
  control.poly_track_selected_update = function (start,end) {
    // get full track from poly_track
    var track_geojson = control.leaflet_map.track_full_geojson;

    var poly_coords = [],
    config = control.parent_tool.configuration,
    config_mapObj = control.leaflet_map;

    var track_updated = L.geoJson(track_geojson,{
      onEachFeature: function (location, location_feature) {
        var date_compare = control.iso_parse(location.properties.time);
        if ((date_compare >= start ) && (date_compare <= end)) {
          poly_coords.push(L.latLng(location.geometry.coordinates[1],location.geometry.coordinates[0]));
        }
      }
    });
    config_mapObj.poly_line_selected.setLatLngs(poly_coords);
  };


  /**
   * apply_button_press
   * Called by Apply button
   */
  control.apply_button_press = function (evt) {
    var btn_apply = $(evt.target);
    
    // check to see if button is disabled, if not, apply changes
    if (!btn_apply.hasClass('disabled')) {
    
      // Update the configurations value
      control.parent_tool.configuration.institution = $("#config-institution").val();
      control.parent_tool.configuration.glider = $("#config-glider").val();
      control.parent_tool.configuration.dataset_id = $("#config-deployment").val();
      control.parent_tool.configuration.date_start = $("#config-date_start").val();
      control.parent_tool.configuration.date_end = $("#config-date_end").val();
      control.parent_tool.configuration.graph_title = $("#config-title").val();
      
      // Call the parent tool's Apply callback
      control.parent_tool.config_callback();

      // Disable the apply button
      control.apply_button_status("updated");
    }
  };


  /**
   * apply_button_status
   * Update the Apply button by enabling or disabling the class
   */
  control.apply_button_status = function(status){
    if(status == "modified"){
      $("#apply-btn")
        .attr('class', 'btn btn-medium');
      $("#revert-btn")
        .attr('class', 'btn btn-medium');
    } else if (status == "updated") {
      $("#apply-btn")
        .attr('class', 'btn btn-medium disabled');
      $("#apply-check").show().fadeOut(3000);
    }
  };


  /**
   * revert_button_press
   * Called by Revert button
   */
  control.revert_button_press = function (evt) {
    var btn_apply = $(evt.target);
    
    // check to see if button is disabled, if not, apply changes
    if (!btn_apply.hasClass('disabled')) {
    
      // Merge in default configuration from parent tool (or instance)
      $.extend(true, control.config_controls, control.initial_config);
            
      // Update the dataset browser
      control.populate_arrays();

      // Enable the apply button to save changes
      control.apply_button_status("modified");
    }
  };
  
  
  // Ending code
  if ( 'object' !== typeof EduVis.controls ) {
    EduVis.controls = {};
  }
  EduVis.controls[control.name] = control;

}(EduVis));
