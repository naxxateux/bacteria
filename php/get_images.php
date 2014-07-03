<?php

$view = $_GET["view"];
$files = "[";

foreach(glob('../img/' . $view . '/*.*') as $filename) {
	if ($files != "[") {
    	$files .= ",";
    }
	$files .= "\"$filename\"";
}

$files .= "]";
echo $files;

?>
