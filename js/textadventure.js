function TextAdventure() {
	this.locationsData; 		// json locations data
	this.unkownMessages;	  // array containing possible responses to input we can't handle
	this.currentLocation; 	// name of current spot

	this.OUTPUT_EVENT = "output";
	
	// PUBLIC
	this.input = function(text) {
		console.log('TextAdventure:input: ',text);
		var currentLocationData = this.locationsData[this.currentLocation];
		var validExit;

		// check exits
		if(currentLocationData.exits != undefined) {
			var self = this;
			$.each(currentLocationData.exits,function(exit,content) {
				console.log("  checking exit: ",exit);
				$.each(content,function(index,exitCommand) {
			  	console.log("    checking exitCommand: ",exitCommand);
			  	if(self.isMatch(text,exitCommand)) {
			  		validExit = exit;
			  		return false;
			  	}
				});
			});
		}
		if(validExit == undefined) {
		  this.outputUnknown();
		} else {
		  this.goto(validExit);
		}
	}
	
	// PRIVATE
	this.goto = function(location) {
		console.log("goto location: ",location);
		if(this.locationsData[location] == undefined) {
	  	this.outputError("There is no location called '"+location+"'");
		} else {
	    var currentLocationData = this.locationsData[location];
	  	console.log("  data: ",currentLocationData);
	  	this.output(currentLocationData.output);
	    this.currentLocation = location;
	  }
	}
	this.outputUnknown = function() {
		console.log("outputUnknown");
		var randomIndex = Math.round(Math.random()*(this.unkownMessages.length-1));
		var randomUnknown = this.unkownMessages[randomIndex];
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
