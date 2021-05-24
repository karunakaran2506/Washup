const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'customers',
        require:true
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

module.exports = Cart = mongoose.model("cartmodel", CartSchema);