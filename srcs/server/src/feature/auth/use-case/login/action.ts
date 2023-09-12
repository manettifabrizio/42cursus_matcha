import type { CryptoService }     from '@/core/cryto/types';
import type { DatabaseService }   from '@/core/database/types';
import type { ValidationService } from '@/core/validation/types';
import type { Account }           from '@/feature/auth/entity';
import { AuthException }          from '@/feature/auth/exception';
import { query }                  from './query';
import { validate }               from './validate';

// Type ------------------------------------------------------------------------
type ActionInput =
{
	username: string;
	password: string;
};

type ActionOutput =
	Pick<Account, 'id'>
;

// Function --------------------------------------------------------------------
export const action = async (
	validation_svc: ValidationService,
	database_svc: DatabaseService,
	crypto_svc: CryptoService,
	dto: ActionInput,
)
	: Promise<ActionOutput> =>
{
	const fields = await validate(validation_svc, dto);
	const account = await query(database_svc, crypto_svc, fields);

	if (account === null)
	{
		throw new AuthException({
			cause: "Invalid credentials.",
		});
	}

	return account;
};
