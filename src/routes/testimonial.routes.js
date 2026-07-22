import express from "express";

import {
    createTestimonial,
    getAllTestimonials,
    getSingleTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from "../controllers/testimonial.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Public
router.get("/", verifyJWT, getAllTestimonials);
router.get("/:id",verifyJWT, getSingleTestimonial);

// Admin
router.post(
    "/",
    verifyJWT,
    upload.single("image"),
    createTestimonial
);

router.patch(
    "/:id",
    verifyJWT,
    upload.single("image"),
    updateTestimonial
);

router.delete(
    "/:id",
    verifyJWT,
    deleteTestimonial
);

export default router;