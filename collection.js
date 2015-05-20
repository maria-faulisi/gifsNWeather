var GifWeather = window.GifWeather || {};
//create new backbone Collection
GifWeather.Collection = Backbone.Collection.extend({
	//tell Collection which model to use
	model: GifWeather.GifModel,
	//tell Collection to store models using localStorage
	localStorage: new Backbone.LocalStorage('GifWeather')
});
//create instance of GifWeather Collection add to namespace
GifWeather.Gifs = new GifWeather.Collection();