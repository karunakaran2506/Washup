const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({

    name : {
        type : String,
        require : true
    },
    phone : {
        type : String,
        require : true,
        unique : true
    },
    password: {
		type: String,
		require: true
	},
    email : {
        type : String,
        require : true
    },
    customertype : {
        type : String,
        require : true
    },
    customertypeinfo1 : {
        type : String,
        default : null
    },
    customertypeinfo2 : {
        type : String,
        default : null
    },
    isverified : {
        type : Number,
        default : 0
    },
    membership : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'membership',
        default:null
    },
    otp : {
        type : String,
        default : null
    },
    forgetotp :{
        type : String,
        default : null
    },
    player_id:{
		type: String,
		default:null
	},
    created_at: {
		type: Date,
		required: true,
		default: new Date()
	}

})

module.exports = Customers = mongoose.model('customers',CustomerSchema);