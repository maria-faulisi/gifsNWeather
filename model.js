var GifWeather = window.GifWeather || {};
//create a model for gif by extending backbone model 
GifWeather.GifModel = Backbone.Model.extend({
	defaults: {
		zipcode: '',
		source: '',
		city: '',
		temp: '',
		currentWeather: '',
		darkText: false
	}
});
