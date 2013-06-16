function TextAdventure() {
	this.spotsData; 			// json spots data
	this.unkownTexts;			// array containing possible responses to input we can't handle
	this.currentSpot;			// name of current spot

	this.OUTPUT_EVENT = "output";
	
	// PUBLIC
	this.input = function(text) {
		console.log('TextAdventure:input: ',text);
		var currentSpotData = this.spotsData[this.currentSpot];
		var validOption;
		var self = this;
		$.each(currentSpotData.options,function(option,value) {
			console.log("  checking option: ",option);
			$.each(value,function(index,optionInput) {
		  	console.log("    checking optionInput: ",optionInput);
		  	if(self.isMatch(text,optionInput)) {
		  		validOption = option;
		  		return false;
		  	}
			});
		});
		if(validOption == undefined) {
		  this.outputUnknown();
		} else {
		  this.goto(validOption);
		}
	}
	
	// PRIVATE
	this.goto = function(spot) {
		console.log("goto spot: ",spot);
		console.log("  this.spotsData[spot]: ",this.spotsData[spot]);
		if(this.spotsData[spot] == undefined) {
	  	this.outputError("There is no spot called '"+spot+"'");
		} else {
	    this.currentSpotData = this.spotsData[spot];
	  	console.log("  data: ",this.currentSpotData);
	  	this.output(this.currentSpotData.output);
	    this.currentSpot = spot;
	  }
	}
	this.outputUnknown = function() {
		console.log("outputUnknown");
		var randomIndex = Math.round(Math.random()*(this.unkownTexts.length-1));
		console.log("randomIndex: ",randomIndex);
		console.log("this.unkownTexts.length: ",this.unkownTexts.length);
		var randomUnknown = this.unkownTexts[randomIndex];
		console.log("randomUnknown: ",randomUnknown);
		this.output(randomUnknown);
	}
	this.outputError = function(text) {
		this.output('Error: '+text);
	}
	this.output = function(text) {
		$(document).trigger(this.OUTPUT_EVENT,text);
	}
	
	this.isMatch = function(input,optionInput) {
		regExp = new RegExp(optionInput,'i');
		return regExp.test(input);
	}
}
