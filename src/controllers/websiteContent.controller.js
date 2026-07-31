import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import { WebsiteContent } from "../models/WebsiteContentModel.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const getWebsiteContent = asyncHandler(async (req, res) => {
  const { page } = req.params;

  let content = await WebsiteContent.findOne({ page });

  if (!content) {
    content = await WebsiteContent.create({
      page,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      content,
      "Website content fetched successfully"
    )
  );
});



export const updateHeroImage = asyncHandler(async (req, res) => {
  const { page } = req.params;

  if (!req.file) {
    throw new ApiError(400, "Hero image is required");
  }

  let content = await WebsiteContent.findOne({ page });

  if (!content) {
    content = await WebsiteContent.create({
      page,
      sections: {},
    });
  }

  // Delete old image
  if (
    content.sections?.hero?.public_id
  ) {
    await cloudinary.uploader.destroy(
      content.sections.hero.public_id
    );
  }

  const uploadedImage = await uploadoncloudinary(
    req.file.path
  );

  if (!uploadedImage) {
    throw new ApiError(500, "Image upload failed");
  }

  content.sections.hero = {
    image: uploadedImage.url,
    public_id: uploadedImage.public_id,
  };

  await content.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      content,
      "Hero image updated successfully"
    )
  );
});



export const updateCompanyImage = asyncHandler(async (req, res) => {
  const { page } = req.params;

  if (!req.file) {
    throw new ApiError(400, "About image is required");
  }

  let content = await WebsiteContent.findOne({ page });

  if (!content) {
    content = await WebsiteContent.create({
      page,
      sections: {},
    });
  }

  // Delete old image if exists
  if (content.sections?.about?.public_id) {
    await cloudinary.uploader.destroy(
      content.sections.about.public_id
    );
  }

  const uploadedImage = await uploadoncloudinary(req.file.path);

  if (!uploadedImage) {
    throw new ApiError(500, "Image upload failed");
  }

  content.sections.about = {
    image: uploadedImage.url,
    public_id: uploadedImage.public_id,
  };

  await content.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      content,
      "About image updated successfully"
    )
  );
});



export const deleteCompanyImage = asyncHandler(async (req, res) => {
  const { page } = req.params;

  const content = await WebsiteContent.findOne({ page });

  if (!content) {
    throw new ApiError(404, "Page content not found");
  }

  if (!content.sections?.about?.public_id) {
    throw new ApiError(404, "About image not found");
  }

  await cloudinary.uploader.destroy(
    content.sections.about.public_id
  );

  content.sections.about = {
    image: "",
    public_id: "",
  };

  await content.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "About image deleted successfully"
    )
  );
});



export const addProject = asyncHandler(async (req, res) => {

  const { title, description,link,technologies } = req.body;

  if (!title || !link|| !technologies|| !description || !req.file) {
    throw new ApiError(400, "All fields are required");
  }

  let content = await WebsiteContent.findOne({
    page: "agency",
  });

  if (!content) {
    content = await WebsiteContent.create({
      page: "agency",
      sections: {
        projects: [],
      },
    });
  }

  const uploadedImage = await uploadoncloudinary(
    req.file.path
  );

  content.sections.projects.push({
    title,
    description,
    link,
    technologies,
    image: uploadedImage.url,
    public_id: uploadedImage.public_id,
  });

  await content.save();

  return res.status(201).json(
    new ApiResponse(
      201,
      content,
      "Project added successfully"
    )
  );
});


export const deleteProject = asyncHandler(async (req, res) => {

  const { projectId } = req.params;

  const content = await WebsiteContent.findOne({
    page: "agency",
  });

  if (!content) {
    throw new ApiError(404, "Agency content not found");
  }

  const project = content.sections.projects.id(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  await cloudinary.uploader.destroy(
    project.public_id
  );

  project.deleteOne();

  await content.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Project deleted successfully"
    )
  );
});





export const updateWebsiteContent = asyncHandler(async (req, res) => {
  const { page } = req.params;

  const { sections } = req.body;

  if (!sections) {
    throw new ApiError(400, "Sections data is required");
  }

  const content = await WebsiteContent.findOneAndUpdate(
    { page },
    {
      $set: {
        sections,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      content,
      "Website content updated successfully"
    )
  );
});