#! /bin/bash

docker compose --env-file frontend/.env --profile prod up -d --build
