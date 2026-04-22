import type { SelectProducts } from "../db/schema.js";

// GET /
export type GetAllProductsResponse = Pick<
  SelectProducts,
  "id" | "title" | "price" | "image"
>[];

// GET /:productSlug
export type GetProductFromSlugResponse = SelectProducts;
