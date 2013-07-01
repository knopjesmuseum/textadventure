function Terminal() {
	this.container; 			// DOM element to contain the terminal
	this.printDelay = 10; 			// DOM element to contain the terminal
	this.inputPrefix = "> ";
	this.inputSuffix = "_";
	
	this.currentLine;
	this.printBuffer = "";
	this.inputEnabled = false;
	
	Terminal.INPUT_EVENT = "input";
	
	// PUBLIC
	this.init = function() {
		var self = this;
		$(document).keydown(function(event) {self.handleInput(event)});
	}
	this.print = function(text) {
		console.log('Terminal:print: ',text);
		
		this.inputEnabled = false;
		
		currentLine = $("<p></p>");
		this.container.append(currentLine);
		this.printBuffer = text;
		this.printNextChar();
		
		//this.container.append("<p>"+text+"</p>");
		//console.log('  container: ',this.container);
	}
	
	// PRIVATE
	this.printNextChar = function() {
		if(this.printBuffer.length > 0) {
			var char = this.printBuffer.charAt(0);
			this.printBuffer = this.printBuffer.slice(1);
			currentLine.append(char);
			var self = this;
   		setTimeout(function() { self.printNextChar() } ,this.printDelay);
		} else {
			this.createInput();
		}
		this.container.scrollTop(this.container.prop('scrollHeight'));
	}
	this.createInput = function() {
		currentLine = $("<p class='input'></p>");
		this.container.append(currentLine);
		this.printInput('');
		this.inputEnabled = true;
	}
	this.printInput = function(text) {
		currentLine.text(this.inputPrefix + text + this.inputSuffix);
		this.container.scrollTop(this.container.prop('scrollHeight'));
	}
	this.getInput = function() {
		return currentLine.text().slice(2,currentLine.text().length-1);
	}
	this.handleInput = function(event) {
		//console.log('handleInput');
		//var input = String.fromCharCode(event.keyCode);
		
		switch(event.keyCode) {
			case 8: //backspace
				event.stopPropagation();
				event.preventDefault();
				break;
		}
		if(!this.inputEnabled) return
		switch(event.keyCode) {
			case 13: // enter
				this.submitInput();
				break;
			case 8: //backspace
				var currentInput = this.getInput();
				this.printInput(currentInput.slice(0,currentInput.length-1));
				break;
			default: 
				var charCode = $.getChar(event);
				var char = String.fromCharCode(charCode);
				var currentInput = this.getInput();
				//console.log("input: ",char,currentInput);
				this.printInput(currentInput+char);
				break;
		}
	}
	this.submitInput = function() {
		var currentInput = this.getInput();
		if(currentInput == "") return;
		console.log("submit: '"+currentInput+"'");
		$(document).trigger(Terminal.INPUT_EVENT,currentInput);
	}
}