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
		Rules.checkPassword(),
		Rules.checkPasswordConfirm(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
