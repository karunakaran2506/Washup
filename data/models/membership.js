const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MembershipSchema = new Schema ({
    name : {
        type : String,
        required : true
    },
    points : {
        type : Number,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
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

module.exports = Membership = mongoose.model('membership',MembershipSchema)