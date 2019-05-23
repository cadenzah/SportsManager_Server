# SportsManager_Server

## Introduction

REST API Server for SportsManager_Desktop or any other client program.

## Features

## API Rules

## How to use

1. Run `mongod`
```bash
$ sudo mongod
```
2. Download the project
```bash
$ git clone https://gitbub.com/cadenzah/SportsManager_Server.git
```

3. Locate into project's folder
4. Install npm modules
```bash
$ cd SportsManager_Server
$ npm install
```
5. Make `.env` file. This file includes environment values used in the server. Those values include:
> - PORT: The port number for the web server
> - DB_NAME: The MongoDB database name
> - DB_IP: IP address where MongoDB is running
> - DB_PORT: The port number for the DB
6. Run the web server
```bash
$ npm run start
```
