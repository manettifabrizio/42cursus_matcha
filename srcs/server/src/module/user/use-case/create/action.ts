import { DatabaseService }   from '@/core/database/types';
import { ValidationService } from '@/core/validation/types';
import { User }              from '@/module/user/entity';
import { query }             from './query';
import { validate }          from './validate';


export type ActionInput =
{
	id: number;
	firstname: string;
	lastname: string;
};

export type ActionOutput =
	Pick<User, 'id'>
;

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
