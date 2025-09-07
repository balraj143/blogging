import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String,required: true,},
    content: { type: String,required: true,},
    image: { type: String, },
    tags: [ { type: String, },],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },text: String, createdAt: { type: Date, default: Date.now },},],
      reports: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }
]
  
  },

  { timestamps: true }
);

blogSchema.index({ title: "text", content: "text", tags: "text" });

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
