import mongoose from "mongoose";

const websiteContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "home",
        "about",
        "solar",
        "aquarium",
        "agency",
        "contact",
      ],
    },

    sections: {
      hero: {
        image: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },
      },

      about: {
        image: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },
      },

      gallery: [
        {
          image: {
            type: String,
            default: "",
          },
          public_id: {
            type: String,
            default: "",
          },
        },
      ],

      projects: [
        {
          title: {
            type: String,
            default: "",
          },

          description: {
            type: String,
            default: "",
          },

          image: {
            type: String,
            default: "",
          },

          public_id: {
            type: String,
            default: "",
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const WebsiteContent = mongoose.model(
  "WebsiteContent",
  websiteContentSchema
);