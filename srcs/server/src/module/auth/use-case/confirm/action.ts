import { DatabaseService }   from '@/core/database/types';
import { ValidationService } from '@/core/validation/types';
import { Account }           from '@/module/auth/entity';
import { AuthException }     from '@/module/auth/exception';
import { query }             from './query';
import { validate }          from './validate';


type ActionInput =
{
	id: string;
	secret: string;
};

type ActionOutput =
	Pick<Account, 'id'>
;

export const action = async (
	validation_svc: ValidationService,
	database_svc: DatabaseService,
	dto: ActionInput,
)
	: Promise<ActionOutput> =>
{
	const fields = await validate(validation_svc, dto);
	const account = await query(database_svc, fields);

	if (account === null)
	{
		throw new AuthException({
			cause: `Invalid credentials.`
		});
	}

	return account;
};
