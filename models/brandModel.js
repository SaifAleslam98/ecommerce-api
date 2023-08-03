const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'brand required'],
        unique: [true, 'brand must be unique'],
        minlength: [3, 'Too Short brand name'],
        maxlength: [20, 'Too Long brand name']
    },
    slug: {
        type: String,
        lowercase: true
    },
    image:String,
},
    { timestamps: true });
module.exports = mongoose.model('Brand', brandSchema);