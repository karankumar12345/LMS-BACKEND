const { Router } = require("express");
const { 
    addAnswer, 
    addQuestion, 
    addReview, 
    addReviewReply, 
    deleteCourse, 
    editCourse, 
    generatedVideoUrl, 
    getAllCourse, 
    getCoursesByUser, 
    getSingleCourse, 
    uploadCourse, 
    newOrder
} = require("../controllers/course.controller");
const { authorizeAdmin, isAuthenticated } = require("../middleware/auth");
const { updateAccessToken } = require("../controllers/user.controller");


const courseRouter = Router();

courseRouter.post("/create-course", isAuthenticated, authorizeAdmin(), uploadCourse);

courseRouter.put("/edit-course/:id", isAuthenticated, authorizeAdmin(), editCourse);  
courseRouter.get("/single-course/:id", getSingleCourse);
courseRouter.get("/all-courses", getAllCourse);

courseRouter.get("/single-courses-content/:id", isAuthenticated, getCoursesByUser);
courseRouter.put("/add-question", isAuthenticated, addQuestion);

courseRouter.put("/replies-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);

courseRouter.put("/add-replied/:id", isAuthenticated, authorizeAdmin(), addReviewReply);
courseRouter.delete("/delete/:id", isAuthenticated, authorizeAdmin(), deleteCourse);
courseRouter.post("/getvideourl", generatedVideoUrl);

courseRouter.post("/getcoursesAccess/:id", newOrder);

module.exports = courseRouter;
