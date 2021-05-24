const app = require('./app');
const port = 3030;
const http = require('http');
const server = http.createServer(app)

//Server command
// NODE_ENV=production TZ='Asia/Calcutta' pm2 start server.js --name hellowcart-18.04.2021-a

//Timezone set
process.env.TZ = 'Asia/Kolkata';

// mongo db credentials
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const uri = require('./config/key').uri;

// mongo db connection
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, success) => {
    if (err) throw new err

    server.listen(port, () => {
        console.log(`Washup app is running successfully in ${port} and connected to database`)
    })
}
)