const express = require('express');
const {
    //    getBrandValidator,
    createUserValidator,
    changeUserPassword,
  updateUserValidator,
    //    deleteBrandValidator
} = require('../utls/validators/userValidator')
const {
    getUsers,
    createUser,
    getUser,
    updateUser,
    //deleteUser,
    uploadSingleImage,
    resizeImage,
    updateUserPassword,

} = require('../services/userService');

const router = express.Router();

router.put('/changePassword/:id', changeUserPassword, updateUserPassword);
router.route('/').get(getUsers).post(uploadSingleImage, resizeImage, createUserValidator, createUser);

router.route('/:id')
    .get(getUser)
    .put(uploadSingleImage, resizeImage,updateUserValidator, updateUser)
    .delete(uploadSingleImage, resizeImage, updateUser)

module.exports = router;
