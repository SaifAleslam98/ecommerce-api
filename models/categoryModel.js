const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'category required'],
        unique: [true, 'category must be unique'],
        minlength: [3, 'Too Short category name'],
        maxlength: [20, 'Too Long category name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image:String
},
    { timestamps: true });
module.exports = mongoose.model('Category', categorySchema);