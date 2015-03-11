var files = require('../files');
var	gulp = require('gulp');
var	reload = require('browser-sync').reload;

gulp.task('watch', ['browser-sync', 'css', 'lint', 'copy'], function() {
	gulp.watch(files.cssEntry, ['css']);
	gulp.watch(files.lintEntry, ['lint']);
	gulp.watch(files.copyEntry, ['copy', reload]);
});
