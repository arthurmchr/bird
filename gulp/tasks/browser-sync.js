var gulp = require('gulp');
var	browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './dist'
		},
		browser: 'google chrome',
		online: false
	});
});
