import type { SelectProducts } from "../../backend/src/db/schema.js";

// GET /
export type GetAllProductsResponse = Pick<
  SelectProducts,
  "title" | "slug" | "price" | "image"
>[];

// GET /:productSlug
export type GetProductFromSlugResponse = Pick<
  SelectProducts,
  "title" | "price" | "description" | "image"
>;
