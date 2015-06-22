module.exports = function(grunt) {

  grunt.initConfig({
    host_config: grunt.file.readJSON('.host_config'),
    autoprefixer: {
      options: {
         browsers: ['last 2 versions']
      },
      dist: {
        files: {
          'css/screen.css': 'css/screen.css'
        }
      },
    },
    'ftp-deploy': {
      build: {
        auth: {
          host: '<%- host_config.host %>',
          port: '<%- host_config.port %>'
        },
        src: '.',
        dest: '<%- host_config.directory %>',
        exclusions: [
          '.*',
          'bower.json',
          'node_modules',
          'sass',
          'Gruntfile.js',
          'package.json',
          'README.markdown'
        ]
      }
    },
    sass: {
      dist: {
        files: {
          'css/screen.css' : 'sass/screen.sass'
        }
      }
    },
    watch: {
      sass: {
        files: ['sass/*.sass'],
        tasks: ['sass', 'autoprefixer'],
      },
      autoprefixer: {
        files: ['css/*.css'],
        tasks: ['autoprefixer'],
      }
    }
  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('deploy', ['ftp-deploy']);
};