import type { DatabaseService }   from '@/core/database/types';
import type { ValidationService } from '@/core/validation/types';
import type { Picture }           from '../../entity';
import { validate }               from './validate';
import { query }                  from './query';

// Type ------------------------------------------------------------------------
export type ActionInput =
{
	id: Picture['id'];
};

export type ActionOutput =
	boolean
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
	const deleted = await query(database_svc, fields);

	return deleted;
};
