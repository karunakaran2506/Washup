const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser');

app.use(express.static(__dirname + '/')); 

app.use(bodyparser.urlencoded({
    urlencoded: true
}))

app.use(cors());
app.use(bodyparser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin: *");
    res.header("Access-Control-Allow-Credentials: true ");
    res.header("Access-Control-Allow-Methods: OPTIONS, GET, POST");
    res.header("Access-Control-Allow-Headers: Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");;
    next();
});

//routing
const v1 = require('./data/routes/routes');
app.use('/api',v1);

app.get('/', (req,res)=>{
	res.send({message:"Washup app is running app is runing"})
});

module.exports = app;