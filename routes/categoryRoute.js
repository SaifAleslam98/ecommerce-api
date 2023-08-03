const express = require('express');
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator
} = require('../utls/validators/categoryValidator')
const {
    getCategories,
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
    uploadBrandImage,
    resizeImage
} = require('../services/categoryServices');
const authService = require('../services/authService')
const subCategoryRouter = require('./subcategoryRoute')

const router = express.Router();

router.use('/:categoryId/subcategory', subCategoryRouter)
router.route('/').get(getCategories).post(authService.protect,uploadBrandImage,resizeImage, createCategoryValidator, createCategory);

router.route('/:id')
    .get(getCategoryValidator, getCategory)
    .put(updateCategoryValidator, updateCategory)
    .delete(deleteCategoryValidator, deleteCategory)

module.exports = router;
