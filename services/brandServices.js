const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const {uuid} = require('uuidv4');
const handlers = require('./handlers');
const Brand = require('../models/brandModel');
const { uploadSingleImage } = require('../middleware/uploadImages');



// Upload single image
exports.uploadBrandImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuid()}-${Date.now()}.jpeg`;
  
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${filename}`);
  
    // Save image into our db 
     req.body.image = filename;
  
    next();
  });


//@desc    Get a list of all Brands
//@route   GET /api/v1/ecommerce/brands
//@access  Public
exports.getBrands = handlers.getAllDoc(Brand)

//@desc    Get Specific Brand by id
//@route   GET /api/v1/ecommerce/brands/:id
//@access  public
exports.getBrand = handlers.getOne(Brand);

//@Desc    Create Brand
//@route   Post /api/v1/ecommerce/brands
//@access  Private
exports.createBrand = handlers.createOne(Brand);

//@desc     update specific brand
//@route    Put /api/v1/ecommerce/brands/:id
//@access   private
exports.updateBrand = handlers.updateOn(Brand);

//@desc    delete    specific brand
//@route   delete   /api/v1/ecommerce/brands/:id
//@access  private
exports.deleteBrand = handlers.deleteOne(Brand);