const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    price :{
        type : Number,
        default : 0
    },
    image : {
        type : String,
        required : true
    },
    isactive : {
        type : Number,
        default : 0
    },
    category : {
        type : String,
        required: true
    },
    service : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'service',
        required : true
    }    
})

module.exports = Product = mongoose.model('product',ProductSchema);