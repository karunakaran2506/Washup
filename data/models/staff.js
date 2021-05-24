const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema  = new Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    role : {
        type : String,
        required : true
    },
    createdat : {
        type : Date,
        default : new Date()
    }
})

module.exports = Staff = mongoose.model('staff', StaffSchema);