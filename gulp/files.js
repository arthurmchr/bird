module.exports = {
	delEntry: [
		'**/.DS_Store',
		'dist',
		'npm-debug.log',
		'.sass-cache'
	],
	copyEntry: [
		'app/*',
		'app/media/img/**',
		'app/media/font/**',
		'app/media/vendor/**'
	],
	copyDest: 'dist',
	copyBase: 'app',
	browserifyEntry: './app/media/js/main.js',
	browserifyDest: 'dist/media/js',
	cssEntry: 'app/media/scss/**/*.scss',
	cssDest: 'dist/media/css',
	cssBase: 'app',
	lintEntry: 'app/media/js/**/*.js',
	remapifyEntry: 'app/media/js'
};
