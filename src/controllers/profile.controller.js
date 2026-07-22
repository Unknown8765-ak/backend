import { User } from "../models/UserModel.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import {
  uploadoncloudinary,
  // deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const getProfile = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id)
    .select("-password -refreshToken");
    console.log(user)

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "Profile fetched successfully"
    )
  );

});

export const updateProfile = asyncHandler(async (req, res) => {

  const {
    name,
    email
  } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(
      200,
      user,
      "Profile updated successfully"
    )
  );

});

export const changePassword = asyncHandler(async (req, res) => {

  const {
    oldPassword,
    newPassword,
  } = req.body;

  const user = await User.findById(req.user._id);

  const isPasswordCorrect =
    await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {

    throw new ApiError(
      400,
      "Old password is incorrect"
    );

  }

  user.password = newPassword;

  await user.save({
    validateBeforeSave: false,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "Password changed successfully"
    )
  );

});
// export const updateProfileImage = asyncHandler(async (req, res) => {

//   const imageLocalPath = req.file?.path;

//   if (!imageLocalPath) {

//     throw new ApiError(
//       400,
//       "Image is required"
//     );

//   }

//   const uploadedImage =
//     await uploadOnCloudinary(imageLocalPath);

//   const user = await User.findById(req.user._id);

//   if (user.avatar?.public_id) {

//     await deleteFromCloudinary(
//       user.avatar.public_id
//     );

//   }

//   user.avatar = {
//     public_id: uploadedImage.public_id,
//     url: uploadedImage.secure_url,
//   };

//   await user.save({
//     validateBeforeSave: false,
//   });

//   return res.status(200).json(
//     new ApiResponse(
//       200,
//       user,
//       "Profile image updated successfully"
//     )
//   );

// });