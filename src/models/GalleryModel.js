import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Solar", "Aquarium", "Agency"],
      required: true,
    },

    alt: {
      type: String,
      default: "",
    },

    public_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = mongoose.model("Gallery", gallerySchema);