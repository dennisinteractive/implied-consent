module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*!\n'+
            ' * Implied Consent - a jQuery Cookie Notice plugin\n'+
            ' * self-contained version <%= pkg.version %>\n'+
            ' * \n'+
            ' * Copyright Dennis Publishing\n'+
            ' * Released under MIT license\n'+
            ' */\n',

    concat: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: [
         'src/includes/jquery.quarantine.js',
         'src/includes/jquery.cookie.js',
         'src/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      options: {
        jshintrc : '.jshintrc',
      },
      files: [
        'Gruntfile.js',
        'src/<%= pkg.name %>.js'
      ]
    },

    watch: {
      files: ['src/**/*.js'],
      tasks: ['jshint', 'concat', 'uglify', 'bytesize']
    },

    bytesize: {
      dist: {
        src: ['dist/<%= pkg.name %>.*']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bytesize');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'bytesize']);
};
