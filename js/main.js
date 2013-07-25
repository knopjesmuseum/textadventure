var input;
var adventureData;
var currentSpot;
var textAdventure = new TextAdventure();
var terminal = new Terminal();

$( document ).ready(function() {
  console.log( "ready!" );
  
  terminal.container = $('#textadventure');
	terminal.init();
	$.ajax({
    url : "data/textadventure.yaml",
    dataType: "text",
    success : function (data) {
      //console.log("data: ",data);
      textAdventureData = YAML.parse(data);
      console.log("data: ",textAdventureData);
      textAdventure.locationsData = textAdventureData.locations;
      textAdventure.generalCommands = textAdventureData.generalCommands;
      textAdventure.unkownMessages = textAdventureData.messages.unknown;
      textAdventure.goto("start");
    },
    error : function (data) {
      console.log("error");
    }
  });
  
  $(document).on(TextAdventure.OUTPUT_EVENT,handleOutput);
  $(document).on(Terminal.INPUT_EVENT,handleInput);
});

function handleInput(event,text) {
	textAdventure.input(text);
}
function handleOutput(event,text) {
	console.log("handleOutput: ",text);
	terminal.print(text);
}