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

export type GetAllProductsResponse = ProductThumbnail[];
export type GetProductFromSlugResponse = ProductDetail;
