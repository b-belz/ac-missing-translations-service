#!/bin/bash
set -e

###### MYSQL START ##############

# DEFAULT VALUES
DBPORT=3386
DBHOST=127.0.0.1
DBUSER=root
DBPASS=actest
DBDOCKER=mysql-userTasks-test
WAITDOCKER=20

#source ./test/credentials.txt
export MYSQL_PWD=$DBPASS
LDBHOST=""
TXTHOST="LOCALHOST"
if [ "${DBHOST+x}" ];
then
  LDBHOST="--host $DBHOST"
  TXTHOST="$DBHOST"
fi

echo ""
echo "***********************************************************************"

echo "Start Mysql Docker image | Instance $DBDOCKER | Host $DBHOST | Port $DBPORT"
DBDOCKERINSTANCE=`docker ps -a -q -f name=$DBDOCKER`
if [[ $DBDOCKERINSTANCE ]]; 
  then
    echo "Use existing docker instance $DBDOCKERINSTANCE"
    if [ "$( docker container inspect -f '{{.State.Status}}' $DBDOCKER )" == "running" ]; 
      then
        echo "Use already running Mysql instance"
      else
        echo "Restarting mysql docker"
        docker start $DBDOCKERINSTANCE > /dev/null
      fi
  else 
    echo "Create a new docker mysql instance"
    docker run --name $DBDOCKER -p $DBPORT:3306 -e MYSQL_ROOT_PASSWORD=actest -d mysql:latest --default-authentication-plugin=mysql_native_password --sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION'
fi



####### REDIS START ##############

REDISDOCKER=redis-userTasks-test
REDISPORT=6386
WAITDOCKER=20

echo ""
echo "***********************************************************************"

echo "Start Redis Docker image | Instance $REDISDOCKER | Port $REDISPORT"
DOCKERINSTANCE=`docker ps -a -q -f name=$REDISDOCKER`
if [[ $DOCKERINSTANCE ]]; 
  then
    echo "Use existing docker instance $DOCKERINSTANCE"
    if [ "$( docker container inspect -f '{{.State.Status}}' $REDISDOCKER )" == "running" ]; 
      then
        echo "Use already running Redis instance"
      else
        echo "Restarting Redis docker"
        docker start $DOCKERINSTANCE > /dev/null
      fi
  else 
    echo "Create a new docker redis instance"
    docker run --name $REDISDOCKER -p $REDISPORT:6379 -d redis 
fi



###### MYSQL WAIT ##############

echo ""
echo "Waiting up to $WAITDOCKER seconds for Mysql to start"
c=0
# mysqladmin will return "connect to server at '127.0.0.1' failed" until connection is available
# with set -e it will exit the code, therefore we set +e temporatily
set +e
while [ $c -le $WAITDOCKER ];
do
  MYSQLONLINE=$(mysqladmin ping -h $DBHOST -P $DBPORT -u $DBUSER)
  if [[ $MYSQLONLINE = "mysqld is alive" ]]; then
    break
  fi
  printf '.'
  ((c++)) && ((c == $WAITDOCKER)) && break
  sleep 1
done
echo ""
echo "Mysql started/ready after $c seconds"
echo ""
echo "***********************************************************************"



###### MYSQL DB/TABLE/DATA SETUP ##############

echo ""
# CREATE USER actest with password actest
echo "Create Mysql user actest"
mysql -u$DBUSER --port $DBPORT $LDBHOST < ./test/sql/createTestUser.sql

echo ""
echo "Adjust for Mysql8.x/5.x legacy"
mysql -u$DBUSER --port $DBPORT $LDBHOST < ./test/sql/mysql8.sql

echo "Prepare Databases";

echo "create default db and table"
echo "create database if not exists user_tasks" | mysql -u$DBUSER --port $DBPORT $LDBHOST
mysql -u$DBUSER --port $DBPORT $LDBHOST user_tasks < ./test/sql/acDB.sql

echo "Database preparations done"
echo "***********************************************************************"
echo ""



###### REDIS WAIT ##############

echo "Waiting up to $WAITDOCKER seconds for Redis to start"
c=0
while [ $c -le $WAITDOCKER ];
do
    REDISONLINE=$(redis-cli -p $REDISPORT PING)
    if [[ $REDISONLINE = "PONG" ]]; then
      break
    fi
    printf '.'
    ((c++)) && ((c == $MAXWAIT)) && break
    sleep 1
done
echo ""
echo "Redis started/ready after $c seconds"
echo ""
echo "***********************************************************************"
echo ""