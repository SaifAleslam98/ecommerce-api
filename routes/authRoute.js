const express = require('express');
const { signupValidator, loginValidator, forgetPasswordValidator } = require('../utls/validators/authValidator')
const { signup, login, forgetPassword } = require('../services/authService');

const router = express.Router();

//router.put('/changePassword/:id', updateUserPassword);
router.post('/signup', signupValidator, signup);
router.post('/login',loginValidator, login);
router.post('/forgetPassword', forgetPasswordValidator,forgetPassword);

/*router.route('/:id')
    .get(getUser)
    .put(uploadSingleImage, resizeImage, updateUser)
    .delete(uploadSingleImage, resizeImage, updateUser)
*/
module.exports = router;
