export type ProfileUser = string | "OWN PROFILE";

export type SocialMediaAccount = string | "NONE_PROVIDED";


export type User = {
  username: string;
  avatar: string; // link
  uploaded_items: string; // array of item IDs
  uploaded_fits: string; // array of fit IDs
  favorite_items: string; // array of item IDs of their liked items
  favorite_fits: string; // array of fit IDs of their liked fits
  following: string[]; // array of username strings
  followers: string[]; // array of username strings
  instagram: SocialMediaAccount;
  twitter: SocialMediaAccount;
  youtube: SocialMediaAccount;
} | null;

// Does not include avatar
export type ProfileUpdateRequest = {
  is_updating_avatar: boolean;
  username: string;
  instagram: string;
  twitter: string;
  youtube: string;
};

export type Gender = "Men" | "Women" | "Unisex";

export type ItemUploadType = {
  name: string;
  brand: string;
  price: number;
  tags: string[];
  description: string;
  images: File[];
  gender: Gender;
  category: string;
  color: string;
};

export type Item = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  tags: string[];
  description: string;
  imgs: string[];
  uploader: string;
  gender: Gender;
  favorited: number;
  inFits: string[];
  category: string;
  uploadDate: string;
  color: string;
};

export type FitUploadType = {
  name: string;
  tags: string[];
  description: string;
  img_url: string;
  width: number;
  height: number;
  itemBoxes: number[][]; // [[x1, y1, x2, y2], ...] where (x1, y1) is top-left and (x2, y2) is bottom-right
  gender: Gender;
};

export type Fit = {
  _id: string;
  name: string;
  tags: string[];
  description: string;
  img_url: string;
  items: (Item | "")[];
  uploader: string;
  annotations: any;
  gender: Gender;
  favorited: number;
  uploadDate: string;
};
