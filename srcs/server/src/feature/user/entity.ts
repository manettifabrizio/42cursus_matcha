import type { Account } from '@/feature/auth/entity';
import type { Picture } from '@/feature/picture/entity';

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
	id_picture: Picture['id']|null;
	firstname: string;
	lastname: string;
	birthdate: Date|null;
	gender: Gender;
	orientation: Orientation;
	biography: string;
	location: Location|null;
};
