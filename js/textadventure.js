var ouput;
var input;
var adventureData;
var currentSpot;

$( document ).ready(function() {
  console.log( "ready!" );
  
  ouput = $('#textadventure #ouput');
  input = $('#textadventure #input');
  input.keyup(keyup);
  
	$.ajax({
    url : "data/textadventure.yaml",
    dataType: "text",
    success : function (data) {
      //console.log("data: ",data);
      adventureData = YAML.parse(data);
      console.log("data: ",adventureData);

      goto("start");
    },
    error : function (data) {
      console.log("error");
    }
  });
});

function keyup(event) {
	//console.log('keyup: ' + event.keyCode);
	switch(event.keyCode) {
		case 13: // enter
			submit();
			break;
	}
}

function submit() {
	var inputValue = $(input).val();
	console.log('submitting: ',inputValue);
	$(input).val('');
	
	var validOption;
	$.each(currentSpotData.options,function(option,value) {
		console.log("  checking option: ",option);
		$.each(value,function(index,optionInput) {
	  	console.log("    checking optionInput: ",optionInput);
	  	if(isMatch(inputValue,optionInput)) {
	  		validOption = option;
	  		return false;
	  	}
		});
	});
	if(validOption == undefined) {
	  printUnkown();
	} else {
	  goto(validOption);
	}
}

function isMatch(input,optionInput) {
	regExp = new RegExp(optionInput,'i');
	return regExp.test(input);
}

function goto(spot) {
	console.log("goto spot: ",spot);
	if(adventureData.spots[spot] == undefined) {
  	print("There is no spot called '"+spot+"'");
	} else {
    currentSpotData = adventureData.spots[spot];
  	console.log("  data: ",currentSpotData);
  	print(currentSpotData.output);
    currentSpot = spot;
  }
}

function printUnkown() {
	unknownOuputs = adventureData.unknown;
	var randomIndex = Math.round(Math.random()*unknownOuputs.length);
	var randomUnknown = unknownOuputs[randomIndex];
	print(randomUnknown);
}

function print(text) {
	ouput.append('<p>'+text+'</p>');
}