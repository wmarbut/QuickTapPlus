
	/* Initialize QTPlus within your app */
	var QTPlusInit = function(){
			Pebble.sendAppMessage({
				"0":1,
				"1":"32\u00B0C",
				"2": "Atlanta",
				"3": "Clear"
			}, function(e){ 
				console.log("Successfully sent message");
			}, function(e) {
				console.log("Unable to send message");
				console.log(e.error.message);
				console.log(e);
			});
	};

	Pebble.addEventListener("ready", function(e) {
		console.log("JavaScript app ready and running!");
		QTPlusInit();
	});
