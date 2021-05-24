const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdminSchema = new Schema({
        name: {
                type: String
        },
        email: {
                type: String,
                required: true
        },
        password: {
                type: String,
                required: true
        },
        phone : {
                type : String,
                required : true
        },
        forgetotp : {
                type : String,
                default: null
        },
        created_at: {
                type: Date,
                required: true,
                default: new Date()
        }
});

module.exports = Admins = mongoose.model("admins", AdminSchema);
