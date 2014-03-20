<?php

  error_reporting(E_ALL);

  // admin

  if("compile"=="compile"){

    // file parts to be compiled.. in order of appearance

    $parts = array(
      "modules/EduVis_base.js",
      "modules/module_asset.js",
      
      "modules/module_environment.js",
      "modules/module_formatting.js",
      
      "modules/module_tool.js",
      "modules/module_utility.js",
      "resources/js/jquery-1.10.1.min.js"
    );

    if (is_writable("EduVis.js")) {

      $outfile = fopen("EduVis.js", 'w');
      //$f0 = "//Date Compiled: " . date ("F d Y H:i:s") . "\n";
      
      fwrite($outfile,"//Date Compiled: " . date ("F d Y H:i:s") . "\n");
      
      $components = "<div><h3>Components Included in Build</h3><ul>";

      $count = count($parts);
      for ($i = 0; $i < $count; $i++) {
        
        fwrite($outfile, file_get_contents($parts[$i]));

        $components .= "<li>".$parts[$i]."</li>";

      }

      $components .= "</ul></div>";

      fclose($outfile);
     
      //,$f2,$f3,$f4,$f5,$f6,$f7,$f8,$f9,$f10);

      echo "<h1>---EduVis.js COMPILED--- ". $result ."</h1>";
      echo $components;

    }
    else{
      echo "<h1>---NO COMPILE.. file not writable---</h1>". date ("F d Y H:i:s");
    }

  }
  else{
    echo "<h1>---NO COMPILE---</h1>". date ("F d Y H:i:s");
  }
