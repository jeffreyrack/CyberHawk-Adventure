
<?php
include "credentials.php";	 //dbase credentials + dbase connection

$id=$_REQUEST['id'];//pulls question id from the url 

// retives a row that matches qid in table image q
$query = "SELECT * FROM image where id=$id";  
$ques = mysql_query($query, $dbconnect);	//as question id is distinct it pulls only one row from table.
$result=mysql_fetch_array($ques);
//echo "<img src='../user/".$result['images']."'/>";

header('Content-Type: image/jpeg');
if(mysql_num_rows($ques)==1)
readfile("../user/".$result['images']);
//echo "<img src='".$result['images']."' alt='image' />";

?>
