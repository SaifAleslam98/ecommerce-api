const express = require('express');
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
} = require('../utls/validators/brandValidator')
const {
    getBrands,
    createBrand,
    getBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    resizeImage
} = require('../services/brandServices');

const router = express.Router();

router.route('/').get(getBrands).post(uploadBrandImage,resizeImage,createBrandValidator, createBrand);

router.route('/:id')
    .get(getBrandValidator, getBrand)
    .put(updateBrandValidator, updateBrand)
    .delete(deleteBrandValidator, deleteBrand)

module.exports = router;
