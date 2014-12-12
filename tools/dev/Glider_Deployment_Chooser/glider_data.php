<?php

error_reporting(E_ALL ^ E_NOTICE);

// get query string parameters tool and config

// $dateStart = "2011-12-15";
// $dateEnd = "2012-01-10";

$dateStart = $_GET['date_start'];//|| "03-14-12";
$dateEnd = $_GET['date_end'];// || "03-16-12";

//$host = 'mysql1';
$host = 'mysql1';
$login = 'sage_epeglider';
$pass = 'sageimcs';
$database = 'sage_epeglider';

$link = mysql_connect($host, $login, $pass);
if (!$link) {
    die('{"error":"'. mysql_error() . '"}');
}
mysql_select_db($database);


//$task = $_GET['dbtask'] or die("Database Task ( " . $_GET['dbtask'] . " ) is not defined.");
//$task = "json_day_summarized_tracks";
//$task = "find_deployments";

$task = "query_bounding_box";

if(isset($_GET['deployments'])){
	$deployments = $_GET['deployments'];
}
else{
	$deployments = "SELECT deployment_id from epe_deployments";
}

switch($task){

	case "find_deployments":

		$query = sprintf("SELECT epe_deployments.*, gliders.glider_name FROM epe_deployments inner join epe_gliders gliders on epe_deployments.glider_id = gliders.glider_id 
	    WHERE (start_date >= '%s' AND start_date <= '%s') OR 
	    (end_date >='%s' AND end_date <= '%s')",

		    mysql_real_escape_string($dateStart),
		    mysql_real_escape_string($dateEnd),
		    mysql_real_escape_string($dateStart),
		    mysql_real_escape_string($dateEnd)
	    );

		// Perform Query
		$result = mysql_query($query);
			
		// Check result
		// This shows the actual query sent to MySQL, and the error. Useful for debugging.
		if (!$result) {
		    $message  = 'Invalid query: ' . mysql_error() . "\n";
		    $message .= 'Whole query: ' . $query;
		    die($message);
		}

		
		$deployment_data = array();

		while ($row = mysql_fetch_assoc($result)) {

			$deployment_data[] = $row;
			
			// deployment_id
			// glider_id    
			// start_date   
			// end_date     
			// name         
			// date_added   

		}

		//echo json_encode($deployment_data);
		echo prettyPrint(json_encode($deployment_data));

		break;

	case "find_cast_data":

		  $sql = "SELECT profile_id, date_format(profile_time,'%Y-%m-%dT%TZ') as obsdate, profile_lat, profile_lon, profile_direction 
    		FROM epe_profiles 
    		WHERE glider_id = " . $deployment['glider_id'] . " AND profile_time >= '" . $deployment['start_date'] . "' AND profile_time <= '" . $deployment['end_date'] . "'";

	
	break;

	case "query_bounding_box":

		//http://ooi.dev/epe/framework/EV_Glider_Deployment_Chooser/glider_data.php?dbtask=query_bounding_box&date_start=2011-08-10&date_end=2012-11-05&
		//http://ooi.dev/epe/framework/EV_Glider_Deployment_Chooser/glider_data.php?dbtask=find_deployments&date_start=2011-08-10&date_end=2012-11-05&lng_min=-15.1171875&lng_max=-15.1171875&lat_min=13.581920900545844&lat_max=57.136239319177434

		//SELECT fish_name WHERE lat > $low_lat AND lat < $high_lat AND lng > $low_lng AND lng < $high_lng

		$lat_min = $_GET['lat_min'];
		$lat_max = $_GET['lat_max'];
		$lng_min = $_GET['lng_min'];
		$lng_max = $_GET['lng_max'];

		//		North West: lat: 41.623655390686395, lng: -75.311279296875
		//		South West: lat: 38.94232097947902, lng: -67.34619140625

		// 2011-08-10 13:30:00
		// "start_date": "2011-08-10 13:30:00",
		// "end_date": "2011-09-09 05:00",

		// "start_date": "2012-08-14 15:19:00",
		// "end_date": "2012-08-30 12:59"

		// "start_date": "2012-09-13 15:12:00",
		// "end_date": "2012-10-04 13:28",
		// "name": "RU07 - EPA run on the NJ coast",


		// "start_date": "2012-10-25 19:44:00",
		// "end_date": "2012-11-05 17:44",
		// "name": "RU23 - Hurricane Sandy",

		//SELECT profile_id, date_format(profile_time,'%Y-%m-%dT%TZ') as obsdate, profile_lat, profile_lon, profile_direction 
		//FROM epe_profiles 
		//WHERE glider_id= 3 AND profile_time >= '2011-08-10' AND profile_time <= '2011-08-11' AND profile_lat > 38.9423 AND profile_lat < 41.6236 AND profile_lon > -75.3112 AND profile_lon < -67.34619140625

		// get profiles in the bounding box
		$sql_profiles = "SELECT profile_id, glider_id, num_records, profile_max_pressure_decibars, date_format(profile_time,'%Y-%m-%dT%TZ') as obsdate, ".
			" profile_lat as lat, profile_lon as lng, profile_direction FROM epe_profiles ".
			" WHERE " .
			//" glider_id = " . $glider_id . " "
			" profile_time >= '".$dateStart. "'".
			" AND profile_time <= '".$dateEnd. "'".
			" AND profile_lat > ".$lat_min.
			" AND profile_lat < ".$lat_max.
			" AND profile_lon > ".$lng_min.
			" AND profile_lon < ".$lng_max;
			//" group by glider_id, to_days(profile_time)". 
			//" order by glider_id, to_days(profile_time)";
					// Perform Query
			
		$result = mysql_query($sql_profiles);

		if (!$result) {
		    $message  = 'Invalid query: ' . mysql_error() . "\n";
		    $message .= 'Whole query: ' . $query;
		    die($message);
		}

		$profileFeatures["type"] = "FeatureCollection";

		$gliders = array();

		while ($row = mysql_fetch_assoc($result)) {

			$glider = $row["glider_id"];
			$id = $row["profile_id"];
			$lat = (float)$row["lat"];
			$lng = (float)$row["lng"];
			$coords = array($lng,$lat);

			$gliders[$row["glider_id"]] = $row["glider_id"];

			// test if the feature is set.. if so, just append the coordinates to the 
			// if(isset($jsonObj[$glider]["geometry"])){
				
			// 	$jsonObj[$glider]["geometry"]["coordinates"][] = $coords;
			// }
			// else
			// {
			// 	$jsonObj[$glider]["type"] = "Feature";
			// 	$jsonObj[$glider]["id"] = $d;
			// 	$jsonObj[$glider]["properties"]["profile_id"] = $id;
			// 	$jsonObj[$glider]["properties"]["glider_id"] = $glider;
			// 	$jsonObj[$glider]["geometry"]["type"] = "LineString";
			// 	$jsonObj[$glider]["geometry"]["coordinates"][] = $coords;
				
			// }
			$profileFeatures['features'][] = array (
				"type" => "Feature",

				"geometry" => array(
					"type" => "Point",
					"coordinates" =>  $coords
				),
				"properties" => array(
					"id" => $id,
					"direction" => $row["profile_direction"]
				)
			);
				
			//	"direction" => $row["profile_direction"],
			//	"obsdate" => $row["obsdate"],
			//	"num_records" => $row["num_records"],
			//	"max_pressure_decibars" => $row["profile_max_pressure_decibars"]

		}

    	// get deployment and glider id full deployments for linestring

    	// foreach($gliders as $key){
    	// 	$gliderset[] = $key;
    	// }

    	//echo "gliders "  . json_encode($gliders) ."\n\n\n";


		header("Content-type: application/json");
    	if($_GET['pretty_print'] == "yes"){
			echo prettyPrint(json_encode($profileFeatures));
    	}
    	else{
			echo json_encode($profileFeatures);
    	}

  //   	$sql_deployments = "SELECT epe_deployments.*, gliders.glider_name ".
  //   		" FROM epe_deployments inner join epe_gliders gliders on epe_deployments.glider_id = gliders.glider_id ".
  //   		" WHERE epe_deployments.glider_id in ( ".explode(",", $gliderset) . ")".
  //   		"AND (epe_deployments.start_date <= '".$dateStart. "' AND epe_deployments.end_date >= '".$dateEnd. "')";

		// $jsonObj = array();

		// if ($result = $mysqli->query($sql_deployments)) {

  //   		while ($deployment = $result->fetch_assoc()) {

  //   			$sql_deployment = "SELECT profile_id, date_format(profile_time,'%Y-%m-%dT%TZ') as obsdate, profile_lat, profile_lon, profile_direction 

  //   			FROM epe_profiles
  //   			WHERE glider_id = " . $deployment['glider_id'] . " AND profile_time >= '" . $deployment['start_date'] . "' AND profile_time <= '" . $deployment['end_date'] . "'";

  //   			$gliderId = $deployment['glider_id'];

  //   			// create the linestring features and add the properties;
  //   			if ($result2 = $mysqli->query($sql_deployment)) {

  //   				while ($profile = $result2->fetch_assoc()) {

  //   					if(isset($jsonObj[$gliderId]["geometry"])){
					
		// 					$jsonObj[$gliderId]["geometry"]["coordinates"][] = $coords;
		// 				}
		// 				else
		// 				{
		// 					$jsonObj[$gliderId]["type"] = "Feature";
		// 					$jsonObj[$gliderId]["id"] = $d;
		// 					$jsonObj[$gliderId]["properties"]["profile_id"] = $id;
		// 					$jsonObj[$gliderId]["properties"]["glider_id"] = $gliderId;
		// 					$jsonObj[$gliderId]["geometry"]["type"] = "LineString";
		// 					$jsonObj[$gliderId]["geometry"]["coordinates"][] = $coords;
							
		// 				}
  //   				}
  //   				$result2->free();
		// 		}

  //   		}
  //   		$result->free();
  //   	}


	 //    // Perform Query
		// $result = mysql_query($query);

		// $lineFeatures = array();
		// $profileFeatures = array();
			
		// // Check result
		// // This shows the actual query sent to MySQL, and the error. Useful for debugging.
		// 	while ($row = mysql_fetch_assoc($result)) {

		// 	// define the feature, we will use the deployment ID as a grouping element
		// 	$glider = $row["glider_id"];
		// 	$id = $row["profile_id"];
		// 	$lat = (float)$row["lat"];
		// 	$lng = (float)$row["lng"];
		// 	$coords = array($lng,$lat);

		// 	// test if the feature is set.. if so, just append the coordinates to the 
		// 	// if(isset($jsonObj[$glider]["geometry"])){
				
		// 	// 	$jsonObj[$glider]["geometry"]["coordinates"][] = $coords;
		// 	// }
		// 	// else
		// 	// {
		// 	// 	$jsonObj[$glider]["type"] = "Feature";
		// 	// 	$jsonObj[$glider]["id"] = $d;
		// 	// 	$jsonObj[$glider]["properties"]["profile_id"] = $id;
		// 	// 	$jsonObj[$glider]["properties"]["glider_id"] = $glider;
		// 	// 	$jsonObj[$glider]["geometry"]["type"] = "LineString";
		// 	// 	$jsonObj[$glider]["geometry"]["coordinates"][] = $coords;
				
		// 	// }

		// 	$profileFeatures[$id]["type"] = "Feature";
		// 	$profileFeatures[$id]["geometry"]["type"] = "Point";
		// 	$profileFeatures[$id]["geometry"]["coordinates"] = $coords;
		// 	$profileFeatures[$id]["properties"]["lat"] = $lat;
		// 	$profileFeatures[$id]["properties"]["lng"] = $lng;
		// 	$profileFeatures[$id]["properties"]["direction"] = $row["profile_direction"];
		// 	$profileFeatures[$id]["properties"]["obsdate"] = $row["obsdate"];
		// 	$profileFeatures[$id]["properties"]["num_records"] = $row["num_recprds"];
		// 	$profileFeatures[$id]["properties"]["max_pressure_decibars"] = $row["max_pressure_decibars"];

		// }

		// create the feature collection object
		
		//$jsonObj["features"] = array();

		// $newObj = array();
		// $newObj["type"] = "FeatureCollection";

		// // add each feature to the object to preserve grouping

		// foreach($jsonObj as $feature){
		// 	$newObj["features"][] = $feature;
		// }

		// foreach($profileFeatures as $feature){
		// 	$newObj["features"][] = $feature;
		// }

		// encode as json and output GeoJSON obj
		//header("Content-type: application/json");
		
		//echo prettyPrint(json_encode($newObj));

	break;	

	case "json_day_summarized_tracks":

		
		//SELECT id, observation_time as obstime, deployment_id, latitude as lat, longitude as lng from cast_data where deployment_id in (221,359,367,369) group by to_days(obstime) order by to_days(obstime)


  		$sql = "SELECT profile_id, date_format(profile_time,'%Y-%m-%dT%TZ') as obsdate, profile_lat, profile_lon, profile_direction 
    			FROM epe_profiles 
    			WHERE glider_id = " . $deployment['glider_id'] . " AND profile_time >= '" . $deployment['start_date'] . "' AND profile_time <= '" . $deployment['end_date'] . "'";
	
	    $query = sprintf("SELECT deployment_id, observation_time as obstime, deployment_id as deployment, latitude as lat, longitude as lng 
			from cast_data group by to_days(obstime) 
			order by to_days(obstime)",

	    	mysql_real_escape_string($deployments)
	    
	    );

	  //   $query = sprintf("SELECT id, observation_time as obstime, deployment_id as deployment, latitude as lat, longitude as lng 
			// from cast_data group by to_days(obstime) 
			// order by to_days(obstime)",

	  //   	mysql_real_escape_string($deployments)
	    
	  //   );

		// Perform Query
		$result = mysql_query($query);
			
		// Check result
		// This shows the actual query sent to MySQL, and the error. Useful for debugging.
		if (!$result) {
		    $message  = 'Invalid query: ' . mysql_error() . "\n";
		    $message .= 'Whole query: ' . $query;
		    die($message);
		}

		$jsonObj["type"] = "FeatureCollection";
	
		while ($row = mysql_fetch_assoc($result)) {

			// define the feature, we will use the deployment ID as a grouping element

			$d = $row["deployment"];
			$lat = (float)$row["lat"];
			$lng = (float)$row["lng"];
			$coords = array($lng,$lat);

			// test if the feature is set.. if so, just append the coordinates to the 
			if(isset($feature[$d]["geometry"])){
				
				//$feature[$d]["geometry"]["coordinates"][] = $coords;

				$jsonObj["features"][$d]["geometry"]["coordinates"][] = $coords;
			}
			else
			{
				$jsonObj["features"][$d]["type"] = "Feature";
				$jsonObj["features"][$d]["id"] = $d;
				

				$jsonObj["features"][$d]["properties"]["deployment"] = $d;
				//$jsonObj["features"][$d]["properties"]["obstime"] = $row["obstime"];

				$jsonObj["features"][$d]["geometry"]["type"] = "LineString";
				$jsonObj["features"][$d]["geometry"]["coordinates"][] = $coords;

				//$jsonObj["features"][$d] = $feature;
			}

		};


		// create the feature collection object
		
		//$jsonObj["features"] = array();

		$newObj = array();
		$newObj["type"] = "FeatureCollection";

		// add each feature to the object to preserve grouping

		foreach($jsonObj["features"] as $feature){
			$newObj["features"][] = $feature;
		}

		// encode as json and output GeoJSON obj
		header("Content-type: application/json");
		
		echo prettyPrint(json_encode($newObj));

	break;
}

// for GeoJSON details --> see http://geojson.org/geojson-spec.html#feature-collection-objects


mysql_free_result($result);

mysql_close($link);

function prettyPrint( $json )
{
    $result = '';
    $level = 0;
    $prev_char = '';
    $in_quotes = false;
    $ends_line_level = NULL;
    $json_length = strlen( $json );

    for( $i = 0; $i < $json_length; $i++ ) {
        $char = $json[$i];
        $new_line_level = NULL;
        $post = "";
        if( $ends_line_level !== NULL ) {
            $new_line_level = $ends_line_level;
            $ends_line_level = NULL;
        }
        if( $char === '"' && $prev_char != '\\' ) {
            $in_quotes = !$in_quotes;
        } else if( ! $in_quotes ) {
            switch( $char ) {
                case '}': case ']':
                    $level--;
                    $ends_line_level = NULL;
                    $new_line_level = $level;
                    break;

                case '{': case '[':
                    $level++;
                case ',':
                    $ends_line_level = $level;
                    break;

                case ':':
                    $post = " ";
                    break;

                case " ": case "\t": case "\n": case "\r":
                    $char = "";
                    $ends_line_level = $new_line_level;
                    $new_line_level = NULL;
                    break;
            }
        }
        if( $new_line_level !== NULL ) {
            $result .= "\n".str_repeat( "\t", $new_line_level );
        }
        $result .= $char.$post;
        $prev_char = $char;
    }

    return $result;
}

?>