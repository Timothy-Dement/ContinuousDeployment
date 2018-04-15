#!/bin/bash
service nginx restart
sleep 1
node server.js
