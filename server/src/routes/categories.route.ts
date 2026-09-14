import { Router } from "express";

import CategoriesController from "../controllers/categories/categories.controller";

const router = Router();

router.post("/", CategoriesController.createCategory);

router.get("/", CategoriesController.getCategories);

export default router;