import { DatabaseService }   from '@/core/database/types';
import { ValidationService } from '@/core/validation/types';
import { query }             from './query';
import { ActionInput }       from './types';
import { ActionOutput }      from './types';
import { validate }          from './validate';


export const action = async (
	validation_svc: ValidationService,
	database_svc: DatabaseService,
	dto: ActionInput,
)
	: Promise<ActionOutput> =>
{
	const fields = await validate(validation_svc, dto);
	const confirmed = await query(database_svc, fields);

	return confirmed;
};
