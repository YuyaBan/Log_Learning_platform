#!/bin/bash

ps aux | grep ssh|grep sshpass | grep -v grep| awk '{print "kill " $2}' |sh
ps aux | grep frontail| grep -v grep | awk '{print "kill " $2}' |sh