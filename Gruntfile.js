module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n'+
            ' * Implied Consent - jQuery Cookie Notice plugin\n'+
            ' * self-contained version <%= pkg.version %>\n'+
            ' * \n'+
            ' * Copyright Dennis Publishing\n'+
            ' * Released under MIT license\n'+
            ' * \n'+
            ' * Display a cookie notice bar at the top of the page and set a cookie to\n'+
            ' * prevent further display when any local link or the close button is clicked.\n'+
            ' * <%= pkg.repository.url %>\n'+
            ' */\n\n',
    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: [
         'src/includes/jquery.quarantine.js',
         'src/includes/jquery.cookie.js',
         'src/*.js'],
        dest: 'cookie-notice.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'cookie-notice.min.js': ['<%= concat.dist.dest %>']
        }
      },
    },
    jshint: {
      files: ['Gruntfile.js', 'src/cookie-notice.js'],
      options: {
        loopfunc: true,
        strict: true
      }
    },
    watch: {
      files: ['src/**/*.js'],
      tasks: ['jshint', 'concat', 'uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};
