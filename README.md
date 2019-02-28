# trainee-node-task
A simple Node.js HTTP server that handles JSON data about students.
This application provides three functions for calculating the average score for each student. All of them use different JS technologies but performs the same result:
1. Function that uses Promises(ES6, used for supporting of asynchronous programming)
2. Function that uses callbacks.
3. Function that uses async/await(ES7 technology that is more elegant way of supporting asynchronous programming)

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
