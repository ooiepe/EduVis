/*  *  *  *  *  *  *  *
*
* EduVis.ERDDAP
*
*/

(function (eduVis) {

  "use strict";

  // var geoJSON = "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/GP05MOASGlider001Loc.htmlTable?"+
  //   "profile_number,time,latitude,longitude"+
  //   "&time>=2014-02-28T00:00:00Z&time<=2014-03-07T10:57:00Z"+
  //   "&latitude>=49.93815"+
  //   "&latitude<=50.61418"+
  //   "&longitude!=-145.1376"+
  //   "&longitude<=-144.1539";

  // "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/"
  // GP05MOASGlider001Loc.geoJson?profile_number,time,latitude,longitude


  // GP05MOASGlider001Data.csv?
  // profile_number,time,latitude,longitude,depth,salinity,temperature,conductivity,density
  // &time>=2014-02-28T00:00:00Z&time<=2014-03-07T12:03:10Z

  // http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/GP05MOASGlider001Data.csv?profile_number,time,latitude,longitude,depth,salinity,temperature,conductivity,density
  // &time>=2014-02-28T00:00:00Z
  // &time<=2014-03-07T12:03:10Z
  // &latitude>=49.965
  // &latitude<=50.605
  // &longitude>=-145.11
  // &longitude<=-144.165
  
  "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/GP05MOASGlider001Data.csv?profile_number,time,latitude,longitude,depth,salinity,temperature,conductivity,density&profile_number=1"
  
  var ERDDAP_endpoint = 
  "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/GP05MOASGlider001Loc.htmlTable?";

  // profile_number,time,latitude,longitude
  // &time>=2014-02-28T00:00:00Z
  // &time<=2014-03-07T10:57:00Z
  // &latitude>=49.93815
  // &latitude<=50.61418
  // &longitude>=-145.1376
  // &longitude<=-144.1539

  var erddap_request_glider_locations = function(){

  };

  var ERRDAP = {
    "url":""
  },

  dataset_search_example = {
    "table": {
      "columnNames": ["griddap", "Subset", "tabledap", "Make A Graph", "wms", "Title", "Summary", "FGDC", "ISO 19115", "Info", "Background Info", "RSS", "Institution", "Dataset ID"],
      "columnTypes": ["String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String", "String"],
      "rows": [
        ["", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL001.subset", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL001", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL001.graph", "", "OOI GP05MOAS-GL001", "Observational data from an OOI Global Station Papa profiling glider\n\ncdm_data_type = TrajectoryProfile\nVARIABLES:\ntrajectory (Trajectory Name, 1)\nsegment_id\nprofile_id (1)\ntime (Profile Time, seconds since 1970-01-01T00:00:00Z)\nlatitude (degrees_north)\nlongitude (degrees_east)\ndepth (m)\npressure (Sea Water Pressure, dbar)\ntemperature (Sea Water Temperature, Celsius)\nsalinity (Sea Water Practical Salinity, 1)\nconductivity (Sea Water Electrical Conductivity, S m-1)\nchlorophyll_a (Chlorophyll a Concentration, ug L-1, ug L-1)\nvolumetric_backscatter_650nm (Volume Scattering Function, Beta(117,650), m-1 sr-1, m-1 sr-1)\noxygen_concentration (Estimated Oxygen Concentration, uMol L-1, uMol L-1)\noxygen_saturation (Estimated Percentage Oxygen Saturation, %, %)\nprecise_time (seconds since 1970-01-01T00:00:00Z)\nprecise_lat (Precise Latitude, degrees_north)\nprecise_lon (Precise Longitude, degrees_east)\n", "http://tds-dev.marine.rutgers.edu:8082/erddap/metadata/fgdc/xml/OOI-GP05MOAS-GL001_fgdc.xml", "http://tds-dev.marine.rutgers.edu:8082/erddap/metadata/iso19115/xml/OOI-GP05MOAS-GL001_iso19115.xml", "http://tds-dev.marine.rutgers.edu:8082/erddap/info/OOI-GP05MOAS-GL001/index.json", "http://oceanobservatories.org", "http://tds-dev.marine.rutgers.edu:8082/erddap/rss/OOI-GP05MOAS-GL001.rss", "OOI", "OOI-GP05MOAS-GL001"],
        ["", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL002.subset", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL002", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL002.graph", "", "OOI GP05MOAS-GL002", "Observational data from an OOI Global Station Papa profiling glider\n\ncdm_data_type = TrajectoryProfile\nVARIABLES:\ntrajectory (Trajectory Name, 1)\nsegment_id\nprofile_id (1)\ntime (Profile Time, seconds since 1970-01-01T00:00:00Z)\nlatitude (degrees_north)\nlongitude (degrees_east)\ndepth (m)\npressure (Sea Water Pressure, dbar)\ntemperature (Sea Water Temperature, Celsius)\nsalinity (Sea Water Practical Salinity, 1)\nconductivity (Sea Water Electrical Conductivity, S m-1)\nchlorophyll_a (Chlorophyll a Concentration, ug L-1, ug L-1)\nvolumetric_backscatter_650nm (Volume Scattering Function, Beta(117,650), m-1 sr-1, m-1 sr-1)\noxygen_concentration (Estimated Oxygen Concentration, uMol L-1, uMol L-1)\noxygen_saturation (Estimated Percentage Oxygen Saturation, %, %)\nprecise_time (seconds since 1970-01-01T00:00:00Z)\nprecise_lat (Precise Latitude, degrees_north)\nprecise_lon (Precise Longitude, degrees_east)\n", "http://tds-dev.marine.rutgers.edu:8082/erddap/metadata/fgdc/xml/OOI-GP05MOAS-GL002_fgdc.xml", "http://tds-dev.marine.rutgers.edu:8082/erddap/metadata/iso19115/xml/OOI-GP05MOAS-GL002_iso19115.xml", "http://tds-dev.marine.rutgers.edu:8082/erddap/info/OOI-GP05MOAS-GL002/index.json", "http://oceanobservatories.org", "http://tds-dev.marine.rutgers.edu:8082/erddap/rss/OOI-GP05MOAS-GL002.rss", "OOI", "OOI-GP05MOAS-GL002"],
        ["", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL003.subset", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL003", "http://tds-dev.marine.rutgers.edu:8082/erddap/tabledap/OOI-GP05MOAS-GL003.graph", "", "OOI GP05MOAS-GL003", "Observational data from an OOI Global Station Papa profiling glider\n\ncdm_data_type = TrajectoryProfile\nVARIABLES:\ntrajectory (Trajectory Name, 1)\nsegment_id\nprofile_id (1)\ntime (Profile Time, seconds since 1970-01-01T00:00:00Z)\nlatitude (degrees_north)\nlongitude (degrees_east)\ndepth (m)\npressure (Sea Water Pressure, dbar)\ntemperature (Sea Water Temperature, Celsius)\nsalinity (Sea Water Practical Salinity, 1)\nconductivity (Sea Water Electrical Conductivity, S m-1)\nchlorophyll_a (Chlorophyll a Concentration, ug L-1, ug L-1)\nvolumetric_backscatter_650nm (Volume Scattering Function, Beta(117,650), m-1 sr-1, m-1 sr-1)\noxygen_concentration (Estimated Oxygen Concentration, uMol L-1, uMol L-1)\noxygen_saturation (Estimated Percentage Oxygen Saturation, %, %)\nprecise_time (seconds since 1970-01-01T00:00:00Z)\nprecise_lat (Precise Latitude, degrees_north)\nprecise_lon (Precise Longitude, degrees_east)\n", "http://tds-dev.marine.rutgers.edu:8082/erddap/metadata/fgdc/xml/OOI-GP05MOAS-GL003_fgdc.xml", "http://tds-dev.marine.rutgers.edu:8082/erddap/metadata/iso19115/xml/OOI-GP05MOAS-GL003_iso19115.xml", "http://tds-dev.marine.rutgers.edu:8082/erddap/info/OOI-GP05MOAS-GL003/index.json", "http://oceanobservatories.org", "http://tds-dev.marine.rutgers.edu:8082/erddap/rss/OOI-GP05MOAS-GL003.rss", "OOI", "OOI-GP05MOAS-GL003"]
      ]
    }
  };

  erddap_get_ooi_datasets = function(){

    $.getJSON('http://tds-dev.marine.rutgers.edu:8082/erddap/search/advanced.json?searchFor=&protocol=tabledap&institution=ooi', {}, function(json, textStatus) {
        
        /*optional stuff to do after success */

        var ds = json, datasets = [],
        vals_we_want = ["Dataset ID", "Title"],
        ci = 0,
        clen = ds.table.columnNames.length;

        function getColumnKey(columnValue) {
            for (ci = 0; ci < clen; ci++) {
                if (ds.table.columnNames[ci] == columnValue) return ci;
            }
            return -1;
        }

        function getRowValue(row, columnValue) {

            var columnKey = getColumnKey(columnValue),
                rowValue = dse.table.rows[row][columnKey];
            return rowValue;
        }

        $.each(ds.table.rows, function (i, row) {
            var dset = {};
            $.each(vals_we_want, function (x, v) {
                dset[v] = getRowValue(i, v);
            });
            datasets.push(dset);
        });

        console.log(datasets);
    });
  }

  eduVis.ERDDAP = {
    OOI_DataSets : erddap_get_ooi_datasets
  };

}(EduVis));