var webpack = require('webpack');
var path  = require('path');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
module.exports = {
	devtool:'source-map',
	entry: {
		//index:'./controller/index.js',
		lynnCharts:'./src/Lynncharts.js',
		//lynnTabs:'./controller/lynnTabs.js',
		//lynnLayoutTest:'./controller/lynnLayoutTest.js',
		//lynnMarquee:'./src/plugin/lynnMarquee'
	},
	output: {
		path:__dirname+'/dist',
		filename:'[name].js',
		libraryTarget:'umd',
		library:'[name]'
	},
	externals: {
		"jquery": {
			root:'jQuery',
			commonjs:'jquery',
			commonjs2:'jquery',
			amd:'jquery'
		}
	},

	/*resolve: {
		extensions: ['','.js']
	}*/
	
	/*plugins: [
		new webpack.optimize.UglifyJsPlugin({
		    mangle: {
		        except: ['$', 'exports', 'require']
		    }
		})
	]*/
}