'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015']
      },
      dist: {
        files: {
          'dist/skrimp.js': 'index.js'
        }
      }
    },
    watch: {
      scripts: {
        files: ['index.js'],
        tasks: ['build']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('build', ['babel']);
  grunt.registerTask('build-watch', ['build', 'watch']);

};
