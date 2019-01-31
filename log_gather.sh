#!/bin/bash

sshpass -p yuya1021 ssh root@10.37.129.8 tail -f -n 10 /var/log/secure >> ./log/secure.log&
sshpass -p yuya1021 ssh root@10.37.129.8 tail -f -n 10 /var/log/httpd/access_log >> ./log/access.log&
sshpass -p yuya1021 ssh root@10.37.129.8 tail -f -n 10 /var/log/mariadb/mariadb.log >> ./log/mariadb.log&