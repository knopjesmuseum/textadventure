function Terminal() {
	this.container; 			// DOM element to contain the terminal
	this.printDelay = 10; 			// DOM element to contain the terminal
	this.inputPrefix = "> ";
	this.inputSuffix = "_";
	
	this.buffer = [];
	this.state;
	
	Terminal.INPUT_EVENT = "input";
	
	Terminal.PRINTING_STATE = "printing";
	Terminal.LISTENING_STATE = "listening";
	
	// PUBLIC
	this.init = function() {
		this.state = Terminal.LISTENING_STATE;
		var self = this;
		$(document).keydown(function(event) {self.handleInput(event)});
	}
	this.print = function(text) {
		console.log('Terminal:print: ',text);
		
		this.buffer.push(text);
		
		if(this.state != Terminal.PRINTING_STATE) {
			this.state = Terminal.PRINTING_STATE;
			this.printNextParagraph();
		}
		//this.container.append("<p>"+text+"</p>");
		//console.log('  container: ',this.container);
	}
	
	// PRIVATE
	this.printNextParagraph = function() {
		var currentLine = $("<p></p>");
		this.container.append(currentLine);
		this.printNextChar(currentLine);
	}
	this.printNextChar = function(currentLine) {
		var text = this.buffer[0];
		if(text.length > 0) {
			var char = text.charAt(0);
			this.buffer[0] = text.slice(1);
			currentLine.append(char);
			var self = this;
   		setTimeout(function() { self.printNextChar(currentLine) } ,this.printDelay);
		} else {
			this.buffer.shift(); // remove empty string from buffer
			if(this.buffer.length > 0) { // more paragraphs in buffer? 
				this.printNextParagraph();
			} else { // no more paragraphs?
				this.createInput();
			}
		}
		this.container.scrollTop(this.container.prop('scrollHeight'));
	}
	
	this.createInput = function() {
		currentLine = $("<p class='input'></p>");
		this.container.append(currentLine);
		this.printInput('');
		this.state = Terminal.LISTENING_STATE;
	}
	this.printInput = function(text) {
		currentLine.text(this.inputPrefix + text + this.inputSuffix);
		this.container.scrollTop(this.container.prop('scrollHeight'));
	}
	this.getInput = function() {
		return currentLine.text().slice(2,currentLine.text().length-1);
	}
	this.handleInput = function(event) {
		switch(event.keyCode) {
			case 8: //backspace
				event.stopPropagation();
				event.preventDefault();
				break;
		}

		if(this.state == Terminal.LISTENING_STATE) {
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
	}
	this.submitInput = function() {
		var currentInput = this.getInput();
		if(currentInput == "") return;
		console.log("submit: '"+currentInput+"'");
		$(document).trigger(Terminal.INPUT_EVENT,currentInput);
	}
}