#!/usr/bin/bash

set -e

echo "Building the app"
npm run build
echo "Copying build to server"
rsync -Pr build/ relier@emayhew.com:/srv/http/relier/
echo "Deploy complete! Have a nice day :)"
