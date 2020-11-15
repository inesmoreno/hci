#!/usr/bin/bash

set -e

echo "DEPLOYING BACKEND"
(cd backend; ./deploy.sh)
echo "DEPLOYING FRONTEND"
(cd frontend; ./deploy.sh)
