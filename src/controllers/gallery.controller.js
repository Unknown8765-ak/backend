

import { Gallery } from "../models/GalleryModel.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

const createGalleryImage = asyncHandler(async (req, res) => {

    const { title, category } = req.body;

    if (!title || !category) {
        throw new ApiError(400, "Title and Category are required");
    }

    if (!req.file) {
        throw new ApiError(400, "Image is required");
    }

    const uploadedImage = await uploadoncloudinary(req.file.path);

    if (!uploadedImage) {
        throw new ApiError(500, "Image upload failed");
    }

    const gallery = await Gallery.create({
        title,
        category,
        image: uploadedImage.url,
        public_id: uploadedImage.public_id,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            gallery,
            "Gallery image uploaded successfully"
        )
    );

});

const getAllGalleryImages = asyncHandler(async (req, res) => {

    const gallery = await Gallery.find().sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            gallery,
            "Gallery fetched successfully"
        )
    );

});


const updateGalleryImage = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { title, category } = req.body;

    const gallery = await Gallery.findById(id);

    if (!gallery) {
        throw new ApiError(404, "Gallery image not found");
    }

    if (title) {
        gallery.title = title;
    }

    if (category) {
        gallery.category = category;
    }

    if (req.file) {
        await cloudinary.uploader.destroy(gallery.public_id);
        const uploadedImage = await uploadoncloudinary(req.file.path);

        if (!uploadedImage) {
            throw new ApiError(500, "Image upload failed");
        }

        gallery.image = uploadedImage.url;
        gallery.public_id = uploadedImage.public_id;
    }

    await gallery.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            gallery,
            "Gallery updated successfully"
        )
    );

});

const deleteGalleryImage = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const gallery = await Gallery.findById(id);

    if (!gallery) {
        throw new ApiError(404, "Gallery image not found");
    }
    await cloudinary.uploader.destroy(gallery.public_id);
    await Gallery.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Gallery deleted successfully"
        )
    );

});

export {
    createGalleryImage,
    getAllGalleryImages,
    updateGalleryImage,
    deleteGalleryImage,
};