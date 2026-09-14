import { Router } from "express";

import { authenticate } from "../controllers/middleware/auth.middleware";

import UsersController from "../controllers/auth/users/users.controller";
const router = Router();

// Get all posts by User ID
router.get("/:userId", authenticate, UsersController.getPostsByUserId);

// Get specific post by User ID and Post ID
router.get("/:userId/posts/:postId", authenticate, UsersController.getUserPost);

export default router;
