var GifWeather = window.GifWeather || {};
//create a WeatherTileView by extending Backbone
GifWeather.WeatherTileView = Backbone.View.extend({
	//refer to the template being used
	template: _.template($('#weatherTemplate').html()),
	//type of element view will be wrapped in
	tagName: 'div',
	//default class for element wrapping weather tiles
	className: 'weatherWrap',
	//events on modelView
	events: {
		//click events on each weather tile
		'click .optionsText': 'changeTextColor', 
		'click .optionsDelete': 'deleteWeatherTile',
		'click .optionsNewGif': 'getNewGif'
	}, 
	initialize: function(){
		//Collection event listener render when any change is made.
		this.listenTo(GifWeather.Gifs, 'change', this.render);
	},
	render: function(){
		//render view's html from template and model
		this.$el.html(this.template(this.model.toJSON()));
		//check to see if darkText in model is true
		if(this.model.get('darkText')){
			//add dark class to the rendered weather tile 
			this.$el.find('.weatherInfo').addClass('dark');
			//change optionText to read "Light Text" indicating toggle change
			this.$el.find('.optionsText').text("Light Text");
		}
		return this;
	},
	changeTextColor: function(){
		//toggle class of weather tile so weather info is black
		this.$el.find('.weatherInfo').toggleClass('dark');
		//if the weather tile has class of dark update model and save
		if(this.$el.find('.weatherInfo').hasClass('dark')){
			this.model.set('darkText', true);
			this.model.save();
			//change text color option to read "Light Text" indicating change
			this.$el.find('.optionsText').text("Light Text");
		}else{
			//if weather tile does not have dark class set to model to false and save
			this.model.set('darkText', false);
			this.model.save();
			//change text color option to read "Dark Text" indicating change
			this.$el.find('.optionsText').text("Dark Text");
		}
	},
	deleteWeatherTile: function(){
		//remove the element from the DOM
		this.$el.remove();
		//remove the model from the collection in local storage
		this.model.destroy();
	}, 
	getNewGif: function(){
		//get reference to view instance's model
		var thisModel = this.model;
		//get gif from giphy API
		$.ajax({
			url: 'http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC',
			type: 'get',
			dataType: 'json',
			success: function(data){
			//call to getGif function
				getGif(data);
			},
			complete: function(){console.log('got gif')}
		});
		//function for giphy API success
		var getGif = function(gif){
			//store gif id from api data 
			var id = gif.data.id;
			//declare fariable for complete source
			var source = 'http://i.giphy.com/' + id + '.gif';
			//set the model's source to the concatanated source
			thisModel.set('source', source);
			//save updated model fields
			thisModel.save();
		};
	}
});








