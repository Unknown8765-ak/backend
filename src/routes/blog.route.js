import { Router } from "express";

import {
    createBlog,
    getAllBlogs,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
} from "../controllers/blog.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/")
    .get(getAllBlogs);

router.route("/:slug")
    .get(getBlogBySlug);



router.route("/")
    .post(verifyJWT,upload.single("featuredImage"),createBlog);

router.route("/:id")
    .put(
        verifyJWT,
        upload.single("featuredImage"),
        updateBlog
    )
    .delete(
        verifyJWT,
        deleteBlog
    );

export default router;