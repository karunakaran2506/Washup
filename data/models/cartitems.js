const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CartItemSchema = new Schema ({
    quantity : {
        type : Number,
        required : true
    },
    subcharges :{
        type : Number,
        default : 0
    },
    taxamount : {
        type : Number,
        required : true,
        default : 0
    },
    subtotal : {
        type : Number,
        required : true
    },
    totalamount : {
        type : Number,
        required : true
    },
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product',
        required : true
    },
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'customers',
        default : null
    },
    cartid : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'cartmodel'
    },    
})

module.exports = Cartitem = mongoose.model('Cartitem',CartItemSchema);