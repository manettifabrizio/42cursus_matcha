import { ValidationService } from '@/core/validation/types';
import * as Rules            from '../../rules';


type ValidationInput =
{
	username: string;
	password: string;
	password_confirm: string;
	email: string;
};

type ValidationOuput =
	Omit<ValidationInput, 'password_confirm'>
;

export const validate = async (
	validation_svc: ValidationService,
	dto: ValidationInput,
)
	: Promise<ValidationOuput> =>
{
	const rules =
	[
		Rules.checkUsername(),
		Rules.checkPassword(),
		Rules.checkPasswordConfirm(),
		Rules.checkEmail(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
