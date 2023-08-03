var express = require('express');
var {
    createSubCategoryValidator,
    getSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
} = require('../utls/validators/subCategoryValidators')
var {
    createSubCategory,
    getSubCategories,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    setCategoryIdToBody,
    setFilterObject
} = require('../services/subCategoryService');

// merge params allow us to access parameters on other routers
var router = express.Router({mergeParams: true});

router.route('/')
    .post(setCategoryIdToBody,createSubCategoryValidator, createSubCategory)
    .get(setFilterObject,getSubCategories);
router.route('/:id')
    .get(getSubCategoryValidator,getSubCategory)
    .put(updateSubCategoryValidator,updateSubCategory)
    .delete(deleteSubCategoryValidator,deleteSubCategory)

module.exports = router