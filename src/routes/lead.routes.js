import express from "express";

import {
  createLead,
  getAllLeads,
  getSingleLead,
  updateLeadStatus,
  deleteLead,
} from "../controllers/lead.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Route
router.post("/", createLead);

router.get("/", verifyJWT, getAllLeads);
router.get("/:id", verifyJWT, getSingleLead);
router.patch("/:id", verifyJWT, updateLeadStatus);
router.delete("/:id", verifyJWT, deleteLead);

export default router;