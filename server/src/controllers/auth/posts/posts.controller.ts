import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../../config/db";
import { postsTable } from "../../../config/schema";

import {
  createPostSchema,
  postIdSchema,
} from "../../../validations/post.validation";

import { uploadToCloudinary } from "../../../services/cloudinary.service";

export class PostsController {

  // =====================================================
  // CREATE POST
  // =====================================================

  createPost = async (req: Request, res: Response) => {
    try {
      // Validasi data
      const validatedData = createPostSchema.parse(req.body);

      const {
        userId,
        categoryId,
        title,
        content,
        status,
      } = validatedData;

      // Default gambar
      let imageUrl: string | null = null;
      let imagePublicId: string | null = null;

      // =================================================
      // UPLOAD GAMBAR KE CLOUDINARY
      // =================================================

      if (req.file) {
        const uploadedImage = await uploadToCloudinary(
          req.file.buffer
        );

        imageUrl = uploadedImage.secure_url;
        imagePublicId = uploadedImage.public_id;
      }

      // =================================================
      // SIMPAN POST KE DATABASE
      // =================================================

      const [insertedPost] = await db
        .insert(postsTable)
        .values({
          userId,
          categoryId,
          title,
          content,
          imageUrl,
          imagePublicId,
          status: status ?? "published",
        })
        .$returningId();

      // Ambil kembali post yang baru dibuat
      const newPost = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, insertedPost.id),
      });

      return res.status(201).json({
        success: true,
        message: "Post created successfully",

        data: {
          post: newPost,
        },
      });

    } catch (error: any) {

      console.error("Create post error:", error);

      // =================================================
      // ERROR VALIDASI ZOD
      // =================================================

      if (error?.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors,
        });
      }

      // =================================================
      // ERROR SERVER
      // =================================================

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error:
          error instanceof Error
            ? error.message
            : error,
      });
    }
  };


  // =====================================================
  // GET ALL POSTS
  // =====================================================

  getposts = async (req: Request, res: Response) => {
    try {

      const posts = await db.query.postsTable.findMany();

      return res.status(200).json({
        success: true,

        data: {
          posts,
        },
      });

    } catch (error: any) {

      console.error("Get posts error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  };


  // =====================================================
  // GET POST BY ID
  // =====================================================

  getPostById = async (req: Request, res: Response) => {
    try {

      const { id } = postIdSchema.parse(req.params);

      const post = await db.query.postsTable.findFirst({
        where: eq(postsTable.id, id),
      });

      // Post tidak ditemukan
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post tidak ditemukan",
        });
      }

      return res.status(200).json({
        success: true,

        data: {
          post,
        },
      });

    } catch (error: any) {

      console.error(
        "Get post by id error:",
        error
      );

      // Error validasi ID
      if (error?.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Invalid post ID",
          errors: error.errors,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  };


  // =====================================================
  // UPDATE POST
  // =====================================================

  updatePost = async (req: Request, res: Response) => {
    try {

      const { id } = postIdSchema.parse(req.params);

      // =================================================
      // CEK POST
      // =================================================

      const existingPost =
        await db.query.postsTable.findFirst({
          where: eq(postsTable.id, id),
        });

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: "Post tidak ditemukan",
        });
      }

      // =================================================
      // DATA UPDATE
      // =================================================

      const title = req.body.title;
      const content = req.body.content;
      const categoryId = req.body.categoryId;
      const status = req.body.status;

      const updateData: any = {};

      if (title !== undefined) {
        updateData.title = title;
      }

      if (content !== undefined) {
        updateData.content = content;
      }

      if (categoryId !== undefined) {
        updateData.categoryId = Number(categoryId);
      }

      if (status !== undefined) {
        updateData.status = status;
      }

      // =================================================
      // UPLOAD GAMBAR BARU
      // =================================================

      if (req.file) {

        const uploadedImage =
          await uploadToCloudinary(
            req.file.buffer
          );

        updateData.imageUrl =
          uploadedImage.secure_url;

        updateData.imagePublicId =
          uploadedImage.public_id;
      }

      // =================================================
      // UPDATE DATABASE
      // =================================================

      await db
        .update(postsTable)
        .set(updateData)
        .where(eq(postsTable.id, id));

      // =================================================
      // AMBIL DATA TERBARU
      // =================================================

      const updatedPost =
        await db.query.postsTable.findFirst({
          where: eq(postsTable.id, id),
        });

      return res.status(200).json({
        success: true,
        message: "Post updated successfully",

        data: {
          post: updatedPost,
        },
      });

    } catch (error: any) {

      console.error(
        "Update post error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
        error:
          error instanceof Error
            ? error.message
            : error,
      });
    }
  };


  // =====================================================
  // DELETE POST
  // =====================================================

  deletePost = async (req: Request, res: Response) => {
    try {

      const { id } = postIdSchema.parse(req.params);

      // =================================================
      // CEK POST
      // =================================================

      const existingPost =
        await db.query.postsTable.findFirst({
          where: eq(postsTable.id, id),
        });

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: "Post tidak ditemukan",
        });
      }

      // =================================================
      // DELETE DATABASE
      // =================================================

      await db
        .delete(postsTable)
        .where(eq(postsTable.id, id));

      return res.status(200).json({
        success: true,
        message: "Post deleted successfully",
      });

    } catch (error: any) {

      console.error(
        "Delete post error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  };
}


// =====================================================
// EXPORT CONTROLLER
// =====================================================

export default new PostsController();