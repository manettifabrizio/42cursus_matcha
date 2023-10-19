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
