var LOCATION_CLS_NAME = 'location_class';
var TIME_CLS_NAME = 'time_class';
var DELETE_BUTTON_CLS_NAME = 'delete_button';
var BAR_CLS_NAME = 'bar_class';

/**
 * this function adds elements to the div 'timezones' dynamically
 * the structure:
 * 
 * <div id='time_with_tz_X'>
 * 	<button>
 * 		<img...>
 * 	</button>
 *  <div id='location_X'>...
 * 	<div id='time_X'>...
 * </div>
 */
function addElement() 
{
	  var ni = document.getElementById('timezones');
	  var numElement = document.getElementById('theValue');

	  var num = numElement.value;

	  //increase the value (for next time we use it):
	  numElement.value = (num - 1) + 2;	//if we write '+1' where the value is '5', we get '51' coz it's a string.

	  var newdiv = document.createElement('div');

	  var divIdName = 'time_with_tz_' + num;

	  newdiv.setAttribute('id', divIdName);
//	  logInfo('Element with id= '+divIdName+' has been added');

	  ni.appendChild(newdiv);

	  //create inner items ONLY AFTER PARENT ITEM IS APPENDED!
	  createInnerItems( num, newdiv );

	  logDebug('Element (with child-elements) have been created successfully for index '+ num);
}

function createInnerItems( index, parentElement )
{
	  var newDeleteButton = document.createElement('button');
	  var newDeleteButtonImg = document.createElement('img');
	  var newLocationdiv = document.createElement('div');
	  var newTimediv = document.createElement('div');
	  var newBar = document.createElement('div');

	  var deleteButtonId = 'delete_' + index;
	  var divLocationId = 'location_' + index;
	  var divTimeId = 'time_' + index;
	  var divBarId = 'bar_' + index;

	  newDeleteButton.id = deleteButtonId;
	  newLocationdiv.setAttribute('id', divLocationId);
	  newTimediv.setAttribute('id', divTimeId);
	  newBar.id = divBarId;
	  
	  newDeleteButton.className = DELETE_BUTTON_CLS_NAME;	//equiv to newLocationdiv.setAttribute('class', XXX);
	  newLocationdiv.className = LOCATION_CLS_NAME;		//equiv to newLocationdiv.setAttribute('class', XXX);
	  newTimediv.className = TIME_CLS_NAME;
	  newBar.className = BAR_CLS_NAME;

	  newDeleteButtonImg.id = 'del_img_' + index;
	  newDeleteButtonImg.setAttribute('src', '/delete.png');
	  
	  
	  newDeleteButton.type = 'button';
	  newDeleteButton.innerHtml = 'moshe';
	  newDeleteButton.onclick = removeElement;
	  newDeleteButton.appendChild(newDeleteButtonImg);
	  
	  createBar(newBar, divBarId);

	  
	  //DONE BY CSS: 
	  //making all in the same line (div's default is 'block'):
//	  newLocationdiv.style.display = 'inline';
//	  newTimediv.style.display = 'inline';

	  parentElement.appendChild(newDeleteButton);
	  parentElement.appendChild(newLocationdiv);
	  parentElement.appendChild(newTimediv);
	  parentElement.appendChild(newBar);

//	  logInfo('child Elements have been created successfully for index '+ index);
	  
}

function removeElement() 
{
	//jQuery event.target always refers to the element that triggered the event
	//the catch is that the control that triggeredd the event is the IMAGE INSIDE THE BUTTON,
	//so get the its parent (the button) and then the containing div.
	var id = event.target.id;
	logDebug('deleting ' + id);
	var mainDiv = document.getElementById('timezones');
	var imgElement = document.getElementById( id );
	var btnElement = imgElement.parentElement;
	var parentElement = btnElement.parentElement;
	//delete the button:
	parentElement.removeChild( btnElement );

	mainDiv.removeChild( parentElement );
}


function createBar(newBar, parentId)
{
	for (var i=0; i < 24; i++)
	{
		var newBarItem = document.createElement('span');

		newBarItem.id = parentId + '_' + i;
		newBarItem.className = 'bar_item_class';
		newBarItem.innerText = i ;
		newBarItem.onmouseover = onBarItemMouseOver;
		newBarItem.onmouseout = onBarItemMouseOut;

		newBar.appendChild(newBarItem);
	}

}