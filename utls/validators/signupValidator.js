const slugify = require('slugify');
//const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middleware/validator');
const User = require('../../models/userModel');

exports.signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('User Name Required')
        .isLength({ min: 3 })
        .withMessage('Too short User name')
        .isLength({ max: 20 })
        .withMessage('Too long User name')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true
        }),
    check('email')
        .notEmpty()
        .withMessage('Email Required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom((val) => User.findOne({ email: val }).then(user => {
            if (user) {
                return Promise.reject(new Error('this email address in use'));
            }
        })),
 
    check('password')
        .notEmpty()
        .withMessage('password required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters')
        .custom((password, { req }) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error('password Confirmation incorrect');
            }
            return true;
        }
        ),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('password confirm required')
    ,
    validatorMiddleware
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid Id format'),
    validatorMiddleware
];

