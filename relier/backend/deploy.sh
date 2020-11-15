#!/usr/bin/bash

set -e

echo "SSH-ing into the sevrer"
ssh -A relier@emayhew.com bash <<EOF
set -e
cd repo/
echo "cloning git repo"
git fetch
git reset --hard origin/master
cd relier/backend/
npm install
echo "building relier!"
npm run build
mkdir -p ~/.config/systemd/user/
cp systemd/relier.service ~/.config/systemd/user/
echo "restarting relier daemon"
systemctl --user daemon-reload
systemctl --user restart relier
EOF

echo "Backend is deployed. Have a nice day!"
