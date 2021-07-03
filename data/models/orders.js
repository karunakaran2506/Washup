const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    ordertype: {
        type: String,
        default : null
    },
    orderid: {
        type: String,
        required: true
    },
    cartid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cartmodel',
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    paymentmode: {
        type: String,
        required: true
    },
    orderstatus: {
        type: String,
        required: true
    },
    paymentstatus: {
        type: String,
        required: true
    },
    paymentid: {
        type: String,
        default: null
    },
    subtotal: {
        type: Number,
        required: true
    },
    subcharges: {
        type: Number,
        default: 0
    },
    totalamount: {
        type: Number,
        required: true
    },
    isactive: {
        type: Boolean,
        default: false
    },
    createdat: {
        type: Date,
        default: new Date()
    },
    razorpay_payment_id: {
        type: String,
        default: null
    },
    razorpay_order_id: {
        type: String,
        default: null
    },
    razorpay_signature: {
        type: String,
        default: null
    },
},
    {
        timezone: 'Asia/Kolkata'
    }
)

module.exports = Orders = mongoose.model('orders', OrderSchema);