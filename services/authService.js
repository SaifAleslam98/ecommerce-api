const crypto = require('crypto');

const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ApiError = require('../utls/apiError');
//const sendEmail = require('../utls/testMail');  //to send testing email
const sendEmail = require('../utls/apiMailer');
const createToken = require('../utls/createToken');
const User = require('../models/userModel');


//@desc Sign up
//@route /api/v1/auth/signup
//@access Public
exports.signup = asyncHandler(async (req, res, next) => {
    // 1- create user
    const user = await User.create({
        name: req.body.name,
        slug: slugify(req.body.name),
        email: req.body.email,
        password: req.body.password
    });
    // 2- create the token
    const token = createToken(user._id);
    res.status(201).json({ data: user, token })
});

//@desc login
//@route /api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
    // 1- check if password & email from body
    // 2- check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Incorrect email or password', 401))
    }
    const token = createToken(user._id);
    res.status(200).json({ data: user, token })

});

// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(
            new ApiError(
                'You are not login, Please login to get access this route',
                401
            )
        );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const loggeduser = await User.findById(decoded.userId);

    if (loggeduser.passwordChangedAt) {

        const passwordChangedTime = parseInt(
            loggeduser.passwordChangedAt.getTime() / 1000,
            10)
        if (passwordChangedTime > decoded.iat) {
            return next(
                new ApiError(
                    'User recently changed his password. please login again',
                    401
                )
            )
        }
    }
    req.user = loggeduser;
    next();
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    // 1) Get user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(
            new ApiError(
                `There is no user with that email ${req.body.email}`,
                404
            )

        )
    }
    // 2) If user exist, Generate hash reset random 6 digits and save it in db
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');
    // Save hashed password reset code into db
    user.passwordResetCode = hashedResetCode;
    // Add expiration time for password reset code (10 min)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
    await user.save();

    // Send Email From Real Account
    const uname = user.name
    const umail = user.email
    const uid = user._id
    const Options = {uname, umail, uid ,resetCode}
    try {
        await sendEmail(Options);
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError(err, 401));
    }
    res.status(200)
        .json({ status: 'Success', message: `Your reset code sent to ${user.email}` });
    
    // Send Email  from TestAccount
    /*
    const message = `Hi ${user.name},\n
     We received a request to reset the password on your E-shop Account. \n
      ${resetCode} \n
       Enter this code to complete the reset. \n
        Thanks for helping us keep your account secure.\n The E-shop Team`;
    const subject = 'Your password reset code (valid for 10 min)';
    const Opts = [message, user.email , subject]
    try {
        
        await sendEmail(Opts);
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError(err, 500));
    }
    res
        .status(200)
        .json({ status: 'Success', message: `Your reset code sent to ${user.email}` });*/
});