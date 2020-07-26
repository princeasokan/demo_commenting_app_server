# Ares Report Management

## Installation
- Delete package-lock.json this will created for your system, When you finish installation
```bash
$ git clone https://github.com/princeasokan/demo_commenting_app_server.git
$ cd  demo_commenting_app_server
$ sudo apt-get update
$ sudo apt-get install nodejs
$ sudo apt-get install npm
$ npm install
$ npm install pm2 -g

```


## Running in Developement
```bash
$ npm start
```


## Running in Production Server

- From root folder of the project

```bash

$ pm2 start server.js
```
- Stop Server

```bash

$ pm2 kill

```
- See Documentations http://pm2.keymetrics.io/docs/usage/process-management/
- See Logs of the Server
```bash
$ pm2 logs
```
