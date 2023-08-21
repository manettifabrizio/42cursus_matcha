import { ValidationService } from '@/core/validation/types';
import * as Rules            from '../../rules';


type ValidationInput =
{
	username: string;
	password: string;
};

type ValidationOuput =
	ValidationInput
;

export const validate = async (
	validation_svc: ValidationService,
	dto: ValidationInput,
)
	: Promise<ValidationOuput> =>
{
	const rules =
	[
		Rules.checkUsernameNotEmpty(),
		Rules.checkPasswordNotEmpty(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
