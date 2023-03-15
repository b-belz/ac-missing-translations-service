#!/bin/bash
echo "***********************************************************************"
echo "Cleaning up after testing by killing node app and docker containers"
#docker kill mysql-userTasks-test
#docker kill redis-userTasks-test
while IFS='' read -r line || [[ -n "$line" ]]; do
  echo "Kill ac-userTasks-service PID: $line"
  kill $line
done < ./test/testpid.file
echo "***********************************************************************"
echo ""
echo "Test suite completed"
if [[ "$OSTYPE" == "darwin"* ]]; then
  # inform with spoken message
  say "Test suite for user-tasks service has been completed."
fi
echo ""
echo "<<<<<<< Tests ended at $(date)"
