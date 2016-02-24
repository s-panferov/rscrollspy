module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: ['dist'],
        typescript: {
            default: {
                options: {
                    compiler: './node_modules/typescript/bin/tsc',
                    module: "commonjs",
                    fast: 'never',
                    jsx: 'React',
                    declaration: true,
                    preserveConstEnums: true,
                    target: 'es5',
                    references: [
                        "typings/tsd.d.ts"
                    ]
                },
                src: 'src/**/*.tsx',
                dest: 'dist'
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'chore(ver): v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'chore(ver): v%VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: "rc",
                regExp: false
            }
        },
        shell: {
            add: {
                command: 'git add CHANGELOG.md && git add -f dist'
            }
        },
        changelog: {
            options: {}
        }
    });

    grunt.registerTask("release", "Release a new version", function(target) {
        if (!target) {
            target = "minor";
        }
        return grunt.task.run('default', "bump-only:" + target, "changelog", "shell:add", "bump-commit");
    });

    grunt.registerTask('default', ['typescript:default']);
};
