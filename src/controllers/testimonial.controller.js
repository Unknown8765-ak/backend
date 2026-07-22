

import { Testimonial } from "../models/TestimonialModel.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import cloudinary from "cloudinary";


// ==========================================
// Create Testimonial
// ==========================================

const createTestimonial = asyncHandler(async (req, res) => {
console.log(req.user);

console.log(req.body);
console.log(req.file);
    const { name, designation, company, review, rating } = req.body;


    if (!name || !designation || !review || !rating) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    let imageUrl = "";

    if (req.file) {

        const uploadedImage = await uploadoncloudinary(req.file.path);

        if (!uploadedImage) {
            throw new ApiError(500, "Image upload failed");
        }

        imageUrl = uploadedImage.url;
    }

    const testimonial = await Testimonial.create({
        name,
        designation,
        company,
        review,
        rating,
        image: imageUrl,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            testimonial,
            "Testimonial created successfully"
        )
    );

});

const getAllTestimonials = asyncHandler(async (req, res) => {

    const testimonials = await Testimonial.find().sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            testimonials,
            "Testimonials fetched successfully"
        )
    );

});

const getSingleTestimonial = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            testimonial,
            "Testimonial fetched successfully"
        )
    );

});

const updateTestimonial = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    const { name, designation, company, review, rating } = req.body;

    if (name) testimonial.name = name;
    if (designation) testimonial.designation = designation;
    if (company) testimonial.company = company;
    if (review) testimonial.review = review;
    if (rating) testimonial.rating = rating;

    if (req.file) {

        if (testimonial.image) {

            const publicId = testimonial.image
                .split("/")
                .pop()
                .split(".")[0];

            await cloudinary.v2.uploader.destroy(publicId);
        }

        const uploadedImage = await uploadoncloudinary(req.file.path);

        if (!uploadedImage) {
            throw new ApiError(500, "Image upload failed");
        }

        testimonial.image = uploadedImage.url;
    }

    await testimonial.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            testimonial,
            "Testimonial updated successfully"
        )
    );

});

const deleteTestimonial = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
    }

    if (testimonial.image) {

        const publicId = testimonial.image
            .split("/")
            .pop()
            .split(".")[0];

        await cloudinary.v2.uploader.destroy(publicId);
    }

    await Testimonial.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Testimonial deleted successfully"
        )
    );

}); 

export {
    createTestimonial,
    deleteTestimonial,
    getAllTestimonials,
    getSingleTestimonial,
    updateTestimonial
}