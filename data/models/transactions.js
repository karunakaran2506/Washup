const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'membership'
    },
    paymentstatus: {
        type: String,
        required: true
    },
    totalamount: {
        type: Number,
        required: true
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
    createdat: {
        type: Date,
        default: new Date()
    },
},
    {
        timezone: 'Asia/Kolkata'
    }
)

module.exports = Transaction = mongoose.model('transaction', TransactionSchema);