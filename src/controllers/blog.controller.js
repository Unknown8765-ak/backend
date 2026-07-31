import { Blog } from "../models/BlogModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiReponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const createBlog = asyncHandler(async (req, res) => {

    const {
        title,
        excerpt,
        content,
        category,
        tags,
        status,
        metaTitle,
        metaDescription
    } = req.body;
    console.log(req.body);
console.log(typeof title);
console.log(typeof excerpt);
console.log(typeof content);
console.log(typeof category);
    if (
        [title, excerpt, content, category].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields are mandatory");
    }

    const slug = generateSlug(title);
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
        throw new ApiError(
            409,
            "A blog with this title already exists."
        );
    }

    const featuredImageLocalPath = req.file?.path;

    if (!featuredImageLocalPath) {
        throw new ApiError(400, "Featured image is required");
    }

    const uploadedImage = await uploadoncloudinary(featuredImageLocalPath);
    if (!uploadedImage) {
        throw new ApiError(
            500,
            "Failed to upload featured image"
        );
    }

    let formattedTags = [];

    if (tags) {
        if (Array.isArray(tags)) {
            formattedTags = tags;
        } else {
            formattedTags = tags
                .split(",")
                .map(tag => tag.trim().toLowerCase())
                .filter(tag => tag !== "");

        }
    }


    const blog = await Blog.create({
        title,
        slug,
        excerpt,
        content,
        featuredImage: {
            url: uploadedImage.secure_url,
            public_id: uploadedImage.public_id,
        },
        category,
        tags: formattedTags,
        author: req.user._id,
        status: status || "draft",
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        publishedAt:
            status === "published"
                ? new Date()
                : null
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            blog,
            "Blog created successfully."
        )

    );

});


const getAllBlogs = asyncHandler(async (req, res) => {

    let {
        page = 1,
        limit = 9,
        category,
        search,
        status = "published",
        sort = "latest"
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const filter = {};
    if (status) {
        filter.status = status;
    }

  
    if (category) {
        filter.category = category;
    }

    if (search) {
        filter.$text = {
            $search: search
        };
    }


    let sortOption = {};

    switch (sort) {

        case "oldest":
            sortOption = { publishedAt: 1 };
            break;

        case "views":
            sortOption = { views: -1 };
            break;

        default:
            sortOption = { publishedAt: -1 };
    }

    const totalBlogs = await Blog.countDocuments(filter);

    const blogs = await Blog.find(filter)
        .populate("author", "fullName username avatar")
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                blogs,
                pagination: {
                    totalBlogs,
                    currentPage: page,
                    totalPages: Math.ceil(totalBlogs / limit),
                    limit,
                    hasNextPage:
                        page < Math.ceil(totalBlogs / limit),
                    hasPrevPage:
                        page > 1
                    }
            },
            "Blogs fetched successfully."
        )

    );

});

const getBlogBySlug = asyncHandler(async (req, res) => {

    const { slug } = req.params;
    if (!slug) {
        throw new ApiError(
            400,
            "Blog slug is required."
        );
    }
    const blog = await Blog.findOneAndUpdate(
        {
            slug,
            status: "published"
        },
        {
            $inc: {
                views: 1
            }
        },{new: true}
        ).populate(
            "author",
            "fullName username avatar bio"
        );

    if (!blog) {
        throw new ApiError(404,"Blog not found.");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            blog,
            "Blog fetched successfully."

        )

    );

});



const updateBlog = asyncHandler(async (req, res) => {

    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "Blog id is required.");
    }
    const blog = await Blog.findById(id);
    if (!blog) {
        throw new ApiError(404, "Blog not found.");
    }
    const {
        title,
        excerpt,
        content,
        category,
        tags,
        status,
        metaTitle,
        metaDescription
    } = req.body;


    let featuredImage = blog.featuredImage;

    if (req.file?.path) {
        const uploadedImage = await uploadoncloudinary(req.file.path);

        if (!uploadedImage) {
            throw new ApiError(500,"Failed to upload featured image.");
        }
        featuredImage = uploadedImage.secure_url;
    }

    let formattedTags = blog.tags;

    if (tags) {
        formattedTags = Array.isArray(tags)
            ? tags
            : tags
                  .split(",")
                  .map(tag => tag.trim().toLowerCase())
                  .filter(Boolean);
    }

    let slug = blog.slug;

    if (title && title !== blog.title) {
        slug = generateSlug(title);
        const existingBlog = await Blog.findOne({
            slug,
            _id: { $ne: id }
        });

        if (existingBlog) {
            throw new ApiError(
                409,
                "Another blog already exists with this title."
            );
        }

    }

    blog.title = title ?? blog.title;
    blog.slug = slug;
    blog.excerpt = excerpt ?? blog.excerpt;
    blog.content = content ?? blog.content;
    blog.featuredImage = featuredImage;
    blog.category = category ?? blog.category;
    blog.tags = formattedTags;
    blog.status = status ?? blog.status;
    blog.metaTitle = metaTitle || title || blog.metaTitle;
    blog.metaDescription = metaDescription || excerpt || blog.metaDescription;

    if (
        status === "published" &&
        !blog.publishedAt
    ) {
        blog.publishedAt = new Date();
    }

    await blog.save();
    return res.status(200).json(
        new ApiResponse(200,blog,"Blog updated successfully.")
    );

});

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError( 400,"Blog id is required.");
    }
    const blog = await Blog.findById(id);

    if (!blog) {
        throw new ApiError(404,"Blog not found.");
    }
    await Blog.findByIdAndDelete(id);
    return res.status(200).json(
        new ApiResponse(
            200,
            blog,
            "Blog deleted successfully."
        )

    );

});


const incrementViews = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid blog id.");
    }
    const blog = await Blog.findByIdAndUpdate(id,
        {
            $inc: {
                views: 1
            }
        },
        { new: true}

    ).select("views");
    if (!blog) {
        throw new ApiError(404, "Blog not found.");
    }
    return res.status(200).json(
        new ApiResponse(200,blog,"Blog views updated successfully.")
    );

});

export{
    getBlogBySlug,
    getAllBlogs,
    createBlog,
    deleteBlog,
    updateBlog
}
