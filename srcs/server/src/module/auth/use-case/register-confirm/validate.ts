import { ValidationService } from '@/core/validation/types';
import * as Rules            from '../../rules';
import { ValidationInput }   from './types';
import { ValidationOuput }   from './types';


export const validate = async (
	validation_svc: ValidationService,
	dto: ValidationInput,
)
	: Promise<ValidationOuput> =>
{
	const rules =
	[
		Rules.checkIdNotEmpty(),
		Rules.checkSecretNotEmpty(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
