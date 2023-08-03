const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const { uploadMixOfImages } = require('../middleware/uploadImages');
const Product = require('../models/productModel');
const handlers= require('./handlers')


exports.uploadProductImages = uploadMixOfImages([
    {
      name: 'imageCover',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
  ]);

  exports.resizeProductImages = asyncHandler(async (req, res, next) => {
    console.log(req.files)
    // console.log(req.files);
    //1- Image processing for imageCover
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
  
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);
  
      // Save image into our db
      req.body.imageCover = imageCoverFileName;
    }
    //2- Image processing for images
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
  
          await sharp(img.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);
  
          // Save image into our db
          req.body.images.push(imageName);
        })
      );
  
      next();
    }
  });

//@desc Get a list of all Products
//@route /api/v1/ecommerce/products
//@access Public
exports.getProducts = handlers.getAllDoc(Product)

//@desc Get Specific Product by id
//@route GET /api/v1/ecommerce/products/:id
//@access public
exports.getProduct = handlers.getOne(Product);

//@Desc Create Product
//@route Post /api/v1/ecommerce/products
//@access Private
exports.createProduct = handlers.createOne(Product);


//@desc    update specific Product
//@route   PUT /api/v1/ecommerce/products/:id
//@access  private
exports.updateProduct = handlers.updateOn(Product);

//@desc delete specific Product
//@route DELETE /api/v1/ecommerce/products/:id
//@access private

exports.deleteProduct = handlers.deleteOne(Product);