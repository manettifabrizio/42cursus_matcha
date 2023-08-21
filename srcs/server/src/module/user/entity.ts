import { Account } from '@/module/auth/entity';

export type Gender = 'male'|'female';
export type Orientation = 'bisexual'|'heterosexual'|'homosexual';

export type User =
{
	id: Account['id'];
	firstname: string;
	lastname: string;
	birthdate: Date|null;
	gender: Gender|null;
	orientation: Orientation|null;
	biography: string|null;
	created_at: Date;
	updated_at: Date;
};
