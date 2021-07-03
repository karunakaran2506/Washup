const mongoose = require('mongoose')
const Schema = mongoose.Schema


const DistrictSchema = new Schema({
    name:{
        type:String
    },
    created_at:{
        type:Date,
        required:true,
        default:new Date()
    }
});

module.exports = District = mongoose.model("districts", DistrictSchema);
