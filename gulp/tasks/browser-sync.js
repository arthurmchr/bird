var gulp = require('gulp');
var	browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync({
		proxy: 'localhost:8000',
		browser: 'google chrome',
		online: false
	});
});
