const { Notification } = require('../models/notification.model');
const { catchAsync } = require("../middleware/catchAsync");
const ErrorHandler = require("../utils/ErrorHandler");
const cron = require('node-cron');

// Get Notifications
exports.getNotification = catchAsync(async (req, res, next) => {
    try {
        const notification = await Notification.find().sort({ createdAt: -1 });
        res.status(201).json({
            success: true,
            notification
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Update Notification Status
exports.updateNotification = catchAsync(async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id);
        if (!notification) {
            return next(new ErrorHandler("Notification not found", 400));
        } else {
            notification.status ? notification.status = 'read' : notification.status = 'unread';
        }

        await notification.save();
        const notifications = await Notification.find().sort({ createdAt: -1 });
        
        res.status(201).json({
            success: true,
            notifications
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Cron job to delete read notifications older than 30 days
cron.schedule('0 0 0 * * *', async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await Notification.deleteMany({ status: 'read', createdAt: { $lt: thirtyDaysAgo } });
});
