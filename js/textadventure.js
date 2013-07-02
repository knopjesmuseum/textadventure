function TextAdventure() {
	this.locationsData; 		// json locations data
	this.unkownMessages;	  // array containing possible responses to input we can't handle
	this.currentLocation; 	// name of current spot

	this.data = {};
	
	TextAdventure.OUTPUT_EVENT = "output";
	
	// PUBLIC
	this.input = function(text) {
		console.log('TextAdventure:input: ',text);
		var currentLocationData = this.locationsData[this.currentLocation];
		

		// check exits
		var validExit;
		if(currentLocationData.exits != undefined) {
			var self = this;
			$.each(currentLocationData.exits,function(exit,content) {
				console.log("  checking exit: ",exit);
				// check inputs per exit
				$.each(content,function(index,exitInput) {
			  	console.log("    checking exitInput: ",exitInput);
			  	if(self.isMatch(text,exitInput)) {
			  		validExit = exit;
			  		return false;
			  	}
				});
			});
		}
		if(validExit) {
			this.goto(validExit);
			return;
		}
		
		// check cmds
		var validCmd;
		if(currentLocationData.commands != undefined) {
			var self = this;
			$.each(currentLocationData.commands,function(index,cmdObj) {
				console.log("  checking cmd: ",index);
				// check inputs per cmd
				$.each(cmdObj.inputs,function(index,cmdInput) {
			  	console.log("    checking cmdInput: ",cmdInput);
			  	if(self.isMatch(text,cmdInput)) {
			  		console.log("      match");
			  		validCmd = cmdObj.content;
			  		return false;
			  	} else {
			  		console.log("      no match");
			  	}
				});
			});
		}
		if(validCmd) {
			this.execute(validCmd);
			return;
		}
		this.outputUnknown();
	}
	
	// PRIVATE
	this.goto = function(location) {
		console.log("goto location: ",location);
		if(this.locationsData[location] == undefined) {
	  	this.outputError("There is no location called '"+location+"'");
		} else {
	    var currentLocationData = this.locationsData[location];
	    
	  	console.log("  data: ",currentLocationData);
	  	if(currentLocationData.output == undefined)
	  		currentLocationData.output = "";
	  	this.output(currentLocationData.output);
	  	
	  	if(currentLocationData.onEnter != undefined) {
	  		this.execute(currentLocationData.onEnter);
	  	}
	  	
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
		$(document).trigger(TextAdventure.OUTPUT_EVENT,text);
	}
	
	this.isMatch = function(input,optionInput) {
		regExp = new RegExp(optionInput,'i');
		return regExp.test(input);
	}
	this.execute = function(codeStr) {
	  new Function("data","msg",codeStr) (this.data,this.output);
	}
}