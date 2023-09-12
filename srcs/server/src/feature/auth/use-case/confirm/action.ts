import type { DatabaseService }   from '@/core/database/types';
import type { ValidationService } from '@/core/validation/types';
import type { Account }           from '@/feature/auth/entity';
import { AuthException }          from '@/feature/auth/exception';
import { query }                  from './query';
import { validate }               from './validate';

// Type ------------------------------------------------------------------------
type ActionInput =
{
	id: string;
	secret: string;
};

type ActionOutput =
	Pick<Account, 'id'>
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
	const account = await query(database_svc, fields);

	if (account === null)
	{
		throw new AuthException({
			cause: `Invalid credentials.`
		});
	}

	return account;
};
