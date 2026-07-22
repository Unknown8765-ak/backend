import { Setting } from "../models/SettingModel.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";


export const getSettings = asyncHandler(async (req, res) => {

  let settings = await Setting.findOne();

  if (!settings) {

    settings = await Setting.create({
      companyName: "",
      email: "",
      phone: "",
      address: "",
    });

  }

  return res.status(200).json(
    new ApiResponse(
      200,
      settings,
      "Settings fetched successfully"
    )
  );

});


export const updateSettings = asyncHandler(async (req, res) => {

  let settings = await Setting.findOne();

  if (!settings) {

    settings = await Setting.create({
      companyName: "",
      email: "",
      phone: "",
      address: "",
    });

  }

  const {
    companyName,
    email,
    phone,
    address,

    facebook,
    instagram,
    linkedin,
    youtube,

    metaTitle,
    metaDescription,
    keywords,
    robots,

  } = req.body;

  if (companyName) settings.companyName = companyName;
  if (email) settings.email = email;
  if (phone) settings.phone = phone;
  if (address) settings.address = address;

  if (facebook !== undefined)
    settings.socialLinks.facebook = facebook;

  if (instagram !== undefined)
    settings.socialLinks.instagram = instagram;

  if (linkedin !== undefined)
    settings.socialLinks.linkedin = linkedin;

  if (youtube !== undefined)
    settings.socialLinks.youtube = youtube;

  if (metaTitle !== undefined)
    settings.seo.metaTitle = metaTitle;

  if (metaDescription !== undefined)
    settings.seo.metaDescription = metaDescription;

  if (keywords !== undefined)
    settings.seo.keywords = keywords;

  if (robots !== undefined)
    settings.seo.robots = robots;



  if (req.files?.logo?.length > 0) {

    if (settings.logo.public_id) {

      await cloudinary.uploader.destroy(
        settings.logo.public_id
      );

    }

    const uploadedLogo = await uploadoncloudinary(
      req.files.logo[0].path
    );

    if (!uploadedLogo) {
      throw new ApiError(500, "Logo upload failed");
    }

    settings.logo = {
      url: uploadedLogo.url,
      public_id: uploadedLogo.public_id,
    };

  }


  if (req.files?.favicon?.length > 0) {

    if (settings.favicon.public_id) {

      await cloudinary.uploader.destroy(
        settings.favicon.public_id
      );

    }

    const uploadedFavicon = await uploadoncloudinary(
      req.files.favicon[0].path
    );

    if (!uploadedFavicon) {
      throw new ApiError(500, "Favicon upload failed");
    }

    settings.favicon = {
      url: uploadedFavicon.url,
      public_id: uploadedFavicon.public_id,
    };

  }

  await settings.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      settings,
      "Settings updated successfully"
    )
  );

});