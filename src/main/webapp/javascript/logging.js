var backend_url  = '/log';

var ERROR_LEVEL = "ERROR";
var INFO_LEVEL = "INFO";
var DEBUG_LEVEL = "DEBUG";

function logError(text)
{
	_log(ERROR_LEVEL, text)
}

function logInfo(text)
{
	_log(INFO_LEVEL, text)
}

function logDebug(text)
{
	_log(DEBUG_LEVEL, text)
}

function _log(level, message) 
{
	$.ajax({
		type: 'POST',
		url: backend_url,
		data: {context: navigator.userAgent,
			level: level,
			message: message},
		contentType: 'application/x-www-form-urlencoded'
//			,
//		success: function(response)
//		{
//			alert('logged suxesfuly');
//		},
//		error: function(response)
//		{
//			alert('error!!!!');
//		}
	}); 

}
