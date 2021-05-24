const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ServiceSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    isactive : {
        type : Number,
        default : 0
    }
})

module.exports = Service = mongoose.model('service',ServiceSchema);