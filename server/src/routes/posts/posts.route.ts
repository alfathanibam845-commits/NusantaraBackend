import { Router } from "express";

import PostsController from "../../controllers/auth/posts/posts.controller";

import { uploadSingleImage } from "../../controllers/middleware/upload.middleware";

const router = Router();

router.post("/", uploadSingleImage, PostsController.createPost);

router.get("/", PostsController.getposts);

router.get("/:id", PostsController.getPostById);

router.put("/:id", uploadSingleImage, PostsController.updatePost);

router.delete("/:id", PostsController.deletePost);

export default router;