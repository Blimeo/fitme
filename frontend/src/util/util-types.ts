export type ItemUploadType = {
    name: string;
    brand: string;
    price: number;
    tags: string[];
    description: string;
    images: File[];
};

export type Item = {
    name: string;
    brand: string;
    price: number;
    tags: string[];
    description: string;
    imgs: string[];
    uploader: string;
};