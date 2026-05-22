#! /bin/bash

docker compose --env-file frontend/.env --profile dev up -d --build