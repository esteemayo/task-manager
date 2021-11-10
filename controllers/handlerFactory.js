const { StatusCodes } = require('http-status-codes');

const catchAsync = require('../utils/catchAsync');
const NotFoundError = require('../errors/notFound');
const APIFeatures = require('../utils/apiFeatures');

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const docs = await features.query;

    res.status(StatusCodes.OK).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: docs.length,
        data: {
            docs,
        },
    });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    const { id: docID } = req.params;

    let query = Model.findById(docID);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
        return next(new NotFoundError(`No document found with the given ID: ${docID}.`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            doc,
        },
    });
});

exports.getSlug = (Model, popOptions) => catchAsync(async (req, res, next) => {
    const { slug } = req.params;

    let query = Model.findOne({ 'slug': slug });
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
        return next(new NotFoundError(`No document found with the given SLUG: ${slug}.`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            doc,
        },
    });
});

exports.createOne = (Model) => catchAsync(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
        status: 'success',
        data: {
            doc,
        },
    });
});

exports.updateOne = (Model) => catchAsync(async (req, res, next) => {
    const { id: docID } = req.params;

    const doc = await Model.findByIdAndUpdate(docID, req.body, {
        new: true,
        runValidators: true,
    });

    if (!doc) {
        return next(new NotFoundError(`No document found with the given ID: ${docID}.`));
    }

    res.status(StatusCodes.OK).json({
        status: 'success',
        data: {
            doc,
        },
    });
});

exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const { id: docID } = req.params;

    const doc = await Model.findByIdAndDelete(docID);

    if (!doc) {
        return next(new NotFoundError(`No document found with the given ID: ${docID}.`));
    }

    res.status(StatusCodes.NO_CONTENT).json({
        status: 'success',
        data: null,
    });
});
