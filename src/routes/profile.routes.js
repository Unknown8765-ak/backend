import express from "express";

import {
  getProfile,
  updateProfile,
  // updateProfileImage,
  changePassword,
} from "../controllers/profile.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getProfile);

router.patch("/", verifyJWT, updateProfile);

// router.patch(
//   "/image",
//   verifyJWT,
//   upload.single("image"),
//   updateProfileImage
// );

router.patch(
  "/change-password",
  verifyJWT,
  changePassword
);

export default router;