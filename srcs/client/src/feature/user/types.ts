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
	last_seen_at?: string;
	id: number;
	fame?: string;
	username?: string;
	firstname?: string;
	lastname?: string;
	email?: string;
	birthdate?: string;
	gender: 'MALE' | 'FEMALE';
	orientation: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL';
	biography?: string;
	picture?: Picture;
	location?: { distance: number };
	pictures: Picture[];
	tags: Tag[];
	likes?: { by_me: boolean; to_me: boolean };
	blocks?: { by_me: boolean };
	reports?: { by_me: boolean };
};

export const initProfile: Profile = {
	last_seen_at: undefined,
	id: -1,
	fame: undefined,
	username: undefined,
	firstname: undefined,
	email: undefined,
	lastname: undefined,
	birthdate: undefined,
	gender: 'MALE',
	orientation: 'BISEXUAL',
	biography: undefined,
	picture: { id: -1, path: '' },
	location: undefined,
	pictures: [],
	tags: [],
	likes: undefined,
	blocks: undefined,
	reports: undefined,
};

export type UserSortCriteria = 'age' | 'distance' | 'tags' | 'fame';

type SortOption = `${UserSortCriteria},${'asc' | 'desc'}`;

export interface UserFilters {
	smart_recommendation?: boolean;
	page: number;
	age_min: number;
	age_max: number;
	distance_min: number;
	distance_max: number;
	tags_min: number;
	fame_min: number;
	fame_max: number;
	sort?: SortOption;
}

export const initFilters: UserFilters = {
	page: 1,
	age_min: 18,
	age_max: 80,
	distance_min: 0,
	distance_max: 100,
	tags_min: 0,
	fame_min: 0,
	fame_max: 100,
};

export type CompleteProfile = {
	firstname?: string;
	lastname?: string;
	birthdate?: string;
	gender: 'MALE' | 'FEMALE';
	orientation: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL';
	biography?: string;
	location?: Position | { distance: number };
	tags: string[];
};

export const initCompleteProfile: CompleteProfile = {
	firstname: undefined,
	lastname: undefined,
	birthdate: undefined,
	gender: 'MALE',
	orientation: 'BISEXUAL',
	biography: undefined,
	location: undefined,
	tags: [],
};

export type AuthProfile = {
	email: string;
	password: string;
	password_confirm: string;
};

export const initAuthProfile: AuthProfile = {
	email: '',
	password: '',
	password_confirm: '',
};

export type PicturesProfile = {
	pictures: Picture[];
	profile_picture?: Picture;
};

export const initPicturesProfile: PicturesProfile = {
	pictures: [],
	profile_picture: undefined,
};

export type PicturesProfileError = {
	pictures?: string[];
	profile_picture?: string[];
};

export const initPicturesProfileError: PicturesProfileError = {
	pictures: [],
	profile_picture: [],
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
	biography?: string[];
	tags?: string[];
};

export const initCompleteProfileErrors: CompleteProfileError = {
	birthdate: [],
	tags: [],
	firstname: [],
	lastname: [],
	biography: [],
};

export type LoginFormErrors = {
	username?: string[];
	password?: string[];
};

export type ResetPasswordFormErrors = {
	username?: string[];
	email?: string[];
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

export type TagsError = { name: string[] };
export type PictureError = { picture: string[] };
