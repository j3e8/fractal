<?php
require('lib/db.inc');

$data = array();

$sql = "INSERT INTO userfractals
	(ip, url)
	VALUES('" . $_SERVER['REMOTE_ADDR'] . "', '" . $_POST['url'] . "')";
db_query($sql);
$id = db_get_insert_id();

$file64 = substr($_POST['file'], strpos($_POST['file'], ',')+1);
$file = base64_decode($file64);
$fh = fopen("userfractals/$id.png", "wb");
fwrite($fh, $file);
fclose($fh);

//$data['file'] = $file64;
$data['url'] = "http://flooreight.com/userfractals/$id.png";
echo json_encode($data);

