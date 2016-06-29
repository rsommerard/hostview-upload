#!/bin/bash
set -e

echo "Hostview Upload starting in '$NODE_ENV' environment"

if [[ $TEST && ${TEST-x} ]] ; then
    echo "Running all tests ..."
    exec npm test
elif [[ $DEBUG && ${DEBUG-x} ]] ; then
    echo "Starting the debugger ..."
    exec npm run-script debug
elif [ "$NODE_ENV" == 'development' ]; then
    exec npm start
else
    exec pm2 start app.js -x -- --prod
fi
