module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                oimplementation: require('sass'), 
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'dist/style.css': 'src/style.scss'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-sass');
    grunt.registerTask('default', ['sass']);
}