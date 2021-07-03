const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddressSchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    address1: { 
        type: String,
        required : true
    },
    address2: { 
        type: String,
        default : null
    },
    area: { 
        type: String,
        required : true
    },
    landmark: { 
        type: String,
        default: null
    },
    city: { 
        type: String,
        required : true
    },
    pincode: { 
        type: String,
        required : true
    },
    is_active: { 
        type: Number
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = Address = mongoose.model("address", AddressSchema);
