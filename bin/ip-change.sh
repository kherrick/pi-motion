#!/usr/bin/env bash

#change directory to the project root
bash_source="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $bash_source
cd ..

if [ $# -lt 2 ]; then
  echo 'you need to specify two params (search / replace). the current setting, and the one to change it to (e.g.):'
  echo $0': 127.0.0.1 10.10.10.2'
  exit 1
fi

echo attempting to change these files:
echo '#######################################'
cd app; grep -RHi $1; cd ..

find app -type f -exec sed -i -e "s/$1/$2/g" {} \;

echo
echo to:
echo '#######################################'
cd app; grep -RHi $2; cd ..
