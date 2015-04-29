#!/usr/bin/env bash

#change directory to the project root
bash_source="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $bash_source
cd ..

echo "Starting 'project initialization'..."

NPMINSTALL="$(npm install > /dev/null 2>&1; echo ${PIPESTATUS[0]})"

if [ $NPMINSTALL -ne 0 ]; then
  echo 'Error. NPM installation failed...'
  echo
  echo "Please run 'npm install' in the root of the project manually. Determine the issue, and then rerun this script."
  exit 1
fi

BOWERINSTALL="$(bin/bower install > /dev/null 2>&1; echo ${PIPESTATUS[0]})"

if [ $BOWERINSTALL -ne 0 ]; then
  echo 'Error. Bower installation failed...'
  echo
  echo "Please run 'bin/bower install' in the root of the project manually. Determine the issue, and then rerun this script."
  exit 1
fi

INITIALIZEDATABASE="$(bin/gulp init-database > /dev/null 2>&1; echo ${PIPESTATUS[0]})"

if [ $INITIALIZEDATABASE -ne 0 ]; then
  echo 'Error. Database initialization failed...'
  echo
  echo "Please run 'bin/gulp init-database' in the root of the project manually. Determine the issue, and then rerun this script."
  exit 1
fi

echo "Ending 'project initialization'..."
echo "Please run 'bin/gulp serve' to begin using the project."
