
// const { catchAsync } = require("../middleware/catchAsync");
// const InterviewExperienceModel = require("../models/interviewExperience");

const { catchAsync } = require("../middleware/catchAsync");
const InterviewExperienceModel = require("../models/interviewExperience");
const ErrorHandler = require("../utils/ErrorHandler");

// const ErrorHandler = require("../utils/ErrorHandler");

// Create Interview Experience
exports.createInterviewExperience = catchAsync(async (req, res, next) => {
    try {
        const data = req.body;
        await InterviewExperienceModel.create(data);
        res.status(201).json({
            success: true,
            message: "Interview Experience Added Successfully"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// Update Interview Experience
exports.updateExperience = catchAsync(async (req, res, next) => {
    try {
        await InterviewExperienceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            message: "Update Successful"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// Access Single Interview Experience
exports.accessSingleExperience = catchAsync(async (req, res, next) => {
    try {
        const singleExperience = await InterviewExperienceModel.findById(req.params.id);
        if (!singleExperience) {
            return next(new ErrorHandler("Interview Experience not found", 404));
        }
        res.status(200).json({
            success: true,
            singleExperience
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// Get All Interview Experiences
exports.allInterviewExperience = catchAsync(async (req, res, next) => {
    try {
        const allInterviewExperience = await InterviewExperienceModel.find({}).select("companyName jobPosition finalOutcome");
        res.status(200).json({
            success: true,
            allInterviewExperience
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});

// Delete Interview Experience
exports.deleteInterviewExperience = catchAsync(async (req, res, next) => {
    try {
        await InterviewExperienceModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Interview Experience Deleted Successfully"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
});
