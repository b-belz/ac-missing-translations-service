const tests = require('./../tests/index');
const timeOut = 45000

module.exports = {
  testsuite: function() {

    describe('USER TASKS', function() {
      // this.timeout(timeOut)
      tests.userTasks();
    });

  }
}
