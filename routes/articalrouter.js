const { Router } = require("express");
const { isAuthenticated } = require("../middleware/auth");
const { deleteArtical, getAllArtical, getSingleArtical, updateArtical, uploadArtical } = require("../controllers/Artical.controller");

const ArticalRouter = Router();

ArticalRouter.post("/artical/create-artical", isAuthenticated, uploadArtical);

ArticalRouter.get("/artical/get-all-artical", getAllArtical);
ArticalRouter.get("/artical/get-artical/:id", getSingleArtical);
ArticalRouter.put("/artical/update/:id", isAuthenticated, updateArtical);
ArticalRouter.delete("/artical/delete-artical/:id", isAuthenticated, deleteArtical);

module.exports = ArticalRouter;
