#!/bin/bash

date > /home/adm-sk/teplica/teplica-js/blynk-start.txt
nohup node /home/adm-sk/teplica/teplica-js/teplica.js

nohup node /home/adm-sk/teplica/teplica-js/teplica_man.js
exit
