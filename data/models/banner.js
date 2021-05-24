const mongoose = require('mongoose')
const Schema = mongoose.Schema


const BannerSchema = new Schema({
	image:{
        type:String
    },
    name:{
        type:String
    },
    created_at:{
        type:Date,
        required:true,
        default:new Date()
    }
});

module.exports = Banner = mongoose.model("banners", BannerSchema);
