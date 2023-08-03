const asyncHandler = require('express-async-handler');
const ApiError = require('../utls/apiError');
const ApiFeatures = require('../utls/apiFeatures');

exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOneAndDelete(id);
    if (!document) {
        return next(new ApiError('No Category Found', 404))
    }
    res.status(200).send()
});

exports.updateOn = (Model) => asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body,
        { new: true }
    );
    if (!document) {
        return next(new ApiError(`No value Found for id : ${req.params.id}`, 404))
    }
    res.status(200).json({ data: document })
});

exports.createOne = (Model) => asyncHandler(async (req, res) => {
    //async await
    const document = await Model.create(req.body)
    res.status(201).json({ data: document })
});

exports.getOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const document = await Model.findById(id);
    if (!document) {
        return next(new ApiError('No document Found', 404))
    }
    res.status(200).json({ data: document })
});

exports.getAllDoc = (Model) => asyncHandler(async (req, res) => {
    //Build The Query 
    let filter = {};
    if(req.filterObj) {
        filter = req.filterObj
    }
    const documentCount = await Model.countDocuments();
    const apiFeature = new ApiFeatures(Model.find(filter), req.query)

        .filter()
        .limitFeilds()
        .sorting()
        .search(Model)
        .paginate(documentCount);

    //Execute
    const { mongoQuery, paginationResult } = apiFeature;
    const document = await mongoQuery
    res.status(200).json({ result: document.length, paginationResult, data: document })
});