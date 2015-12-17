var device_ID = '__YOUR_PARTICLE_DEVICE_ID__ ';
var access_token = '__YOUR_PARTICLE_ACCESS_TOKEN__';
var variables = [''];
var checkLatestData = true;
var refreshTime = 60;

//  Select the active spreadsheet
var sheet = SpreadsheetApp.getActiveSheet();

//	Function to create a header
function showHeader()	{
	//	Clear the first row
	sheet.deleteRow(1);

	//	At first add the timestamp
	sheet.getRange(1,1).setValue('Timestamp');

	//	Loop through all the variables and add the names of them
	for (var i = 0; i < variables.length; i++) {
		sheet.getRange(1,2 + i).setValue(variables[i]);
	};

	if(checkLatestData) {
		sheet.getRange(1, 3 + variables.length).setValue('Timestamp');

		//	Loop through all the variables and add the names of them
		for (var i = 0; i < variables.length; i++) {
			sheet.getRange(1,4 + variables.length).setValue(variables[i]);
		};
	}

	collectData();
}

//	Function to show the latest data
function showLatestData(timestamp, results)	{
	//	At first add the timestamp
	sheet.getRange(2,3 + variables.length).setValue(timestamp);

	//	Loop through all the variables and add the names of them
	for (var i = 0; i < results.length; i++) {
		sheet.getRange(2,4 + variables.length).setValue(results[i]);
	};
}

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
	var resultsWithKey = [];

	//	Loop through the array with variables and get their content
	for (var i = 0; i < variables.length; i++) {

		//	Push the results in an array
		results.push(getResponse(variables[i]));
		resultsWithKey[variables[i]] = getResponse(variables[i]);
	};

	if(checkLatestData) showLatestData(timestamp, results)
	
	//  Add the responses to the spreadsheet
	sheet.appendRow(results);

	Utilities.sleep(refreshTime * 1000)
	collectData();
}