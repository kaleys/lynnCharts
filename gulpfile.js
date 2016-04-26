var gulp = require('gulp');
var webpack = require('gulp-webpack');
var uglify = require('gulp-uglify');

gulp.task('webpack',function(){
	gulp.src('./src')
		.pipe(webpack(require('./webpack.config')))
		.pipe(gulp.dest('./../js/plugin/lynnCharts'))
})
gulp.task('webpackDev',function(){
	gulp.src('./src')
		.pipe(webpack(require('./webpack.config')))
		.pipe(gulp.dest('./dist'))
})



//gulp压缩
/*gulp.task('minijs',function(){
	gulp.src('./dist/lynnChart.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
})*/

gulp.task('watch',function(){
	gulp.watch('./src/*.js',['webpack','webpackDev']);
	gulp.watch('./src/plugin/*.js',['webpack','webpackDev']);
})