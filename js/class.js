function LiveGallery(simple, newImagesCallback) {
	this.maxWidthBigImage = 0.75; // max percentage of screen width

	
	this.init = function() {
		this.loadLatestImages();
		
		var self = this;
	  $(document).click(function() { self.loadLatestImages });
	}
	this.loadLatestImages = function() {
		var self = this;
		$.ajax({
		  url: '../index.php/rss/feed/rss_extra/latest',
		  dataType: 'xml',
		  timeout: self.timeoutTime*1000,
		  success: function(data){
		  
		  	var items = Utils.parseRSSData(data);
		  	
			},
			error: function(jqXHR, status, errorThrown){   //the status returned will be "timeout" 
   			//if(console) console.log("livegallery reload error. Status: ",status,' errorThrown: ',errorThrown);
   			switch(status) {
   				case 'timeout':
	   				self.loadLatestImages(); 
   					break;
   			} 			
			} 
		});
	}
	this.hideFlash = function() {
		if(this.simple) {
	  	$('#flash').empty();	  
	  } else {
			$('#flash div').animate({
		    opacity: 0
		  	}, 500, function() {
		  		$('#flash').empty();
		  	}
		  );
	  }
	}
}