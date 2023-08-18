import { CryptoService }     from '@/core/cryto/types';
import { DatabaseService }   from '@/core/database/types';
import { ValidationService } from '@/core/validation/types';
import { query }             from './query';
import { ActionInput }       from './types';
import { ActionOutput }      from './types';
import { validate }          from './validate';


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

	return account;
};
