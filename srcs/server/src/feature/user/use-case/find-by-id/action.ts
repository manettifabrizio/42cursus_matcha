import type { DatabaseService }   from '@/core/database/types';
import type { ValidationService } from '@/core/validation/types';
import type { User }              from '@/feature/user/entity';
import { query }                  from './query';
import { validate }               from './validate';

// Type ------------------------------------------------------------------------
export type ActionInput =
{
	id: number;
};

export type ActionOutput =
	Omit<User, 'created_at'|'updated_at'> | null
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
	const user = await query(database_svc, fields);

	return user;
};
