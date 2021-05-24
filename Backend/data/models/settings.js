const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SettingsSchema = new Schema({
    extra_charge: {
        type : Number,
    },
    packaging_charge:{
        type : Number,
    },
    delivery_charge:{
        type : Number,
    }
});

module.exports = Settings = mongoose.model("settings", SettingsSchema);
