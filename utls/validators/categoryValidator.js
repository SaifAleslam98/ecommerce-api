const slugify = require('slugify');
const { check, body } = require('express-validator');
const validator = require('../../middleware/validator');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Id'),
    validator
];

exports.createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Category Name Required')
        .isLength({min:3})
        .withMessage('Too short Category name')
        .isLength({max:20})
        .withMessage('Too long category name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true
        }),
        validator
];

exports.updateCategoryValidator= [
    check('id').isMongoId().withMessage('Invalid Id'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true
    }),
    validator
];
exports.deleteCategoryValidator= [
    check('id').isMongoId().withMessage('Invalid Id'),
    validator
];