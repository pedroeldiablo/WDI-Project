const gulp     = require("gulp");
const babel    = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");
const plumber  = require("gulp-plumber");

const sass 		 	 = require('gulp-sass');
const flatten		 = require('gulp-flatten');
const nodemon    = require("gulp-nodemon");
const livereload = require('gulp-livereload');

const src  = "src";
const dist = "public";

gulp.task("es6", () => {
	return gulp.src('src/**/*.js')
	.pipe(plumber())
	.pipe(babel({
		presets: ["es2015"]
	}))
	.pipe(gulp.dest('public'));
});

gulp.task('sass', () => {
	return gulp.src(`${src}/**/*.scss`)
	.pipe(sass().on('error', sass.logError))
	.pipe(cleanCSS({ compatibility: "ie8"}))
	.pipe(plumber())
	.pipe(flatten())
	.pipe(gulp.dest(`${dist}/css/`))
	.pipe(livereload());
});

gulp.task('nodemon', () => {
	return nodemon({
		script: 'server.js',
		ext: 'js html',
		env: { 'NODE_ENV': 'development' }
	});
});

gulp.task("watch", () => {
	livereload.listen();
	gulp.watch('src/**/*.js', ['es6']);
	gulp.watch(`${src}/**/*.scss`, ['sass']);
});

gulp.task("default", [
	'es6',
	'sass',
	'watch',
	'nodemon'
]);
