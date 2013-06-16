function Terminal() {
	this.container; 			// DOM element to contain the terminal

	// PUBLIC
	this.print = function(text) {
		console.log('Terminal:print: ',text);
		this.container.append("<p>"+text+"</p>");
		console.log('  container: ',this.container);
	}
}
