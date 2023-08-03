const slugify = require('slugify');
const bcrypt = require('bcryptjs');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middleware/validator');
const User = require('../../models/userModel');

exports.createUserValidator = [
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
    check('phone')
        .optional()
        .isMobilePhone("ar-SA")
        .withMessage('invalid phone number, just KSA accepted')
    ,
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
    check('profilePic').optional(),
    check('role').optional()
    ,
    validatorMiddleware
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid Id format'),
    validatorMiddleware
];

exports.updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid Id'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true
    }),
    check('email')
        .optional()
        .notEmpty()
        .withMessage('Email Required')
        .isEmail()
        .withMessage('Invalid email address')
        .custom((val) => User.findOne({ email: val }).then(user => {
            if (user) {
                return Promise.reject(new Error('this email address in use'));
            }
        })),
    check('phone')
        .optional()
        .isMobilePhone("ar-SA")
        .withMessage('invalid phone number, just KSA accepted'),
    check('profilePic').optional(),
    check('role').optional()
    ,
    validatorMiddleware
];

exports.changeUserPassword = [
    check('id').isMongoId().withMessage('Invalid User Id format'),
    body('currentPassword')
        .notEmpty()
        .withMessage('you mut enter your current password'),
    body('passwordConfirm')
        .notEmpty()
        .withMessage('you must enter your password confirm'),
    body('newPassword')
        .notEmpty()
        .withMessage('you must enter your new password')
        .custom(async (val, { req }) => {
            // 1- Find the user to verify the password
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error('There is no user for this id')
            }
            // 2- comparing the password & current pasword
            const isCorrectpassword = await bcrypt.compare(
                req.body.currentPassword, user.password);
            if (!isCorrectpassword) {
                throw new Error('incorrect current password')
            }
            // 3- validate confirm password
            if (val !== req.body.passwordConfirm) {
                throw new Error('password Confirmation incorrect');
            }
            return true;
        }),
    validatorMiddleware
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid Id'),
    validatorMiddleware
];