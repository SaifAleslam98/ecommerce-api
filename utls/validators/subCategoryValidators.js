const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validator');

exports.getSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Id'),
    validatorMiddleware
];

exports.createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('SubCategory Name Required')
        .isLength({ min: 3 })
        .withMessage('Too short SubCategory name')
        .isLength({ max: 20 })
        .withMessage('Too long SubCategory name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true
        }),
    check('category')
        .notEmpty().withMessage('Category required')
        .isMongoId().withMessage('Invalid Category Id'),
    
    validatorMiddleware
];

exports.updateSubCategoryValidator = [
    check('id')
        .isMongoId().withMessage('Invalid Id')
        .notEmpty().withMessage('Invalid SubCategory Id'),
    check('name')
        .notEmpty().withMessage('SubCategory name required'),
    check('category')
        .notEmpty().withMessage('SubCategory must have parent Category required'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true
    }),
    validatorMiddleware
];
exports.deleteSubCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Id'),
    validatorMiddleware
];