const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validator');


exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Id format'),
    validatorMiddleware
];

exports.createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Brand Name Required')
        .isLength({ min: 3 })
        .withMessage('Too short Brand name')
        .isLength({ max: 20 })
        .withMessage('Too long Brand name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true
        }),
    validatorMiddleware
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Id'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true
    }),
    validatorMiddleware
];
exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Id'),
    validatorMiddleware
];