import type {
  SelectCategories,
  SelectProducts,
} from "../../backend/src/db/schema.js";

// GET /
export type GetAllCategoriesResponse = SelectCategories[];

// GET /:categorySlug
export type GetCategoryFromSlugResponse = {
  categoryName: string;
  products: Pick<SelectProducts, "title" | "slug" | "price" | "image">[];
};
