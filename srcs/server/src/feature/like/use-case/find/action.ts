import type { DatabaseService }   from '@/core/database/types';
import type { ValidationService } from '@/core/validation/types';
import type { Like }              from '../../entity';
import { query }                  from './query';
import { validate }               from './validate';

// Type ------------------------------------------------------------------------
export type ActionInput =
{
	id_user_from: string | number;
	id_user_to: string | number;
};

export type ActionOutput =
	Like | null
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
	const like = await query(database_svc, fields);

	return like;
};
