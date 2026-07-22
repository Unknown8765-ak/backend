import express from "express";

import {
  createGalleryImage,
  getAllGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/gallery.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Public Route
router.get("/", getAllGalleryImages);

// Admin Routes
router.post(
  "/",
  verifyJWT,
  upload.single("image"),
  createGalleryImage
);

router.patch(
  "/:id",
  verifyJWT,
  upload.single("image"),
  updateGalleryImage
);

router.delete(
  "/:id",
  verifyJWT,
  deleteGalleryImage
);

export default router;