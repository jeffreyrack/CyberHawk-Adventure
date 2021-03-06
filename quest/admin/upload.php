<?php
/*
 * Updates the Status of the activity.
 * Used by Ajax request from wscript.js
 */
include '../php/credentials.php';
session_start();
//scripts starts its execution from here by verifying the post request it received and also the session of the user
if (isset($_SESSION['who']) == 'teacher') {
	if (isset($_POST['content'])) {
		process($_POST['content']);
	} else//if there is unexpected request from the client
		echo "unexpectedrequest";
} else {//if session doesnt exist this commands client to redirect to loginpage
	echo "sessionfail";
}

//Processes the data sent from the client to upload it to the Database
function process($x) {
	$content = json_decode(x);
	$x = array_keys(get_object_vars($content));
	for ($i = 0; $i < count($x); $i++)
		query("UPDATE stud_activity SET status='" . esc($content -> $x[$i] -> grant) . "',comments='" . esc($content -> $x[$i] -> comment) . "' WHERE id='" . $x[$i] . "' ");
	echo "sucess";
}

//dbase query executer
function query($x) {
	$result = mysql_query($x) or die("mysqlfailed");
	return $result;
}

//escapes mysql injection
function esc($x) {
	return mysql_escape_string($x);
}
?>

