module.exports = function(grunt) {

  grunt.initConfig({
    clean: ['src/css'],
    connect: {
      server: {
        options: {
          port: 8000
        }
      }
    },
    copy: {
      images: {
        files: [
          {
            expand: true,
            cwd: 'src/images/',
            src: ['**'],
            dest: 'dist/images'
          }
        ],
      },
      jquery: {
        files: {
            'dist/js/jquery.min.js': 'node_modules/jquery/dist/jquery.min.js'
        }
      },
      lightbox2: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/lightbox2/dist',
            src: ['**'],
            dest: 'dist/'
          }
        ]
      }
    },
    highlight: {
      task: {
        files: {
          'dist/index.html': ['src/index.html']
        }
      }
    },
    sass: {
      dist: {
        files: {
          'dist/css/screen.css' : 'src/sass/screen.sass'
        }
      }
    },
    watch: {
      sass: {
        files: ['src/sass/*.sass'],
        tasks: ['sass'],
      },
      highlight: {
        files: ['src/index.html'],
        tasks: ['highlight'],
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-highlight');
  grunt.loadNpmTasks('grunt-html');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['build', 'connect', 'watch']);
  grunt.registerTask('build', ['highlight', 'sass', 'copy', 'clean']);
};
