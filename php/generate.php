<?php 
header ("Content-Type:text/xml");  //php will act as a xml document to the client side
//================Database====================================
include "credentials.php";	 //dbase credentials + dbase connection

$what=$_REQUEST['q'];   //pulls quadrant id from the url

$table_id = 'location'; //this table has the information about the locations of each quadrant
$query = "SELECT * FROM $table_id where belong=$what";
$location = mysql_query($query, $dbconnect);
$table_id = 'quadrants'; //this table has the information about all the quadrants
$query = "SELECT * FROM $table_id where id=$what";
$quadrants = mysql_query($query, $dbconnect);

//=============================================================

$doc=new DOMDocument('1.0');	
$root=$doc->createElement('task');	

//===== Quadrants =========
//this part creates the xml elements which does have all the required information about a quadrant
$i = 0;$who=$root;  ///$i is used to keep track of how many executions happened in while loop and also create new elements at particular value of i.
$result=mysql_fetch_array($quadrants);
while ($i < mysql_num_fields($quadrants)-1) {
   
    $meta = mysql_fetch_field($quadrants, $i);
    if (!$meta) {
        
    }
	$column=$meta->name;
	if($i==6)
	{
	$zone=$doc->createElement("zone");
	$topleft=$doc->createElement("topleft");
	$who=$topleft;	
	}
	
	
$element=$doc->createElement($column,$result[$column]);

$element=$who->appendChild($element);
if($i==7)
	{$topleft=$zone->appendChild($topleft);
	$who=$zone;
	}
    $i++;
}
$zone=$root->appendChild($zone);
//=================== markers ==================
$markers=$doc->createElement("markers");

$i = 0;$who=$root;

while ($result=mysql_fetch_array($location)) {
   
    
	$marker=$doc->createElement("marker");
	$marker->setAttribute('type',$result['marker']);
	
	$element=$doc->createElement("title",$result['title']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("synopsis",$result['synopsis']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("latitude",$result['latitude']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("longitude",$result['longitude']);
	$element=$marker->appendChild($element);
	
	$element=$doc->createElement("icon",$result['icon']);
	$element=$marker->appendChild($element);
	
	$content=$doc->createElement("content");
	$pagedir=$doc->createElement('page_dir',$result['pagedir']);
	$pagedir=$content->appendChild($pagedir);
	$pages=$doc->createElement("pages");
	$id=$result['id'];
	// pulls all the activities
	$table_id = 'questions';
	$query = "SELECT * FROM $table_id where qbelong=$id";
	$questions = mysql_query($query, $dbconnect);
	//
	while($p=mysql_fetch_array($questions))
	{
		$page=$doc->createElement("page");
		
		$element=$doc->createElement("path",$p['path']."?qid=".$p['qid']);
		$element=$page->appendChild($element);
		
		$element=$doc->createElement("name",$p['name']);
		$element=$page->appendChild($element);
		
		$element=$doc->createElement("status",$p['status']);
		$element=$page->appendChild($element);
		
		$page=$pages->appendChild($page);
		
	}
	$pages=$content->appendChild($pages);
	$content=$marker->appendChild($content);
	$marker=$markers->appendChild($marker);
}
mysql_close($dbconnect);
$markers=$root->appendChild($markers);


$root=$doc->appendChild($root);

echo $doc->saveXML();



?>