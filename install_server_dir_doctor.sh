#!/bin/bash

if [ -e /tmp/LingConf.cfg ]
then
  echo "Config file exists. It shouldn't. Exiting"
  exit 1
fi
if [ $# -eq 0 ]
then
  echo "config file missing on command line. Exiting"
  exit 1
fi
echo $#
echo $1
