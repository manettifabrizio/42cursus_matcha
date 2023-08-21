import { ValidationService } from '@/core/validation/types';
import * as Rules            from '@/module/auth/rules';


type ValidationInput =
{
	id: number;
	email: string;
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
		Rules.checkIdNotEmpty(),
		Rules.checkEmail(),
	];

	return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
