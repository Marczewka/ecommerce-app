import type { SelectCategories, SelectProducts } from "../db/schema.js";

// GET /
export type GetAllCategoriesResponse = SelectCategories[];

// GET /:categorySlug
export type GetCategoryFromSlugResponse = {
  categoryName: string;
  products: Pick<SelectProducts, "id" | "title" | "price" | "image">[];
};
