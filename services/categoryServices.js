const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const {uuid} = require('uuidv4');
const Category = require('../models/categoryModel');
const handlers = require('./handlers');
const { uploadSingleImage } = require('../middleware/uploadImages');

exports.uploadBrandImage = uploadSingleImage('image');
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `category-${uuid()}-${Date.now()}.jpeg`;
  
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);
  
    // Save image into our db 
     req.body.image = filename;
  
    next();
  });
//@desc    Get a list of all Categories
//@route   GET /api/v1/ecommerce/category
//@access  Public
exports.getCategories = handlers.getAllDoc(Category);

//@ Desc    Get Specific Category by id
//@ route   GET /api/v1/ecommerce/category/:id
//@ access  public
exports.getCategory = handlers.getOne(Category);

//@Desc    Create Category
//@route   Post /api/v1/ecommerce/category
//@access  Private
exports.createCategory = handlers.createOne(Category);


//@desc    update specific category
//@route   PUT /api/v1/ecommerce/category/:id
//@access  private
exports.updateCategory = handlers.updateOn(Category);

//@desc    delete specific category
//@route   DELETE /api/v1/ecommerce/category/:id
//@access  private
exports.deleteCategory = handlers.deleteOne(Category);