module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*!\n'+
            ' * Implied Consent version <%= pkg.version %> - <%= pkg.description %>\n' +
            ' * \n'+
            ' * Copyright Dennis Publishing\n' +
            ' * Released under MIT license\n' +
            ' */\n',

    browserify: {
      dist: {
        options: {
          transform: ['browserify-shim']
        },
        src: 'src/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= browserify.dist.dest %>']
        }
      }
    },

    jshint: {
      options: {
        jshintrc : '.jshintrc',
      },
      files: [
        'Gruntfile.js',
        'src/**.js'
      ]
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['default']
    },

    bytesize: {
      dist: {
        src: ['dist/<%= pkg.name %>.*']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-bytesize');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'browserify', 'uglify', 'bytesize']);
};
