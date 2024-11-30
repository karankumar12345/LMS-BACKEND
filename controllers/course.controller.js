const cloudinary = require('cloudinary');

// const ErrorHandler = require("../utils/ErrorHandler");
// const { createCourse } = require('./courses');
// const { CommentModel, CourseModel, ReviewModel } = require('../models/course.model');
// const UserModel  = require('../models/user.model');
const mongoose = require('mongoose');
// const { catchAsync } = require('../middleware/catchAsync');

const { default: axios } = require('axios');
const { catchAsync } = require('../middleware/catchAsync');
const ErrorHandler = require('../utils/ErrorHandler');
const UserModel = require('../models/user.model');
const { CourseModel, CommentModel, ReviewModel } = require('../models/course.model');
const { createCourse } = require('./courses');
// const axios = require('axios');

exports.uploadCourse = catchAsync(async (req, res, next) => {
    try {
        const data = req.body;
        const { thumbnail } = data;

        // Upload thumbnail to Cloudinary if it exists
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "thumbnail"
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }

        // Call the createCourse function
        await createCourse(data, res, next);
    } catch (error) {
        return next(new ErrorHandler(400, error.message)); // Use your ErrorHandler class or function
    }
});
 exports.newOrder = catchAsync(async (req, res, next) => {
    const data = req.body;

    // Find user and course
    console.log(data);
    const user = await UserModel.findById(data.userId);
    const course = await CourseModel.findById(data.coursesID);

    if (!user || !course) {
        return next(new ErrorHandler("User or course not found", 404));
    }

    // Log data before pushing
    console.log("Pushing this to user.courses:", { courseId: data.coursesID });

    // Add course to user's courses
    user.courses.push( data.coursesID ); // Push object with courseId
    console.log("User after pushing courses:", user);

    await user.save();

    res.status(201).json({
        success: true,
        user,
    });
});

exports.editCourse = catchAsync(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if (thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "thumbnail"
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            };
        }
        const courseId = req.params.id;
        const course = await CourseModel.findByIdAndUpdate(courseId, data);
        createCourse(data, res, next);
    } catch (error) {
        return next(new ErrorHandler(400, error.message));
    }
});

exports.getSingleCourse = catchAsync(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const course = await CourseModel.findById(courseId).select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links");

        if (!course) {
            res.status(400).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            course,
        });
    } catch (error) {
        return next(new ErrorHandler(400, error.message));
    }
});

exports.getAllCourse = catchAsync(async (req, res, next) => {
    try {
        const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestions -courseData.questions -courseData.links");
        res.status(201).json({
            success: true,
            courses
        });
    } catch (error) {
        return next(new ErrorHandler(400, error.message));
    }
});

exports.getCoursesByUser = catchAsync(async (req, res, next) => {
    const userCourses = req.user?.courses;
    const courseId = req.params.id;

    if (!userCourses) {
        console.error("User courses not found");
        return next(new ErrorHandler("User data not found", 401));
    }

    const courseExists = userCourses.some((course) => {
        return course._id === courseId;
    });

    if (!courseExists) {
        return res.status(403).json({
            success: false,
            message: "You are not eligible for this course",
        });
    }

    const course = await CourseModel.findById(courseId).populate("courseData");
    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }

    res.status(200).json({
        success: true,
        course,
    });
});

exports.addQuestion = catchAsync(async (req, res, next) => {
    try {
        const { question, courseId, contentId, userId } = req.body;

        if (!question || !courseId || !contentId || !userId) {
            return next(new ErrorHandler("All fields are required.", 400));
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(new ErrorHandler("Invalid course id", 400));
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const courseContent = course.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler("Content not found in the course", 400));
        }

        const newQuestion = {
            user: userId,
            question,
            questionReplies: [],
        };

        courseContent.questions.push(newQuestion);

        // await Notification.create({
        //     userId: userId,
        //     title: "New Question Received",
        //     message: `You have a new question in ${courseContent.title}`,
        // });

        await course.save();

        res.status(200).json({
            success: true,
            course,
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.addAnswer = catchAsync(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId, userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(new ErrorHandler("Invalid course id", 400));
        }
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid content id", 400));
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return next(new ErrorHandler("Invalid user id", 400));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const courseContent = course.courseData?.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler("Content not found in the course", 400));
        }

        const question = courseContent.questions.find((item) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler("Question not found", 400));
        }

        const newAnswer = new CommentModel({
            user: new mongoose.Types.ObjectId(userId),
            question: answer,
            questionReplies: [],
        });

        question.questionReplies.push(newAnswer);

        await newAnswer.save();
        await course.save();

        res.status(200).json({
            success: true,
            course,
        });

    } catch (error) {
        console.error('Error:', error);
        return next(new ErrorHandler(error.message || "Something went wrong", 500));
    }
});

exports.addReview = catchAsync(async (req, res, next) => {
    try {
        const courseId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return next(new ErrorHandler("Invalid course ID", 400));
        }

        if (!req.user) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }

        const userCourseList = req.user.courses || [];
        const coursesExist = userCourseList.some((courseItem) => courseItem._id.toString() === courseId);

        if (!coursesExist) {
            return next(new ErrorHandler("You are not eligible to review this course", 400));
        }

        const { review, rating } = req.body;

        const reviewData = new ReviewModel({
            user: req.user._id,
            comment: review,
            rating: rating,
            commentReplies: []
        });

        course.reviews.push(reviewData);

        const totalRatings = course.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        course.ratings = totalRatings / course.reviews.length;

        await course.save();
        await reviewData.save();

        res.status(200).json({
            success: true,
            course,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message || "Something went wrong", 500));
    }
});

exports.addReviewReply = catchAsync(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }

        const review = course?.reviews?.find((rev) => rev._id.toString() === reviewId.toString());
        if (!review) {
            return next(new ErrorHandler("Review not found", 400));
        }

        const replyData = {
            user: req.user,
            comment
        };

        if (!review.commentReplies) {
            review.commentReplies = [];
        }

        review?.commentReplies.push(replyData);
        await course.save();

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        return next(new ErrorHandler("Something went wrong", 500));
    }
});



// Delete course
exports.deleteCourse = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);
        if (!course) {
            return next(new ErrorHandler("Course not found", 400));
        }
        await course.deleteOne({ _id: id });
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        return next(new ErrorHandler(404, error.message));
    }
});

// Generate video URL
exports.generatedVideoUrl = catchAsync(async (req, res, next) => {
    try {
        console.log(`${process.env.VIDEO_API_SECRET}`);
        const { videoId } = req.body;
        const response = await axios.post(
            `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
            { ttl: 300 },
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Apisecret ${process.env.VIDEO_API_SECRET}`,

                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error generating video URL:", error.response?.data || error.message);
        return next(new ErrorHandler(error.response?.data.message || "Failed to generate video URL", error.response?.status || 500));
    }
    
});
