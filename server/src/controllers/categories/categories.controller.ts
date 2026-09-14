import { Request, Response } from "express";
import { eq } from "drizzle-orm";

import { db } from "../../config/db";
import { categoriesTable } from "../../config/schema";

export class CategoriesController {
  // CREATE CATEGORY
  createCategory = async (req: Request, res: Response) => {
    try {
      const { title } = req.body;

      if (!title || title.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Title kategori wajib diisi",
        });
      }

      const [result] = await db
        .insert(categoriesTable)
        .values({
          title: title.trim(),
        })
        .$returningId();

      const category = await db.query.categoriesTable.findFirst({
        where: eq(categoriesTable.id, result.id),
      });

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: {
          category,
        },
      });
    } catch (error) {
      console.error("Create category error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  };

  // GET ALL CATEGORIES
  getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await db.query.categoriesTable.findMany();

      return res.status(200).json({
        success: true,
        data: {
          categories,
        },
      });
    } catch (error) {
      console.error("Get categories error:", error);

      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server",
      });
    }
  };
}

export default new CategoriesController();