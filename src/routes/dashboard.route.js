// routes/dashboard.routes.js

import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", verifyJWT, getDashboardData);

export default router;