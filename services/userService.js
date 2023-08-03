const slugify = require('slugify');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const { uuid } = require('uuidv4');
const bcrypt = require('bcryptjs')
const User = require('../models/userModel');
const handlers = require('./handlers');
const ApiError = require('../utls/apiError');
const { uploadSingleImage } = require('../middleware/uploadImages');

exports.uploadSingleImage = uploadSingleImage('profilePic');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuid()}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 95 })
            .toFile(`uploads/users/${filename}`);

        // Save image into our db 
        req.body.profilePic = filename;

    }
    next();
});

//@desc    Get a list of all users
//@route   GET /api/v1/ecommerce/users
//@access  Private
exports.getUsers = handlers.getAllDoc(User)

//@desc    Get Specific User by id
//@route   GET /api/v1/ecommerce/Users/:id
//@access  Private
exports.getUser = handlers.getOne(User);

//@Desc    Create User
//@route   Post /api/v1/ecommerce/Users
//@access  Private
exports.createUser = handlers.createOne(User);

//@desc     update specific User
//@route    Put /api/v1/ecommerce/Users/:id
//@access   private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            slug: slugify(req.body.name) ,
            profilePic: req.body.profilePic,
            role: req.body.role
        },
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`No value Found for id : ${req.params.id}`, 404))
    }
    res.status(200).json({ data: document })
});

//@desc     update specific User Password
//@route    Put /api/v1/ecommerce/users/:id
//@access   private
exports.updateUserPassword = asyncHandler(async (req, res, next)=>{
    const document = await User.findByIdAndUpdate(req.params.id,
        {
            password: await bcrypt.hash(req.body.newPassword, 12) ,
            passwordChangedAt: Date.now()
        },
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`No value Found for id : ${req.params.id}`, 404))
    }
    res.status(200).json({ data: document })
})

//@desc    delete    specific User
//@route   delete   /api/v1/ecommerce/Users/:id
//@access  private
exports.deleteUser = handlers.deleteOne(User);