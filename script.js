var device_ID = '__YOUR_PARTICLE_DEVICE_ID__ ';
var access_token = '__YOUR_PARTICLE_ACCESS_TOKEN__';
var variables = [''];

//  Function to get and parse the JSON variable from the spark API
function getResponse(variable){
	var JSONResponse = UrlFetchApp.fetch("https://api.spark.io/v1/devices/" + device_ID + "/" + variable + "?access_token=" + access_token);
	
	var response = JSON.parse(JSONResponse.getContentText());
	return response.result;		
}

function collectData()  {
	//	Declare a result array
	var timestamp = new Date();
	var results = [timestamp];

	//  Select the active spreadsheet
	var sheet = SpreadsheetApp.getActiveSheet();

	//	Loop through the array with variables and get their content
	for (var i = 0; i < variables.length; i++) {

		//	Push the results in an array
		results.push(getResponse(variables[i]));
	};
	
	//  Add the responses to the spreadsheet
	sheet.appendRow(results);
}