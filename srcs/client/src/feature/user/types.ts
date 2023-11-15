export type Position = { latitude: number; longitude: number };
export type Picture = { id: number; path: string };
export type Tag = { id: number; name: string };

export type User = {
	id: number;
	username: string;
	firstname: string;
	lastname: string;
	gender: 'MALE' | 'FEMALE';
	orientation: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL';
	biography: string;
	location: Position | null;
	tags: Tag[];
	picture: Picture | null;
	pictures: Picture[];
	age: number;
};

export type Profile = {
	id: number;
	username: string;
	firstname: string;
	lastname: string;
	birthdate: string;
	gender: 'MALE' | 'FEMALE';
	orientation: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL';
	biography: string;
	picture: { id: number; path: string };
	location: { distance: number };
	pictures: { id: number; path: string }[];
	tags: { id: number; name: string }[];
	likes?: { by_me: boolean; to_me: boolean };
	blocks?: { by_me: boolean };
	reports?: { by_me: boolean };
};

export type UserSortCriteria = 'age' | 'distance' | 'tags' | 'fame';

type SortOption = `${UserSortCriteria},${'asc' | 'desc'}`;

export interface UserFilters {
    smart_recommendation: boolean;
	page: number;
	age_min: number;
	age_max: number;
	distance_min: number;
	distance_max: number;
	tags_min: number;
	tags_max: number;
	fame_min: number;
	fame_max: number;
	sort?: SortOption;
}

export const initFilters: UserFilters = {
    smart_recommendation: true,
	page: 1,
	age_min: 18,
	age_max: 80,
	distance_min: 1,
	distance_max: 1,
	tags_min: 0,
	tags_max: 0,
	fame_min: 0,
	fame_max: 100,
	sort: undefined,
};

export type CompleteProfile = {
	birthday: string | undefined;
	gender: 'MALE' | 'FEMALE' | undefined;
	orientation: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL' | undefined;
	biography: string;
	location: Position | undefined;
	tags: string[];
	pictures: File[];
};

export type CompleteProfileInputProps = {
	id: string;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<CompleteProfile>>;
	disabled: boolean;
};

/* ERRORS */

export type CompleteProfileError = {
	birthday?: string[];
	gender?: string[];
	orientation?: string[];
	biography?: string[];
	location?: string[];
	tags?: string[];
	pictures?: string[];
};

export type UserEditError = { birthday?: string[]; gender?: string[] };
export type TagsError = { name: string[] };
export type PictureError = { picture: string[] };
