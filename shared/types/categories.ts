export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface Product {
    title: string;
    slug: string;
    price: number;
    image: string;
}

// GET /
export type GetAllCategoriesResponse = Category[];

// GET /:categorySlug
export type GetCategoryFromSlugResponse = {
    categoryName: string;
    products: Product[];
};
