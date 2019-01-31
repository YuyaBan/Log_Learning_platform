#!/bin/bash

./kill_ssh_and_frontail.sh

./log_gather.sh&
echo gather_OK
sleep 1s

#echo start > ./access.log
#echo start > ./secure.log
#echo start > ./mariadb.log
#echo log_clear_OK
#sleep 1s

frontail -n 10 --ui-highlight --port 9001 ../log/access.log&
frontail -n 10 --ui-highlight --port 9002 ../log/secure.log&
frontail -n 10 --ui-highlight --port 9003 ../log/mariadb.log&
echo frontail_OK
sleep 1s

node main.sh
echo Start

#./demo_access.sh&
#./demo_secure.sh&
