module.exports = function(grunt) {
    grunt.initConfig({
        jslint: {
            js_files: {
                src: ['set.js'],
                directives: {
                    // http://jslint.com/#JSLINT_OPTIONS
                    browser: true,
                    devel: true,
                    plusplus: true,
                    todo: true,
                    indent: 4,
                    ass: true,
                    newcap: true
                }
            }
        },
        uglify: {
            set: {
                files: {
                    'set.min.js' : ['set.js']
                }
            }
        },
        watch: {
            js: {
                files: ['set.js'],
                tasks: ['jslint', 'uglify']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jslint');

    grunt.registerTask('default', ['watch']);
};
