export interface ProductThumbnail {
    title: string;
    slug: string;
    price: number;
    image: string;
}

export interface ProductDetail {
    title: string;
    price: number;
    description: string;
    image: string;
}

export type GetAllProductsResponse = ProductThumbnail[];
export type GetProductFromSlugResponse = ProductDetail;
