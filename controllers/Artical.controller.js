const cloudinary = require('cloudinary');
const { catchAsync } = require('../middleware/catchAsync');
const { ArticalModel } = require('../models/Artical.Model');
const ErrorHandler = require('../utils/ErrorHandler');

// Upload article with optional thumbnail
exports.uploadArtical = catchAsync(async (req, res, next) => {
  const data = req.body;
  let { thumbnail } = data;

  if (thumbnail && typeof thumbnail === "string") {
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, { folder: "artical" });
    thumbnail = { public_id: myCloud.public_id, url: myCloud.secure_url };
  }

  data.thumbnail = thumbnail; // Assign processed thumbnail to the data object

  const article = await ArticalModel.create(data);

  res.status(201).json({
    success: true,
    message: "Article created successfully",
    article,
  });
});

// Get a single article by ID
exports.getSingleArtical = catchAsync(async (req, res, next) => {
  const article = await ArticalModel.findById(req.params.id);
  if (!article) {
    return next(new ErrorHandler("Article not found", 404));
  }
  res.status(200).json({
    success: true,
    article,
  });
});

// Update article by ID
exports.updateArtical = catchAsync(async (req, res, next) => {
  const article = await ArticalModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!article) {
    return next(new ErrorHandler("Article not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Article updated successfully",
    article,
  });
});

// Get all articles with selected fields (title, description, thumbnail)
exports.getAllArtical = catchAsync(async (req, res, next) => {
  const articles = await ArticalModel.find({}).select("title description thumbnail");
  res.status(200).json({
    success: true,
    articles,
  });
});

// Delete article by ID
exports.deleteArtical = catchAsync(async (req, res, next) => {
  const article = await ArticalModel.findByIdAndDelete(req.params.id);
  if (!article) {
    return next(new ErrorHandler("Article not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Article deleted successfully",
  });
});
