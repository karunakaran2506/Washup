const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurrentMembershipSchema = new Schema ({
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'membership',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: true
    },
    balance : {
        type : Number,
        default : 0
    },
    isactive : {
        type : Number,
        default : 0
    },
    created_at: {
		type: Date,
		required: true,
		default: new Date()
	}
})

module.exports = CurrentMembership = mongoose.model('currentmembership', CurrentMembershipSchema)