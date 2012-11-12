/**
 * Grunt configuration file, @see http://gruntjs.com/
 */
module.exports = function(grunt) {
  "use strict";
  grunt.loadNpmTasks('grunt-jsdoc-plugin');
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['src/**/*.js', 'grunt.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    min:{
      'lib/watch.min.js': ['src/**/*.js']
    },
    jsdoc:{

    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        browser: true
      },
      globals: {
        exports: true,
        define: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

};