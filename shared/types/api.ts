export interface Category {
    id: string;
    name: string;
    slug: string;
}

export interface ProductThumbnail {
    id: number;
    title: string;
    slug: string;
    price: number;
    image: string;
    quantity: number;
}

export interface ProductDetail {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
}

export interface User {
    id: number;
    username: string;
    role: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

// GET api/categories
export type GetAllCategoriesResponse = Category[];

// GET api/products/:categorySlug
export type GetCategoryFromSlugResponse = {
    categoryName: string;
    products: ProductThumbnail[];
};

// GET api/products || api/carts/my-cart
export type GetAllProductsResponse = ProductThumbnail[];

// GET api/products/:productSlug
export type GetProductFromSlugResponse = ProductDetail;
