import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  getWebsiteContent,
  updateHeroImage,
  updateCompanyImage,
  deleteCompanyImage,
  addProject,
  deleteProject,
} from "../controllers/websiteContent.controller.js";

import {
  updateWebsiteContent,
} from "../controllers/websiteContent.controller.js";

const router = express.Router();


router.get("/:page", getWebsiteContent);

// Hero Image
router.patch(
  "/:page/hero",
  verifyJWT,
  upload.single("image"),
  updateHeroImage
);

// Aquarium Gallery
router.patch(
  "/:page/company-image",
  verifyJWT,
  upload.single("image"),
  updateCompanyImage
);

router.delete(
  "/:page/company-image",
  verifyJWT,
  deleteCompanyImage
);

// Agency Projects
router.post(
  "/agency/project",
  verifyJWT,
  upload.single("image"),
  addProject
);

router.delete(
  "/agency/project/:projectId",
  verifyJWT,
  deleteProject
);

router.patch("/:page", verifyJWT, updateWebsiteContent);

export default router;