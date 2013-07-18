<?php

/* EduVis Development Helper */

//todo:

// file listing of DEV folder.. file listing of Production Folder

//

$exclude_list = array(".", "..", "example.txt");
if (isset($_GET["dir"])) {
  $dir_path = $_SERVER["DOCUMENT_ROOT"]."/".$_GET["dir"];
}
else {
  $dir_path = $_SERVER["DOCUMENT_ROOT"]."/";
}

//-- until here
function dir_nav() {
  global $exclude_list, $dir_path;
  $directories = array_diff(scandir($dir_path), $exclude_list);
  echo "<ul style='list-style:none;padding:0'>";
  foreach($directories as $entry) {
    if(is_dir($dir_path.$entry)) {
      echo "<li style='margin-left:1em;'>[`] <a href='?dir=".$_GET["dir"].$entry."/"."'>".$entry."</a></li>";
    }
  }
  echo "</ul>";
  //-- separator
  echo "<ul style='list-style:none;padding:0'>";
  foreach($directories as $entry) {
    if(is_file($dir_path.$entry)) {
      echo "<li style='margin-left:1em;'>[ ] <a href='?file=".$_GET["dir"].$entry."'>".$entry."</a></li>";
    }
  }
  echo "</ul>";
}
dir_nav();
//-- optional placement

if (isset($_GET["file"])) {
  //echo "<div style='margin:1em;border:1px solid Silver;'>";
//  highlight_file($dir_path.$_GET['file']);
 // echo "</div>";
}

function renderFile($filename) { 
    if(file_exists($filename) && is_file($filename)) { 
        $code = highlight_file($filename, true); 
        $counter = 1; 
        $arr = explode('<br />', $code); 
        echo '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: monospace;">' . "\r\n"; 
        foreach($arr as $line) { 
            echo '<tr>' . "\r\n"; 
                echo '<td width="65px" nowrap style="color: #666;">' . $counter . ':</td>' . "\r\n"; 

                // fix multi-line comment bug 
                if((strstr($line, '<span style="color: #FF8000">/*') !== false) && (strstr($line, '*/') !== false)) { // single line comment using /* */ 
                    $comments = false; 
                    $startcolor = "orange"; 
                }   
                elseif(strstr($line, '<span style="color: #FF8000">/*') !== false) { // multi line comment using /* */ 
                    $startcolor = "orange"; 
                    $comments = true; 
                }   
                else { // no comment marks found 
                    $startcolor = "green"; 
                    if($comments) { // continuation of multi line comment 
                        if(strstr($line, '*/') !== false) { 
                            $comments = false; 
                            $startcolor = "orange"; 
                        }   
                        else { 
                            $comments = true; 
                        }   
                    }   
                    else { // normal line   
                        $comments = false; 
                        $startcolor = "green"; 
                    }   
                }   
                // end fix multi-line comment bug 

                if($comments) 
                    echo '<td width="100%" nowrap style="color: orange;">' . $line . '</td>' . "\r\n"; 
                else 
                    echo '<td width="100%" nowrap style="color: ' . $startcolor . ';">' . $line . '</td>' . "\r\n"; 

                echo '</tr>' . "\r\n"; 
                $counter++; 
        }   
        echo '</table>' . "\r\n"; 
    }   
    else { 
        echo "<p>The file <i>$filename</i> could not be opened.</p>\r\n"; 
        return; 
    }   
} 

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>EV Developers Tool</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="stylesheet" type="text/css" href="resources/css/bootstrap.min.css">
	<style type="text/css">
		
		.num { 
			float: left; 
			color: gray; 
			text-align: right; 
			margin-right: 6pt; 
			padding-right: 6pt; 
			border-right: 1px solid gray;
		} 

	</style>
</head>
<body>
<div class="container-fluid">
	<div class="row-fluid">
		<div class="span12">
			<h1>EV Developers Tool <small> </h1>

			<ul class="nav nav-tabs">
				<li class="dropdown">
					<a class="dropdown-toggle" data-toggle="dropdown" href="#">Dropdown<b class="caret"></b></a>
					<ul class="dropdown-menu">
						<!-- links -->
						<li><a href="#">Link</a></li>
						<li class="divider"></li>
					</ul>
				</li>
			</ul>


<div class="tabbable"> 
  <ul class="nav nav-tabs">
    <li class="active"><a href="#tab1" data-toggle="tab">Section 1</a></li>
    <li><a href="#tab2" data-toggle="tab">Section 2</a></li>
  </ul>
  <div class="tab-content">
    <div class="tab-pane active" id="tab1">
      

<div>
<?php
function highlight_num($file) 
{ 
  echo '<code class="num">', implode(range(1, count(file($file))), '<br />'), '</code>'; 
  highlight_file($file); 
} 

highlight_num($dir_path.$_GET['file']); 

?>
</div>


    </div>
    <div class="tab-pane" id="tab2">

<?php renderFile($dir_path.$_GET['file']); ?>

    </div>
  </div>
</div>

		</div>
	</div>
</div>

<script src="resources/js/jquery-1.10.1.min.js"></script>
<script src="resources/js/bootstrap.min.js"></script>

<script>

// (function(){

// 	EduVis.tool.load({
// 		"name" : "Time_Series_Explorer",
// 		"target_div": "Time_Series_Explorer"
// 	});

// }());
	
</script>
</body>
</html>