<?php

// this is a very basic and temporary web service that will return hard coded tool configuration objects.
// this is to be replaced with a drupal counterpart
// request returns json object

$instanceId = $_GET['iid'];

header('Content-Type: application/json');

function getInstance($instance_id)
{
	$json = "";

	switch($instance_id){

//switch begin

case "sample" : 
$json = 
'{
	"a":"1",
	"b":"2"
}';
break;

case "Template_1" : 
$json = 
'{"alertMessage" : "This is an alert from the tool instance configuration."}';
break;
case "Time_Series_Explorer_1" : 
$json =
'{"date_end" : "2010-01-10", "date_start" : "2010-01-06"}';
break;
case "NDBC_Data" : 
$json =
'{"" : "", "" : ""}';
break;

// end switch
	}

	return $json;
	
}

echo getInstance($instanceId);


?>