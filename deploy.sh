#!/bin/bash

echo "Starting post-deployment tasks..."

# Run database migrations
php artisan migrate --force

echo "Deployment tasks completed successfully!"
