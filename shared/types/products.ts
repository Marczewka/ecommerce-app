export interface ProductThumbnail {
    id: number;
    title: string;
    slug: string;
    price: number;
    image: string;
    quantityInCart: number;
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
