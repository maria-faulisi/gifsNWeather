var GifWeather = window.GifWeather || {};

GifWeather.AppView = Backbone.View.extend({
	el: $('#appWrap'),
	events: {
		'click #submitZip': 'makeWeatherTile'
	}, 
	initialize: function(){
		//get reference to form elements
		this.$zipCode = $('#zipCode');
		this.$form = $('#form');
		//reference to view container
		this.$tileContainer = $('#weatherView');
		//listen for new models in the Collection
		this.listenTo(GifWeather.Gifs, 'add', this.addWeatherTile);
		//get gifs in localstorage
		GifWeather.Gifs.fetch();
	},
	makeWeatherTile: function(){
		//regex for zipcode
		var testZip = RegExp("^\\d{5}(-\\d{4})?$");
		//get user input zipcode value
		var zip = this.$zipCode.val();
		//todos validate that zipcode contains numbers only
		if(testZip.test(zip) === false){
			window.alert('Please enter a valid U.S. Zipcode!');
		}else{
			//put zipcode and gif source in Collection
			var newTile = {	
				zipcode: zip,
				darkText: false
			};

			//put the newTile in the Collection save returned model as myTile
			var myTile = GifWeather.Gifs.create(newTile);

			//function for wunderground API success 
			var getWeather = function(weather){
				//update model to reflect wunderground API data
				var city = weather.current_observation.display_location.full;
				myTile.set('city', city);
				var temp = weather.current_observation.temp_f;
				var tempToString = temp.toString();
				var tempRounded = tempToString.split(".");
				myTile.set('temp', tempRounded[0]);
				var currentWeather = weather.current_observation.weather;
				myTile.set('currentWeather', currentWeather);	
				//save updated model fields
				myTile.save();
			};
			//function for giphy API success
			var getGif = function(gif){
				//update model to reflect wunderground API data
				var id = gif.data.id;
				var source = 'http://i.giphy.com/' + id + '.gif';
				myTile.set('source', source);
				//save updated model fields
				myTile.save();
			};
			//get weather from wunderground API
			$.ajax({
				url: 'http://api.wunderground.com/api/e1f9c0868ad1eca5/conditions/q/' + zip + '.json',
				type: 'get',
				dataType: 'json',
				success: function(data){
					//call to initialized appView's getWeather function
					getWeather(data);
				},
				complete: function(){console.log('got weather')}
			});

			//get gif from giphy API
			$.ajax({
				url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC',
				type: 'get',
				dataType: 'json',
				success: function(data){
				//call to initialized appView's getGif function
					getGif(data);
				},
				complete: function(){console.log('got gif')}
			});

			//clear form
			this.$form[0].reset();
		}
	},
	addWeatherTile: function(weatherTile){
		//new view for new model in Collection
		var newTile = new GifWeather.WeatherTileView({model: weatherTile});

		//put new view in the DOM
		this.$tileContainer.prepend(newTile.render().el);
	}
});

GifWeatherAppView = new GifWeather.AppView();

