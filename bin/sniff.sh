#!/usr/bin/env bash

#change directory to the project root
bash_source="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $bash_source
cd ..

node_modules/jshint/bin/jshint app/
