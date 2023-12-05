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

export const initUser: User = {
	age: -1,
	id: -1,
	username: '',
	firstname: '',
	lastname: '',
	gender: 'MALE',
	orientation: 'BISEXUAL',
	biography: '',
	location: null,
	tags: [],
	picture: null,
	pictures: [],
};

export type Profile = {
	last_seen_at: string;
	id: number;
	fame: string;
	username: string;
	firstname: string;
	lastname: string;
	email?: string;
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

export const initProfile: Profile = {
	last_seen_at: '',
	id: -1,
	fame: '',
	username: '',
	firstname: '',
	email: undefined,
	lastname: '',
	birthdate: '',
	gender: 'MALE',
	orientation: 'BISEXUAL',
	biography: '',
	picture: { id: -1, path: '' },
	location: { distance: -1 },
	pictures: [],
	tags: [],
	likes: undefined,
	blocks: undefined,
	reports: undefined,
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
	firstname?: string;
	lastname?: string;
	password?: string;
	password_confirm?: string;
	email?: string;
	birthdate: string | undefined;
	gender: 'MALE' | 'FEMALE' | undefined;
	orientation: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL' | undefined;
	biography: string;
	location: Position | { distance: number } | undefined;
	tags: string[];
	pictures: File[];
};

export const initCompleteProfile: CompleteProfile = {
	firstname: undefined,
	lastname: undefined,
	email: undefined,
	birthdate: undefined,
	gender: undefined,
	orientation: undefined,
	biography: '',
	location: undefined,
	pictures: [],
	tags: [],
};

export type AuthProfile = {
	email?: string;
	password?: string;
	password_confirm?: string;
};

export const initAuthProfile: AuthProfile = {
	email: undefined,
	password: undefined,
	password_confirm: undefined,
};

export type CompleteProfileInputProps = {
	id: string;
	errors?: string[];
	setProfile: React.Dispatch<React.SetStateAction<CompleteProfile>>;
	disabled: boolean;
	profile: CompleteProfile;
};

/* ERRORS */

export type CompleteProfileError = {
	firstname?: string[];
	lastname?: string[];
	birthdate?: string[];
	gender?: string[];
	orientation?: string[];
	biography?: string[];
	location?: string[];
	tags?: string[];
	pictures?: string[];
};

export const initCompleteProfileErrors: CompleteProfileError = {
	birthdate: [],
	gender: [],
	pictures: [],
	tags: [],
};

export type AuthProfileError = {
	email?: string[];
	password?: string[];
	password_confirm?: string[];
};

export const initAuthProfileError: AuthProfileError = {
	email: [],
	password: [],
	password_confirm: [],
};

export type UserEditError = { birthdate?: string[]; gender?: string[] };
export type TagsError = { name: string[] };
export type PictureError = { picture: string[] };
