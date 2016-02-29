module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        clean: ['dist'],
        ts: {
            default: {
                options: {
                    compiler: './node_modules/typescript/bin/tsc',
                    declaration: true,
                    fast: 'never',
                },
                tsconfig: './src/tsconfig.json',
                src: 'src/**/*.ts',
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
        conventionalChangelog: {
            options: {
                changelogOpts: {
                    // conventional-changelog options go here
                    preset: 'angular'
                }
            },
            release: {
                src: 'CHANGELOG.md'
            }
        },
    });

    grunt.registerTask("release", "Release a new version", function(target) {
        if (!target) {
            target = "minor";
        }
        return grunt.task.run('ts:default', "bump-only:" + target, "conventionalChangelog", "shell:add", "bump-commit");
    });

    grunt.registerTask('default', ['ts:default']);
};
