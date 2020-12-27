
export type ProfileUser = string | 'OWN_PROFILE';

export type User = {
  email: string;
  username: string;
  avatar: string; // link
	favorite_items: string[]; // array of item IDs of their liked items
	favorite_fits: string[]; // array of fit IDs of their liked fits
	following: string[]; // array of username strings
	followers: string[]; // array of username strings
} | null;