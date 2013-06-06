<?php



$instanceId = $_GET['iid'];

header('Content-Type: application/json');
//header('Content-disposition: attachment; filename='.$instanceId.'.js'); 

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
'{"alertMessage" : "This is a configuration setting over ride. \n Yay! Custom Instances actually work!"}';
break;
case "Time_Series_Explorer_1" : 
$json =
'{"date_start" : "2010-01-01", "date_end" : "2010-01-14"}';
break;


// end switch
	}

	return $json;
	
}

echo getInstance($instanceId);


?>