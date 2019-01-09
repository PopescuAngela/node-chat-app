const path = require('path');
const express = require('express');

var publicPath = path.join(__dirname, '../public');

var app = express();
var port = process.env.PORT || 3000;

// set the middleware the public file path
app.use(express.static(publicPath));

app.listen(port, ()=> {
    console.log(`Started on ${port} port!`);
});

module.exports = {app}




