/**
 * Class  CookieManager
 * supports all handling with cookie, that saves the locations the user used.
 * 
 * "public" methods are:
 * addLocationToCookie, readCookie, removeLocationFromCookie
 */
var g_cookieManager = new CookieManager();
var COOKIE_NAME = 'tz-buddy';


function CookieManager() 
{
    var self = this;

    this.addToTimezonesCookie = function (value)
    {
    	self.addToCookie(COOKIE_NAME, value);
    };


/**
 * called upon page load or refresh
 * 
 * @returns string array with all saved locations
 */
    this.readTimezonesCookie = function()
	{
		var cookieValue = self.readCookie( COOKIE_NAME );
		return cookieValue.split('+');
	};

/**
 * when user deletes a location, we need to remove it from the cookie
 * and leave the other locations.
 * @returns
 */
	this.removeLocationFromCookie = function(value)
	{
		self._removeFromCookie(COOKIE_NAME, value);
	};


	this.addToCookie = function(name, value)
	{
		var cookieValue = self.readCookie(name);
		if(cookieValue == null)
		{
			//cookie does not exist - create a new one:
			cookieValue = value;
		}
		else
		{
			//cookie exists - add new value to existing one.
			cookieValue = cookieValue + '+' + value;		
		}
		
		self.newCookie(name, cookieValue, 30);		
	};


	this._removeFromCookie = function(name, value)
	{
		var cookieSavedLocations = self.readTimezonesCookie();
		
		var newCookieValue = '';
		
		for(var i=0; i<cookieSavedLocations.length; i++)
		{
			var location = cookieSavedLocations[i];
			if(location != value)
			{
				newCookieValue += location;
			}
		}
		self.newCookie(name, newCookieValue, 30);		
	};

	/**
	 * low-level Cookie-saver
	 * 
	 * @param name
	 * @param value
	 * @param days
	 */
	this.newCookie = function(name, value, days)
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
	};

	this.readCookie = function(name) 
	{
		var nameSG = name + "=";
	
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) 
		{
			var c = ca[i];
			while (c.charAt(0)==' ') 
				c = c.substring(1,c.length);
			if (c.indexOf(nameSG) == 0) 
				return c.substring(nameSG.length,c.length);
		}
		return null;
	};
}