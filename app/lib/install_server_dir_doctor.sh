#!/bin/bash

function error {
  echo "Something went wrong"
  echo $1
  exit 1;
}

function getConf {
  if [ -e /tmp/LingConf.cfg ]
    then
    echo "Config file exists. It shouldn't. Exiting"
    exit 1
  fi
  echo "Processing config file $1"
  awk '/^\/\/ @@/' $1 | sed 's#// @@\(.*\)@@#\1#g' > /tmp/LingConf.cfg
  source /tmp/LingConf.cfg
}

function setPaths {
  for var in nodeport nodeserver webdir webroot
  do  
    echo @@$var@@
    for file in `find $webroot/$webdir -name *template`
    do 
      sed "s#@@$var@@#${!var}#g" $file > $file.tmp
      mv $file.tmp $file
    done
  done
  for file in `find $webroot/$webdir -name *template`
  do
    mv $file ${file%.template}
  done
}

if [ $# -eq 0 ]
then
  echo "Missing command line argument. Exiting"
  exit 1
fi
getConf $1
echo "Webroot is set to $webroot. "
echo "Webdir is set to $webdir. Creating..."
mkdir "$webroot/$webdir" || error "Could not create directory."
echo "Success"
echo "copying files to webdir..."
cp -ar ../webroot/* "$webroot/$webdir/" || error "Could not copy files."
echo "Success"
echo "Adjusting scripts to environment"
setPaths || error "Could not set proper paths in script files"
echo "Success"
echo "Changing file ownership"
chown -R $user:$user "$webroot/$webdir/" || error "Could not change owner"
echo "Success"
rm /tmp/LingConf.cfg || error "Could not delete temp file"
echo "All done."
exit 0

