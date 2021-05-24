const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FaqSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: new Date()
    }
});

module.exports = Faq = mongoose.model("faqs", FaqSchema);
