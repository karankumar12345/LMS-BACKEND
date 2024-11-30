// const { CourseModel } = require("../models/course.model");
// const { catchAsync } = require("../middleware/catchAsync");

const { catchAsync } = require("../middleware/catchAsync");
const { CourseModel } = require("../models/course.model");

// Create course
exports.createCourse = catchAsync(async (data, res) => {
    try {
        const course = await CourseModel.create(data);
        res.status(201).json({
            success: true,
            message: "Course created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating course",
            error: error.message,
        });
    }
});
