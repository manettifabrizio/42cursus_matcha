import * as Config           from '@/Config';
import { CryptoService }     from '@/core/cryto/types';
import { DatabaseService }   from '@/core/database/types';
import { ValidationService } from '@/core/validation/types';
import { Account }           from '@/module/auth/entity';
import { AuthException }     from '@/module/auth/exception';
import { query }             from './query';
import { validate }          from './validate';


type ActionInput =
{
	id: number;
	email: string;
};

type ActionOutput =
	Pick<Account, 'id'|'email'|'secret'>
;

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
			cause: `Invalid account id.`
		});
	}

	return account;
};
