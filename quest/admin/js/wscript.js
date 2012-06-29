/*
 * Common scripts needed
 * handles ajax
 * handles selection of a hunt activity
 * Creates activitiy array 
 * USED by welcome.php
 */
var uniq=Math.floor((Math.random()*100)+1);
//shortcut to get object with their id
function $(x)
{return document.getElementById(x);}
//ajax POST request
function ajax(data,url,callback)
{	
var xmlhttp;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    callback(xmlhttp.responseText);
    }
  }
xmlhttp.open("POST",url,true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send(data);
}
//this function invoked when student selects a hunt
function huntsel(x)
{ 
	if(x!='null')
	{	var hunt=hunts[x];
	//huntboundary=new georect(new latlng(hunt['minlat'],hunt['minlng']),new latlng(hunt['maxlat'],hunt['maxlng']));
	ajax("id="+hunt['id'],'retrive.php',create_activity_obj);
	//$('activity').innerHTML=multiple;
	starter();}

}


var activities=new Array();// Holds all the activities of a particular hunt organised by student id
var feed={};// Has the status of each activity like its id,comment and status.
//Instantiates the array activities with student activitivities
function create_activity_obj(x)
{
	if(x=="false")
	alert("No one has created acticity yet");
	else
	{
		x=JSON.parse(x);
		
			var temp=document.createElement('select');
			temp.id='slist';
			temp.size=10;
			temp.multiple=multiple;
	
		for ( m = 0; m < x.length; m++) {

			if (activities.hassid(x[m]['student_id']) == 'false') {
				var z = new Object();
				z.sid = x[m]['student_id'];
				z.contents = new Array();
				z.contents.push(x[m]);
				activities.push(z);
				temp.options[temp.options.length] = new Option(x[m]['firstname'] + " " + x[m]['lastname'], x[m]['student_id']);

				temp.onchange = function() {
					$('activity').innerHTML = "";
					var x = activities.hassid(this.value);
					if (x != "false") {
						for ( i = 0; i < activities[x].contents.length; i++)
							displayactivity(activities[x].contents[i])
					} else
						alert("something went wrong")
				};

			} else {
				var z = activities.hassid(x[m]['student_id']);
				activities[z].contents.push(x[m]);
			}
			var z=new Object();
			z.grant="true";
			z.comment='';
			feed[x[m]['id']]=z;

		}

		$('students').appendChild(temp);
		temp=document.createElement('input');
		temp.type='button';
		temp.value="Update DB";
		temp.onclick=function(){ajax('content='+JSON.stringify(feed),'upload.php',function(x){alert(x)})};
		$('students').appendChild(temp);
		//actdisp(x[m]);
	}
	
}

function displayactivity(x)
{
	var div=document.createElement('div');
	div.className='elem';
	//Image Element
	var img=document.createElement('img');
	img.src="../php/image.php?id="+x['media_id'];
	img.onmouseover=function(){
		this.style.height='281px';this.style.width='450px';}
	img.onmouseout=function(){
		this.style.height='80px';this.style.width='100px';}	
	div.appendChild(img);
	//Dummy place holder for image as because image is used with absolute positioning
	var dummy=document.createElement('div');
	dummy.className='dummyimg';
	div.appendChild(dummy);
	//USER Name elements ,Multiple choice question Elements
	div.appendChild(createElement('label',x['firstname']+" "+x['lastname']))
	var ans=JSON.parse(x['choices']);
 	temp=createElement('label','Multiple Chocie Question : '+x['mquestion']);
 	temp.style.width='550px';
	div.appendChild(temp);
	 temp=createElement('div','');
	temp.className='clear';
	div.appendChild(temp);
	for(y=0;y<ans.choices.length;y++)
	if(ans.choices[y].ans=="true")
	{
		var temp=createElement('label',ans.choices[y].choice+" . "+ans.choices[y].content);
		temp.style.color="green";
		div.appendChild(temp);
	}
	else
	div.appendChild(createElement('label',ans.choices[y].choice+" . "+ans.choices[y].content));
	//Clears the Div 
		 temp=createElement('div','');
	temp.className='clear';
	div.appendChild(temp);
	//Other Question Elements
	div.appendChild(createElement('label','About    : '+x['aboutmedia']));
	div.appendChild(createElement('label','Reason   : '+x['whythis']));
	div.appendChild(createElement('label','Evidence : '+x['howhelpfull']));
	div.appendChild(createElement('label','Question : '+x['yourdoubt']));
	//Clears the Div
	
	temp = createElement('div', '');
	temp.className = 'clear';
	div.appendChild(temp);
	//Comments and status Elements ad their Eventhandling on onchange to update the variable feed
	var comments = createElement('label', 'Comments');
	comments.style.width = '80px';
	var temp1 = document.createElement('textarea');
	temp1.onchange = function() {
		feed[x['id']].comment = this.value;
	}
	comments.appendChild(temp1);

	temp = document.createElement('select');
	temp.options[temp.options.length] = new Option("ACCEPT", "true");
	temp.options[temp.options.length] = new Option("DECLINE", "false");

	temp.onchange = function() {
		if (this.value == "false") {
			this.parentNode.insertBefore(comments, this.nextSibling);
			feed[x['id']].grant = "false";
		} else {
			this.parentNode.removeChild(comments);
			feed[x['id']].grant = 'true';
			feed[x['id']].comment = '';
		}

	};
	temp.value = feed[x['id']].grant;
	div.appendChild(temp);
	if (temp.value == "false") {
		comments.childNodes[1].value = feed[x['id']].comment;
		temp.parentNode.insertBefore(comments, temp.nextSibling);
	}

	
	//Horijontal Ruler
	div.appendChild(document.createElement('hr'));
	//Append the div element to the div 'activity'	
	$('activity').appendChild(div);
}
//creates a dom element
function createElement(x,y)
{
	x= document.createElement(x);
	x.innerHTML=y;
	return x;
}
// a custom prototype thats been added to array object to find existence of particular value
Array.prototype.has=function(v){
for (i=0; i<this.length; i++){
if (this[i]==v) return true;
}
return false;
}
//A custom prototype verifies whether paticular id exist inside the array
Array.prototype.hassid=function(v){
for (i=0; i<this.length; i++){
if (this[i].sid==v) return i;
}
return "false";
}
