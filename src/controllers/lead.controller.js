import {Lead} from "../models/LeadModel.js"
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
// ==========================================
// Create Lead (Public)
// ==========================================

const createLead = asyncHandler(async (req, res) => {

    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
        throw new ApiError(400, "All fields are required");
    }

    const lead = await Lead.create({
        name,
        email,
        phone,
        subject,
        message,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            lead,
            "Lead submitted successfully"
        )
    );

});

// ==========================================
// Get All Leads (Admin)
// ==========================================

const getAllLeads = asyncHandler(async (req, res) => {

    const leads = await Lead.find().sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            leads,
            "Leads fetched successfully"
        )
    );

});


const getSingleLead = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            lead,
            "Lead fetched successfully"
        )
    );

});

const updateLeadStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    lead.status = status;

    await lead.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            lead,
            "Lead status updated successfully"
        )
    );

});

const deleteLead = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    await Lead.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Lead deleted successfully"
        )
    );

});

export {
    createLead,
    getAllLeads,
    getSingleLead,
    updateLeadStatus,
    deleteLead,
};