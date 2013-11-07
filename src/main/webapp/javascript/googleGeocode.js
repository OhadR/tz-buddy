var google_tz_url  = 'https://maps.googleapis.com/maps/api/timezone/json';
var geocoder;
var dotsStr = ':';

var locationsArray = [];


function OnLoad()
{
	initialize();
}

function initialize() 
{
	geocoder = new google.maps.Geocoder();

	setInterval(updateClocks, 1200);
}


function OnAddLocation()
{
	var location = document.getElementById('location').value;
	if(location == null || location == '')
	{
		alert('location is null or empty. please enter a valid location');
		return;
	}

	//there is a callback function defined there, that keeps the handling:
	codeAddress( location );
}


function codeAddress(address) 
{
	//save the address to the cookie:
	newCookie("tz_buddy", address, 90);
	
//	var address = document.getElementById("address").value;
	geocoder.geocode( { 'address': address}, codeAddressCallback);
}


function codeAddressCallback(results, status) 
{
	if (status == google.maps.GeocoderStatus.OK) 
	{
		var loc = results[0].geometry.location;
		var formattedAddress = results[0].formatted_address;
//		alert( formattedAddress + loc  );

		//pass the formattedAddress so we can show it to the user:
		getTzByGeoFromGoogle(loc, formattedAddress);
	} 
	else 
	{
		alert("Geocode was not successful for the following reason: " + status);
	}
}


function getTzByGeoFromGoogle(location, formattedAddress)
{
	var lat = location.lat();
	var lng = location.lng();
	var tsSecs = new Date().getTime() / 1000;
	
	$.ajax({
		url : google_tz_url,
		type: 'GET',
		data: 'location=' + lat + ',' + lng 
			+ '&timestamp='
			+ tsSecs
			+ '&sensor=false',
//		data: 
//		{
//			location: dummy,
//			timestamp: '1331161200',
//			senson: 'false'
//		},
		dataType: "json",
		success: function(response)
		{
			populateResult(response, formattedAddress);
		}
	});
}


/**
 * class LocationAndTimezone
 */
function LocationAndTimezone()
{
	this.formattedAddress;
	this.tzOffsetSecs;
	this.dstOffsetSecs;
}


function populateResult(tzResponse, formattedAddress)
{
	if(tzResponse.status == 'OK')
	{
		var locationAndTimezone = new LocationAndTimezone();
		locationAndTimezone.formattedAddress = formattedAddress;
		locationAndTimezone.tzOffsetSecs = tzResponse.rawOffset;
		//consider DST (daylight saving time):
		locationAndTimezone.dstOffsetSecs = tzResponse.dstOffset;
		
		var arrayLength = locationsArray.length;
		locationsArray.push( locationAndTimezone );

		//add a new div element for this item:
		addElement();
		
		var locationElement = document.getElementById('location_' + arrayLength); 

		locationElement.innerText = formattedAddress ;

		logInfo("Response was populated successfully for location: " + formattedAddress );
	}
	else
	{
		logError("Response status is: " + tzResponse.status );
	}
}



/**
 * get offset in seconds, and return the time as string with this offset.
 */
function getTimeWithOffset( tzOffsetSeconds, dstOffsetSeconds )
{
	//create a date for local area:
	var d = new Date();
	var millisecsUTC = d.getTime();
	
	//add the offset(s):
	d.setTime(millisecsUTC + (tzOffsetSeconds * 1000) + (dstOffsetSeconds * 1000));
	
	return dateToString( d );
}


/**
 * get offset in seconds, and return only the hours as string with this offset.
 */
function getHoursWithOffset( tzOffsetSeconds, dstOffsetSeconds )
{
	//create a date for local area:
	var d = new Date();
	var millisecsUTC = d.getTime();
	
	//add the offset(s):
	d.setTime(millisecsUTC + (tzOffsetSeconds * 1000) + (dstOffsetSeconds * 1000));
	
	return ('0' + d.getUTCHours()).slice(-2);
}


function dateToString( date )
{
	return ('0' + date.getUTCHours()).slice(-2)		//.slice(-2) gives us the last two characters of the string 
		+ dotsStr		 
		+ ('0' + date.getUTCMinutes()).slice(-2)	
		;
	
}




/**
 * this is the timer callabck, that updates the clocks.
 */
function updateClocks()
{
	//switch clock' dots
	if(dotsStr == ':')
	{
		dotsStr = ' ';
	}
	else
	{
		dotsStr = ':';
	}


	for (var i=0; i < locationsArray.length; i++)	
	{
		var locationElement = document.getElementById('location_' + i); 
		var timeElement = document.getElementById('time_' + i); 
		
		//check if this item has been deleted; if so - continue iterating without updating
		if(locationElement == null)
		{
			continue;
		}
		
		locationElement.innerText = locationsArray[i].formattedAddress;

		timeElement.innerText = '   ' + getTimeWithOffset(
				locationsArray[i].tzOffsetSecs,  
				locationsArray[i].dstOffsetSecs);
		
		//update the bar with the correct values:
		var barElement = document.getElementById('bar_' + i); 
		var currentHour = getHoursWithOffset(
				locationsArray[i].tzOffsetSecs,  
				locationsArray[i].dstOffsetSecs);
 
		//update the bar:
		for (var j=0; j < 24; j++)
		{
			var barElement = document.getElementById('bar_' + i + '_' + j); 
			if(barElement != null)
			{
//				barElement.style.color = "Red";
				
				var value = ++currentHour ;
				if(value >= 24)
				{
					value -= 24;
				}

				if(value >= 22 || value <= 5)	//middle of the night:
				{
					barElement.style.backgroundColor = '#0038D4';
					barElement.style.color = 'white';
				}
				else if (value >= 8 && value <= 17)		//day time
				{
					
					barElement.style.backgroundColor = '#FFFFC8';
//					barElement.style.backgroundColor = '#FCFCA2';
				}
				else
				{
					barElement.style.backgroundColor = '#C5C9FA';
				}
			
				barElement.innerText = value;
			}
		}
		
	}
}


function onBarItemMouseOver()
{
//	this.style.color = 'Red'; 
//	this.style.fontWeight = 'bold'; 
}

function onBarItemMouseOut()
{
//	this.style.color = 'Black'; 
//	this.style.fontWeight = 'none';
}






function newCookie(name, value, days)
{
	var expires;
	var days = 10;// the number at the left reflects the number of days for the cookie to last
	     // modify it according to your needs
	if (days) 
	{
		var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toGMTString(); 
	}
	else 
	{
		expires = "";
	}
	document.cookie = name + "=" + value + expires + "; path=/"; 
}

function readCookie(name) 
{
	var nameSG = name + "=";
	var nuller = '';
	if (document.cookie.indexOf(nameSG) == -1) {return nuller}
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0)==' ') c = c.substring(1,c.length);
	if (c.indexOf(nameSG) == 0) return c.substring(nameSG.length,c.length);
	}
	return null;
}

function eraseCookie(name) 
{
	newCookie(name,"",1); 
}
