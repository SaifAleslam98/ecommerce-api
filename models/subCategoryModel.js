const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, 'SunCategory must be unique'],
        minlength: [3, 'Too short subcategory naame'],
        maxlength: [20, 'Too long subcategory naame']
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        rquired: [true, 'SubCategory must be belong to parent category']
    }
},
    { timestamps: true }
);
module.exports = mongoose.model('SubCategory' , subCategorySchema);