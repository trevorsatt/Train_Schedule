$(document).ready(function(){
/*FireBase
==============================================================*/
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCjcnP9crYZ3C2cSBrvIEPjk8gFnDMP5C0",
    authDomain: "trainscheduler-980d4.firebaseapp.com",
    databaseURL: "https://trainscheduler-980d4.firebaseio.com",
    storageBucket: "trainscheduler-980d4.appspot.com",
    messagingSenderId: "754858838432"
  };
  firebase.initializeApp(config);

  //Reference database
  database = firebase.database();

/*Global Variables
==============================================================*/
var trainName = '';
var dest = '';
var firstTrainTime = ''; 
var freq = '';

//Conversion Variable
var firstTimeConverted = '';
var diffTime = '';
var tRemainder;
var tMinutesTillTrain;
var nextTrain; 

//Data reference
var trainNameData = '';
var destData = '';
var arrivalData = '';
var freqData = '';
var minutesAwayData = ''; 
 
/*Functions
==============================================================*/
	//When Submit button is clicked.....
	$('#submit').on('click',function(event){
		event.preventDefault();
		//Get input info
		trainName = $('#trainName').val().trim();
		dest = $('#dest').val().trim();
		firstTrainTime = $('#firstTrainTime').val().trim();
		freq = $('#freq').val().trim();

		//Removed input info 
		$('#trainName').val('');
		$('#dest').val('');
		$('#firstTrainTime').val('');
		$('#freq').val('');

		//Conversion
			//Convert to HH:MM
			firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
			//Converts the firsTimeCover object into string
			
			 // Current Time
		    var currentTime = moment();
			diffTime = moment().diff(moment(firstTimeConverted), "minutes");
			
			// Time apart (remainder)
			tRemainder = diffTime % freq;

			// Minute Until Train
			tMinutesTillTrain = freq - tRemainder;
    		
    		// Next Train
			nextTrain = moment().add(tMinutesTillTrain, "minutes");
			nextTrainFormat = moment(nextTrain).format('hh:mm');
		
		database.ref('/trainSchedule').push({
			trainName: trainName,
			destination: dest,
			arrival: nextTrainFormat,
			minutesAway: tMinutesTillTrain,
			frequency: freq 
		}); 	
	}); 
		
		database.ref('/trainSchedule').on('child_added',function(snap){
					//Testing
					trainNameData = snap.val().trainName;
					destData = snap.val().destination;
					arrivalData = snap.val().arrival;
					freqData = snap.val().frequency;
					minutesAwayData = snap.val().minutesAway;

					//Data array
					var dataArray = [trainNameData, destData, freqData, arrivalData, minutesAwayData];
					var newTr = $('<tr>');
					for(var i = 0; i< dataArray.length; i++){
						var newTd = $('<td>');
						newTd.text(dataArray[i]);
						newTd.appendTo(newTr);
					}	
					$('.table').append(newTr);
		});
});// End of line