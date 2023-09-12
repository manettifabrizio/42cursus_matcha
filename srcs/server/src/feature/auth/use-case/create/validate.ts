import type { ValidationService } from '@/core/validation/types';
import * as Rules                 from '@/feature/auth/rules';

// Type ------------------------------------------------------------------------
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

// Function --------------------------------------------------------------------
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
