const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Too short paroduct name'],
        maxlength: [100, 'Too long product name']
    },
    slug: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [10, 'Too short description']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        trim: true,
        max: [2000000, 'Too long product price']
    },
    priceAfterDiscount: {
        type: Number
    },
    colors: [String],
    imageCover: {
        type: String,
        required: [true, 'Product image cover is required']
    },
    images: [String],
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Product must belong to category']
    },
    subcategories:[
        {
            type: mongoose.Schema.ObjectId,
            ref: 'SubCategory'
        }
    ],
    brand:{
        type: mongoose.Schema.ObjectId,
        ref:'Brand'
    },
    ratingsAverage:{
        type:Number,
        min:[1, 'Rating must be above or equal 1'],
        max:[5, ' Rating must be below or equal 5']
    },
    ratingsQuantity:{
        type:Number,
        default:0
    }

},
    { timestamps: true });
    productSchema.pre(/^find/, function(next){
        this.populate({
            path:'category',
            select: 'name'
        });
        next(); 
    });
    const setImageURL = (doc) => {
        if (doc.imageCover) {
          const imageUrl = `uploads/products/${doc.imageCover}`;
          doc.imageCover = imageUrl;
        }
        if (doc.images) {
          const imagesList = [];
          doc.images.forEach((image) => {
            const imageUrl = `uploads/products/${image}`;
            imagesList.push(imageUrl);
          });
          doc.images = imagesList;
        }
      };
      // findOne, findAll and update
      productSchema.post('init', (doc) => {
        setImageURL(doc);
      });
      
      // create
      productSchema.post('save', (doc) => {
        setImageURL(doc);
      });
module.exports = mongoose.model('Product', productSchema);