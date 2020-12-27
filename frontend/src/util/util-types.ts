
export type ProfileUser = string | "OWN_PROFILE";

export type SocialMediaAccount = string | "NONE_PROVIDED";

export type User = {
  username: string;
	avatar: string; // link
	uploaded_items: string[]; // array of item IDs
	uploaded_fits: string[]; // array of fit IDs
	favorite_items: string[]; // array of item IDs of their liked items
	favorite_fits: string[]; // array of fit IDs of their liked fits
	following: string[]; // array of username strings
	followers: string[]; // array of username strings
	instagram: SocialMediaAccount;
	twitter: SocialMediaAccount;
	youtube: SocialMediaAccount;
} | null;