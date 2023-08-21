import { ValidationService } from '@/core/validation/types';
import * as Rules            from '../../rules';


export type ValidationInput =
{
	id: number;
	password: string;
	password_confirm: string;
};

export type ValidationOuput =
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
		Rules.checkIdNotEmpty(),
		Rules.checkPassword(),
		Rules.checkPasswordConfirm(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
