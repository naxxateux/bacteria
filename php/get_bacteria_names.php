<?php

$files = "[";

foreach(glob('../data/bacteries/*.*') as $filename) {
	if ($files != "[") {
    	$files .= ",";
    }
	$files .= "\"$filename\"";
}

$files .= "]";
echo $files;

?>
