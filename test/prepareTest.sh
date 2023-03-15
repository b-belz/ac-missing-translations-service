#!/bin/bash

## Empty PIDs
> ./test/testpid.file
> ./testLogs.log


MAXWAIT=20
APIPATH=$PWD
echo "***********************************************************************"
echo "Start the ac-userTasks-service in test mode"
cd $APIPATH

# export PORT=8095
NODE_ENV=test node server.js > testLogs.log &
echo $! >> ./test/testpid.file

c=0
until $(curl --output /dev/null --silent --head --fail http://localhost:8111); do
    printf '.'
    ((c++)) && ((c == $MAXWAIT)) && break
    sleep 2
done

if [[ $c = $MAXWAIT ]]; then
  echo ""
  echo ""
  echo "!!! - Exiting tests due to error at startup"
  echo ""
  echo ""
  exit 1;
fi

echo "... UserTasks API started"
echo ""

echo ""
echo ""
echo ">>>>> Starting the test...."
echo ""

