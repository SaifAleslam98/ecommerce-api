
const SubCategory = require('../models/subCategoryModel');
const handlers = require('./handlers');

exports.setFilterObject = (req, res, next)=>{
    let filterObject = {};
    if(req.params.categoryId) filterObject= {category: req.params.categoryId}
    req.filterObj = filterObject;
    next();
};
exports.setCategoryIdToBody = (req, res, next)=>{
    // Nested route
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
};

//@desc    Create SubCategory
//@route   POST api/v1/ecommerce/subcategory
//@access  Private
exports.createSubCategory = handlers.createOne(SubCategory);


//@desc    Get a list of all SubCategories
//@route   GET api/v1/ecommerce/subcategory
//@access  Public
exports.getSubCategories = handlers.getAllDoc(SubCategory);

//@desc    Get Specific Category by id
//@route   GET /api/v1/ecommerce/subcategory/:id
//@access  public
exports.getSubCategory =handlers.getOne(SubCategory);

//@desc    update specific category
//@route   PUT /api/v1/ecommerce/subcategory/:id
//@access  private
exports.updateSubCategory = handlers.updateOn(SubCategory);
//@desc    delete specific category
//@route   DELETE  /api/v1/ecommerce/subcategory/:id
//@access  private

exports.deleteSubCategory = handlers.deleteOne(SubCategory);