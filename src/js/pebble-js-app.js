
	/* Initialize QTPlus within your app */
	var QTPlusInit = function(){
		var weather_timeout, failed_attempts;
		failed_attempts = 0;

		var roundTo = function(flpt, places) {
			return	(Math.round( (parseInt( flpt * Math.pow(10, places+1) ) / 10) ) / Math.pow(10,places));
		};

		var sendWeather = function(weather) {
			Pebble.sendAppMessage(
				weather,
				function(e){ 
					console.log("Successfully sent message");
				}, function(e) {
					console.log("Unable to send message");
					console.log(e.error.message);
					console.log(e);
					setTimeout(function() {
						sendWeather(weather);
					}, 5000);
				}
			);
		};

		var sendWeatherFail = function() {
			sendWeather({
				"0": 8,
				"1": "---\u00B0F",
				"2": "N/A",
				"3": "N/A",
				"4": "---\u00B0F"
			});
		};

		var getLocation = function(callback) {
			window.navigator.geolocation.getCurrentPosition(
				function(loc) {
					callback(false, loc);	
				},
				function(err) {
					locationFailureCallback(err);
					callback(err);
				}, 
				{
					timeout: 15000,
					maximumAge: 10000
				}
			);
		};

		var locationFailureCallback = function(err) {
			console.log(err);
			sendWeatherFail();
		};

		var getWeatherIcon = function(weather_id, sunset, sunrise) {
			var cdate = new Date();
			var is_day = (cdate.getTime() < sunset && cdate.getTime() > sunrise)? true : false;
			var icon = 0;
			if (weather_id <= 100) {
				icon = (is_day)? 0 : 1;
			} else if (weather_id <= 200) {
				icon = 5;
			} else if (weather_id <= 300) {
				icon = 6;
			} else if (weather_id <= 500) {
				icon = 6;
			} else if (weather_id <= 600) {
				icon = 7;
			} else if (weather_id <= 700) {
				icon = (is_day)? 3 : 2;
			} else if (weather_id <= 800) {
				icon = 4;
			} else if (weather_id < 950) {
				icon = 5;
			}
			return icon;	
		};

		var getWeather = function (loc, callback) {
			var req = new XMLHttpRequest();
			var url = "http://api.openweathermap.org/data/2.5/weather?" +
				"lat=" + roundTo(loc.coords.latitude,2) + "&lon=" + roundTo(loc.coords.longitude,2);
			console.log("Requestiong weather at: " + url);
			req.open('GET', url, true);
			req.onload = function(e) {
				if (req.readyState == 4 && req.status == 200) {
					var response;
					try {
						response = JSON.parse(req.responseText);
					} catch (err) {
						console.log("Unable to parse JSON weather response");
						response = false;
					}
					var temperature, icon, city, description;
					if (response && response.main && response.weather) {
						var weather_response = {
							"temperature": Math.round(response.main.temp - 273.15),
							"icon": getWeatherIcon(response.weather[0].id, response.sys.sunset, response.sys.sunrise),
							"city": response.name,
							"description": response.weather[0].main
						};
						callback(false, weather_response);
					} else {
						console.log("Weather response did not include expected elements: " + JSON.stringify(response));
						callback(true);
					}
				} else {
					if (req.status !== 200) {
						console.log("XHR did not return 200: " + req.status);
					}
					callback(true);
				}
			};
			req.send(null);

		};

		var goWeather = function() {
			console.log("Requestiong weather...");
			getLocation(function(err, loc){
				if (!err) {
					console.log("Location received ("+ loc.coords.latitude + "," + loc.coords.longitude + "), fetching weather"); 
					getWeather(loc, function(err, weather){
						if (!err) {
							console.log("Weather received, sending to Pebble");
							failed_attempts = 0;
							sendWeather({
								"0": weather.icon,
								"1": ((1.8 * weather.temperature)+32).toString() + "\u00B0C",
								"2": weather.city,
								"3": weather.description,
								"4": weather.temperature.toString() + "\u00B0C"
							});
						} else {
							console.log("Unable to retrieve weather");
							sendWeatherFail();
							resetWeather();
						}
					});
				} else {
					console.log("Unable to retrieeve location");
					sendWeatherFail();
					resetWeather();
				}
			});
		};

		var resetWeather = function() {
			if (weather_timeout) {
				console.log("Clearing weather timeout");
				clearTimeout(weather_timeout);
				weather_timeout = false;
				failed_attempts += 1;
			}
			if (failed_attempts < 5) {
				console.log("Kick off weather");
				goWeather();
			}
			weather_timeout = setTimeout(function() {
				goWeather();
			}, 15*60*1000);
		};

		console.log("Initial weather request");
		resetWeather();

	};

	Pebble.addEventListener("ready", function(e) {
		console.log("JavaScript app ready and running!");
		QTPlusInit();
	});
