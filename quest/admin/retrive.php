<?
if(isset($_POST['id']))
{
	include "../php/credentials.php";
	$x=mysql_query("SELECT stud_activity.*,students.firstname,students.lastname FROM stud_activity,students WHERE students.id=stud_activity.student_id AND stud_activity.hunt_id='".mysql_escape_string($_POST['id'])."'");
	if(mysql_num_rows($x)==0)
	{echo "false";}
	else {
		$z=array();
		while($m=mysql_fetch_assoc($x))
		array_push($z,$m);
		$z=json_encode($z);
		echo $z;
	}

}
?>