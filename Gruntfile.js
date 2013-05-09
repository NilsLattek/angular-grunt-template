var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var folderMount = function folderMount(connect, point) {
  return connect.static(path.resolve(point));
};

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      'build/application.js': 'build/application.js'
    },

    /* Concat css */
    cssmin: {
      compress: {
        files: {
          'build/application.css': ['app/css/**/*.css']
        }
      }
    },

    /* Optimize images */
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/images',
          src: '*.{png,jpg,jpeg}',
          dest: 'build/images'
        }]
      }
    },

    /* remove image backups */
    clean: {
      build: ['build']
    },

    /* copy other files like icons */
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'build',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'index.html'
          ]
        }]
      }
      /*move files into app folders: phonegap: {

      }*/
    },

    ngmin: {
      dist: {
        src: ['build/application.js'],
        dest: 'build/application.js'
      }
    },

    /* resolve dependencies */
    neuter: {
      development: {
        options: {
          includeSourceURL: true
        },
        files: {
          'build/application.js': 'app/js/main.js'
        }
      },
      production: {
        options: {
          includeSourceURL: false
        },
        files: {
          'build/application.js': 'app/js/main.js'
        }
      },
      options: {
        filepathTransform: function(filepath) {
          return 'app/js/' + filepath;
        }
      }
    },

    inline: {
      'build/index.html': ['app/views/**/*.html']
    },

    /* watch files and run tasks on change */
    regarde: {
      application_code: {
        files: ['app/views/**/*.html', 'app/js/**/*.js', 'test/**/*.js'],
        tasks: ['neuter:development', 'copy', 'inline', 'livereload']
      },
      css: {
        files: ['app/css/**/*.css'],
        tasks: ['cssmin', 'livereload']
      }
    },

    /* start livereload server */
    connect: {
      options: {
        port: 8000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect, options) {
            return [proxySnippet, lrSnippet, folderMount(connect, '.')];
          }
        }
      },
      proxies: [
        {
          context: '/api',
          host: 'localhost',
          port: 3000,
          https: false,
          changeOrigin: false
        }
      ]
    }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-neuter');
  grunt.loadNpmTasks('grunt-regarde');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-connect-proxy');

  // Alias the `test` task to run `karma` instead
  grunt.registerTask('karma', 'run the karma test driver', function () {
    var done = this.async();
    require('child_process').exec('karma start --single-run', function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });

  grunt.registerMultiTask('inline', 'Inline AngularJS templates into single file.', function() {
    var SCRIPT = '<script type="text/ng-template" id="<%= id %>"><%= content %></script>\n';

    var html = '$1\n\n';
    grunt.file.expand({filter: 'isFile'}, this.data).forEach(function(file) {
      grunt.log.writeln('Inlining ' + file);
      var id = file.substr(file.indexOf('/') + 1);
      html += grunt.template.process(SCRIPT, {data: {id: id, content: grunt.file.read(file)}});
    });

    var result = this.target;
    grunt.file.write(result, grunt.file.read(result).replace(/(<div class="tpl"[^>]*>)/, html));
  });

  grunt.registerTask('build', ['clean:build', 'neuter:production', 'ngmin', 'uglify', 'cssmin', 'imagemin', 'copy', 'inline']);

  grunt.registerTask('test', ['neuter:development', 'karma']);

  grunt.registerTask('default', ['configureProxies', 'livereload-start', 'connect:livereload', 'neuter:development', 'cssmin', 'imagemin', 'copy', 'inline', 'regarde']);
};
