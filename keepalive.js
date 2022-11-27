const express = require('express');

const server = express();

function keepAlive(){

   server.listen(3000, ()=>{console.log("Server is online!")});

}

module.exports = keepAlive;