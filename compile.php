<?php
// Script to compile EduVis modules into master EduVis.js
error_reporting(E_ALL);
date_default_timezone_set('America/New_York');

if("compile"=="compile"){
  
  // file parts to be compiled.. in order of appearance
  $parts = array(
    "modules/EduVis_base.js",
    "modules/module_asset.js",
    "modules/module_environment.js",
    "modules/module_formatting.js",
    "modules/module_tool.js",
    "modules/module_utility.js"
    // "resources/js/jquery-1.10.1.min.js"
  );

  if (is_writable("EduVis.js")) {
    $outfile = fopen("EduVis.js", 'w');
    fwrite($outfile,"//Date Compiled: " . date ("Y-m-d H:i:s") . "\n");
    
    $components = "\nComponents Included in Build\n";
    $count = count($parts);
    for ($i = 0; $i < $count; $i++) {
      fwrite($outfile, file_get_contents($parts[$i]));
      $components .= "\n-".$parts[$i];
    }
    $components .= "\n";
    fclose($outfile);
   
    //echo "<h1>---EduVis.js COMPILED--- ". $result ."</h1>";
    echo $components;

  } else {
    echo "NO COMPILE.. file not writable". date ("F d Y H:i:s") ." \n";
  }
} else {
  echo "NO COMPILE". date ("F d Y H:i:s") . "\n";
}
