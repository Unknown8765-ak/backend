import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiReponse.js";

import { Lead } from "../models/LeadModel.js";
import { Gallery } from "../models/GalleryModel.js";
import { Testimonial } from "../models/TestimonialModel.js";
import { WebsiteContent } from "../models/WebsiteContentModel.js";

export const getDashboardData = asyncHandler(async (req, res) => {

    // Total Counts
    const [
        totalLeads,
        totalGalleryImages,
        totalTestimonials,
        totalWebsiteContents,
    ] = await Promise.all([
        Lead.countDocuments(),
        Gallery.countDocuments(),
        Testimonial.countDocuments(),
        WebsiteContent.countDocuments(),
    ]);

    // Recent Leads
    const recentLeads = await Lead.find()
        .sort({ createdAt: -1 })
        .limit(5);

    // Recent Gallery Images
    const recentGallery = await Gallery.find()
        .sort({ createdAt: -1 })
        .limit(6);

    // Recent Testimonials
    const recentTestimonials = await Testimonial.find()
        .sort({ createdAt: -1 })
        .limit(5);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalLeads,
                totalGalleryImages,
                totalTestimonials,
                totalWebsiteContents,
                recentLeads,
                recentGallery,
                recentTestimonials,
            },
            "Dashboard data fetched successfully"
        )
    );

});