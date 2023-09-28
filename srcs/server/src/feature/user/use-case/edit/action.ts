import type { DatabaseService }   from '@/core/database/types';
import type { ValidationService } from '@/core/validation/types';
import type { User }              from '../../entity';
import { query }                  from './query';
import { validate }               from './validate';

// Type ------------------------------------------------------------------------
export type ActionInput =
{
	id: string|number;
	id_picture?: string|number;
	firstname?: string;
	lastname?: string;
	birthdate?: string;
	gender?: string;
	orientation?: string;
	biography?: string;
	location?:
	{
		latitude: string|number;
		longitude: string|number;
	};
};

export type ActionOutput =
	Partial<Omit<User, 'id'>> | null
;

// Function --------------------------------------------------------------------
export const action = async (
	validation_svc: ValidationService,
	database_svc: DatabaseService,
	dto: ActionInput,
)
	: Promise<ActionOutput> =>
{
	const fields = await validate(validation_svc, dto);

	if (Object.entries(fields).length <= 1)
	{
		return {};
	}

	const user = await query(database_svc, fields);

	return user;
};
