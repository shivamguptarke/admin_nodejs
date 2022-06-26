const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    quantity : {
        type: Number,
        required: true
    },
    description : {
        type: String,
        required: false
    },
    image : {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('Product', ProductSchema);