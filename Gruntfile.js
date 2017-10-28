// Generated on 2013-02-27 using generator-webapp 0.1.5
'use strict';
//var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  var barstaskdef = {
    files: {
      "app/scripts/compiled-templates.js": [
        "app/bundles/**/templates/*.bars"
      ]
    },
    options: {
      namespace: 'JST',
      processName: function(filename) {
        return filename
        .replace(/^app\//, '')
        .replace(/\.bars$/, '')
        .replace('bundles/', '')
        .replace('app/', '') // TODO: just make a regex once moving is complete
        .replace('common/', '') // see above todo
        .replace('templates/', '');
      },
      amd: true
    }
  };

  grunt.initConfig({
    yeoman: yeomanConfig,

    handlebars: {
      compile: barstaskdef
    },

    replace: {
      compile: {
        src: ['dist/index.html'],
        overwrite: true,                 // overwrite matched source files
        replacements: [{
          from: "window.isOptimized = false;",
          to: "window.isOptimized = true;"
        }]
      }
    },

    watch: {
      handlebars: {
        options: { livereload: true },
        files: ["app/bundles/**/templates/*.bars"],
        tasks: ['handlebars']
      },
      css_files: {
        options: { livereload: true },
        files: ['{.tmp,<%= yeoman.app %>}/**/*.css'],
        tasks: []
      },
      js_files: {
        options: { livereload: true },
        files: ['{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js' , '<%= yeoman.app %>/bundles/app/strut.slide_editor/view/OperatingTable.js' , 'app/bundles/app/strut.editor/EditorView.js' , 'app/bundles/app/strut.deck/Utils.js'],
        tasks: []
      },
      html_files: {
        options: { livereload: true },
        files: ['<%= yeoman.app %>/*.html'],
        tasks: []
      }
      //whenever_files_below_are_modified_connect_colon_app_task_will_run: { // this weird name "whenever_files_below_are_modified_connect_colon_app_task_will_run" does not matter.
      //    files: [
      //        '<%= yeoman.app %>/*.html',
      //        '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
      //        '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
      //        '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,webp}'
      //    ],
      //    tasks: ['connect:app']
      //}
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: '0.0.0.0',
        livereload: true
      },
      app: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'app')
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
    dist: {}
  },*/
  requirejs: {
    dist: {
      // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
      options: {
        // `name` and `out` is set by grunt-usemin
        baseUrl: 'app/scripts',
        optimize: 'none',
        mainConfigFile: 'app/scripts/main.js',
        // TODO: Figure out how to make sourcemaps work with grunt-usemin
        // https://github.com/yeoman/grunt-usemin/issues/30
        //generateSourceMaps: true,
        // required to support SourceMaps
        // http://requirejs.org/docs/errors.html#sourcemapcomments
        preserveLicenseComments: false,
        useStrict: true,
        wrap: true,
        //uglify2: {} // https://github.com/mishoo/UglifyJS2
      }
    }
  },
  useminPrepare: {
    html: '<%= yeoman.app %>/index.html',
    options: {
      dest: '<%= yeoman.dist %>'
    }
  },
  usemin: {
    html: ['<%= yeoman.dist %>/{,*/}*.html'],
    css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
    options: {
      dirs: ['<%= yeoman.dist %>']
    }
  },
  imagemin: {
    dist: {
      files: [{
        expand: true,
        cwd: '<%= yeoman.app %>/images',
        src: '{,*/}*.{png,jpg,jpeg}',
        dest: '<%= yeoman.dist %>/images'
      }]
    }
  },
  // cssmin: {
  //     dist: {
  //         files: {
  //             '<%= yeoman.dist %>/styles/main.css': [
  //                 '.tmp/styles/{,*/}*.css',
  //                 '<%= yeoman.app %>/styles/{,*/}*.css'
  //             ]
  //         }
  //     }
  // },
  // VALIDATE CSS FILES ACCORDING TO CSS3 STANDARD
  'css-validation': {
    options: {
      reset: false,
      stoponerror: false,
      relaxerror: [],
      profile: 'css3', // possible profiles are: none, css1, css2, css21, css3, svg, svgbasic, svgtiny, mobile, atsc-tv, tv
      medium: 'all', // possible media are: all, aural, braille, embossed, handheld, print, projection, screen, tty, tv, presentation
      warnings: '0' // possible warnings are: 2 (all), 1 (normal), 0 (most important), no (no warnings)
    },
    files: {
      src: ['{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css']
      //src: ['{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css','!<%= yeoman.app %>/styles/add-btn.css','!<%= yeoman.app %>/styles/built.css','!<%= yeoman.app %>/styles/etch_extension/EtchOverrides.css','!<%= yeoman.app %>/styles/logo_button/logo.css','!<%= yeoman.app %>/styles/slide_editor/slideWell.css']
    }
  },
  // VALIDATE HTML FILES ACCORDING TO HTML5 STANDARD
  'html-validation': {
    options: {
      reset: false,
      stoponerror: false
    },
    files: {
      src: '<%= yeoman.app %>/*.html'
    }
  },
  htmlmin: {
    dist: {
      options: {
        /*removeCommentsFromCDATA: true,
        // https://github.com/yeoman/grunt-usemin/issues/44
        //collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true*/
      },
      files: [{
        expand: true,
        cwd: '<%= yeoman.app %>',
        src: '*.html',
        dest: '<%= yeoman.dist %>'
      }]
    }
  },
  copy: {
    dist: {
      files: [{
        expand: true,
        dot: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>',
        src: [
          '.htaccess',
          'empty.html',
          'preview_export/**',
          'zip/**'
        ]
      },
      {
        expand: true,
        dot: true,
        flatten: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>/styles/img',
        src: [
          '**/*.{ico,txt,png,jpg,gif}',
        ]
      },
      // TODO: figure out what the deal is with the fonts in dist mode...
      {
        expand: true,
        dot: true,
        flatten: true,
        cwd: '<%= yeoman.app %>',
        dest: '<%= yeoman.dist %>/styles',
        src: [
          '**/*.woff'
        ]
      },
      {
        expand: true,
        cwd: '<%= yeoman.app %>/styles/strut.themes',
        dest: '<%= yeoman.dist %>/styles/strut.themes',
        src: [
          '**/*.png',
          '*.css'
        ]
      }]
    }
  },
  bower: {
    all: {
      rjsConfig: '<%= yeoman.app %>/scripts/main.js'
    }
  }
});

// grunt.renameTask('regarde', 'watch');

grunt.registerTask('server', function (target) {
  if (target === 'dist') {
    return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
  }

  grunt.task.run([
    'clean:server',
    'handlebars',
    'connect:app',
    'watch'
  ]);
});

grunt.registerTask('test', [
  'clean:server',
  'connect:test',
  'mocha'
]);

grunt.registerTask('build', [
  'clean:dist',
  'handlebars',
  'useminPrepare',
  'requirejs',
  'imagemin',
  'htmlmin',
  'concat',
  // 'cssmin',
  'uglify',
  'copy',
  'replace',
  'usemin'
]);

grunt.registerTask('default', [
  'jshint',
  'test',
  'build'
]);
};
