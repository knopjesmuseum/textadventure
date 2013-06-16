var input;
var adventureData;
var currentSpot;
var textAdventure = new TextAdventure();
var terminal = new Terminal();

$( document ).ready(function() {
  console.log( "ready!" );
  
  input = $('#textadventure #input');
  input.keyup(keyup);

  terminal.container = $('#textadventure #ouput');
	
	$.ajax({
    url : "data/textAdventure.yaml",
    dataType: "text",
    success : function (data) {
      //console.log("data: ",data);
      textAdventureData = YAML.parse(data);
      console.log("data: ",textAdventureData);
      textAdventure.spotsData = textAdventureData.spots;
      textAdventure.unkownTexts = textAdventureData.unknown;
      textAdventure.goto("start");
    },
    error : function (data) {
      console.log("error");
    }
  });
  
  $(document).on(textAdventure.OUTPUT_EVENT,handleOutput);
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
	textAdventure.input(inputValue);
	$(input).val('');
}
function handleOutput(event,text) {
	terminal.print(text);
}