import type { Account } from '@/feature/auth/entity';

// Type ------------------------------------------------------------------------
export type Gender =
	'MALE'|'FEMALE'
;

export type Orientation =
	'BISEXUAL'|'HETEROSEXUAL'|'HOMOSEXUAL'
;

export type Position =
{
	latitude: number;
	longitude: number;
};

export type Distance =
{
	distance: number;
};

export type Location =
	Position | Distance | (Position & Distance)
;

export type User =
{
	id: Account['id'];
	// id_picture: Picture['id']|null; // Todo: Implement
	firstname: string;
	lastname: string;
	birthdate: Date|null;
	gender: Gender|null;
	orientation: Orientation|null;
	location: Location|null;
	biography: string|null;
};
