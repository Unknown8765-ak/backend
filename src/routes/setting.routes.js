import express from "express";

import {
  getSettings,
  updateSettings,
} from "../controllers/setting.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyJWT,
  getSettings
);

router.patch(
  "/",
  verifyJWT,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "favicon",
      maxCount: 1,
    },
  ]),
  updateSettings
);

export default router;