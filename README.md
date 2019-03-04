# trainee-node-task
The application consists of two parts:
1) A simple API that returns students related data, it's based on Node.js HTTP server and uses JSON stub as a data source.
2) Four functions for calculating the average score for each student. All of the functions use different JS tools but serve the same purpose:
1. Function that uses Promises(ES6, used for supporting of asynchronous programming)
2. Function that uses callbacks.
3. Function that uses async/await(ES7 technology that is more elegant way of supporting asynchronous programming)
4. Function-generator (supports asynchonous programming using yield)

Functions use [axios](https://www.npmjs.com/package/axios) to perform HTTP requests to server.
# Getting started
## Install Node.js and npm from the Ubuntu repository
Install [node.js](https://nodejs.org/en/) using the apt package manager
```
sudo apt install nodejs npm
```
Use npm to install all required packages
```bash
npm install
```

To run server use

```
node index.js
```

# Tests

Run ```npm test``` to execute tests via [Mocha](https://mochajs.org/)
