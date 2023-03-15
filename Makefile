MOCHA_OPTS= --slow 0 -A
MOCHA?=./node_modules/.bin/mocha
REPORTER?=mocha-jenkins-reporter
REPORTER_OPTS=junit_report_name='userTasks'
GROWL?=--growl
FLAGS=$(BAIL) --colors --slow 1000 --timeout 60000 --exit --reporter $(REPORTER) --reporter-options $(REPORTER_OPTS)

commit:
	@node ./node_modules/ac-semantic-release/lib/commit.js

# TESTS
apptest:
	./test/prepareDatabases.sh
	./test/prepareTest.sh
	JUNIT_REPORT_PATH=./report.xml $(MOCHA) --mode $(MODE) --name $(NAME) --filter $(FILTER) $(FLAGS) ./test/test.js || :
	./test/cleanupTest.sh

createpr:
	./node_modules/ac-jenkins/bin/createpr.sh

test-release:
	DEBUGMODE=true node ./node_modules/ac-semantic-release/lib/release.js

# LINT
lint-check:
	./node_modules/.bin/eslint "api/**" "config/**"

lint-fix:
	./node_modules/.bin/eslint "api/**" "config/**" "test/tests/**" --fix